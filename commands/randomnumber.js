const Discord = require('discord.js');

function getRandomInt(min, max) {
  // Debug snippet
  //console.log(`GRI min: ${min}, GRI max: ${max}`);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(min, max) {
  var factor = 1;
  var altMin, altMax;
  //var altMind, altMaxd;

  // Checks to see if the minimum is larger than the maximum. If so, switches the numbers around.
  altMin = Math.max(min, max);
  altMax = Math.min(max, min);

  // Converts the decimal to an integer for convenience.
  while (Math.ceil(altMin) !== (max * factor) || Math.floor(altMax) !== (min * factor)) {
    altMin *= 10;
    altMax *= 10;
    factor *= 10;
  }
  
  /*if(altMin % 1 != 0 || altMax % 1 != 0) {
    // Splits the decimal and whole number portions
    altMind = altMin % 1;
    altMaxd = altMax % 1; altMaxd++;
    altMin = Math.floor(altMin);
    altMax = Math.floor(altMax) - 1;
  }*/

  // Debug snippet
  //console.log(`altMin = ${altMin}, altMax = ${altMax}`);
  //console.log(`altMind = ${altMind}, altMaxd = ${altMaxd}`);

  if (altMax >= 0) {
    //altMax++:
    var num = getRandomInt(altMin, parseInt(altMax)+1);
    //altMax--;
  } else if (altMax < 0){
    //altMin++;
    var num = getRandomInt(parseInt(altMin)+1, altMax);
    //altMin--;
  }

  // Debug snippet
  //console.log(`num = ${num}`);

  if (num > altMin && num > altMax) {
    while (num > altMin && num > altMax) {
      num--;
    }
  } else if (num < altMin && num < altMax) {
    while (num < altMin && num < altMax) {
      num++;
    }
  }

  /*if (altMax >= 0 && num >= altMax) {
    num = altMax;
  } else if (altMax < 0 && num >= altMin) {
    num = altMin;
  }*/

  // Debug snippet
  // console.log(`num (altered) = ${num}, num/factor = ${num / factor}\n- - - - - - - - - - -`);

  return (num/factor);
}

module.exports.run = {
  execute(message, args) {

    var number = 0;

    if (!args.length) {
      message.reply('I can\'t generate a number between a non-existent range!')
      return;
    }

    // Debug block
    /*var a0typ = isNaN(args[0]);
    if (args.length >= 2) {
      var a1typ = isNaN(args[1]);
    } //*/

    if (args.length >= 2) {

      // Debug snippet
      //console.log(`arg0type = ${a0typ}, arg1type = ${a1typ}`);

      if (!isNaN(args[0]) && !isNaN(args[1])) {
        number = getRandomNumber(args[0], args[1]);
      } else {
        message.reply('I can\'t generate a random number between non-numerical values!');
        return;
      }
    } else if (args.length = 1) {

      // Debug snippet
      //console.log(`arg0type = ${a0typ}`);

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
  "description": "Generates a random number between two numbers, inclusive.\nIf only one argument is given, generates a number between 0 and that number, inclusive.",
  "usage": `${process.env.prefix}randomnumber <num1> [num2]`,
  "params": "<num1> [num2]",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};
