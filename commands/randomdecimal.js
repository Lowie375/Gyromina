const D = require('discord.js'); // discord.js
const style = require('../systemFiles/style.json'); // style file
// embed colour checker, minMax constrainer, responder, rejection embed generator
const {eCol, minMax, genRejectEmbed} = require('../systemFiles/globalFunctions.js');

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

    if (args.length === 0)
      number = getRandomDecimal(0, 1, 10);
    else if (args[0] < 0)
      return message.reply({embeds: [genRejectEmbed(message, `Negative \`places\` argument`, `Please enter a valid positive integer and try again.`)]});
    else if (args[0] >= 0)
      number = getRandomDecimal(0, 1, minMax(parseInt(args[0]), 1, 16));
    
    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`\`${number}\``)
      .setColor(eCol(style.e.default));

    // Sends the embed
    return message.reply({content: `Here you go!`, embeds: [embed]});
  }
};

exports.help = {
  "name": "randomdecimal",
  "aliases": ["rd", "randomdecim", "rdec"],
  "description": "Generates a random decimal number between 0 and 1, to up to 16 decimal places.\nDefaults to 10 decimal places.",
  "usage": `${process.env.prefix}randomdecimal [places]`,
  "params": "[places]",
  "default": 0,
  "weight": 2,
  "hide": false,
  "wip": false,
  "dead": false
};
