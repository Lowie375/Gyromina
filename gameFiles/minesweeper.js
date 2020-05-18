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
const cancelRegex = /stop|cancel|end|quit/i;
const catchRegex = /^([cfqo]){1}[\.\:\-\_]{1}([a-z]{1}[a-z]?)(\d)+/i;

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
    case "insane":
    case "expert":
    case "x":
    case "i":
      return [166, 30, 30];
    case "master":
    case "ultimate":
    case "xm":
    case "u":
      return [390, 36, 36];
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

function cycle(field, cx, cy, inc) {
  // Increments/reduces board numbers around a target tile
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(cx+sx >= 0 && cx+sx < field[0].length && cy+sy >= 0 && cy+sy < field.length && field[cy+sy][cx+sx] < 8)
        field[cy+sy][cx+sx] += inc; 
    }
  }
}

function checkTile(field, display, x, y) {
  // Uncovers a tile
  if (field[y][x] == display[y][x]) {
    if (roundabout(field, display, x, y, [11, 15], "d")[0] == display[y][x]) {
      // Niche functionality; pops surrounding squares once flag count equals the number on the tile
      let analysis = roundabout(field, display, x, y);
      let tiles = [];
      let rtx;
      for (p of analysis[1]) {
        if (display[p[1]][p[0]] == 9) {
          switch (field[p[1]][p[0]]) {
            case 12:
              rtx = 4;
              display[p[1]][p[0]] = 13;
              break;
            default:
              display[p[1]][p[0]] = field[p[1]][p[0]];
              tiles.push(display[p[1]][p[0]], p[0], p[1])
              break;
          }
        }
      }
      if (rtx != undefined)
        return rtx; // Mine hit!
      else 
        return tiles; // Tiles to update
    } else {
      return 1; // Already revealed; reject
    }
  } else if (display[y][x] == 11 || display[y][x] == 15) {
    return 2; // Flag; reject
  } else if (display[y][x] == 10) {
    return 3; // QMC; warn
  } else if (field[y][x] == 12) {
    display[y][x] = 13;
    return 4; // Mine hit!
  } else if (field[y][x] == 0) {
    return openTiles(field, display, x, y); // Tiles to update
  } else {
    display[y][x] = field[y][x];
    return [display[y][x], x, y,]; // Tiles to update
  }
}

function openTiles(field, display, x, y) {
  // Opens blank segments of the board


  // Open + store coordinates
}

function recycle(field, filler, x, y) {
  // Repopulates the first 3x3 square opened
}

function roundabout(field, display, cx, cy, target = [12], mode = "f") {
  // Checks for + counts target tiles in a 3x3 chunk
  switch (mode) {
    case "f": return rdbCore(field, cx, cy, target);
    case "d": return rdbCore(display, cx, cy, target);
  }
}

function rdbCore(arr, cx, cy, target) {
  // Core function of roundabout()
  let matchCtr = 0;
  let matches = []; 
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(cx+sx >= 0 && cx+sx < arr[0].length && cy+sy >= 0 && cy+sy < arr.length && target.includes(arr[cy+sy][cx+sx])) {
        matchCtr++;
        matches.push([cx+sx, cy+sy]);
      }
    }
  }
  return [matchCtr, matches];
}

function updateCanvas(board, newTiles, assets) {
  // Updates the canvas
  for (tile of newTiles) {
    board.drawImage(assets, 32*tile[0], 0, 32, 32, (tile[1]+1)*32, (tile[2]+1)*32, 32, 32);
  }
}

// A-Z = 65-90, a-z = 97-122
function decode(y) {
  // Gets the letters' character codes (letter -> number)
  let c = [y.charCodeAt(0)-65, y.charCodeAt(1)-65];
  // Adjusts for lowercase letters
  for (e of c) {
    if (!isNaN(e) && e > 25)
      e -= 32;
  }
  // Returns the corresponding number
  if (c[0] == 0 && !isNaN(c[1]))
    return c[1] + 26;
  else
    return c[0];
}

exports.exe = {
  async start(message, client, player, options) {
    // Variable setup
    var setup;
    var fixFlag = 0;
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

    // Fixes mine count
    if(setup[0] > (setup[1] - 1) * (setup[2] - 1)) {
      setup[0] = (setup[1] - 1) * (setup[2] - 1);
      fixFlag = 1;
    } else if(setup[0] < 3) {
      setup[0] = 3;
      fixFlag = 1;
    }
    
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
        // Generates the canvas
        for (let i = 0; i < display.length; i++) {
          for (let j = 0; j < display[i].length; j++) {
            // Draws the overlay
            board.drawImage(img, 32*display[i][j], 0, 32, 32, (j+1)*32, (i+1)*32, 32, 32);
          }
        }

        // Sends the board
        let attach = new Discord.MessageAttachment(canvas.toBuffer('image/png'), 'board.png');
        message.channel.send("[Add text here]", attach)
          .then(game => {

            // Sets up a message collector
            var moves = 0;
            const filter = (msg) => msg.author.id == player && (((cancelRegex.exec(msg.content) || msg.content.includes("time")) && client.games.get("minesweeper").label.aliases.some(e => msg.content.includes(e))) || catchRegex.exec(msg.content));
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
              switch (catchRegex.exec(msg.content)[0].toLowerCase()) {
                case "c":
                case "o": {
                  let move = checkTile(field, display, x-1, decode(y));
                  if (Array.isArray(move)) { // Valid; board
                    updateCanvas(board, move, img);
                  } else if (move == 1) { // Already revealed; reject
                    
                  } else if (move == 2) { // Flag; reject

                  } else if (move == 3) { // QMC; warn

                  } else if (move == 4) { // Mine hit!
                    finder.stop("fail");
                    // revealMines();
                    return;
                  }
                  break;
                }
                case "f": {
                  break;
                }
                case "q": {

                }
              }
              
              msg.channel.send("T: move caught!");
              finder.resetTimer({time: 120000, idle: 120000});
            });

            finder.on('end', (c, reason) => {
              // Determines why the collector ended
              switch (reason) {
                case "fail":
                  message.channel.send(`Oh no! You hit a mine, <@${player}>!\n**--- YOU LOSE ---**`); return;
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
  "options": ["[preset]", "<mines> <length1> <length2>"],
  "optionsdesc": ["<mines>/[preset]: The number of mines on the field (3-1225), or a preset difficulty (easy = 9×9 + 10 mines, medium = 16×16 + 40 mines, hard = 16×30 + 99 mines, insane = 30×30 + 166 mines, master = 36×36 + 390 mines) Defaults to easy (9×9 + 10 mines)", "<length1>: If no preset is specified, one dimension of the board (7-36)", "<length2>: If no preset is specified, the other dimension of the board (7-36)"],
  "exclusive": 0,
  "indev": 1,
  "deleted": 0
};
