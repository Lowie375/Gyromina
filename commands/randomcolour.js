const Discord = require('discord.js');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports.run = {
  execute(message, args) {

    var hexNums = [0];
    var hex = ["0"];
    var rgb = [0];

    for (g=0; g<=5; g++) {

      hexNums[g] = getRandomInt(0, 16);

      if (hexNums[g] === 10) {
        hex[g] = "a";
      } else if (hexNums[g] === 11) {
        hex[g] = "b";
      } else if (hexNums[g] === 12) {
        hex[g] = "c";
      } else if (hexNums[g] === 13) {
        hex[g] = "d";
      } else if (hexNums[g] === 14) {
        hex[g] = "e";
      } else if (hexNums[g] === 15 || hexNums[g] === 16) {
        hex[g] = "f";
      } else {
        hex[g] = hexNums[g].toString();
      }
    };

    var finalHex = hex[0] + hex[1] + hex[2] + hex[3] + hex[4] + hex[5]
    var embedColour = "0x" + finalHex

    rgb[0] = (hexNums[0] * 16) + hexNums[1];
    rgb[1] = (hexNums[2] * 16) + hexNums[3];
    rgb[2] = (hexNums[4] * 16) + hexNums[5];

    const embed = new Discord.RichEmbed()
      .setTitle("#" + finalHex + "\nrgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")")
      .setColor(embedColour);

    message.reply("here you go!", {embed});

  },
};

module.exports.help = {
  "name": "randomcolour",
  "aliases": ["randomcolor", "colour", "color", "col", "rc"],
  "description": "Returns a random colour in hex and RGB format.",
  "usage": `${process.env.prefix}randomcolour`,
  "hide": 0,
  "wip": 0
};
