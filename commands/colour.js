// Require discord.js and some global functions (colour + Clean)
const Discord = require('discord.js');
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex, Clean, minMax} = require('../systemFiles/globalFunctions.js');

// Regex setup
const hexX = /^(0x|#|\b)([a-f\d]{6})/i;
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;
const cmykX = /^cmyk\((\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;

function extract (xc) {
  let m;
  if(hexX.exec(xc)) {
    // xc -> hex code
    return ["hex", 0, hexX.exec(xc)[2]];
  } else if(rgbX.exec(xc)) {
    // xc -> RGB object
    m = rgbX.exec(xc);
    return ["rgb", 1, {r: minMax(m[1], 0, 255), g: minMax(m[2], 0, 255), b: minMax(m[3], 0, 255)}];
  } else if(cmykX.exec(xc)) {
    // xc -> CMKY object
    m = cmykX.exec(xc);
    return ["cmyk", 2, {c: minMax(m[1], 0, 100), m: minMax(m[2], 0, 100), y: minMax(m[3], 0, 100), k: minMax(m[4], 0, 100)}];
  } else if(!isNaN(parseInt(xc, 10))) {
    // xc -> int
    return ["int", 3, parseInt(xc, 10)];
  } else {
    // xc -> null; unsupported format
    return [null, null];
  }
}

exports.run = {
  execute(message, args, client) {
    if (args.length == 0)
      return message.reply("I can't get colour data for a non-existent colour!")

    // Decoding
    var [...code] = Clean(args);
    var col = extract(code.join(" "));
    
    // Individual colour setup
    var hex;
    var rgb;
    var cmyk;
    var int;

    // Test snippet
    //message.channel.send(`Caught ${col[0]}`);

    // Colour conversions
    switch(col[0]) {
      case "hex": {
        hex = col[2];
        int = hexToInt(hex);
        rgb = hexToRgb(`#${hex}`);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      case "rgb": {
        rgb = col[2];
        cmyk = rgbToCmyk(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "cmyk": {
        cmyk = col[2];
        rgb = cmykToRgb(cmyk);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "int": {
        int = col[2];
        hex = intToHex(int);
        rgb = hexToRgb(`#${hex}`);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      case null:
        return message.reply("Invalid colour code. Please check your syntax and try again.");
    }

    // Encoding
    var strand = [`#${hex}`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, `int: ${int}`];
    var head = strand.splice(col[1], 1);

    // Output setup
    const embed = new Discord.MessageEmbed()
      .setTitle(head)
      .setDescription(strand.join("\n"))
      .setColor(parseInt(`0x${hex}`));

    // Sends the embed
    message.channel.send({embed: embed});
  }
}

exports.help = {
  "name": "colour",
  "aliases": ["color", "col", "cdat", "coldata", "cdata"],
  "description": 'Displays colour data.',
  "usage": `${process.env.prefix}colour <colour>`,
  "params": "<colour>",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
