// Require the RNG and the emoji checker
const {getRandomInt, emojiCheck} = require('../systemFiles/globalFunctions.js');

// Emoji setup
const pront = "🖨️";

// List of excuses (for when emojis can't be pulled)
const excuses = ["the pronter ran out of black ink.",
  "the pronter ran out of cyan ink.",
  "the pronter ran out of yellow ink.",
  "the pronter ran out of magenta ink.",
  "the pronter could not download the requested file.",
  "the pront spoolers stopped working.",
  "the pronter drivers were outdated and could not process the requested file.",
  "the pronter needed to do maintenance.",
  "the pront queue was full.",
  "the pronter shut down.",
  "the pronter got disconnected from the internet.",
  "the pronter ran out of paper.",
  "the pronter threw a fit and refused to pront.",
  "the pronter exploded.",
  "the pronter caved in on itself.",
  "the pronter ran away."];

function makeExcuse() {
  let num = getRandomInt(0, excuses.length-1);
  return excuses[num];
}

exports.run = {
  execute(message, args, client) {
    if (args.length == 0) {
      let excuse = makeExcuse();
      return message.reply(`${excuse} ¯\\_(ツ)_/¯\n(No emoji entered. Please enter a valid emoji and try again.)`);
    }

    var uni = emojiCheck(args[0]);
    var emoji;
    
    // Checks if the emoji check passed
    if (uni[0] == "u") { // Pass; unicode
      emoji = uni[1];
    } else if (uni[0] == "c") { // Pass; custom 
      emoji = client.emojis.cache.get(uni[1]);
      if (emoji == undefined) {
        // Emoji not found, make an excuse
        let excuse = makeExcuse();
        return message.reply(`${excuse} ¯\\_(ツ)_/¯\n(That emoji is from a server Gyromina can't access. Please choose a different emoji and try again.)`);
      }
    } else {
      // Not an emoji, make an excuse
      let excuse = makeExcuse();
      return message.reply(`${excuse} ¯\\_(ツ)_/¯\n(That's not a valid emoji. Please enter a valid emoji and try again.)`);
    }
    
    // Sends the printed emojis
    message.channel.send(`${pront}\n${emoji}\n${emoji}\n${emoji}`);
  },
};

exports.help = {
  "name": "pront",
  "aliases": "print",
  "description": "Prints emojis.",
  "usage": `${process.env.prefix}pront <emoji>`,
  "params": "<emoji>",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
