// randomcolour V2 - Made by Homura#5311

// Require discord.js and the RNG
const Discord = require('discord.js');
const {getRandomInt, hexToRgb, rgbToCmyk, hexToInt} = require('../systemFiles/globalFunctions.js');

function getRandomHex() {
  let r = getRandomInt(0, 255);
  let g = getRandomInt(0, 255);
  let b = getRandomInt(0, 255);

  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

exports.run = {
  execute(message, args, client) {
    let hex = getRandomHex();
    let rgb = hexToRgb(`#${hex}`);
    let cmyk = rgbToCmyk(rgb);
    let int = hexToInt(hex);

    const embed = new Discord.MessageEmbed()
      .setTitle(`#${hex}`)
      .setDescription(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\ncmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)\nint: ${int}`)
      .setColor(parseInt(`0x${hex}`));

    message.reply("here you go!", {embed: embed});

  },
};

exports.help = {
  "name": "randomcolour",
  "aliases": ["randomcolor", "rc", "rcol"],
  "description": "Returns a random colour in various formats.",
  "usage": `${process.env.prefix}randomcolour`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
