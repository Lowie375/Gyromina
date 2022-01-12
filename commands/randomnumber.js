const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
const style = require('../systemFiles/style.json'); // style file
// RNG, embed colour checker, responder, rejection embed generator
const {getRandomInt, eCol, respond, genRejectEmbed} = require('../systemFiles/globalFunctions.js');

function getRandomNumber(min, max) {
  var num, numDecim, factor, factorPower;
  var altMin, altMax, altMinDecim, altMaxDecim;

  // Checks to see if the minimum is larger than the maximum. If so, switches the numbers around.
  altMin = Math.min(parseFloat(min), parseFloat(max));
  altMax = Math.max(parseFloat(min), parseFloat(max));

  // Splits the decimal and whole number portions of each number
  altMinDecim = altMin % 1;
  altMaxDecim = altMax % 1;

  if (altMinDecim === 0 && altMaxDecim === 0) {
    factor = 1;
    factorPower = 0;
  } else if (altMin.toString().split(".").pop().length >= altMax.toString().split(".").pop().length) {
    factor = Math.pow(10, altMin.toString().split(".").pop().length);
    factorPower = altMin.toString().split(".").pop().length;
  } else if (altMin.toString().split(".").pop().length < altMax.toString().split(".").pop().length) {
    factor = Math.pow(10, altMax.toString().split(".").pop().length);
    factorPower = altMax.toString().split(".").pop().length;
  } else { // fallback
    factor = 1;
    factorPower = 0;
  }

  altMin -= altMin % 1;
  altMax -= altMax % 1;

  num = getRandomInt(altMin, altMax);

  if (factor !== 1) {
    switch (num) {
      case altMin: numDecim = getRandomInt(altMinDecim*factor, factor-1)/factor; break;
      case altMax: numDecim = getRandomInt(0, altMaxDecim*factor-1)/factor; break;
      default: numDecim = getRandomInt(0, factor-1)/factor; break;
    }
    num += numDecim;
  }

  while (num > altMax+altMaxDecim) {
    num -= (num/factor);
  }
  while (num < altMin+altMinDecim) {
    num += (num/factor);
  }

  return num.toFixed(factorPower);
}

exports.run = {
  execute(message, args, client) {
    var number;

    // Checks if no bounds were set
    if (args.length === 0)
      return respond({embeds: [genRejectEmbed(message, `\`num1\` argument not found`, `Gyromina can\'t generate a number in a non-existent range!\nPlease enter a valid number and try again.`)]}, [message, message], {reply: true, eph: true});

    // Checks numbers and generates
    if(isNaN(parseInt(args[0]))) { // invalid num1
      return respond({embeds: [genRejectEmbed(message, `Non-numerical \`num1\` argument`, `Gyromina can\'t generate a random number between non-numerical values!\nPlease enter a valid number and try again.`)]}, [message, message], {reply: true, eph: true});
    } else if(args.length >= 2) {
      if(isNaN(parseInt(args[1]))) // invalid num2
        return respond({embeds: [genRejectEmbed(message, `Non-numerical \`num2\` argument`, `Gyromina can\'t generate a random number between non-numerical values!\nPlease enter a valid number and try again.`)]}, [message, message], {reply: true, eph: true});
      else
        number = getRandomNumber(args[0], args[1]);
    } else {
      number = getRandomNumber(0, args[0]);
    }

    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`\`${number}\``)
      .setColor(eCol(style.e.default));

    // Sends the embed
    return respond({content: `Here you go!`, embeds: [embed]}, [message, message], {reply: true});
  },
  slashArgs(interact) {
    // template: multi arg + trailing optionals
    let opts = [
      interact.options.getNumber("num1"),
      interact.options.getNumber("num2")
    ];
    for(let i = 0; i < opts.length; i++) {
      if(opts[i] === null)
        opts[i] = "";
    }
    while(opts[opts.length-1] === "") {
      opts.pop();
    }
    return opts.join(" ");
  },
};

exports.help = {
  "name": "rnum",
  "aliases": ["randomnumber", "number", "num", "rn"],
  "description": "Generates a random number between two numbers, or one number and 0, inclusive.",
  "usage": `${process.env.prefix}rnum <num1> [num2]`,
  "params": "<num1> [num2]",
  "default": 0,
  "weight": 2,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("rnum")
      .setDescription("Generates a random number between two numbers, inclusive")
      .addNumberOption(o => o.setName("num1").setDescription("First bound to generate a number between").setRequired(true))
      .addNumberOption(o => o.setName("num2").setDescription("Second bound to generate a number between (default = 0)").setRequired(false))
  }
};
