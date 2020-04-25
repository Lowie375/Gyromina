// randomcolour.js V2 - made by Homura

// Require discord.js and the RNG
const Discord = require('discord.js');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

module.exports.run = {
  execute(message, args, client) {
    function getRandomHex() {
      let r = getRandomInt(0, 255);
      let g = getRandomInt(0, 255);
      let b = getRandomInt(0, 255);
    
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    let hex = getRandomHex();
    let rgb = hexToRgb(`#${hex}`)

    const embed = new Discord.MessageEmbed()
      .setTitle(`#${hex}\nrgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
      .setColor(parseInt(`0x${hex}`));

    message.reply("here you go!", {embed: embed});

  },
};

module.exports.help = {
  "name": "randomcolour",
  "aliases": ["randomcolor", "rc", "rcol"],
  "description": "Returns a random colour in various formats.",
  "usage": `${process.env.prefix}randomcolour`,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};