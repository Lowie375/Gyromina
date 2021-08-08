// Require discord.js, the style file, the RNG, and the embed colour checker
const D = require('discord.js');
const style = require('../systemFiles/style.json');
const {getRandomInt, eCol} = require('../systemFiles/globalFunctions.js')

function checkDice(faces) {
  // checks for specialty dice types
  switch(faces) {
    case "b":
    case "betrayal": // betrayal dice (custom d6)
      return ["c", "[betrayal]", 0, 0, 1, 1, 2, 2];
    case "m":
    case "mom":
    case "mansions":
    case "mansionsofmadness": // mansions of madness dice (custom d8)
      return ["m", "[mansions]"];
    default:
      return ["s", `${max(1, parseInt(faces))}`, 1, max(1, parseInt(faces))];
  }
}

function rollDice(faces, count, resArr) {
  let tot = 0;

  // rolls the dice the specified amount of times
  for(let i = 1; i <= count; i++) {
    let r = getRandomInt(1, faces);
    resArr.push(r);
    tot += r;
  }
  return tot;
}

function rollMansionsDice(count, resArr) {
  resArr = [0, 0, 0]
  for(let i = 1; i <= count; i++) {
    let r = getRandomInt(1, 8);
    if(r >= 6) // success
      resArr[0] += 1;
    else if(r >= 4) // investigation/clue
      resArr[1] += 1;
    else // failure
      resArr[2] += 1;
  }
  return resArr;
}

exports.run = {
  execute(message, args, client) {
    // variable setup
    var resArr = [];
    var total = 0;
    var modifier = 0;
    var dice = "";
    
    if(args.length === 0) { // default roll: 1d6
      dice = "1d6";
      total += rollDice(6, 1, resArr);
    } else { // custom roll
      // split off info...

      var info = checkDice("...");
      if(info[0] == "m") {
        rollMansionsDice()
      }

      // PSEUDO:
      // split '+-' and 'd'
      // repeat and roll
      // output individuals + total

      // TODO:
      // canvas drawing for common polyhedrals
    }

    // prepares the embed
    const embed = new D.MessageEmbed()
      .setColor(eCol(style.e.default));

    if(results.length <= 1 && modifier === 0) {
      embed.setTitle(``)
    }

    // returns the result of the roll
    return 
  },
};
  
exports.help = {
  "name": 'roll',
  "aliases": ['dice', 'r'],
  "description": 'Rolls dice. Defaults to 1d6 (a standard 6-sided dice).',
  "usage": `${process.env.prefix}roll [dice] [modifier]`,
  "weight": 1,
  "hide": 0,
  "wip": 1,
  "dead": 0,
};