// Require discord.js, the RNG (obviously), permission checker, and emoji file
const D = require('discord.js');
const {getRandomInt, p} = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');

const cancelWords = ["rng cancel", "rng stop", "rng end", "rng quit"];

function numCheck(x) {
  switch(x) {
    case "easy":
    case "basic":
    case "e":
    case "b":
      return 10;
    case "medium":
    case "normal":
    case "moderate":
    case "regular":
    case "m":
    case "r":
    case "n":
      return 100;
    case "hard":
    case "difficult":
    case "h":
    case "d":
      return 1000;
    case "insane":
    case "expert":
    case "x":
    case "i":
      return 7500;
    case "ultimate":
    case "extreme":
    case "u":
    case "xe":
      return 50000;
    case "demonic":
    case "maximum":
    case "max":
    case "xm":
    case "xu":
    case "xd":
      return 16777215;
    default:
      return parseInt(x);
  }
}

exports.exe = {
  start(message, client, player, options) {
    // Variable setup
    var max;
    var guesses;
    var content = "";

    // Emoji setup
    const yep = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.yep) : e.alt.yep;
    const nope = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.nope) : e.alt.yep;

    if (!options)
      max = 10;
    else
      max = numCheck(options[0]);

    // Checks if options are valid
    if(isNaN(max))
      return message.reply(`that's not a valid maximum/preset! Please enter a valid positive integer less than 16777216 or a valid preset and try again.`);

    // Adjusts max, if necessary
    if (max < 2)
      max = 2;
    if (max > 16777215)
      max = 16777215;
    
    // Determines the target number
    var num = getRandomInt(1, max);
    // Calculates how many guesses to give
    let gPow = 1;
    while (max > Math.pow(2, gPow)) {
      gPow++;
    }
    if (gPow <= 4)
      guesses = gPow
    else
      guesses = 4 + Math.floor((gPow-4)*0.75);

    // Prepares the initial game message
    content += `I'm thinking of a number from 1 to ${max}.\n`
    switch (guesses) {
      case 1: content += `You have ${guesses} guess. Go!`
      default: content += `You have ${guesses} guesses. Go!`
    }
    content += `\n\n\*This \`rng\` instance will time out if you do not send a guess within 60 seconds.\nYou can quit the game at any time by typing \`rng stop\`.\*`

    var low = 1;
    var high = max;

    message.channel.send(`${content}`);

    const filter = (msg) => msg.author.id == player && (!isNaN(parseInt(msg.content, 10)) || cancelWords.includes(msg.content));
    const finder = message.channel.createMessageCollector({filter, time: 60000, idle: 60000});
    
    finder.on('collect', msg => {
      // Checks if the collected message was a cancellation message
      if (cancelWords.includes(msg.content)) {
        finder.stop("cancel");
        return; // Stops the game
      }
      
      // Guess setup
      let guess = parseInt(msg.content, 10);
      let alert = "";
      guesses--;

      if (guess == num) { // Spot on!
        finder.stop("win");
        return;
      } else if (guess > num) { // Too high
        high = Math.min(high, guess);
        alert += `⬇️ Lower!\n\*Current range: ${low} to ${high} (inclusive)\*`;
      } else if (guess < num) { // Too low
        low = Math.max(low, guess);
        alert += `⬆️ Higher!\n\*Current range: ${low} to ${high} (inclusive)\*`;
      }

      if (guesses == 0) { // Out of guesses; stops the game
        finder.stop("out");
        return;
      } else if (guesses == 1) { // Last guess!
        alert += `\n\*\*\*This is your last guess, make it count!\*\*\*`
      } else { // Generic
        alert += `\n\*You have ${guesses} guesses remaining.\*`
      }

      // Sends update and resets the timer
      message.reply(alert)
      finder.resetTimer({time: 60000, idle: 60000});
    });

    finder.on('end', (c, reason) => {
      // Determines why the collector ended
      switch (reason) {
        case "time": // Timeouts
        case "idle":
          message.reply(`Your \`rng\` instance timed out due to inactivity. Please restart the game if you would like to play again.`); return;
        case "cancel": // Manually cancelled
          message.reply(`Your \`rng\` instance has been stopped. Please restart the game if you would like to play again.`); return;
        case "win": // Correct guess!
          message.reply(`${yep} Congratulations! You guessed the right number!\n**YOU WIN**`); return;
        case "out": // Out of guesses
          message.reply(`${nope} Oh no, you ran out of guesses!\nThe number was **${num}**.\n**YOU LOSE**`); return;
        default: // Other (error!)
          message.reply(`Your \`rng\` instance has encountered an unknown error and has been stopped. Please restart the game if you would like to play again.`); return;
      }
    });
  }
};

exports.label = {
  "name": "rng",
  "aliases": ["rnggame", "rng-game", "beattherng", "beat-the-rng"],
  "players": [1],
  "reactions": 0,
  "description": "A guessing game of pure chance, because the RNG is wonderful and deserves its own game.",
  "helpurl": "https://l375.weebly.com/gyrogame-rng",
  "options": "[max/preset]",
  "optionsdesc": "[max/preset]: The maximum number the RNG could generate (up to 16777215) or a preset difficulty (easy = 10, medium = 100, hard = 1000, insane = 7500, master = 50000). Defaults to easy (10)",
  "weight": 1,
  "exclusive": 0,
  "indev": 0,
  "deleted": 0
};
