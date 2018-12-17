const Discord = require('discord.js');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(min, max) {
  var factor = 1;
  var altMin, altMax;

  // Checks to see if the minimum is larger than the maximum. If so, switches the numbers around.
  if (min > max) {
    altMin = max;
    altMax = min;

    // Converts the decimal to an integer for convenience.
    while (Math.ceil(altMin) !== (max * factor) || Math.floor(altMax) !== (min * factor)) {
      altMin *= 10;
      altMax *= 10;
      factor *= 10;
    }
  } else {
    altMin = min;
    altMax = max;

    // Converts the decimal to an integer for convenience.
    while (Math.ceil(altMin) !== (min * factor) || Math.floor(altMax) !== (max * factor)) {
      altMin *= 10;
      altMax *= 10;
      factor *= 10;
    }
  }

  // Debug snippet
  //console.log(`altMin = ${altMin}, altMax = ${altMax}, factor = ${factor}`);

  if (altMax >= 0) {
    altMax++;
    var num = getRandomInt(altMin, altMax);
    altMax--;
  } else if (altMax < 0){
    altMin++;
    var num = getRandomInt(altMin, altMax);
    altMin--;
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
  console.log(`num (altered) = ${num}, num/factor = ${num / factor}\n- - - - - - - - - - -`);

  return (num / factor);
}

module.exports = {
  execute(message, args) {

    var number = 0;
    var fail = false;

    if (!args.length) {
      fail = true;
      message.reply('I can\'t generate a random number if I\'m not given any values to generate a number between!')
    }
    if (args.length) {

      var a0typ = isNaN(args[0]);
      if (args.length >= 2) {
        var a1typ = isNaN(args[1]);
      }

      if (args.length >= 2) {

        // Debug snippet
        //console.log(`arg0type = ${a0typ}, arg1type = ${a1typ}`);

        if (!isNaN(args[0]) && !isNaN(args[1])) {
          number = getRandomNumber(args[0], args[1]);
        } else {
          fail = true;
          message.reply('I can\'t generate a random number between non-numerical values!')
        }
      } else if (args.length = 1) {

        // Debug snippet
        //console.log(`arg0type = ${a0typ}`);

        if (!isNaN(args[0])) {
          number = getRandomNumber(0, args[0]);
        } else {
          fail = true;
          message.reply('I can\'t generate a random number between non-numerical values!')
        }
      }

      if (fail === false) {
        const embed = new Discord.RichEmbed()
          .setTitle("\`" + number + "\`")
          .setColor(0x7effaf);

        message.reply("here you go!", {embed});
      }
    }
  }
};

module.exports.help = {
  name: "randomnumber",
  aliases: ["number", "num", "rn"],
  description: "Returns a random number between two other numbers, inclusive.\nIf only one argument is given, returns a number between 0 and that number, inclusive.",
  usage: `${process.env.prefix}randomnumber <max> [min]`,
  hide: false
};
