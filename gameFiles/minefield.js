// Require the game functions file and the RNG
const func = require('../systemFiles/gameFunctions.js');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

// Display icons
const air = "󠀠⬛";
const wll = "🔲";
const bmb = "🧨";
const bam = "💥";
const bkd = "❌";
const ibx = "📥";
const ccl = "♻️";
// Instruction icons
const dir = ["🔑", "🛑", "◀️", "🔼", "▶️", "🔽", "🤖", "💎"];
const rxns = [dir[0], dir[1], dir[2], dir[3], dir[4], dir[5], bkd, ibx, ccl];

function bombCheck(x) {
  switch(x) {
    case "easy":
    case "e":
      return 4;
    case "medium":
    case "normal":
    case "moderate":
    case "regular":
    case "m":
      return 8;
    case "hard":
    case "difficult":
    case "h":
      return 12;
    case "insane":
    case "expert":
    case "x":
    case "i":
      return 16;
    case "master":
    case "ultimate":
    case "xm":
    case "u":
      return 20;
    default:
      return parseInt(x);
  }
}

function genBomb(field, ry, ty, tempSteps, bombOrder, i, attCtr = 0) {
  // Generates bomb coordinates
  let x = getRandomInt(1, 11);
  let y = getRandomInt(1, 6);
  
  // Checks if the randomly selected space already has a bomb
  if (field[y][x] == bmb) {
    // Regenerates the bomb
    genBomb(field, ry, ty, tempSteps, bombOrder, i, attCtr);
  } else {
    // Places a bomb
    field[y][x] = bmb;
  }

  // Checks if the bomb is directly blocking a path
  if (checkBombPos(x, y, ry, ty, tempSteps, field) == 1){
    clearBarricades(field);
    field[y][x] = air;
    attCtr++;
    if (attCtr >= 25) {
      // Removes this bomb and regenerates the previous bomb
      bombOrder.pop();
      i--;
      genBomb(field, ry, ty, tempSteps, bombOrder, i);
    } else {
      // Regenerates the bomb
      genBomb(field, ry, ty, tempSteps, bombOrder, i, attCtr);
    }
  } else {
    // Plants the bomb
    bombOrder.push([x, y])
    clearBarricades(field);
  }
}

function quickCheckPath(ry, tempSteps, field) {
  let x = 0;
  let y = ry;
  for(let i = 0; i < tempSteps.length; i++){
    switch(tempSteps[i]) {
      case "N": y -= 1; break;
      case "E": x += 1; break;
      case "S": y += 1; break;
      case "W": x -= 1; break;
    }
    if (field[y][x] == bmb) {
      return 1;
    }
  }
  return 0;
}

function clearBarricades(field) {
  // Removes blockades placed in pathfinding
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] == bkd) field[i][j] = air;
    }
  }
}

function junction(x, y, f, tsp, field, x1, y1, step1, x2, y2, step2, x3, y3, step3) {
  let output = new Object();
  let sx, sy, sf;
  // Checks for junction paths
  // Follow left first, then front, then right (always this order)
  if (field[y+y1][x+x1] == dir[7] || field[y+y2][x+x2] == dir[7] || field[y+y3][x+x3] == dir[7]) { // Checks for the target in all directions
    tsp.push("E");
    return 0;
  } else if (field[y+y1][x+x1] == air) { // Checks to the left
    tsp.push(step1);
    sx = x+x1;
    sy = y+y1;
    sf = step1;
  } else if (field[y+y2][x+x2] == air) { // Checks to the front
    tsp.push(step2);
    sx = x+x2;
    sy = y+y2;
    sf = step2;
  } else if (field[y+y3][x+x3] == air) { // Checks to the right
    tsp.push(step3);
    sx = x+x3;
    sy = y+y3;
    sf = step3;
  } else { // Dead end hit <!>
    return 1;
  }
  // Checks for an intersection (2 or more paths)
  if ((field[y+y1][x+x1] == air && field[y+y2][x+x2] == air) || (field[y+y1][x+x1] == air && field[y+y3][x+x3] == air) || (field[y+y2][x+x2] == air && field[y+y3][x+x3] == air)) {
    // Saves the coordinates to the output, to be transferred to split[]
    output = {
      "x": sx,
      "y": sy,
      "f": sf,
      "s": [x, y, f, tsp.length-1],
    };
  } else {
    // No intersection
    output = {
      "x": sx,
      "y": sy,
      "f": sf,
      "s": false,
    };
  }
  return output;
}

