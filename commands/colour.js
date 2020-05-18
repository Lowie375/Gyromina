// Require discord.js and some global functions (colour + Clean)
const Discord = require('discord.js');
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex, Clean} = require('../systemFiles/globalFunctions.js');

// Regex setup
const rgbX = /^rgb\((\d)[, ]+(\d)[, ]+(\d)\)$/i;
const cmykX = /^cmyk\((\d)%?[, ]+(\d)%?[, ]+(\d)%?[, ]+(\d)%?\)$/i;
const hexX = /^#?([a-f\d]{6})$/i;

function extract (xc) {
  if(rgbX.exec(xc)) {
    // xc -> RGB object
    return 1;
  } else if(cmykX.exec(xc)) {
    // xc -> CMKY object
    return 2;
  } else if(hexX.exec(xc)) {
    // xc -> hex code
    return 3;
  } else if(!isNaN(parseInt(xc))) {
    // xc -> int
    return 4;
  } else {
    // xc -> unsupported format
    return null;
  }
}

exports.run = {
  execute(message, args, client) {
    var [...code] = Clean(args);
    var col = extract(code);
    
    // Add code here

  }
}

exports.help = {
  "name": "colour",
  "aliases": ["color", "col", "cdat", "coldata", "cdata"],
  "description": 'Displays colour data.',
  "usage": `${process.env.prefix}colour <colour>`,
  "params": "<colour>",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};