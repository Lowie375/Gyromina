// Require the package file, emoji file, and some global functions (colours)
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);

    // Checks to see if the bot owner or a contributor sent the message.
    if(message.author.id !== process.env.hostID && message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id)) {
      console.log('A user attempted to run a test, but was unsuccessful!');
      return message.channel.send(`${nope} Error - Insufficient permissions!`);
    }

    if (args.length >= 3) {
      // Colour tests
      let rgb = {r: parseInt(args[0]), g: parseInt(args[1]), b: parseInt(args[2])};
      // Hex
      let hex = rgbToHex(rgb);
      let n1 = hexToRgb(`${hex}`);
      // CMYK
      let cmyk = rgbToCmyk(rgb);
      let n2 = cmykToRgb(cmyk);
      // Int
      let int = hexToInt(hex);
      let hex2 = intToHex(int);
      let n3 = hexToRgb(hex2);

      message.channel.send(`1: rgb(${n1.r}, ${n1.g}, ${n1.b}) // 2: rgb(${n2.r}, ${n2.g}, ${n2.b}) // 3: rgb(${n3.r}, ${n3.g}, ${n3.b})\nhex: #${hex} // cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%) // int: ${int}`);
    } else {
      // Markdown test
      message.channel.send("Markdown [test](https://lx375.weebly.com)");
    }
  },
};
    
exports.help = {
  "name": 'vartest',
  "aliases": 'vt',
  "description": 'Miscellaneous test command. (Contributors only)',
  "usage": `${process.env.prefix}vartest`,
  "params": "(contributors only)",
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
