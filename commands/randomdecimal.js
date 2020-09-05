// Require discord.js
const Discord = require('discord.js');

function getRandomDecimal(min, max, decims) {

  var places = Math.round(decims);
  var factor = Math.pow(10, places);

  min = Math.ceil(min * factor);
  max = Math.floor(max * factor);

  var num = Math.floor(Math.random() * (max - min)) + min + 1;
  if (num >= 0 && num >= max) {
    num = max;
  } else if (num <= 0 && num <= min) {
    num = min;
  }

  return (num / factor);
}

exports.run = {
  execute(message, args, client) {
    var number = 0;

    if (args.length == 0)
      number = getRandomDecimal(0, 1, 10);
    else if (args[0] < 0)
      return message.reply("I can\'t generate a decimal number to a negative amount of decimal places!");
    else if (args[0] >= 0)
      number = getRandomDecimal(0, 1, args[0]);

    const embed = new Discord.MessageEmbed()
      .setTitle(`\`${number}\``)
      .setColor(0x7effaf);

    message.reply("here you go!", {embed: embed});
  }
};

exports.help = {
  "name": "randomdecimal",
  "aliases": ["decimal", "rd"],
  "description": "Generates a random decimal number between 0 and 1, to up to 16 decimal places.\nDefaults to 10 decimal places.",
  "usage": `${process.env.prefix}randomdecimal [places]`,
  "params": "[places]",
  "weight": 2,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
