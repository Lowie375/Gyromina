// Require discord.js, the style file, the RNG, and the embed colour checker
const Discord = require('discord.js');
const style = require('../systemFiles/style.json');
const {getRandomInt, eCol} = require('../systemFiles/globalFunctions.js');

const flow = ["Anyway,", "Regardless,", "Either way,"];

// Negative number regex
const negNum = /^-\d/;
const dots = /(\.\.+|…+)$/;

function argComb(args) {
  let save = []; // = [type, mixedBool, runoffLength]
  let mixed = 0;
  let run;
  let rSave;
  // Checks for queries
  for (let i = 0; i < args.length; i++) {
    if(args[i].startsWith("-") && !negNum.exec(args[i])) {
      switch(args[i].slice(1, 2)) {
        case "t":
        case "d":
        case "n":
          save.push("t");
          break;
        case "r":
        case "_":
          save.push("r");
          run = i;
          rSave = args[i].slice(2);
          break;
        case "m":
          mixed = 1;
          break;
      }
      args.splice(i, 1);
      i--;
    } else if(dots.exec(args[i])) {
      save.push("r");
      run = i;
      let d = dots.exec(args[i]);
      args[i].slice(0, -d[1].length);
    }
  } 
  switch(save.length) {
    case 0: return ["x", mixed, 0];
    case 1: return [save[0], mixed, runoffCheck(args, run, rSave)];
    default: {
      for (let j = 1; j < save.length; j++) {
        if (save[0] != save[j]) return ["n", mixed, 0];
      }
      return [save[0], mixed, runoffCheck(args, run, rSave)];
    }
  }
} 

function analyze(num) {
  let numArr = num[1].split("");
  let lim = Math.floor(num[1].length/2);
  let cSp = 1;
  let rMatch = 0;

  while (rMatch === 0 && cSp <= lim) { // comb spacer loop
    rMatch = 1;
    for (let i = 1; i <= cSp; i++) { // comb loob
      // assume match until disproven
      if (numArr[-i] !== numArr[-i-cSp]) rMatch = 0; 
    }
    if (rMatch === 1) return ["r", cSp]; // match = likely pattern!
    cSp++; // else, bump comb + try again
  }
  return ["t", 0]; // no pattern, assume terminating
}

function runoffCheck(args, run, rSave) {
  // cancels runoff check for terminating decimals (does not apply)
  if(!run) return 0;

  // checks if a specific runoff has been given
  if(rSave && !isNaN(parseInt(rSave))) { // snapped together
    return rSave;
  } else if(args[run] && !isNaN(parseInt(args[run]))) { // next arg
    return args[run];
  } else { // no runoff given, calculate later
    return 0;
  }
}

function runner(num, set) {
  if(set[2] === 0) { // finds runoff if not yet determined
    let s2 = analyze(num)[1];
    if(s2 === 0)
      set[2] = num[1].length
    else
      set[2] = s2;
  }
/* PSEUDO:
if no runoff given, analyze()
find start of runoff
- start at start, compare strings using runoff length
split term + runoff
- use dec() on term
- store dec places as factor
iterate runner (limit to 1023 for stability)
- multiply current test denom by decimal given + take ceiling/floor
- compare bounds to actual number
  - if match, break
  - else, move to next non-power-of-2-or-5 number
  //Math.log(x)/Math.log(2) % 1 === 0 || Math.log(x)/Math.log(5) % 1 === 0
add term and runoff*factor
- find gcf + add
add whole number
return
*/
}

function dec(num, set) {
  // Puts decimal portion over a power of 10 + makes note of how many times the number can be divided
  var nFrac = parseInt(num[1]);
  var div = num[1].length;
  var dFrac = Math.pow(10, div);

  // Divides numbers
  for(let i = 2; i <= 5; i+=3) {
    let j = 0;
    while((nFrac/i) % 1 === 0 && j < div) {
      nFrac /= i;
      dFrac /= i;
      j++;
    }
  }
  // Adds the whole number component, if present and mixed not specified
  if (set[1] == 0) {
    nFrac += num[0] * dFrac;
  }
  // Returns the fraction
  return [nFrac, dFrac];
}

exports.run = {
  execute(message, args, client) {
    if (args.length === 0)
      return message.channel.send(`I need a number to convert to a fraction, <@${message.author.id}>!`);

    // Prepares the number and handles queries
    var set = argComb(args);
    var num = args[0].split(".").slice(0, 2);
    var frac;
    var results;

    // Determines the fraction algorithm to run based on decimal type
    switch(set[0]) {
      case "t": {// terminating
        frac = dec(num, set); break;
      } case "r": {// repeating
        frac = runner(num, set); break;
      } case "x": {// indeterminate; further analysis needed
        results = analyze(num);
        set[2] = results[1];
        if(results[0] == "t")
          frac = dec(num, set);
        else
          frac = runner(num, set);
        break;
      } default: // conflicting; throw error
        return message.channel.send(`I'm not sure what kind of decimal to treat this as, <@${message.author.id}>.\n(Please choose either **\`-r\`**epeating or **\`-t\`**erminating, not both.)`);
    }

    // creates the embed
    const embed = new Discord.MessageEmbed()
      .setColor(eCol(style.e.default));
    
    if (set[1] === 1 && num[0] !== "0")
      embed.setTitle(`\`${num[0]} ${frac[0]}/${frac[1]}\``);
    else 
      embed.setTitle(`\`${frac[0]}/${frac[1]}\``)

    // sends the embedd
    if(set[0] == "x") {
      switch(results[0]) {
        case "t": // terminating
          return message.channel.send(`I think this is a terminating decimal, <@${message.author.id}>. If I'm wrong, try this command again with a **\`-r\`** at the end.\n${flow[getRandomInt(0,2)]} here you go!`, {embed: embed});
        default: // repeating
          return message.channel.send(`I think this is a repeating decimal, <@${message.author.id}>. If I'm wrong, try this command again with a **\`-t\`** at the end.\n${flow[getRandomInt(0,2)]} here you go!`, {embed: embed});
      }
    } else {
      return message.channel.send(`Here you go, <@${message.author.id}>!`, {embed: embed});
    }
    
    
  }
};

exports.help = {
  "name": "fraction",
  "aliases": ["frac", "dtof", "df"],
  "description": "Converts a decimal to a simplified fraction (in base 10).\nDefaults to an improper fraction.",
  "usage": `${process.env.prefix}fraction <decimal> [queries]`,
  "params": "<decimal> [queries]",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};
