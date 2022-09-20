const D = require('discord.js'); // discord.js
const style = require('../system/style.json'); // style file
const e = require('../system/emojis.json'); // emoji file
// RNG, mention cleaner, embed colour checker, rejection ember generator, emoji puller
const {getRandomInt, Clean, eCol, genRejectEmbed, getEmoji} = require('../system/globalFunctions.js')

// regexes + arrays
const d6X1 = /regular|die|standard|single|one/i;
const d6X2 = /dice|doubles|double|two/i;
const d20advX = /^(advantage|adv|a)|(advantage|adv|a)$/i;
const d20disX = /^(disadvantage|dis|d)|(disadvantage|dis|d)$/i;
const onedxX = /^d\d+/i;
const negX = /^-/i;
const standardDice = [2, 4, 6, 8, 10, 12, 20, 100];

// emojis
const mSuccess = '💥';
const mClue = '🔍';
const mFail = '❌';

function checkDice(faces, count) {
  // checks for specialty dice types
  switch(faces.replaceAll(/[\[\]\(\)\{\}]+/g, "")) {
    case "b":
    case "bahoth":
    case "babg":
    case "betrayal": // betrayal dice (custom d6)
      return ["c", count, "\\\[b\\\]", 0, 0, 1, 1, 2, 2];
    case "m":
    case "mom":
    case "mansions":
    case "mansionsofmadness": // mansions of madness dice (custom d8)
      return ["m", count, "\\\[m\\\]"];
    case "adv":
    case "dis": // 1d20 w/ advantage/disadvantage
      return ["a", faces];
    default: // standard or custom, run deeper check
      break;
  }
  if(!isNaN(parseInt(faces))) { // standard dice
    return ["s", count, `${Math.max(1, parseInt(faces))}`];
  } else { // custom dice, process then send
    let diceArr = ["c", count];
    let faceArr = faces.replaceAll(/[\[\]\(\)\{\}]+/g, "").split(',').map(e => parseFloat(e)).filter(e => !isNaN(e));
    if(faceArr.length <= 0) {
      return "err";
    } else {
      diceArr.push(`${faceArr.length}\\\[${faceArr.join(",")}\\\]`);
      return diceArr.concat(faceArr);
    }
  }
}

function getSplits(arg, split, start) {
  let save = [start];
  for(let i = 0; i < split.length-1; i++) {
    arg = arg.replace(split[i], "");
    if(arg.length > 0) {
      switch(arg.charAt(0)) {
        case "-":
          save.push(-1); break;
        case "+":
        default:
          save.push(1); break;
      }
      arg = arg.slice(1);
    } 
  }
  return save;
}

function rollDice(infoArr, resArr, s = 1) {
  let tot = 0;
  let count = infoArr[1];
  let faces = parseInt(infoArr[2]);

  // rolls the dice the specified amount of times
  for(let i = 1; i <= count; i++) {
    let r = getRandomInt(1, faces);
    resArr.push(`\`${r}\``);
    tot += s*r;
  }
  return tot;
}

function rollCustomDice(infoArr, resArr, s = 1) {
  let tot = 0;
  let count = infoArr[1];
  let faces = infoArr.slice(3);

  // rolls the dice the specified amount of times
  for(let i = 1; i <= count; i++) {
    let r = getRandomInt(0, faces.length-1);
    resArr.push(`\`${faces[r]}\``);
    tot += s*faces[r];
  }
  return tot;
}

function rollMansionsDice(count, mArr, resArr) {
  for(let i = 1; i <= count; i++) {
    let r = getRandomInt(1, 8);
    if(r >= 6) { // success
      mArr[0] += 1;
      resArr.push(mSuccess);
    } else if(r >= 4) {// investigation/clue
      mArr[1] += 1;
      resArr.push(mClue);
    } else {// failure
      mArr[2] += 1;
      resArr.push(mFail);
    }
  }
}

function rollAdvDis20(advDis, resArr, dice, splits, i = -1) { // WIP
  let res = [];
  let tot;
  let k = 0;

  // makes adjustments depending on whether a single d20 was already rolled or not
  if(i !== -1) {
    // finds the result that corresponds to the d20
    for(let j = 0; j < i; j++) {
      k += parseInt(dice[j].split('d')[0]);
    }
    // pushes the appropriate result
    res.push(parseInt(resArr[k].slice(1, -1)));
  }
  let n = (i !== -1 ? 1 : 2)

  // rolls the dice the specified amount of times
  for(let j = 1; j <= n; j++) {
    let r = getRandomInt(1, 20);
    res.push(r);
  }
  // sort the array in ascending order + format
  let cleanRes = res.sort((a, b) => a - b);

  let finalRes;
  if(advDis === 1)
    finalRes = cleanRes[1]; // advantage: take higher result
  else
    finalRes = cleanRes[0]; // disadvantage: take lower result
  
  if(i !== -1) {
    dice[i] = `1d20\\\[${advDis === 1 ? "adv" : "dis"}\\\]`;
    tot = finalRes - parseInt(resArr[k].slice(1, -1)); // adjust rolled value accordingly
    resArr[k] = `\`${finalRes}\``;
  } else {
    dice.push(`1d20\\\[${advDis === 1 ? "adv" : "dis"}\\\]`)
    resArr.push(`\`${finalRes}\``);
    tot = finalRes;
  }

  // return net total + both roll results for embed description
  return {
    ad: res.map(e => `\`${e}\``),
    t: tot*(i !== -1 ? splits[i] : 1)
  };
}

