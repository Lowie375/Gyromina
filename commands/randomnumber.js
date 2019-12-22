const Discord = require('discord.js');

function getRandomInt(min, max) {
  min = Math.round(min);
  max = Math.round(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(min, max) {
  var num, numDecim, factor, factorPower;
  var altMin, altMax, altMinDecim, altMaxDecim;

  // Checks to see if the minimum is larger than the maximum. If so, switches the numbers around.
  altMin = Math.min(parseFloat(min), parseFloat(max));
  altMax = Math.max(parseFloat(min), parseFloat(max));

  // Splits the decimal and whole number portions of each number
  altMinDecim = altMin % 1;
  altMaxDecim = altMax % 1;

  if (altMinDecim == 0 && altMaxDecim == 0) {
    factor = 1;
    factorPower = 1;
  } else if (altMin.toString().split(".").pop().length >= altMax.toString().split(".").pop().length) {
    factor = Math.pow(10, altMin.toString().split(".").pop().length);
    factorPower = altMin.toString().split(".").pop().length;
  } else if (altMin.toString().split(".").pop().length < altMax.toString().split(".").pop().length) {
    factor = Math.pow(10, altMax.toString().split(".").pop().length);
    factorPower = altMax.toString().split(".").pop().length;
  }

  altMin -= altMin % 1;
  altMax -= altMax % 1;

  //altMinDecim = parseFloat(altMin.toString().split(".").pop());
  //altMaxDecim = parseFloat(altMin.toString().split(".").pop());

  /*if (altMinDecim == 0 && altMaxDecim == 0) {
    factor = 1;
  } else if (altMinDecim.toString().length >= altMaxDecim.toString().length) {
    factor = Math.pow(10, altMinDecim.toString().length - 2);
  } else if (altMinDecim.toString().length < altMaxDecim.toString().length) {
    factor = Math.pow(10, altMaxDecim.toString().length - 2);
  }*/

  num = getRandomInt(altMin, altMax+1);

  if (factor != 1) {
    switch (num) {
      case altMin: numDecim = getRandomInt(altMinDecim*factor, factor)/factor; break;
      case altMax: numDecim = getRandomInt(0, altMaxDecim*factor)/factor; break;
      default: numDecim = getRandomInt(0, factor)/factor; break;
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

module.exports.run = {
  execute(message, args) {

    var number = 0;

    if (!args.length) {
      message.reply('I can\'t generate a number between a non-existent range!')
      return;
    }

    if (args.length >= 2) {

      if (!isNaN(args[0]) && !isNaN(args[1])) {
        number = getRandomNumber(args[0], args[1]);
      } else {
        message.reply('I can\'t generate a random number between non-numerical values!');
        return;
      }
    } else if (args.length = 1) {

      if (!isNaN(args[0])) {
        number = getRandomNumber(0, args[0]);
      } else {
        message.reply('I can\'t generate a random number between non-numerical values!');
        return;
      }
    }

    const embed = new Discord.RichEmbed()
      .setTitle("\`" + number + "\`")
      .setColor(0x7effaf);

    message.reply("here you go!", {embed});
  }
};

module.exports.help = {
  "name": "randomnumber",
  "aliases": ["number", "num", "rn"],
  "description": "Generates a random number between two numbers, inclusive.\nIf only one argument is given, generates between 0 and that number, inclusive.",
  "usage": `${process.env.prefix}randomnumber <num1> [num2]`,
  "params": "<num1> [num2]",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
