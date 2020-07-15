// Require the RNG
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

exports.exe = {
  start(message, client, player, options) {
    // Insert code here
  }
};

exports.label = {
  "name": "kingsmagic",
  "aliases": ["kings", "kings-magic"],
  "players": [1],
  "description": "An original card game. Try your luck, but don't hit the king!",
  "helpurl": "https://lx375.weebly.com/gyrogame-kingsmagic",
  "options": "[mode]",
  "optionsdesc": "\• [mode]: A mode preset (standard, hex, octal, dodeca, double, double-dodeca, quadruple, quadruple-dodeca)",
  "weight": 1,
  "exclusive": 1,
  "indev": 1,
  "deleted": 0
};
