const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
const style = require('../systemFiles/style.json'); // style file
// embed colour checker, minMax constrainer, responder, rejection embed generator
const {eCol, minMax, respond, genRejectEmbed} = require('../systemFiles/globalFunctions.js');

function getRandomDecimal(min, max, decims) {

  //var places = Math.round(decims);
  var factor = Math.pow(10, decims);

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
      return respond({embeds: [genRejectEmbed(message, `\`places\` argument is negative`, `Please enter a valid positive integer and try again.`)]}, [message, message], {reply: true, eph: true});
    else if (args[0] >= 0)
      number = getRandomDecimal(0, 1, minMax(parseInt(args[0]), 1, 16));
    
    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`\`${number}\``)
      .setColor(eCol(style.e.default));

    // Sends the embed
    return respond({content: `Here you go!`, embeds: [embed]}, [message, message], {reply: true});
  },
  slashArgs(interact) {
    // template: single arg
    let opts = interact.options.getNumber("places")
    switch(opts) {
      case null: return "";
      default: return opts;
    }
  },
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
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("randomdecimal")
      .setDescription("Generates a random decimal number between 0 and 1")
      .addNumberOption(o => o.setName("places").setDescription("Number of decimal places to generate the decimal to (default = 10)").setRequired(false))
  }
};
