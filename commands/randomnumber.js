const D = require('discord.js'); // discord.js
const style = require('../systemFiles/style.json'); // style file
// RNG, embed colour checker, responder, rejection embed generator
const {getRandomInt, eCol, genRejectEmbed} = require('../systemFiles/globalFunctions.js');

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
      return message.reply({embeds: [genRejectEmbed(message, `\`num1\` argument not found`, `Gyromina can\'t generate a number in a non-existent range!\nPlease enter a valid number and try again.`)]});

    // Checks numbers and generates
    if (args.length >= 2) {
      if (!isNaN(args[0]) && !isNaN(args[1]))
        number = getRandomNumber(args[0], args[1]);
      else
        return message.reply({embeds: [genRejectEmbed(message, `Non-numerical \`num1\` or \`num2\` arguments`, `Gyromina can\'t generate a random number between non-numerical values!\nPlease enter valid numbers and try again.`)]});
    } else {
      if (!isNaN(args[0]))
        number = getRandomNumber(0, args[0]);
      else
        return message.reply({embeds: [genRejectEmbed(message, `Non-numerical \`num1\` argument`, `Gyromina can\'t generate a random number between non-numerical values!\nPlease enter a valid number and try again.`)]});
    }

    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`\`${number}\``)
      .setColor(eCol(style.e.default));

    // Sends the embed
    return message.reply({content: `Here you go!`, embeds: [embed]});
  }
};

exports.help = {
  "name": "randomnumber",
  "aliases": ["number", "num", "rn", "rnum"],
  "description": "Generates a random number between two numbers, or one number and 0, inclusive.",
  "usage": `${process.env.prefix}randomnumber <num1> [num2]`,
  "params": "<num1> [num2]",
  "default": 0,
  "weight": 2,
  "hide": false,
  "wip": false,
  "dead": false
};
