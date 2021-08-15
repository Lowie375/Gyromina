// randomcolour V2 - Made by Irisu (irisuwastaken)

// Require discord.js, the RNG, and some colour conversions
const D = require('discord.js');
const {getRandomInt, hexToRgb, rgbToCmyk, rgbToHsl, rgbToHsv, hexToInt} = require('../systemFiles/globalFunctions.js');

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
    let hsl = rgbToHsl(rgb);
    let hsv = rgbToHsv(rgb);
    let cmyk = rgbToCmyk(rgb);
    let int = hexToInt(hex);

    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`#${hex}`)
      .setDescription(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nhsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)\nhsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)\ncmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)\nint: ${int}`)
    
    switch(hex) {
      case "ffffff": embed.setColor(0xfefefe); break; // override because #ffffff is transparent
      default: embed.setColor(parseInt(`0x${hex}`)); break;
    }

    // Sends the embed
    return message.reply({content: `Here you go!`, embeds: [embed]});
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
