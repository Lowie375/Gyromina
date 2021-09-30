// Require discord.js, the style file, the RNG, and the embed colour checker
const D = require('discord.js');
const style = require('../systemFiles/style.json');
const {getRandomInt, eCol} = require('../systemFiles/globalFunctions.js');

// quip list for badly formatted fractions; subject to change
const quips = [
  ["You may want to practice your pizza slicing.", 0],
  ["Long division who?", 0],
  ["That fraction doesn't look right…", 1],
  ["What a messy fraction.", 0],
  ["Something's off about that fraction…", 1],
  ["I don't think I've seen a fraction like that before…", 1],
];
const qExt = [
  ["Anyway,", "anyway,"],
  ["Regardless,", "regardless,"],
  ["Either way,", "either way,"],
  ["Anywho,", "anywho,"],
  ["Oh well,", "oh well,"],
];

// fraction regex
const whole = /^\d{1,}$/ig
const frac = /^(\d+)[/⁄÷∕](\d*\d)$/i
const div = /^[/⁄÷∕]$/ig

function argComb(args) {
  let wSave = [];
  let fSave = [];
  let output = [0, 0, 1];

  // check if an advanced comb/replace is needed
  if (args.length >= 3) { // advanced (space-wise) comb
    for(let i = 0; i < args.length-2; i++) {
      let concat = `${args[i]}${args[i+1]}${args[i+2]}`;
      if(div.test(args[i+1]) && frac.test(concat)) {
        args.splice(i, 3, concat);
      }
    }
  }
  // run through and classify matching args
  for(const arg of args) {
    if(whole.test(arg)) {
      wSave.push(arg);
    } else {
      let f = frac.exec(arg);
      if(f) fSave.push([f[1], f[2]]);
    }
  }
  // check for fraction portion duplicates
  switch (fSave.length) {
    case 0: return "null";
    case 1: {
      output[1] = parseInt(fSave[0][0]);
      output[2] = parseInt(fSave[0][1]);
      break;
    }
    default: {
      for(let i = 1; i < fSave.length; i++) {
        if(fSave[0] != fSave[i]) return "err";
      }
      output[1] = parseInt(fSave[0][0]);
      output[2] = parseInt(fSave[0][1]);
      break;
    }
  }
  // check for whole portion duplicates
  switch (wSave.length) {
    case 0: output[0] = 0; break;
    case 1: output[0] = parseInt(wSave[0]); break;
    default: {
      for(let i = 1; i < fSave.length; i++) {
        if(wSave[0] != wSave[i]) return "err";
      }
      output[0] = parseInt(wSave[0]);
      break;
    }
  }
  return output;
}

exports.run = {
  execute(message, args, client) {
    var statement;
    if(args.length === 0)
      return message.reply(`I need a fraction to convert to a decimal!`);
    
    var nums = argComb(args);
    if(!Array.isArray(nums)) {
      switch (nums) {
        case "null": return message.reply(`That doesn't look like a fraction. Please check your formatting and try again.`);
        case "err": return message.reply(`I can't convert multiple different fractions into a single decimal!`);
      }
    }
    var decim = nums[1]/nums[2] + nums[0];

    // checks for an improper/mixed fraction combo
    if(nums[0] !== 0 && nums[1] >= nums[2]) { // yes: send quippy message
      var seed = getRandomInt(0, quips.length-1);
      statement = `${quips[seed][0]} ${qExt[getRandomInt(0, qExt.length-1)][quips[seed][1]]} here you go.`;
    } else { // no: send regular message
      statement = `Here you go!`;
    }

    // creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`${nums[0] === 0 ? "" : `${nums[0]} `}${nums[1]}/${nums[2]} is…\n\`${decim}\``)
      .setColor(eCol(style.e.default));

    // sends the message and embed
    return message.reply({content: statement, embeds: [embed]});
  }
};

exports.help = {
  "name": "decimal",
  "aliases": ["decim", "dec", "ftod", "fd"],
  "description": "Converts a fraction (in base 10) to a decimal.",
  "usage": `${process.env.prefix}decimal [whole] <num>/<denom>`,
  "params": "[whole] <num>/<denom>",
  "weight": 2,
  "hide": false,
  "wip": false,
  "dead": false
};