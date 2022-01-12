const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
// colour conversions, responder
const {getRandomInt, hexToRgb, rgbToCmyk, rgbToHsl, rgbToHsv, hexToInt, respond} = require('../systemFiles/globalFunctions.js');

/** randomcolour V2 - hex generator
 * @author Irisu (irisuwastaken)
 */

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
    return respond({content: `Here you go!`, embeds: [embed]}, [message, message], {reply: true});
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": "rcol",
  "aliases": ["randomcolour", "randomcolor", "rc"],
  "description": "Returns a random colour in various formats.",
  "usage": `${process.env.prefix}rcol`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("rcol")
      .setDescription("Returns a random colour in various formats")
  }
};
