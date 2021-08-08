// Require discord.js, bent, canvas, the RNG, the permission checker, the refcode generator, and the emoji + cdn files
const D = require('discord.js');
const bent = require('bent');
const {createCanvas, loadImage} = require('canvas');
const {getRandomInt, p} = require('../systemFiles/globalFunctions.js');
const {genErrorMsg, codeRNG} = require('../systemFiles/refcodes.js');
const e = require('../systemFiles/emojis.json');
const cdn = require('../systemFiles/cdn.json');

// Additional setup
const getBuffer = bent('buffer');
const cancelRegex = /stop|cancel|end|quit|time/i;
const catchRegex = /^([cfqop?x]){1}[\.\:\-\_\,]{1}([a-z]{1}[a-z]?)(\d{1}\d?)+/i;
const alphaFilter = a => b => a.length === b.length && a.every((v, i) => v === b[i]);

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
      return [255, 30, 30];
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
      if(cx+sx >= 0 && cx+sx < field[0].length && cy+sy >= 0 && cy+sy < field.length && field[cy+sy][cx+sx] + inc <= 8 && field[cy+sy][cx+sx] + inc >= 0 && (sx != 0 || sy != 0))
        field[cy+sy][cx+sx] += inc; 
    }
  }
}

function checkTile(field, display, x, y) {
  // Uncovers a tile
  if (field[y][x] == display[y][x]) {
    /*if (roundabout(field, display, x, y, [11, 15], "d")[0] == display[y][x]) {

      // Niche functionality; pops surrounding squares once flag count equals the number on the tile - broken!!!
      // For some reason, a bunch of tiles change before the for loop and IDK why? There's nothing that should change them
      // If anyone can help me with this, please do. I'm stuck

      let analysis = roundabout(field, display, x, y, [0, 1, 2, 3, 4, 5, 6, 7, 8, 12]);
      let tiles = [];
      let rtx = 0;

      for (p of analysis[1]) {
        if (display[p[1]][p[0]] == 9) {
          switch (field[p[1]][p[0]]) {
            case 12:
              rtx = 4;
              display[p[1]][p[0]] = 13;
              break;
            case 0:
              let t = openTiles(field, display, p[0], p[1]);
              tiles.push(t);
              break;
            default:
              display[p[1]][p[0]] = field[p[1]][p[0]];
              tiles.push([display[p[1]][p[0]], p[0], p[1]])
              break;
          }
        }
      }
      if (rtx != 0)
        return rtx; // Mine hit!
      else
        return tiles; // Tiles to update
    } else*/
      return 1; // Already revealed; reject
  } else if (display[y][x] == 11 || display[y][x] == 15) {
    return 2; // Flag; reject
  } else if (display[y][x] == 10) {
    return 3; // QMC; warn
  } else if (field[y][x] == 12) {
    display[y][x] = 13;
    return 4; // Mine hit!
  } else if (field[y][x] == 0) {
    return openTiles(field, display, x, y); // Blank; pops open segments of the grid
  } else {
    display[y][x] = field[y][x]; // Standard tile
    return [[display[y][x], x, y]]; // Tile to update
  }
}

function openTiles(field, display, ix, iy) {
  // Opens blank segments of the board
  let coords = [[ix, iy]];
  let complete = [];
  let update = [];
  do {
    // Sets the coordinates
    let x = coords[0][0];
    let y = coords[0][1];
    // Adds all the surrounding tiles to the update list (if not already present)
    for (let sx = -1; sx <= 1; sx++) {
      for(let sy = -1; sy <= 1; sy++) {
        if(x+sx >= 0 && x+sx < field[0].length && y+sy >= 0 && y+sy < field.length && display[y+sy][x+sx] == 9 && !update.includes([field[y+sy][x+sx], x+sx, y+sy])) {
          display[y+sy][x+sx] = field[y+sy][x+sx];
          update.push([display[y+sy][x+sx], x+sx, y+sy]);
        }
      }
    }
    // Checks if any surrounding tiles are blank
    let roundCheck = roundabout(field, display, x, y, [0]);

    if (roundCheck[0] != 0) { // Blanks exist
      for (coord of roundCheck[1]) {
        if (!coords.some(alphaFilter(coord)) && !complete.some(alphaFilter(coord))) // Checks if blanks are new
          coords.push(coord); // New blank; push
      }
    }
    // Removes the now-opened coordinates
    complete.push(coords.shift());
  } while (coords.length > 0);
  return update; // Tiles to update
}

