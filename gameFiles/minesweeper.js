// Require the RNG and the emoji file
const {getRandomInt} = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');

const brickShell = [e.mswp.b0, e.mswp.b1, e.mswp.b2, e.mswp.b3, e.mswp.b4, e.mswp.b5, e.mswp.b6, e.mswp.b7, e.mswp.b8, e.mswp.solid, e.mswp.flag, e.mswp.qmc, e.mswp.mine, e.mswp.kaboom, e.mswp.fake];
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

function genMine(field, bricks, places, i) {
  let gen = getRandomInt(0, places.length-1)
  let x = places[gen][0]
  let y = places[gen][1]
  
  // Checks if the spot already has a mine
  if (field[y][x] == bricks[12]) {
    genMine(field, bricks, places, i);
  } else {
    // Places a mine
    field[y][x] = bricks[12];
    places.splice(gen, 1);
    cycle(field, bricks, x, y, 1);
  }
}

function backfill(field, bricks, places, k) {
  let lineup = [];
  for (let i = 0; i < k; i++) {
    let gen = getRandomInt(0, places.length-1)
    let x = places[gen][0]
    let y = places[gen][1]

    // Checks if the spot already has a mine
    if (field[y][x] == bricks[12]) {
      i--;
    } else {
      // Saves the backfill position
      lineup.push([x, y]);
      places.splice(gen, 1);
    }
  }
  return lineup;
}

function count(field, bricks, cx, cy) {
  // Adds appropriate numbers for each square in the 3x3 that previously held a mine
}

function numFinder(brick, bricks) {
  // Finds the number/icon of a board element
  switch(brick) {
    default: {
      for (let i = 0; i <= 8; i++) {
        if (brick == bricks[i])
          return i;
      }
      return "null";
    }
    case bricks[9]: return "unknown";
    case bricks[10]: return "flag";
    case bricks[11]: return "unsure";
    case bricks[12]: return "mine";
    case bricks[13]: return "hitmine";
    case bricks[14]: return "falseflag";
  }
}

function cycle(field, bricks, bx, by, inc) {
  // Increments board numbers upwards once a bomb is placed
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(bx+sx >= 0 && bx+sx < field[0].length && by+sy >= 0 && by+sy < field.length) {
        let num = numFinder(field[by+sy][bx+sx], bricks);
        if (!isNaN(num))
          field[by+sy][bx+sx] = bricks[num+inc];
      }
    }
  }
}

function openTiles(field, bricks, x, y) {
  // Opens blank segments of the board
}

module.exports.exe = {
  start(message, client, player, options) {
    // Variable setup
    var setup;
    var bricks = [];
    var places = [];

    // Emoji setup
    for (const brick of brickShell) {
      bricks.push(client.emojis.cache.get(brick));
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
      setup = [options[0], Math.max(7, Math.min(parseInt(options[1]), parseInt(options[2]), 36)), Math.min(Math.max(parseInt(options[1]), parseInt(options[2]), 7), 36)];
    else if (!Array.isArray(setup))
      return message.reply("I can't create a custom field with invalid options! Please check your options and try again.");

    // Extraneous case II: too many mines
    if(setup[0] > (setup[1] - 1) * (setup[2] - 1))
      setup[0] = (setup[1] - 1) * (setup[2] - 1);
    
    // Array setup
    var field = [];
    for (let i = 0; i < setup[2]; i++) {
      let insert = [];
      for (let j = 0; j < setup[1]; j++) {
        insert.push(bricks[0]);
        places.push([j, i]);
      }
      field.push(insert);
    }
    var display = [];
    for (let i = 0; i < setup[2]; i++) {
      let insert = [];
      for (let j = 0; j < setup[1]; j++) {
        insert.push(bricks[9]);
      }
      display.push(insert);
    }

    // Mine generation
    for (let i = 0; i < setup[0]; i++) {
      genMine(field, bricks, places, i)
    }
    let filler = backfill(field, bricks, places, 9);

    // Image library needed to send field (due to emojis taking up too much space)

    // Test snippet
    /*var output = "";
    for (row of field) {
      output += `${row.join("")}\n`
    }
    message.channel.send(output);*/
  }
};

module.exports.label = {
  "name": "minesweeper",
  "aliases": ["mine", "mines", "sweep", "minesweep", "sweeper", "mswp"],
  "players": 1,
  "description": "An old classic, now in bot form!",
  "art": "",
  "options": "[mines/preset] [length1] [length2]",
  "optionsdesc": "\• [mines/preset]: Number of mines on the field (3-1225) or a preset difficulty (easy = 9x9 + 10 mines, medium = 16x16 + 40 mines, hard = 16x30 + 99 mines) Defaults to easy (9x9 + 10 mines)\n\• [length1]: If no preset is specified, one dimension of the board (7-36)\n\• [length2]: If no preset is specified, the other dimension of the board (7-36)",
  "exclusive": 0,
  "indev": 1,
  "deleted": 0
};
