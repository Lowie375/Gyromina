// Require the RNG and the emoji checker
const {getRandomInt, emojiCheck} = require('../systemFiles/globalFunctions.js');

// Emoji setup
const pront = "🖨️";

// List of excuses (for when emojis can't be pulled)
const excuses = ["The pronter ran out of black ink",
  "The pronter ran out of cyan ink",
  "The pronter ran out of yellow ink",
  "The pronter ran out of magenta ink",
  "The pronter could not download the requested file",
  "The pront spoolers stopped working",
  "The pronter drivers were outdated and could not process the requested file",
  "The pronter needed to do maintenance",
  "The pront queue was full",
  "The pronter shut down",
  "The pronter got disconnected from the internet",
  "The pronter ran out of paper",
  "The pronter threw a fit and refused to pront",
  "The pronter exploded",
  "The pronter caved in on itself",
  "The pronter ran away",
  "The pronter had an existential crisis",
  "The pronter mysteriously vanished",
  "The pronter short-circuited",
  "The pronter was too busy eating ice cream",
  "The pronter forgot how to pront"];

function makeExcuse() {
  let num = getRandomInt(0, excuses.length-1);
  return excuses[num];
}

exports.run = {
  execute(message, args, client) {
    if (args.length === 0) {
      let excuse = makeExcuse();
      return message.reply(`${excuse}. ¯\\_(ツ)_/¯\n(No emoji entered. Please enter a valid emoji and try again.)`);
    }

    var uni = emojiCheck(args);
    var emoji;
    
    // Checks if the emoji check passed
    if (uni[0] == "u") { // Pass; unicode
      emoji = uni[1];
    } else if (uni[0] == "c") { // Pass; custom 
      emoji = client.emojis.cache.get(uni[1]);
      if (emoji == undefined) {
        // Emoji not found, make an excuse
        let excuse = makeExcuse();
        return message.reply(`${excuse}. ¯\\_(ツ)_/¯\n(That emoji is from a server Gyromina can't access. Please choose a different emoji and try again.)`);
      }
    } else {
      // Not an emoji, make an excuse
      let excuse = makeExcuse();
      return message.reply(`${excuse}. ¯\\_(ツ)_/¯\n(That's not a valid emoji. Please enter a valid emoji and try again.)`);
    }
    
    // Sends the printed emojis
    return message.channel.send(`${pront}\n${emoji}\n${emoji}\n${emoji}`);
  },
};

exports.help = {
  "name": "pront",
  "aliases": ["print"],
  "description": "Prints emojis.",
  "usage": `${process.env.prefix}pront <emoji>`,
  "params": "<emoji>",
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