function barricade(x, y, field, x1, y1, x2, y2, x3, y3) {
  if (field[y+y1][x+x1] == air) // Checks to the left
    field[y+y1][x+x1] = bkd;
  else if (field[y+y2][x+x2] == air) // Checks to the front
    field[y+y2][x+x2] = bkd;
  else if (field[y+y3][x+x3] == air) // Checks to the right
    field[y+y3][x+x3] = bkd;
}

function checkBombPos(x, y, ry, ty, tempSteps, field) {
  // Basic check (bot un-trapper)
  switch(x) {
    case 1:
      if (y == ry) return 1;
      break;
    case 11:
      if (y == ty) return 1;
      break;
  }
  
  // Advanced check (pathfinder)
  if (tempSteps.length == 0 || quickCheckPath(ry, tempSteps, field) == 1) {
    // Creates a path (if none available or current one is no longer valid)
    let facing = "E";
    let cx = 1;
    let cy = ry;
    let split = [[0, 0, 0, "E"]]; //x, y, step#, facing
    let found = 0;
    tempSteps.splice(0, tempSteps.length);
    tempSteps.push("E");

    do {
      if (cx == 0) {
        // No valid path exists
        return 1;
      } else {
        var res = new Object();
        // Runs a different check depending on which way the robot is "facing".
        switch (facing) {
          case "N": res = junction(cx, cy, facing, tempSteps, field, -1, 0, "W", 0, -1, "N", 1, 0, "E"); break;
          case "E": res = junction(cx, cy, facing, tempSteps, field, 0, -1, "N", 1, 0, "E", 0, 1, "S"); break;
          case "S": res = junction(cx, cy, facing, tempSteps, field, 1, 0, "E", 0, 1, "S", -1, 0, "W"); break;
          case "W": res = junction(cx, cy, facing, tempSteps, field, 0, 1, "S", -1, 0, "W", 0, -1, "N"); break;
        }
        if (res == 1) { // Checks if the robot is in a dead end
          // Backtracks to last intersection found
          let l = split.length - 1;
          cx = split[l][0];
          cy = split[l][1];
          facing = split[l][2];

          // Barricades the dead end
          switch (facing) {
            case "N": barricade(cx, cy, field, -1, 0, 0, -1, 1, 0); break;
            case "E": barricade(cx, cy, field, 0, -1, 1, 0, 0, 1); break;
            case "S": barricade(cx, cy, field, 1, 0, 0, 1, -1, 0); break;
            case "W": barricade(cx, cy, field, 0, 1, -1, 0, 0, -1); break;
          }

          // Removes all steps into the dead path
          tempSteps.splice(split[l][3], tempSteps.length-split[l][3]-1);

          // Removes the intersection from split[]
          split.pop();
        } else if (res == 0) {
          // If the target was reached successfully, exits the loop
          found = 1;
        } else {
          // Repositions the robot
          cx = res.x;
          cy = res.y;
          facing = res.f;
          if (res.s != false) {
            split.push(res.s);
          }
        }
      }
    }
    while (found != 1);
    return 0;
  } else {
    return 0;
  }
}

function removeRxnLoop(urxn, player, n = 0) {
  try {
    urxn.users.remove(player);
  } catch {
    if (n >= 5) return;
    removeRxnLoop(urxn, player, n+1);
  }
};

