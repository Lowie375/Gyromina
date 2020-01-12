// Display icons
const air = "󠀠⬛";
const wll = "🔲";
const bmb = "🧨";
const bam = "💥";
// Instruction icons
const dir = ["🔑", "🛑", "🔼", "🔽", "◀️", "▶️", "🤖", "💎"];

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
var robotY = 0;
var targetY = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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
      return 7;
    case "hard":
    case "difficult":
    case "h":
      return 10;
    case "insane":
    case "expert":
    case "x":
    case "i":
      return 13;
    default:
      return x;
  }
}

function genBomb() {
  let x = getRandomInt(1, 12);
  if (x == 12) x = 11;
  let y = getRandomInt(1, 7);
  if (y == 7) y = 6;

  checkBombPos(x, y);
}

function checkBombPos(x, y) {

}

module.exports.exe = {
  start(message, args, client, player) {
    var bombs = 0;

    if(args.length >= 2)
      bombs = bombCheck(args[1]);
    else
      bombs = 4;

    // Randomly place robot and target
    for(let i = 0; i <= 1; i++) {
      let y = getRandomInt(1, 7);
      if (y == 7) y = 6;
      switch(i) {
        case 0: field[0][y] = dir[6]; robotY = y; break;
        case 1: field[12][y] = dir[7]; targetY = y; break;
      }
    }

    // Randomly place bombs
    for(let i = 0; i < bombs; i++) {
      genBomb();
    }

    // Create a visual representation of the field
    var output = "";
    for (let i = 0; i < field.length; i++) {
      output = output + field[i].join("") + "\n";
    }

    // Post the field + instructions
    message.channel.send(`A minefield has been generated!\n\n${output}\n` +
    `Now, using the reaction icons below, create a set of instructions get the robot [${dir[6]}] to the diamond [${dir[7]}] without running over any mines [${bmb}]!\n` +
    `Remember, the robot [${dir[6]}] only moves when it is ON [${dir[0]}], and it must be turned OFF [${dir[1]}] once it reaches the diamond ${dir[7]}.\n` +
    `\`\`\`${dir[0]} Turn robot ON  •  ${dir[1]} Turn robot OFF\n${dir[2]} Up 1 space  •  ${dir[3]} Down 1 space  •  ${dir[4]} Left 1 space  •  ${dir[5]} Right 1 space\n` +
    `❌ Delete last instruction  •  📥 Confirm instructions\`\`\``);

    // Add reactions

    var steps = [];
  }
};

module.exports.label = {
  "name": "minefield",
  "aliases": ["field", "walkinaminefield", "walk-in-a-minefield"],
  "players": 1,
  "description": "A modified version of Walk in a Minefield, as seen in [Challenge #340 \[Intermediate\]](https://www.reddit.com/r/dailyprogrammer/comments/7d4yoe/20171114_challenge_340_intermediate_walk_in_a/) from r/dailyprogrammer.",
  "art": "",
  "indev": 1,
};