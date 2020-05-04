// Require the RNG and the emoji file
const {getRandomInt} = require('../systemFiles/globalFunctions.js');
const e = require('..systemFiles/emojis.json');

const bricks = [e.mswp.b0, e.mswp.b1, e.mswp.b2, e.mswp.b3, e.mswp.b4, e.mswp.b5, e.mswp.b6, e.mswp.b7, e.mswp.b8, e.mswp.solid, e.mswp.flag, e.mswp.qmc, e.mswp.mine, e.mswp.kaboom, e.mswp.fake];
const cancelWords = ["minesweeper stop", "mswp stop", "mine stop", "sweeper stop", "sweep stop", "minesweeper cancel", "mswp cancel", "mine cancel", "sweeper cancel", "sweep cancel",
  "minesweeper end", "mswp end", "mine end", "sweeper end", "sweep end", "minesweeper quit", "mswp quit", "mine quit", "sweeper quit", "sweep quit"];

function boardCheck(x) {
  switch (x) {
    case "easy":
    case "e":
      return [10, 9, 9];
    case "medium":
    case "normal":
    case "moderate":
    case "regular":
    case "m":
      return [40, 16, 16];
    case "hard":
    case "difficult":
    case "h":
      return [99, 16, 30];
    default:
      return x;
  }
}

function genMine(field, mx, my, i) {
  let x = getRandomInt(0, mx-1);
  let y = getRandomInt(0, my-1);

  if (field[x][y] == bricks[13]) {
    genMine(field, mx, my, i);
  } else {
    field[x][y] = bricks[13];
    cycle(field, x, y, 1);
  }
}

function backfill(field, k) {
  let lineup = [];
  for (let i = 0; i < k; i++) {
    let x = getRandomInt(0, mx-1);
    let y = getRandomInt(0, my-1);

    if (field[x][y] == bricks[13])
      i--;
    else
      lineup.push([x, y]);
  }
  return lineup;
}

function cycle(field, x, y, inc) {

}

module.exports.exe = {
  start(message, client, player, options) {
    // Variable setup
    var setup;

    // Emoji setup
    for (const brick of bricks) {
      brick = client.emojis.cache.get(brick);
    }

    // Option setup
    if (!options)
      setup = boardCheck("e");
    else
      setup = boardCheck(options[0]);

    // Extraneous case I: missing custom field options
    if (!Array.isArray(setup) && options.length < 3)
      return message.reply("I can't create a custom field without a valid mine count and 2 valid lengths! Please check your options and try again.");
    else if (!Array.isArray(setup) && !isNaN(parseInt(options[0]) + parseInt(options[1]) + parseInt(options[2])))
      setup = [options[0], max(7, min(parseInt(options[1]), parseInt(options[2]), 36)), min(max(parseInt(options[1]), parseInt(options[2]), 7), 36)];
    else
      return message.reply("I can't create a custom field with invalid options! Please check your options and try again.");

    // Extraneous case II: too many mines
    if(setup[0] > (setup[1] - 1) * (setup[2] - 1))
      setup[0] = (setup[1] - 1) * (setup[2] - 1);
    
    // Array setup
    var field = [];
    for (let i = 0; i < setup[2]; i++) {
      let insert = [];
      for (let j = 0; j < setup[1]; j++) {
        insert.push(bricks[10]);
      }
      field.push(insert);
    }
    var display = field;

    // Mine generation
    for (let i = 0; i < setup[0]; i++) {
      genMine(field, setup[1], setup[2], i)
    }
    let filler = backfill(field, 9);

  }
};

module.exports.label = {
  "name": "minesweeper",
  "aliases": ["mine", "mines", "sweep", "minesweep", "sweeper", "mswp"],
  "players": 1,
  "description": "The classic game of Minesweeper.",
  "art": "",
  "options": "[mines/preset] [length1] [length2]",
  "optionsdesc": "\• [mines/preset]: Number of mines on the field (3-1225) or a preset difficulty (easy = 9x9 + 10 mines, medium = 16x16 + 40 mines, hard = 16x30 + 99 mines) Defaults to easy (9x9 + 10 mines)\n\• [length1]: If no preset is specified, one dimension of the board (7-36)\n\• [length2]: If no preset is specified, the other dimension of the board (7-36)",
  "exclusive": 0,
  "indev": 1,
  "deleted": 0
};
