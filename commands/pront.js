// Require the emoji regex and the RNG
const emojiRegex = require('emoji-regex');
//const emojiRegex = require('emoji-regex/es2015/index.js');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

// Sets up the regex
const regex = emojiRegex();

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
];

function unicodeCheck(e) {
  let match;
  let save = [];
  while (match = regex.exec(e)) {
    save.push(match[0]);
    //const emoji = match[0];
    //console.log(`Matched sequence ${ emoji } — code points: ${ [...emoji].length }`);
  }
  if(save.length != 0)
    return save[0];
  else
    return "null";
}

function makeExcuse() {
  let num = getRandomInt(0, excuses.length);
  if (num >= (excuses.length - 1)) {
    num = excuses.length - 1;
  }
  return excuses[num];
}

module.exports.run = {
  execute(message, args, client) {
    if (!args) {
      let excuse = makeExcuse();
      message.reply(`${excuse} ¯\\_(ツ)_/¯\n(No emoji entered. Please enter a valid emoji and try again.)`);
      return;
    }

    let uni = unicodeCheck(args[0]);
    let emoji;
    
    // Checks if the unicode check passed
    if (uni != "null") {
      emoji = uni;
    } else {
      // Discord custom emoji (or random string), checks for proper custom emoji formatting
      var pEmojiID = args[0].split("<")[1]
      if (!pEmojiID) {
        // Not an emoji, make an excuse
        let excuse = makeExcuse();
        message.reply(`${excuse} ¯\\_(ツ)_/¯\n(That's not a valid emoji. Please enter a valid emoji and try again.)`);
        return;
      }
      var qEmojiID = pEmojiID.split(":");
      var junk = args[0].split("<")[0].length;
      if (!qEmojiID[2] || !args[0].slice(junk).startsWith("<") || qEmojiID[2].slice(-1) != ">") {
        // Not an emoji, make an excuse
        let excuse = makeExcuse();
        message.reply(`${excuse} ¯\\_(ツ)_/¯\n(That's not a valid emoji. Please enter a valid emoji and try again.)`);
        return;
      }
      var emojiID = qEmojiID[2].slice(0, -1);

      emoji = client.emojis.cache.get(emojiID);
      if (emoji == undefined) {
        // Emoji not found, make an excuse
        let excuse = makeExcuse();
        message.reply(`${excuse} ¯\\_(ツ)_/¯\n(That emoji is from a server Gyromina can't access. Please choose a different emoji and try again.)`);
        return;
      }
    }

    // Sends the printed emojis
    message.channel.send(`${pront}\n${emoji}\n${emoji}\n${emoji}`);
  },
};

module.exports.help = {
  "name": "pront",
  "aliases": "print",
  "description": "Prints emojis.",
  "usage": `${process.env.prefix}pront <emoji>`,
  "params": "<emoji>",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};