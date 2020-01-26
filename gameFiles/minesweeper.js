const { getRandomInt } = require('../systemFiles/globalFunctions.js');

module.exports.exe = {
  start(message, args, client, player) {
    // Insert code here
  }
};

module.exports.label = {
  "name": "minesweeper",
  "aliases": ["mine", "mines", "sweep", "minesweep", "sweeper"],
  "players": 1,
  "description": "The classic game of Minesweeper.",
  "art": "",
  "options": "[mines/preset] [height] [width]",
  "optionsdesc": "\• [mines/preset]: Number of mines on the field (1-1192) or a preset difficulty (easy = 9x9 + 10 mines, medium = 16x16 + 40 mines, hard = 16x30 + 99 mines)\n\• [height]: If no preset is specified, height of the board (7-36)\n\• [width]: If no preset is specified, width of the board (7-36)",
  "exclusive": 0,
  "indev": 1,
  "deleted": 0
};