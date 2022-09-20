// RNG
const {getRandomInt} = require('../system/globalFunctions.js');

exports.exe = {
  start(message, client, player, options) {
    // Insert code here
  }
};

exports.label = {
  "name": "kingsmagic",
  "aliases": ["kings", "kings-magic"],
  "players": [1],
  "reactions": false,
  "description": "An original card game. Try your luck, but don't hit the king!",
  "helpurl": "https://l375.weebly.com/gyrogame-kingsmagic",
  "options": "[mode]",
  "optionsdesc": "**[mode]**: A mode preset (standard, hex, octal, dodeca, double, double-dodeca, quadruple, quadruple-dodeca)",
  "weight": 1,
  "exclusive": true,
  "indev": true,
  "deleted": false,
};
