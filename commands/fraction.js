// Require discord.js, the style file, the RNG, and the embed colour checker
const Discord = require('discord.js');
const style = require('../systemFiles/style.json');
const {getRandomInt, eCol} = require('../systemFiles/globalFunctions.js');

const flow = ["Anyway,", "Regardless,", "Either way,"];

// Negative number regex
const negNum = /^-\d/;
const dots = /(\.\.+|…+)$/;
const decimX = /\d{0,}\.\d+/

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
    case 0: return ["x", mixed, 0, 0];
    case 1: {
      let rCheck = runoffCheck(args, run, rSave);
      return [save[0], mixed, rCheck[0], rCheck[1]];
    } 
    default: {
      for (let j = 1; j < save.length; j++) {
        if (save[0] != save[j]) return ["n", mixed, 0, 0];
      }
      let rCheck = runoffCheck(args, run, rSave);
      return [save[0], mixed, rCheck[0], rCheck[1]];
    }
  }
} 

function notLoggable(n) {
  if(n/3 % 1 === 0 || n/7 % 1 === 0 || n/11 % 1 === 0 || n/13 % 1 === 0
    || n/17 % 1 === 0 || n/19 % 1 === 0 || n/23 % 1 === 0 || n/29 % 1 === 0 || n/31 % 1 === 0)
    return 1;
  else
    return 0;
}

function loggable(n) {
  if(n < 1)
    return 0; // not loggable
  else if(Math.log(n)/Math.log(2) % 1 === 0 || Math.log(n)/Math.log(5) % 1 === 0) // basic check
    return 1; // loggable
  else // remove a 10 (2*5) + re-iterate
    loggable(n/10);
}

function analyze(num) {
  for(let i = Math.floor(num[1].length/2); i > 0; i--) { // comb spacer loop
    if(num[1].slice(-i) === num[1].slice(-2*i, -i)) return ["r", i];
  }
  return ["t", 0]; // no pattern, assume terminating
}

function runoffCheck(args, run, rSave) {
  // cancels runoff check for terminating decimals (does not apply)
  if(!run) return [0, 0];

  // checks if a specific runoff has been given
  if(rSave && !isNaN(parseInt(rSave))) { // snapped together
    return [parseInt(rSave), 1];
  } else if(args[run] && !isNaN(parseInt(args[run]))) { // next arg
    return [parseInt(args[run]), 1];
  } else { // no runoff given, calculate later
    return [0, 0];
  }
}

function factorize10(rn, dt) { // one number must be a power of 10
  let common = 1;
  // Divides numbers
  for(let i = 2; i <= 5; i+=3) {
    while(rn/i % 1 === 0 && dt/i % 1 === 0) {
      rn /= i;
      dt /= i;
      common *= i;
    }
  }
  return [dt, rn, common*rn*dt]; // [runFact, decFact, lcm]
}

function getGCF(n1, n2) {
  let gcf = 1;
  let lim = Math.min(n1, n2);
  // irregular checks:
  for(let i = 2; i <= Math.min(lim, 3); i++) {
    while(n1/i % 1 === 0 && n2/i % 1 === 0) {
      n1 /= i;
      n2 /= i;
      gcf *= i;
    }
  }
  // regular checks (2n±1):
  for(let i = 6; (i-1) <= lim; i+=6) {
    while(n1/(i-1) % 1 === 0 && n2/(i-1) % 1 === 0) {
      n1 /= (i-1);
      n2 /= (i-1);
      gcf *= (i-1);
    }
    if(i+1 <= lim) {
      while(n1/(i+1) % 1 === 0 && n2/(i+1) % 1 === 0) {
        n1 /= (i+1);
        n2 /= (i+1);
        gcf *= (i+1);
      }
    }
  }
  return gcf;
}

