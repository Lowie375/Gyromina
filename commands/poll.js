// Require discord.js
const Discord = require('discord.js');
const e = require('../systemFiles/emojis.json');
const {emojiCheck} = require('../systemFiles/globalFunctions.js');

// Preset poll types - types[array#][obj#]
const types = [
  ["yn", e.poll.yes, e.poll.no],
  ["yxn", e.poll.yes, e.poll.nx, e.poll.no],
  ["scale", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
];

function typeCheck(x) {
  for(let i = 0; i < types.length; i++) {
    if(x == types[i][0])
      return i;
  }
  return "null";
}

module.exports.run = {
  execute(message, args, client) {
    // Argument check
    if (args.length <= 1)
      return message.reply("I can't make a poll if no type or prompt is specified!");

    // Embed setup
    const embed = new Discord.MessageEmbed();
    var content = "";

    // Checks the poll type
    let type = typeCheck(args[0]);
    if (type != "null") { // Preset polls

      // Shifts out the type name
      args.shift();
      // Splits up the prompt + options
      let prompt = args.split("-")[0];
      let options = args.split("-");
      options.shift();

      // option handler (min/max)

      // create message contents

    } else { // custom polls

      let pollRoot = args.join(" ").split("-");
      let prompt = pollRoot[0];
      pollRoot.shift();
      let options = [];

      for (const shell of pollRoot) {
        let x = shell.split(" ");
        let e = x.shift();
        x.shift().join(" ");
        options.push([e, x]);
      }

      // Creates a list of reactions + checks for invalid emojis
      let rxns = [];
      let fails = [];
      let i = 1;
      for (const op of options) {
        let u = emojiCheck(op);
        if (u[0] == "u") { // Unicode, push normally
          rxns.push(u[1]);
        } else if (u[0] == "c") { // Custom, check if accessible
          let c = client.emojis.cache.get(u[1]);
          switch (c) {
            case undefined: fails.push(i); // Accessible; push
            default: rxns.push(c); // Not accessible; fail
          }
        } else { // Not an emoji; fail
          fails.push(i);
        }
        i++;
      }

      if(fails.length != 0)
        return message.reply(`some custom emojis (\#${fails.join(", \#")}) were invalid. Please check your emojis and try again.`);
      
      // content merger

      // await reactions
      
    }

    // Pseudocode time!
      // check if poll is valid (has type/prompt/options/etc.)
      // create embed shell
      // check poll type
      // CASE 1: preset poll
        // add prompt
        // react with options (await)
      // CASE 2: custom poll
        // add prompt
        // handle emojis + descriptors
        // METHOD I:
          // join array + .split("-") + .shift()
          // .split(" ") to temp array
          // join + push to final array
        // METHOD II:
          // detect using .startsWith("-")
          // split off to temp array
          // join + push to final array
        // add emojis + descriptors
        // reach with options (await)
      // post poll embed
      // done!
    
  },
};

module.exports.help = {
  "name": "poll",
  "description": "Creates a poll in the current channel.",
  "usage": `${process.env.prefix}poll <type> <prompt> -[options]\n   **--OR--** ${process.env.prefix}poll <prompt> -<e1> [o1] -[e2] [o2] …`,
  "params": ["<type> <prompt> -[options]", "<prompt> -<e1> [o1] -[e2] [o2] …"],
  "helpurl": "https://lx375.weebly.com/gyrocmd-poll",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};