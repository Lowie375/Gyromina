// Require discord.js, the emoji file, the permission checker, and the emoji checker
const Discord = require('discord.js');
const e = require('../systemFiles/emojis.json');
const {p, emojiCheck} = require('../systemFiles/globalFunctions.js');

// Preset poll types - types[array#][obj#]
const types = [
  ["yn", e.poll.yes, e.poll.no],
  ["yxn", e.poll.yes, e.poll.nx, e.poll.no],
  ["scale", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
];
// Alternate emojis (for if external emojis are disabled)
const alt = [
  ["yn", e.alt.poll.yes, e.alt.poll.no],
  ["yxn", e.alt.poll.yes, e.alt.poll.nx, e.alt.poll.no],
];

function typeCheck(x) {
  for(let i = 0; i < types.length; i++) {
    if(x == types[i][0])
      return i;
  }
  return null;
}

function optionCheck(type, options) {
  if (type == 2) {
    // Scale poll: determines custom min/max (if present)
    let save = [2, 6];
    for (op of options) {
      let opSplit = op.split(" ");
      if (opSplit[0].startsWith("min") && opSplit[1].length != 0)
        save[0] = parseInt(opSplit[1])+1;
      else if (opSplit[0].startsWith("max") && opSplit[1].length != 0)
        save[1] = parseInt(opSplit[1])+1;
    }
    // Checks if min/max are within bounds
    save[0] = Math.max(1, save[0]);
    save[1] = Math.min(11, save[1]);

    // Checks if the min is larger than the max
    if (save[0] > save[1]) {
      let tempMax = save[0];
      save.shift();
      save.push(tempMax);
    }
    // Returns the min/max
    return save;
  } else {
    // No options
    return null;
  }
}

exports.run = {
  execute(message, args, client) {
    // Argument check
    if (args.length <= 1)
      return message.channel.send(`I can't make a poll if no type or prompt is specified, <@${message.author.id}>!`);

    // Permission check: add reactions
    if (!p(message, ['ADD_REACTIONS']))
      return message.channel.send(`I can't make a poll if I can't add any reactions, <@${message.author.id}>! Please ask a server administrator to enable the 'Add Reactions' permission for Gyromina and try again.`);

    // Permission check: external emojis
    var perms = p(message, ['USE_EXTERNAL_EMOJIS']);

    // Embed setup
    const embed = new Discord.MessageEmbed();
    var content = "";

    // Checks the poll type
    let type = typeCheck(args[0]);
    if (type != null) { // Preset polls

      // Shifts out the type name
      args.shift();
      // Splits up the prompt + options
      let options = args.join(" ").split("-");
      let prompt = options.shift();

      // Handles options and the description message
      let opVals = optionCheck(type, options);
      let content;
      switch (type) {
        case 0: content = `Vote yes ${perms ? client.emojis.cache.get(e.poll.yes) : e.alt.poll.yes} or no ${perms ? client.emojis.cache.get(e.poll.no) : e.alt.poll.no} using the emojis below.`; break;
        case 1: content = `Vote yes ${perms ? client.emojis.cache.get(e.poll.yes) : e.alt.poll.yes}, neutral ${perms ? client.emojis.cache.get(e.poll.nx) : e.aly.poll.nx}, or no ${perms ? client.emojis.cache.get(e.poll.no) : e.alt.poll.no} using the emojis below.`; break;
        case 2: content = `Vote on a scale from ${opVals[0]-1} to ${opVals[1]-1} using the emojis below.`; break;
        default: content = ``; break;
      }

      // Deletes the poll creation message (for cleanliness)
      message.delete();

      // Sets up the poll embed
      embed.setTitle(`${prompt}`);
      embed.setColor(0x00b275);
      embed.setFooter(`Poll created by ${message.author.tag}`, message.author.avatarURL());
      embed.setTimestamp();
      if (content != "")
        embed.setDescription(`${content}`);

      // Sends the embed
      message.channel.send({embed: embed})
        .then (async poll => {
          // Awaits reactions
          switch (type) {
            case 0:
            case 1:
              for (let i = 1; i < types[type].length; i++) {
                if (perms)
                  await poll.react(types[type][i]);
                else
                  await poll.react(alt[type][i]);
              }
              break;
            case 2:
              for (let i = opVals[0]; i <= opVals[1]; i++) {
                await poll.react(types[type][i]);
              }
              break;
          }
      });     

    } else { // custom polls

      let pollRoot = args.join(" ").split("-");
      let prompt = pollRoot.shift();
      let options = [];

      if (pollRoot.length == 0)
        return message.channel.send(`I can't make a poll without any poll options, <@${message.author.id}>!`);
      
      // Escaped dash handler
      for (let i = 0; i < pollRoot.length; i++) {
        if(pollRoot[i].slice(-1) == "\\") {
          pollRoot[i] += `-${pollRoot[i+1]}`;
          pollRoot.splice(i+1, 1);
          i--;
        }
      }

      for (const shell of pollRoot) {
        let x = shell.split(" ");
        let e = x.shift();
        let s = x.join(" ");
        options.push([e, s]);
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
            case undefined: fails.push(i); // Not accessible; fail
            default: rxns.push(c); // Accessible; push
          }
        } else { // Not an emoji; fail
          fails.push(i);
        }
        i++;
      }

      if(fails.length != 0)
        return message.channel.send(`Some custom emojis (\#${fails.join(", \#")}) were invalid, <@${message.author.id}>. Please check your emojis and try again.`);
      
      // Merges content together
      for (let i = 0; i < rxns.length; i++) {
        content += `${rxns[i]} ${options[i][1]}\n`;
      }

      // Deletes the poll creation message (for cleanliness)
      message.delete();

      // Sets up the poll embed
      embed.setTitle(`${prompt}`);
      embed.setColor(0x00b275);
      embed.setDescription(`${content}`);
      embed.setFooter(`Poll created by ${message.author.tag}`, message.author.avatarURL());
      embed.setTimestamp();

      // Sends the embed
      message.channel.send({embed: embed})
        .then (async poll => {
          // Awaits reactions
          for (rx of rxns) {
            await poll.react(rx);
          }
      });     
    }
  },
};

exports.help = {
  "name": "poll",
  "description": "Creates a poll in the current channel.",
  "usage": [`${process.env.prefix}poll <type> <prompt> -[options]`, `${process.env.prefix}poll <prompt> -<e1> [o1] -[e2] [o2] …`],
  "params": ["<type> <prompt> -[options]", "<prompt> -<e1> [o1] -[e2] [o2] …"],
  "helpurl": "https://l375.weebly.com/gyrocmd-poll",
  "weight": 4,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
