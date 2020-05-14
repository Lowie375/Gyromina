// Require discord.js, bent, canvas, the RNG, the refcode randomizer, the emoji file, and the cdn file
const Discord = require('discord.js');
const bent = require('bent');
const {createCanvas, loadImage} = require('canvas');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');
//const {codeRNG} = require('../systemFiles/refcodes.js');
const e = require('../systemFiles/emojis.json');
const cdn = require('../systemFiles/cdn.json');

// Additional setup
const getBuffer = bent('buffer');
const cancelRegex = /stop|cancel|end|quit/;
const catchRegex = /^[cCfFqQoO]{1}[\.\:\-\_]{1}[a-zA-Z]{1}[a-zA-Z]?\d+/

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
      return [99, 30, 16];
    default:
      return x;
  }
}

// KEY: 0-8=nums, 9=solid, 10=qmc, 11=flag, 12=mine, 13=kaboom, 14=fake, 15=prideFlag
function genMine(field, places, i) {
  let gen = getRandomInt(0, places.length-1)
  let x = places[gen][0]
  let y = places[gen][1]
  
  // Checks if the spot already has a mine
  if (field[y][x] == 12) {
    genMine(field, places, i);
  } else {
    // Places a mine
    field[y][x] = 12;
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
    if (field[y][x] == 12) {
      i--;
    } else {
      // Saves the backfill position
      lineup.push([x, y]);
      places.splice(gen, 1);
    }
  }
  return lineup;
}

function cycle(field, bx, by, inc) {
  // Increments board numbers upwards once a bomb is placed
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(bx+sx >= 0 && bx+sx < field[0].length && by+sy >= 0 && by+sy < field.length && field[by+sy][bx+sx] < 8)
        field[by+sy][bx+sx] += inc; 
    }
  }
}

function openTiles(field, bricks, x, y) {
  // Opens blank segments of the board
}

function fillCanvas(board, display, assets) {
  // Generates the canvas
  for (let i = 0; i < display.length; i++) {
    for (let j = 0; j < display[i].length; j++) {
      // Draws the overlay
      board.drawImage(assets, 32*display[i][j], 0, 32, 32, (j+1)*32, (i+1)*32, 32, 32);
    }
  }
}

exports.exe = {
  async start(message, client, player, options) {
    // Variable setup
    var setup;
    var places = [];

    // Option setup
    if (!options)
      setup = boardCheck("e");
    else
      setup = boardCheck(options[0]);

    // Extraneous case I: missing custom field options
    if (!Array.isArray(setup) && options.length < 3)
      return message.reply("I can't create a custom field without a valid mine count and 2 valid lengths! Please check your options and try again.");
    else if (!Array.isArray(setup) && !isNaN(parseInt(options[0]) + parseInt(options[1]) + parseInt(options[2])))
      setup = [options[0], Math.min(Math.max(parseInt(options[1]), parseInt(options[2]), 7), 36), Math.max(7, Math.min(parseInt(options[1]), parseInt(options[2]), 36))];
    else if (!Array.isArray(setup))
      return message.reply("I can't create a custom field with invalid options! Please check your options and try again.");

    // Extraneous case II: too many mines
    if(setup[0] > (setup[1] - 1) * (setup[2] - 1))
      setup[0] = (setup[1] - 1) * (setup[2] - 1);
    
    // Array setup (j=x, i=y)
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

    // New board image code
    const canvas = createCanvas((display[0].length+1)*32, (display.length+1)*32);
    const board = canvas.getContext("2d");
    let assetBuffer = await getBuffer(cdn.mswp)
    loadImage(assetBuffer)
      .then(img => {
        // Generates the board's squares
        fillCanvas(board, display, img);

        // Sends the board
        let attach = new Discord.MessageAttachment(canvas.toBuffer('image/png'), 'board.png');
        message.channel.send("[Add text here]", attach)
          .then(game => {

            var moves = 0;
            const filter = (msg) => msg.author.id == player && ((cancelRegex.exec(msg.content) && client.games.get("minesweeper").label.aliases.some(e => msg.content.includes(e))) || catchRegex.exec(msg.content) || msg.content.includes("time"));
            const finder = game.channel.createMessageCollector(filter, {time: 120000, idle: 120000});
    
            finder.on('collect', msg => {
              // Checks if the collected message was a cancellation message
              if (cancelRegex.exec(msg.content)) {
                let boolTest = client.games.get("minesweeper").label.aliases.some(e => msg.content.includes(e));
                finder.stop("cancel");
                return; // Stops the game
              } else if (msg.content.includes("time")) {
                msg.react(e.yep);
                finder.resetTimer({time: 300000, idle: 300000});
                return;
              } else if (moves == 0) {
                // First move, check and backfill
                msg.channel.send("T: First move caught!");
              }
              moves++;
              msg.channel.send("T: move caught!");
              finder.resetTimer({time: 120000, idle: 120000});
            });

            finder.on('end', (c, reason) => {
              // Determines why the collector ended
              switch (reason) {
                case "time": // Timeouts
                case "idle":
                  message.reply("your \`minesweeper\` instance timed out due to inactivity. Please restart the game if you would like to play again."); return;
                case "cancel": // Manually cancelled
                  message.reply("your \`minesweeper\` instance has been stopped. Please restart the game if you would like to play again."); return;
                default: 
                  message.reply("your \`minesweeper\` instance has encountered an unknown error and has been stopped. Please restart the game if you would like to play again."); return;
              }
            });
        });
    });
  }
};

exports.label = {
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