function recycle(field, filler, x, y) {
  // Repopulates the first 3x3 square opened
  let square = [];
  // Arranges the suaare's coordinates nicely
  for (let sx = -1; sx <= 1; sx++) {
    for(let sy = -1; sy <= 1; sy++) {
      if(x+sx >= 0 && x+sx < field[0].length && y+sy >= 0 && y+sy < field.length)
        square.push([x+sx, y+sy]);
    }
  }
  // Checks if the filler line contains any squares in the 3x3
  for (let i = 0; i < square.length; i++) {
    for (coord of square) {
      if(filler.some(alphaFilter(coord))) {
        let fm = filler.findIndex(alphaFilter(coord))
        filler.splice(fm, 1);
        let sm = square.findIndex(alphaFilter(coord))
        square.splice(sm, 1);
      }
    }
  }
  // Replaces any bombs in the 3x3
  let fillCtr = 0;
  for (coord of square) {
    if (field[coord[1]][coord[0]] == 12) {
      // Clears the mine
      field[coord[1]][coord[0]] = roundabout(field, [], coord[0], coord[1])[0];
      cycle(field, coord[0], coord[1], -1);
      fillCtr++;
    }
  }
  for (let j = 0; j < fillCtr; j++) {
    // Re-places the mine elsewhere
    field[filler[0][1]][filler[0][0]] = 12;
    cycle(field, filler[0][0], filler[0][1], 1);
    filler.shift();
  }
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
      if(cx+sx >= 0 && cx+sx < arr[0].length && cy+sy >= 0 && cy+sy < arr.length && target.includes(arr[cy+sy][cx+sx]) && (sx != 0 || sy != 0)) {
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
  let c = [y.charCodeAt(0), y.charCodeAt(1)];
  // Adjusts for lowercase letters and NaN
  for (let i = 0; i < c.length; i++) {
    if (!isNaN(c[i])) {
      c[i] -= 65;
      if (c[i] > 25) {
        c[i] -= 32;
      }
    }
  }
  // Returns the corresponding number
  if (c[0] == 0 && !isNaN(c[1]))
    return c[1] + 26;
  else
    return c[0];
}

function winCon(field, display) {
  for (let i = 0; i < display.length; i++) {
    for (let j = 0; j < display[i].length; j++) {
      // Checks if all non-mine tiles have been revealed
      if(display[i][j] == 9 && field[i][j] != 12)
        return 1; // Not all revealed; continue
    }
  }
  return 0; // All revealed; win!
}

function revealMines(field, display) {
  let update = [];
  for (let i = 0; i < display.length; i++) {
    for (let j = 0; j < display[i].length; j++) {
      switch(display[i][j]) {
        case 9:
        case 10: {
          if (field[i][j] == 12)
            update.push([12, j, i]);
          break;
        }
        case 11:
        case 15: {
          if (field[i][j] != 12)
            update.push([14, j, i]);
          break;
        }
        case 13: {
          update.push([13, j, i]);
          break;
        }
      }
    }
  }
  return update;
}

function stats(moves, flags) {
  // Outputs current game stats in clean format
  let statOutput = "\`";
  // Move check
  switch (moves) {
    case 1: statOutput += `${moves} move made`; break;
    default: statOutput += `${moves} moves made`; break;
  }
  statOutput += "  •  "
  // Flag check
  if (flags == 1)
    statOutput += `${flags} flag left\``;
  else if (flags >= 0)
    statOutput += `${flags} flags left\``;
  else if (flags == -1)
    statOutput += `${flags * -1} flag too many\``;
  else
    statOutput += `${flags * -1} flags too many\``;
  return statOutput;
}

exports.exe = {
  async start(message, client, player, options) {
    // Sends a typing indicator to show that board generation is in progress
    message.channel.sendTyping();

    // Variable setup
    var setup;
    var places = [];
    var time = new Date();
    const flagID = `mswp_${codeRNG()}.png`;

    // Option setup
    if (!options)
      setup = boardCheck("e");
    else
      setup = boardCheck(options[0]);

    // Extraneous case I: missing custom field options
    if (!Array.isArray(setup) && options.length < 3)
      return message.reply(`I can't create a custom field without a valid mine count and 2 valid lengths! Please check your options and try again.`);
    else if (!Array.isArray(setup) && !isNaN(parseInt(options[0]) + parseInt(options[1]) + parseInt(options[2])))
      setup = [options[0], Math.min(Math.max(parseInt(options[1]), parseInt(options[2]), 7), 36), Math.max(7, Math.min(parseInt(options[1]), parseInt(options[2]), 36))];
    else if (!Array.isArray(setup))
      return message.reply(`I can't create a custom field with invalid options! Please check your options and try again.`);

    // Fixes mine count
    if(setup[0] > (setup[1] - 1) * (setup[2] - 1)) {
      setup[0] = (setup[1] - 1) * (setup[2] - 1);
      fixFlag = 1;
    } else if(setup[0] < 3) {
      setup[0] = 3;
      fixFlag = 1;
    }

    // Extra setup
    var unrev = setup[1] * setup[2];
    var flags = setup[0];
    
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
        
        // Font format setup
        board.font = "bold 20px sans-serif";
        board.textBaseline = "middle";
        board.textAlign = "center";
        board.fillStyle = "#ffffff";
        board.strokeStyle = "#000000";

        // Overlays the lettering
        for(let i = 1; i <= field[0].length; i++) { // Column markers (numbers)
          board.fillText(`${i}`, 32*i+16, 16, 32);
          board.strokeText(`${i}`, 32*i+16, 16, 32);
        }
        for(let j = 0; j < Math.min(field.length, 26); j++) { // Row markers (letters)
          board.fillText(`${String.fromCharCode(j+65)}`, 16, 32*(j+1)+16, 32);
          board.strokeText(`${String.fromCharCode(j+65)}`, 16, 32*(j+1)+16, 32);
        }
        if (field.length > 26) { // Second sequence
          for(let j = 26; j < field.length; j++) { // Row markers (letters)
            board.fillText(`A${String.fromCharCode(j+39)}`, 16, 32*(j+1)+16, 32);
            board.strokeText(`A${String.fromCharCode(j+39)}`, 16, 32*(j+1)+16, 32);
          }
        }

        // Puts the whole shebang in one variable (wow!)
        let tooltip = `Your ${setup[2]}×${setup[1]}, ${setup[0]}-mine grid has been generated!\n` +
        `All tiles on the grid start covered. Under each tile, there will be either a blank, a number from 1-8, or a mine.\n` +
        `Tiles with numbers indicate how many of the surrounding 8 tiles contain mines. Blanks act as zeroes (0).\n` +
        `(ex: 1 of the 8 tiles surrounding a "1" will contain a mine, 2 of the 8 tiles surrounding a "2" will contain mines, etc.)\n` +
        `**Uncover all the tiles WITHOUT mines to win!**\n\n` +
        `•  To uncover a tile, type **\`c:X#\`**, replacing \`X\` with a row letter and \`#\` with a column number. If you uncover a mine, you will lose!\n` +
        `•  If you think a tile is a mine, you can flag it by typing **\`f:X#\`** (where \`X\` = row and \`#\` = column, as above). Flagged tiles can not be uncovered. To remove a flag, type the flagging command again.\n` +
        `•  If you are unsure about whether a tile is a mine or not, you can mark it as uncertain by typing **\`q:X#\`** (where \`X\` = row and \`#\` = column, as above). You will be warned when trying to uncover a tile marked as uncertain. To remove an uncertanty marker, type the uncertainty command again.\n` +
        `**Good luck and have fun!**\n\n` +
        `\*This \`mswp\` instance will time out if you do not make a move within 2 minutes and 30 seconds.\nYou can quit the game at any time by typing \`mswp stop\`.\nIf you need more time to think about your next move, you can reset the timer to 10 minutes by typing \`mswp time\`.\*`;
        
        // Sends the board
        let attach = new D.MessageAttachment(canvas.toBuffer('image/png'), "mswp_initField.png");
        message.reply({content: tooltip, files: [attach]})
          .then(game => {

            // Sets up a message collector + time reset objects
            var moves = 0;
            const filter = (msg) => msg.author.id == player && ((cancelRegex.exec(msg.content) && (client.games.get("minesweeper").label.aliases.some(elem => msg.content.includes(elem)) || msg.content.includes("minesweeper"))) || catchRegex.exec(msg.content));
            const finder = game.channel.createMessageCollector({filter, time: 240000, idle: 240000});  // First timer is longer to allow for rule reading
            const longTime = {time: 600000, idle: 600000};
            const shortTime = {time: 150000, idle: 150000};

            finder.on('collect', async msg => {
              // Checks if the collected message was a time or cancellation message
              if (msg.content.includes("time")) { // Resets the timer
                finder.resetTimer(longTime);
                // Sends a confirmation reaction/message
                if (p(msg, [D.Permissions.FLAGS.ADD_REACTIONS, D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]))
                  msg.react(e.yep);
                else if (p(msg, [D.Permissions.FLAGS.ADD_REACTIONS]))
                  msg.react(e.alt.yep);
                else if (p(msg, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]))
                  msg.reply(`${e.yep} Timer reset!`);
                else
                  msg.reply(`${e.alt.yep} Timer reset!`);
                return;
              } else if (cancelRegex.exec(msg.content)) {
                finder.stop("cancel");
                return; // Stops the game
              }

              // Sends a typing indicator to show that the move is being processed
              message.channel.sendTyping();

              // Pre-check setup
              let caught = catchRegex.exec(msg.content);
              let x = parseInt(caught[3])-1
              let y = decode(caught[2]);

              // Checks if the move is valid
              if (x >= field[0].length || x < 0 || y >= field.length || y < 0) {
                return msg.reply(`That tile isn't on the grid. Please choose a valid tile and try again.`);
              }

              if (moves == 0) {
                switch (caught[1].toLowerCase()) {
                  case "c":
                  case "o": 
                  case "p":
                    // First move, check and backfill
                    recycle(field, filler, x, y);
                    break;
                  case "f":
                  case "x":
                  case "q":
                  case "?":
                    // Invalid starter; reject
                    return msg.reply(`Invalid starting move. Please open a tile using \`c:X#\` notation to begin.`);
                }
              }
              // Increments the move counter
              moves++;
              
              // Checks the action type
              switch (caught[1].toLowerCase()) {
                case "c":
                case "o": 
                case "p": {
                  // Force snippet
                  if (msg.content.includes("-force"))
                    display[y][x] = 9;

                  // Checks the move result
                  let move = checkTile(field, display, x, y);
                  if (Array.isArray(move)) { // Valid; updates board
                    unrev -= move.length;
                    updateCanvas(board, move, img);
                    let content = "";
                    switch (move.length) {
                      case 1: content = `[<@${player}>] Tile **\`${caught[2].toUpperCase()}${caught[3]}\`** cleared!`; break;
                      default: content = `[<@${player}>] New region opened from tile **\`${caught[2].toUpperCase()}${caught[3]}\`**!`; break;
                    }
                    let newAttach = new D.MessageAttachment(canvas.toBuffer('image/png'), flagID);
                    // Checks if the game has been won
                    if (unrev <= setup[0] && winCon(field, display) == 0) {
                      finder.stop("generic");
                      game.channel.send({content: `Congratulations, <@${player}>! You isolated all the mines in ${moves} moves!\n**--- YOU WIN ---**`, files: [newAttach]});
                    } else {
                      game.channel.send({content: `${content}\n${stats(moves, flags)}`, files: [newAttach]})
                        .then(newMsg => {
                          newMsg.channel.messages.fetch(newMsg.id);
                      });
                    }
                  } else { // Rejection thrown; check outcome
                    finder.resetTimer(shortTime);
                    switch(move) {
                      case 1: // Already cleared
                        return msg.reply(`That tile can't be cleared again!`);
                      case 2: // Flag
                        return msg.reply(`That tile is flagged! I can't uncover a flagged tile!`);
                      case 3: // QMC
                        return msg.reply(`That tile is marked as uncertain!\nIf you are absolutely certain you want to reveal it, re-type the same command followed by \`-force\`.`);
                      case 4: { // Mine hit; reveal mines and end game
                        updateCanvas(board, revealMines(field, display), img);
                        let newAttach = new D.MessageAttachment(canvas.toBuffer('image/png'), flagID);
                        game.channel.send({content: `Oh no! You hit a mine, <@${player}>!\n**--- YOU LOSE ---**`, files: [newAttach]});
                        finder.stop("generic");
                      }
                    }
                  }
                  break;
                }
                case "f":
                case "x": {
                  // Edits flag status
                  let content;
                  if (display[y][x] == 9 || display[y][x] == 10) {
                    display[y][x] = 11 + (time.getUTCMonth() == 5 ? 4 : 0);
                    unrev--;
                    flags--;
                    content = `[<@${player}>] Tile **\`${caught[2].toUpperCase()}${caught[3]}\`** flagged!\n${stats(moves, flags)}`;
                  } else if (display[y][x] == 11 || display[y][x] == 15) {
                    display[y][x] = 9;
                    unrev++;
                    flags++;
                    content = `[<@${player}>] Flag on tile **\`${caught[2].toUpperCase()}${caught[3]}\`** removed!\n${stats(moves, flags)}`;
                  } else {
                    finder.resetTimer(shortTime);
                    return msg.reply(`That tile can't be flagged.`);
                  }
                  updateCanvas(board, [[display[y][x], x, y]], img);
                  let newAttach = new D.MessageAttachment(canvas.toBuffer('image/png'), flagID);
                  game.channel.send({content: content, files: [newAttach]})
                    .then(newMsg => {
                      newMsg.channel.messages.fetch(newMsg.id);
                  });
                  break;
                }
                case "q":
                case "?": {
                  // Edits qmc status
                  let content;
                  if (display[y][x] == 9) {
                    display[y][x] = 10;
                    unrev--;
                    content = `[<@${player}>] Tile \`${caught[2].toUpperCase()}${caught[3]}\` marked as uncertain!\n${stats(moves, flags)}`;
                  } else if (display[y][x] == 10) {
                    display[y][x] = 9;
                    unrev++;
                    content = `[<@${player}>] Uncertainty on tile \`${caught[2].toUpperCase()}${caught[3]}\` removed!\n${stats(moves, flags)}`;
                  } else {
                    finder.resetTimer(shortTime);
                    return msg.reply(`That tile can't be marked as uncertain.`);
                  }
                  updateCanvas(board, [[display[y][x], x, y]], img);
                  let newAttach = new D.MessageAttachment(canvas.toBuffer('image/png'), flagID);
                  game.channel.send({content: content, files: [newAttach]})
                    .then(newMsg => {
                      newMsg.channel.messages.fetch(newMsg.id);
                  });
                  break;
                }
              }
              // Resets the timer
              finder.resetTimer(shortTime);
              // Filter setup
              const attachFilter = (a) => a.name == flagID;
              const msgFilter = (msgx) => msgx.author.id == client.user.id && msgx.attachments.some(attachFilter) && msgx.mentions.users.has(player) && !msgx.deleted;

              // Board swap
              let boards = game.channel.messages.cache.filter(msgFilter);

              // Gets and saves the latest board from the filtered boards
              let tStamp = {createdAt: 0};
              boards.each(msgx => {
                if (msgx.createdAt > tStamp.createdAt)
                tStamp = msgx;
              });
              if (tStamp.createdAt != 0) {
                game = tStamp;
                // Discards the old board
                game.delete()
                  .catch(err => {
                    console.error("E: mswp board could not be discarded", err)
                });
              }
            });

            finder.on('end', (c, reason) => {
              // Determines why the collector ended
              switch (reason) {
                case "generic": 
                  return; // Handled elsewhere in a unique message
                case "time": // Timeouts
                case "idle":
                  return message.reply(`Your \`minesweeper\` instance timed out due to inactivity. Please restart the game if you would like to play again.`);
                case "cancel": // Manually cancelled
                  return message.reply(`Your \`minesweeper\` instance has been stopped. Please restart the game if you would like to play again.`);
                default: // Other (error!)
                  return message.reply(`Your \`minesweeper\` instance has encountered an unknown error and has been stopped. Please restart the game if you would like to play again.`);
              }
            });
        });
    })
    .catch(error => {
      // Generates an error message & logs the error
      genErrorMsg(message, client, error);
    });
  }
};

exports.label = {
  "name": "minesweeper",
  "aliases": ["mine", "mines", "sweep", "minesweep", "sweeper", "mswp"],
  "players": [1],
  "reactions": 0,
  "description": "An old classic, now in bot form!",
  "helpurl": "https://l375.weebly.com/gyrogame-minesweeper",
  "options": ["[preset]", "<mines> <length1> <length2>"],
  "optionsdesc": ["<mines>/[preset]: The number of mines on the field (3-1225), or a preset difficulty (easy = 9×9 + 10 mines, medium = 16×16 + 40 mines, hard = 16×30 + 99 mines, insane = 30×30 + 166 mines, master = 36×36 + 390 mines) Defaults to easy (9×9 + 10 mines)", "<length1>: If no preset is specified, one dimension of the board (7-36)", "<length2>: If no preset is specified, the other dimension of the board (7-36)"],
  "weight": 3,
  "exclusive": 0,
  "indev": 0,
  "deleted": 0
};
