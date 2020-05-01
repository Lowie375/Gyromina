// Require the RNG
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

module.exports.exe = {
  start(message, client, player, options) {
    // Insert code here
  }
};

module.exports.label = {
  "name": "kingsmagic",
  "aliases": ["kings", "kings-magic"],
  "players": 1,
  "description": "King's Magic, a self-created card game.",
  "art": "",
  "options": "[mode]",
  "optionsdesc": "\• [mode]: A mode preset (standard, hex, octal, dodeca, double, double-dodeca, quadruple, quadruple-dodeca)",
  "exclusive": 1,
  "indev": 1,
  "deleted": 0
};