function runner(num, set) {
  let runStart = 0;
  let factor = 1;
  let numDiv;
  let check;
  let runFrac;
  let decFrac;
  let frac;

  // checks if run length is out of range
  if(set[2] <= 0 && set[3] === 1) return "badRun";

  // find runoff if not yet determined
  if(set[2] === 0) {
    let s2 = analyze(num)[1];
    if(s2 === 0) {
      set[2] = num[1].length;
      set[3] = 1;
    } else {
      set[2] = s2;
    }
  } 

  if(set[3] === 1) { // runoff given, do setup assuming from end
    // yes, this is technically a simplification, but not doing this would massively overcomplicate everything
    runStart = num[1].length - set[2];
    factor = Math.pow(10, runStart); // numDiv = [term, cleanRunner, rawRunner]
    numDiv = [num[1].slice(0, runStart), num[1].slice(runStart), `0.${num[1].slice(runStart)}`];
    check = `0.${numDiv[1]}${numDiv[1]}`;
  } else {
    // find the start of the runner ("setup")
    for(let i = 0; i < num[1].length - 2*set[2] + 1; i++) {
      if(num[1].slice(i,i+set[2]) === num[1].slice(i+set[2],i+2*set[2])) {
        runStart = i;
        factor = Math.pow(10, i); // numDiv = [term, cleanRunner, rawRunner]
        numDiv = [num[1].slice(0, i), num[1].slice(i,i+set[2]), `0.${num[1].slice(i)}`];
        check = `0.${numDiv[1]}${numDiv[1]}`;
        i = num[1].length; // break
      }
    }
  }

  // iterator (find the most likely fraction by brute force, fun!)
  let j = 3;
  while(j <= 999) {
    if(notLoggable(j) || !loggable(j)) { // skips terminating decimals (notLoggable = simple check, loggable = secondary check)
      let high = Math.ceil(j*numDiv[2]);
      if((high/j).toString().slice(0, check.length) == check) {
        runFrac = [parseInt(high), j*factor];
        break; // ceiling matches, push
      } else {
        let low = Math.floor(j*numDiv[2]);
        if((low/j).toString().slice(0, check.length) == check) {
          runFrac = [parseInt(low), j*factor];
          break; // floor matches, push
        }
      }
    }
    j++;
  }
  if(j > 999) return "lim"; // too complex, can't handle it (hard limit enforced to save processing power)

  // handle the terminating portion (if present)
  if(numDiv[0] != "")
    decFrac = dec([0, numDiv[0]], set);
  else
    decFrac = [0, 1, num[0]];

  // multiplies fractions by a common factor (for fraction addition)
  let lcm = factorize10(runFrac[1], decFrac[1]);
  for(let i = 0; i <= 1; i++) {
    runFrac[i] *= lcm[0];
  }
  for(let i = 0; i <= 1; i++) {
    decFrac[i] *= lcm[1];
  }
  if(runFrac[1] !== lcm[2] || decFrac[1] !== lcm[2]) return "err"; // throw calculation error

  // Prepares the output fraction
  frac = [runFrac[0] + decFrac[0], lcm[2], num[0], `${numDiv[0]}${numDiv[1]}${numDiv[1]}`];
  // Simplifies the fraction (if necessary)
  let gcf = getGCF(frac[0], frac[1]);
  for(let i = 0; i <= 1; i++) {
    frac[i] /= gcf;
  }
  // Adds the whole number component (if mixed not specified)
  if (set[1] === 0) {
    frac[0] += frac[2] * frac[1];
    frac[2] = "0";
  }

  // Returns the fraction
  return frac;
}

function dec(num, set) {
  // Puts decimal portion over a power of 10 + makes note of how many times the number can be divided
  let nFrac = parseInt(num[1]);
  let div = num[1].length;
  let dFrac = Math.pow(10, div);

  // Divides numbers
  for(let i = 2; i <= 5; i+=3) {
    let j = 0;
    while((nFrac/i) % 1 === 0 && j < div) {
      nFrac /= i;
      dFrac /= i;
      j++;
    }
  }

  // Checks if the whole number component should be added
  if (set[1] === 0) { // improper, add if present
    nFrac += num[0] * dFrac;
    return [nFrac, dFrac, 0];
  } else { // mixed, do not add
    return [nFrac, dFrac, num[0]];
  }
}

exports.run = {
  execute(message, args, client) {
    // Handles queries
    var set = argComb(args);

    // Checks that there is a number, and that it is actually a decimal number
    if(args.length === 0)
      return message.reply(`I need a number to convert to a fraction!`);
    else if(!decimX.test(args[0]))
      return message.reply(`That's not a decimal! Please enter a valid one and try again.`);

    // Prepares the number
    var num = args[0].split(".").slice(0, 2);
    var frac;
    var results;

    // converts num[0] to an integer
    num[0] = parseInt(num[0]);
    if(isNaN(num[0])) num[0] = 0;

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

    if(!Array.isArray(frac)) { // error thrown
      switch(frac) {
        case "lim": return message.channel.send(`That fraction is far too complex for me to handle, <@${message.author.id}>! Sorry about that!`);
        case "badRun": return message.channel.send(`That's not a valid repeating decimal length, <@${message.author.id}>! Please enter a valid positive integer and try again.`);
        default: return message.channel.send(`Something went wrong when processing that fraction, <@${message.author.id}>! Sorry about that!`);
      }
    }

    // creates the embed
    const embed = new Discord.MessageEmbed()
      .setColor(eCol(style.e.default));
    
    if(set[0] == "r" || results[0] == "r")
      embed.setTitle(`${num[0]}.${frac[3]}… is\n\`${parseInt(frac[2]) === 0 ? "" : `${parseInt(frac[2])} `}${frac[0]}/${frac[1]}\``); 
    else
      embed.setTitle(`${num[0]}.${num[1]} is\n\`${parseInt(frac[2]) === 0 ? "" : `${parseInt(frac[2])} `}${frac[0]}/${frac[1]}\``); 

    // sends the embed
    if(set[0] == "x") {
      switch(results[0]) {
        case "t": // terminating
          return message.reply(`I think this is a terminating decimal. If I'm wrong, try this command again with a **\`-r\`** at the end.\n${flow[getRandomInt(0, flow.length-1)]} here you go!`, {embed: embed});
        default: // repeating
          return message.reply(`I think this is a repeating decimal. If I'm wrong, try this command again with a **\`-t\`** at the end.\n${flow[getRandomInt(0, flow.length-1)]} here you go!`, {embed: embed});
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
  "helpurl": "https://l375.weebly.com/gyrocmd-fraction",
  "weight": 2,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