function diceError(resArr) {
  resArr.push("err");
}

exports.run = {
  execute(message, args, client) {
    // variable setup
    var resArr = [];
    var mArr = [0, 0, 0]; // 💥, 🔍, ❌
    var dice = [];
    var cleanSplits = [];
    var total = 0;
    var modifier = 0;
    var advDis = 0;
    
    if(args.length === 0) { // default roll: 1d20
      dice.push("1d20");
      total += rollDice(["s", 1, "20"], resArr); 
    } else { // custom roll
      // clean + split dice
      var rawArgs = Clean(args.join("").toLowerCase())
      var rawDice = rawArgs.split(/[+-]/);
      var splits;
      // check for negative at start
      if(negX.test(rawArgs)) { // negative
        rawArgs = rawArgs.slice(1)
        rawDice.splice(0, 1);
        splits = getSplits(rawArgs, rawDice, -1);
      } else { // no negative
        splits = getSplits(rawArgs, rawDice, 1);
      }
      
      let j = -1;
      // handle dice individually
      for(let i = 0; i < rawDice.length; i++) {
        // loop initializations
        let rawInfo;
        j++;

        // split count and faces apart as needed
        // adv/dis checks: ensures dX won't be treated as disadvantage
        if(!onedxX.test(rawDice[i])) {
          if(d20disX.test(rawDice[i])) { // dis present (check first b/c "disadvantage" contains "advantage")
            advDis = (advDis | 2);
            // slice appropriate portion of string
            if(/^(disadvantage|dis|d)/i.test(rawDice[i]))
              rawDice[i] = rawDice[i].slice(d20disX.exec(rawDice[i])[1].length)
            else
              rawDice[i] = rawDice[i].slice(0, rawDice[i].search(d20disX))
            // rest is handled at end; break loop + repeat iteration
            i--;
            continue;
          } else if(d20advX.test(rawDice[i])) { // adv present
            advDis = (advDis | 1);
            // slice appropriate portion of string
            if(/^(advantage|adv|a)/i.test(rawDice[i]))
              rawDice[i] = rawDice[i].slice(d20advX.exec(rawDice[i])[1].length)
            else
              rawDice[i] = rawDice[i].slice(0, rawDice[i].search(d20advX))
            // rest is handled at end; break loop + repeat iteration
            i--;
            continue;
          }
        }

        // rest of dice checks
        if(d6X1.test(rawDice[i])) { // 1d6 query present
          rawInfo = ["1", "6"];
        } else if(d6X2.test(rawDice[i])) { // 2d6 query present
          rawInfo = ["2", "6"];
        } else {
          rawInfo = rawDice[i].split('d');
        }

        let info = rawInfo.filter(e => e.length >= 1 && !/^ +$/.test(e));
        if(rawInfo[0] == "") info.unshift(""); // retain a blank element at the start of info, if one was present

        switch(info.length) {
          case 0: { // something went wrong
            diceError(resArr);
            break;
          }
          case 1: { // modifier or adv/dis throw, check just in case
            if(isNaN(parseInt(info[0])) || info[0] == "") { 
              // check if an adv/dis check result
              if(i !== j) { // adv/dis throw!
                j = i;
                continue;
              } else { // log a dice error
                diceError(resArr);
                break;
              }
            } else { // modifier!
              modifier += splits[i]*parseInt(info[0], 10);
              break;
            }
          }
          default: { // likely dice, check just in case
            if((isNaN(parseInt(info[0])) && info[0] != "")) {
              // not dice, log a dice error
              diceError(resArr);
              break;
            } else { // probably dice!
              if(info[0] == "") info[0] = "1"; // if no dice count specified, default to 1
              let dInfo = checkDice(info[1], parseInt(info[0], 10));
              if(dInfo == "err") {
                // not dice, log a dice error
                diceError(resArr);
              } else { // definitely dice!
                dice.push(`${dInfo[1]}d${dInfo[2]}`);
                cleanSplits.push(`${splits[i] == -1 ? "-" : "+"}`)
                switch(dInfo[0]) {
                  case "m":
                    rollMansionsDice(dInfo[1], mArr, resArr); break;
                  case "c":
                    total += rollCustomDice(dInfo, resArr, splits[i]); break;
                  case "s":
                    total += rollDice(dInfo, resArr, splits[i]); break;
                  //case "a":
                  //  total += rollAdvDis20(dInfo, resArr); break;
                  default:
                    diceError(resArr); // error
                }
              }
            }
          }
        }
        j = i;
      }
    }

    // handles advantage/disadvantage rolls
    if(advDis == 3 && dice.findIndex(e => e == "1d20") === -1) { // cancellation + no roll: just roll a flat d20
      dice.push("1d20");
      total += rollDice(["s", 1, "20"], resArr);
    } else if(advDis !== 0) { // apply adv or dis
      let d20i = dice.findIndex(e => e == "1d20");
      let res;
      if(d20i !== -1) // apply to existing d20 roll
        res = rollAdvDis20(advDis, resArr, dice, splits, d20i);
      else // add new roll
        res = rollAdvDis20(advDis, resArr, dice, splits);

      // log rolls + adjust total
      advDis = res.ad;
      total += res.t;
    }

    // prepares the embed
    const embed = new D.EmbedBuilder();

    // checks for + filters errors
    var rejectEmbed;
    if(resArr.includes("err")) {
      resArr = resArr.filter(e => e != "err");
      if(resArr.length === 0) {
        return message.reply({embeds: [genRejectEmbed(message, "Invalid roll", "None of your dice could be rolled! Please check your syntax and try again.")]});
      } else {
        rejectEmbed = genRejectEmbed(message, "Some dice invalid; succesful rolls returned", false, {col: style.e.warn, e: getEmoji(message, e.warn, e.alt.warn)})
      }
    }

    // custom colour checker for crits/fails
    if(resArr.length === 1 && resArr[0] != "err") { // crit colouring applies
      let dFaces = parseInt(dice[0].split('d')[1]);
      if(resArr[0] == `\`${dFaces}\`` && standardDice.includes(dFaces))
        embed.setColor(style.dice.crit);
      else if(resArr[0] == `\`1\`` && standardDice.includes(dFaces))
        embed.setColor(style.dice.fail);
      else
        embed.setColor(eCol(style.e.default));
    } else { // crit colouring does not apply: use default
      embed.setColor(eCol(style.e.default));
    }

    // set up embed title
    if(mArr.filter(e => e !== 0).length !== 0) { // mansions dice rolled, report in title
      let eTitle = [];
      if(total !== 0 || modifier !== 0) // regular rolls
        eTitle.push(`${total + modifier}`);
      if(mArr[0] !== 0) // successes
        eTitle.push(`${mArr[0]}${mSuccess}`);
      if(mArr[1] !== 0) // investigation/clue results
        eTitle.push(`${mArr[1]}${mClue}`);
      if(mArr[2] !== 0) // failures
        eTitle.push(`${mArr[2]}${mFail}`);
      // set the title
      embed.setTitle(`${eTitle.join(" + ")}`);
    } else { // standard title
      embed.setTitle(`${total + modifier}`);
    }

    // set up embed description (roll breakdown)
    let eDesc = `${cleanSplits[0] === "-" ? "- " : ""}`;
    for(let i = 0; i < dice.length; i++) {
      let dCount = parseInt(dice[i].split('d')[0]);
      eDesc += `${dice[i]}(`
      // check if advantage/disadvantage formatting is needed
      if(dice[i] == "1d20\\\[adv\\\]" || dice[i] == "1d20\\\[dis\\\]") {
        let output = resArr.shift();
        // hightlight whichever result is used
        if(advDis[0] == advDis[1]) // dice are equal, highlight both
          eDesc += `**${advDis[0]}**|**${advDis[1]}**)`;
        else if (advDis[1] == output)
          eDesc += `~~${advDis[0]}~~|**${advDis[1]}**)`;
        else
          eDesc += `**${advDis[0]}**|~~${advDis[1]}~~)`
        // add split
        eDesc += ` ${cleanSplits[i+1] ? cleanSplits[i+1] : "+"} `
      } else { // standard formatting
        let resCache = [];
        for(let j = 0; j < dCount; j++) {
          resCache.push(resArr.shift());
        }
        eDesc += `**${resCache.join("**+**")}**) ${cleanSplits[i+1] ? cleanSplits[i+1] : "+"} `
      }
    }

    if(modifier > 0)
      embed.setDescription(`${eDesc}${modifier}`);
    else if(modifier < 0)
      embed.setDescription(`${eDesc.slice(0, -3)} - ${modifier*-1}`);
    else
      embed.setDescription(eDesc.slice(0, -3));

    // returns the result of the roll
    if(rejectEmbed)
      return message.reply({content: "Here you go!", embeds: [rejectEmbed, embed]});
    else
      return message.reply({content: "Here you go!", embeds: [embed]});
  },
};
  
exports.help = {
  "name": "roll",
  "aliases": ["dice", "r"],
  "description": 'Rolls dice. Defaults to 1d20 (a 20-sided dice). [options] can include dice, modifiers, and queries.',
  "usage": `${process.env.prefix}roll [options]`,
  "params": "[options]",
  "default": 0,
  "helpurl": "https://l375.weebly.com/gyrocmd-roll",
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