exports.exe = {
  start(message, client, player, options) {
    // Minefield shell
    var field = [
      [wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, air, air, air, air, air, air, air, air, air, air, air, wll],
      [wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll, wll]
    ];
    // Position variables
    var tempSteps = [];
    var bombs;
    var bombOrder = [[]];
    //var boardID = "";
    var steps = [];
    var content = "";

    if(!options)
      bombs = 4;
    else
      bombs = bombCheck(options[0]);
    
    // Checks if options are valid
    if (isNaN(bombs))
      return message.reply("that's not a valid mine count/preset! Please enter a valid positive integer between 4 and 20 or a valid preset and try again.");

    // Adjusts bomb count, if necessary
    if (bombs > 20) {
      bombs = 20;
      content = "*The mine count has been reduced to 20 (max).*\n\n"
    } else if (bombs < 4) {
      bombs = 4
      content = "*The mine count has been increased to 4 (min).*\n\n"
    }

    // Randomly place robot and target
    var robotY = getRandomInt(1, 7);
    if (robotY == 7) robotY = 6;
    var targetY = getRandomInt(1, 7);
    if (targetY == 7) targetY = 6;
    var startY = robotY;

    field[robotY][0] = dir[6];
    field[targetY][12] = dir[7];

    // Randomly place bombs
    for(let i = 0; i < bombs; i++) {
      genBomb(field, robotY, targetY, tempSteps, bombOrder, i);
    }

    // Clear tempSteps[] (no cheating!)
    //tempSteps.splice(0, tempSteps.length);

    // Create a visual representation of the field
    var output = "";
    for (let i = 0; i < field.length; i++) {
      output += field[i].join("") + "\n";
    }
    
    // Puts the whole shebang into one variable (wow)
    content += `A minefield has been generated!\n\n${output}\n` +
    `Now, using the reaction icons below, create a set of instructions get the robot (${dir[6]}) to the diamond (${dir[7]}) without running over any mines (${bmb})!\n` +
    `Remember, the robot (${dir[6]}) only moves when it is ON (${dir[0]}), and it must be turned OFF (${dir[1]}) once it reaches the diamond (${dir[7]}).\n` +
    `\`\`\`${dir[0]} Turn robot ON  •  ${dir[1]} Turn robot OFF\n${dir[2]} Left 1 space  •  ${dir[3]} Up 1 space  •  ${dir[4]} Right 1 space  •  ${dir[5]} Down 1 space\n` +
    `${bkd} Delete last instruction  •  ${ibx} Confirm instructions  •  ${ccl} Quit game\`\`\`` + 
    `\*This instance of the game will time out if you do not react within 60 seconds.\nIf emojis do not get removed automatically upon reaction, you can remove them manually.\*\n`;

    // Post the field + instructions
    message.channel.send(`${content}\n\*Waiting for emojis to load…\*`)
      .then (async board => {         
        // Add reactions (in order, yay!)
        for (let i = 0; i < rxns.length; i++) {
          await board.react(rxns[i]);
        }

        // Set up a collection filter and collector
        const filter = (reaction, user) => rxns.includes(reaction.emoji.name) && user.id == player;

        const builder = board.createReactionCollector(filter, {time: 60000, idle: 60000});
        // .then await a 'collect', if none return shutdown and stop
        
        board.edit(content + "\n\*\*GO!\*\*");

        builder.on('collect', r => {
          // Determine which reaction got collected
          switch(r.emoji.name) {
            case rxns[0]:
            case rxns[1]:
            case rxns[2]:
            case rxns[3]:
            case rxns[4]:
            case rxns[5]:
              steps.push(r.emoji.name);
              board.edit(`${content}\n\*\*INSTRUCTIONS:\*\* ${steps.join(" ")}`);
              break;
            case rxns[6]:
              steps.pop();
              board.edit(`${content}\n\*\*INSTRUCTIONS:\*\* ${steps.join(" ")}`);
              break;
            case rxns[7]:
              builder.stop("complete");
              return;
            case rxns[8]:
              builder.stop("cancel");
              return;
            default:
              break;
          }
          // Removes the corresponding reaction
          const userReaction = board.reactions.cache.filter(reaction => reaction.users.cache.has(player) && reaction.emoji.name == r.emoji.name);
          for (const urxn of userReaction.values()) {
            removeRxnLoop(urxn, player);
            // Should only iterate once. This is the only way I could get it to work, unfortunately
          }

          // Empties and resets the reaction collector
          builder.empty();
          builder.resetTimer({time: 60000, idle: 60000});
        });

        builder.on('end', (c, reason) => {
          // Determines why the collector stopped
          switch(reason) {
            case "complete": // Instructions submitted
              // Final check + output here
              var res = "";
              var robotX = 0;
              let active = 0;
              // Runs through each instruction
              for (let i = 0; i <= steps.length; i++) {
                // Performs the next instruction
                switch(steps[i]) { //GSLURD = operations
                  case rxns[0]: active = 1; break; // Turns robot on
                  case rxns[1]: active = 0; break; // Turns robot off
                  case rxns[2]:
                    if (active == 1 && robotX != 0 && field[robotY][robotX-1] != wll) {
                      robotX -= 1; // Moves left if robot is on
                    }
                    break;
                  case rxns[3]:
                    if (active == 1 && field[robotY-1][robotX] != wll) {
                      robotY -= 1; // Moves up if robot is on
                    }
                    break;
                  case rxns[4]:
                    if (active == 1 && robotX != 12 && field[robotY][robotX+1] != wll) {
                      robotX += 1; // Moves right if robot is on
                    }
                    break;
                  case rxns[5]:
                    if (active == 1 && field[robotY+1][robotX] != wll) {
                      robotY += 1; // Moves down if robot is on
                    }
                    break;
                }
                // Checks if the robot hit a mine or the goal
                if(field[robotY][robotX] == bmb) {
                  // Kaboom! The robot hit a mine and blew up
                  field[robotY][robotX] = bam;
                  res = "bam";
                  break;
                } else if(field[robotY][robotX] == dir[7] && active == 0) {
                  // Hooray! The robot made it through the minefield!
                  field[robotY][robotX] = dir[6];
                  res = "pass";
                  break;
                }
              }

              // Final robot placement
              field[startY][0] = air;
              if(res != "bam" && res != "pass") {
                field[robotY][robotX] = dir[6];
                res = "stuck";
              }

              // Final game board output
              var endField = "";
              for (let i = 0; i < field.length; i++) {
                endField += field[i].join("") + "\n";
              }

              // Prepares a game result message
              var final = `${endField}\n`
              switch(res) {
                case "stuck": final += "Oh no! The robot got stuck in the minefield!\n**YOU LOSE**"; break;
                case "pass": final += "Hooray! The robot made it through the minefield!\n**YOU WIN**"; break;
                case "bam": final += "Oh no! The robot hit a mine and blew up!\n**YOU LOSE**"; break;
              }

              // Sends the final output
              message.channel.send(final);
              break;
            case "time": // Timeouts
            case "idle":
              board.edit(`${content}\n\*\*This \`minefield\` instance timed out due to inactivity. Please restart the game if you would like to play again.\*\*`); return;
            case "cancel": // Manually cancelled
              board.edit(`${content}\n\*\*This \`minefield\` instance has been stopped. Please restart the game if you would like to play again.\*\*`); return;
            default: // Other (error!)
              board.edit(`${content}\n\*\*This \`minefield\` instance has encountered an unknown error and has been stopped. Please restart the game if you would like to play again.\*\*`); return;
          }
        });
    });
  }
};

exports.label = {
  "name": "minefield",
  "aliases": ["field", "walkinaminefield", "walk-in-a-minefield", "walkin", "maze"],
  "players": 1,
  "description": "A modified version of Walk in a Minefield, as seen in [Challenge #340 \[Intermediate\]](https://www.reddit.com/r/dailyprogrammer/comments/7d4yoe/20171114_challenge_340_intermediate_walk_in_a/) from r/dailyprogrammer.",
  "art": "",
  "options": "[mines/preset]",
  "optionsdesc": "\• [mines/preset]: Number of mines on the field (4-20) or a preset difficulty (easy = 4, medium = 8, hard = 12, insane = 16, master = 20). Defaults to easy (4 mines)",
  "exclusive": 0,
  "indev": 0,
  "deleted": 0
};
