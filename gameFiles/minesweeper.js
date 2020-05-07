// Require fs, Jimp, the RNG, the refcode randomizer, and the cdn file
const fs = require('fs');
const Jimp = require('jimp');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');
const {codeRNG, genErrorMsg} = require('../systemFiles/refcodes.js');
//const e = require('../systemFiles/emojis.json');
const cdn = require('../systemFiles/cdn.json');

const cancelWords = ["minesweeper stop", "mswp stop", "mine stop", "sweeper stop", "sweep stop", "minesweeper cancel", "mswp cancel", "mine cancel", "sweeper cancel", "sweep cancel",
  "minesweeper end", "mswp end", "mine end", "sweeper end", "sweep end", "minesweeper quit", "mswp quit", "mine quit", "sweeper quit", "sweep quit"];
const img = [cdn.mswp.b0, cdn.mswp.b1, cdn.mswp.b2, cdn.mswp.b3, cdn.mswp.b4, cdn.mswp.b5, cdn.mswp.b6, cdn.mswp.b7, cdn.mswp.b8, cdn.mswp.solid, cdn.mswp.flag, cdn.mswp.qmc, cdn.mswp.mine, cdn.mswp.kaboom, cdn.mswp.fake];

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

function genMine(field, places, i) {
  let gen = getRandomInt(0, places.length-1)
  let x = places[gen][0]
  let y = places[gen][1]
  
  // Checks if the spot already has a mine
  if (field[y][x] == "m") {
    genMine(field, places, i);
  } else {
    // Places a mine
    field[y][x] = "m";
    places.splice(gen, 1);
    cycle(field, x, y, 1);
  }
}

function backfill(field, places, k) {
  let lineup = [];
  for (let i = 0; i < k; i++) {
    let gen = getRandomInt(0, places.length-1)
    let x = places[gen][0]
    let y = places[gen][1]

    // Checks if the spot already has a mine
    if (field[y][x] == "m") {
      i--;
    } else {
      // Saves the backfill position
      lineup.push([x, y]);
      places.splice(gen, 1);
    }
  }
  return lineup;
}

function count(field, cx, cy) {
  // Adds appropriate numbers for each square in the 3x3 that previously held a mine
}

function cycle(field, bx, by, inc) {
  // Increments board numbers upwards once a bomb is placed
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(bx+sx >= 0 && bx+sx < field[0].length && by+sy >= 0 && by+sy < field.length && !isNaN(field[by+sy][bx+sx]))
        field[by+sy][bx+sx] += inc; 
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
    var places = [];

    // Emoji setup (none of it!)

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
        insert.push(0);
        places.push([j, i]);
      }
      field.push(insert);
    }
    var display = [];
    for (let i = 0; i < setup[2]; i++) {
      let insert = [];
      for (let j = 0; j < setup[1]; j++) {
        insert.push(9);
      }
      display.push(insert);
    }

    // Mine generation
    for (let i = 0; i < setup[0]; i++) {
      genMine(field, places, i)
    }
    let filler = backfill(field, places, 9);

    // Creates an image identifier (using the refcode randomizer)
    var boardID = `assets/minesweeper/game${codeRNG()}`;
    var ext;
    var imgSave;

    // Creates the board image (hoping this works!)
    new Jimp((display[0].length+1)*32, (display.length+1)*32, 0xffffffff, (err, image) => {
      // Gets the image extension + stores the image in another variable
      ext = image.getExtension();
      imgSave = image;

      // Overlays minesweeper assets
      for (let i = 0; i < display.length; i++) {
        for (let j = 0; j < display[i].length; j++) {
          // Loads the overlay
          Jimp.read(cdn.mswp[display[i][j]])
            .then(overlay => {
              // Overlays, then writes the image
              imgSave.composite(overlay, (j+1)*32, (i+1)*32);
              imgSave.write(`${boardID}.${ext}`)
          })
            .catch(error => {

          });
        }
      }
    });  

    // Test send
    message.channel.send("Test", {files: `../${boardID}.png`});

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
