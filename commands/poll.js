const D = require('discord.js'); // discord.js
const e = require('../systemFiles/emojis.json'); // emoji file
const style = require('../systemFiles/style.json'); // style file
// permission checker, emoji checker, embed colour checker, timestamp generator, rejection embed generator, emoji puller
const {p, emojiCheck, eCol, stamp, genRejectEmbed, getEmoji} = require('../systemFiles/globalFunctions.js');

// Cleanup regex
const cleaner = /^ +/;

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
  if(type === 2) {
    // Scale poll: determines custom min/max and descriptors (if present)
    let save = [2, 6, false, false];

    for(op of options) {
      let opName = op.trimStart().split(/ +/)[0];
      let opDesc = op.trimStart();
      // trim name off descriptor string
      for(let c = opName.length; c > 0; c) {
        if(opDesc.charAt(0) !== " ") c--;
        opDesc = opDesc.slice(1);
        if(opDesc == "") break;
      }
      // final cleanup
      if(opDesc.startsWith(" ")) opDesc = opDesc.slice(1);
      if(opDesc.endsWith(" ")) opDesc = opDesc.slice(0, -1);

      // checks that there is actually an option present
      if(opDesc.length !== 0) {
        if(opName.startsWith("mind"))
          save[2] = opDesc;
        else if(opName.startsWith("maxd"))
          save[3] = opDesc;
        else if(opName.startsWith("min"))
          save[0] = parseInt(opDesc.trim())+1;
        else if(opName.startsWith("max"))
          save[1] = parseInt(opDesc.trim())+1;
      }
    }

    // Checks if min/max are within bounds
    save[0] = isNaN(save[0]) ? 2 : Math.max(1, save[0]);
    save[1] = isNaN(save[1]) ? 6 : Math.min(11, save[1]);

    // Checks if the min is larger than the max
    if(save[0] > save[1]) {
      let tempMax = save[0];
      save.shift();
      save.splice(1, 0, tempMax);
    }
    // Returns the options
    return save;
  } else if(type === 0 || type === 1) {
    // Y/X/N polls: determines option descriptors (if present)
    let save = ["yes", "neutral", "no"];

    for(op of options) {
      let opName = op.trimStart().split(/ +/)[0];
      let opDesc = op.trimStart();
      // trim name off descriptor string
      for(let c = opName.length; c > 0; c) {
        if(opDesc.charAt(0) !== " ") c--;
        opDesc = opDesc.slice(1);
        if(opDesc == "") break;
      }
      // final cleanup
      if(opDesc.startsWith(" ")) opDesc = opDesc.slice(1);
      if(opDesc.endsWith(" ")) opDesc = opDesc.slice(0, -1);

      // check that there is actually an option present
      if(opDesc.length !== 0) {
        if(opName.startsWith("y"))
          save[0] = opDesc;
        else if(opName.startsWith("x") && type === 1)
          save[1] = opDesc;
        else if(opName.startsWith("n"))
          save[2] = opDesc;
      }
    }
    // returns the options
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
      return message.reply({embeds: [genRejectEmbed(message, "\`type\`/\`prompt\` arguments not found", "Gyromina can't make a poll if no poll type or prompt is given!\nPlease check your arguments and try again")]});

    // Permission check: add reactions
    if (!p(message, [D.Permissions.FLAGS.ADD_REACTIONS]))
      return message.reply({embeds: [genRejectEmbed(message, "Gyromina is missing permissions", `Gyromina can't make polls without being able to add reactions!\nPlease ask a server administrator to enable the \`Add Reactions\` permission for ${client.user.tag} and try again.`)]});

    // Permission check: external emojis
    var perms = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]);

    // Embed setup
    const embed = new D.MessageEmbed();
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
        case 0: content = `Vote ${perms ? client.emojis.cache.get(e.poll.yes) : e.alt.poll.yes} (${opVals[0]}) or ${perms ? client.emojis.cache.get(e.poll.no) : e.alt.poll.no} (${opVals[2]}) using the emojis below.`; break;
        case 1: content = `Vote ${perms ? client.emojis.cache.get(e.poll.yes) : e.alt.poll.yes} (${opVals[0]}), ${perms ? client.emojis.cache.get(e.poll.nx) : e.aly.poll.nx} (${opVals[1]}), or ${perms ? client.emojis.cache.get(e.poll.no) : e.alt.poll.no} (${opVals[2]}) using the emojis below.`; break;
        case 2: content = `Vote on a scale from ${opVals[0]-1}${opVals[2] ? ` (${opVals[2]})` : ""} to ${opVals[1]-1}${opVals[3] ? ` (${opVals[3]})` : ""} using the emojis below.`; break;
        default: content = ``; break;
      }

      // Deletes the poll creation message (for cleanliness), if possible
      if (p(message, [D.Permissions.FLAGS.MANAGE_MESSAGES]) && !args.includes("-nd")) message.delete();

      // Sets up the poll embed
      embed.setTitle(`${prompt}`);
      embed.setColor(eCol(style.e.default));
      embed.setFooter(`Poll created by ${message.author.tag} - ${stamp()}`, message.author.avatarURL());
      if (content != "")
        embed.setDescription(`${content}`);

      // Sends the embed
      return message.channel.send({embeds: [embed]})
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

      // removes flags so that they don't interfere with the poll maker
      const checks = ["-nd"];
      var flags = 0;
      var sliced = false;

      for (let i = 0; i < checks.length; i++) {
        if (args.includes(checks[i]))
          flags += Math.pow(2, i);
      }
      for (let j = 0; j < args.length; j++) {
        if (checks.includes(args[j])) {
          args.splice(j, 1);
          j--;
        }
      }

      // sets up the actual poll
      let pollRoot = args.join(" ").split("-");
      let prompt = pollRoot.shift();
      let options = [];

      if (pollRoot.length === 0)
        return message.reply({embeds: [genRejectEmbed(message, "No poll options found", "Gyromina can't make a poll without any poll options!\nPlease add one or more valid poll options and try again.")]});
      
      // Escaped dash handler
      for (let i = 0; i < pollRoot.length; i++) {
        if(pollRoot[i].slice(-1) == "\\") {
          pollRoot[i] += `-${pollRoot[i+1]}`;
          pollRoot.splice(i+1, 1);
          i--;
        }
      }
      
      // Check if poll length needs to be chopped (anti-spam)
      if(pollRoot.length > 4) {
        const pollRoleX = /polls?/i
        if (message.channel.guild.roles.cache.some(r => pollRoleX.test(r.name.toLowerCase()))) {
          // poll role exists, check permissions + roles
          let guildMember = message.channel.guild.members.cache.get(message.author.id);
          if(!(message.author.id === message.guild.ownerId || guildMember.permissions.has(D.Permissions.FLAGS.MANAGE_MESSAGES, true) || guildMember.roles.cache.some(r => pollRoleX.test(r.name.toLowerCase())))) {
            // no poll role or permissions for member: impose 4 option restriction for anti-spam protection
            pollRoot = pollRoot.slice(0, 4);
            sliced = true;
          }
        }
      }

      for (const shell of pollRoot) {
        let x = shell.trimStart().split(" "); //shell.replace(cleaner, "").split(" ");
        let e = x.shift();
        let s = x.join(" ");
        options.push([e, s]);
      }

      // Creates a list of reactions + checks for invalid emojis
      let rxns = [];
      let fails = [];
      let i = 1;
      for (const op of options) {
        let u = emojiCheck([op[0]]);
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
        return message.reply({embeds: [genRejectEmbed(message, `Invalid emojis (**\#${fails.join("**, **\#")}**)`, `Please check your emojis and try again.\nDon't forget that dashes \`-\` must be preceded by backslashes \`\\\` (like this \`\\-\`) in description fields!`)]});
      
      // Merges content together
      for (let i = 0; i < rxns.length; i++) {
        content += `${rxns[i]} ${options[i][1]}\n`;
      }

      // Deletes the poll creation message (for cleanliness), if possible
      if (p(message, [D.Permissions.FLAGS.MANAGE_MESSAGES]) && (flags & 1) === 0) message.delete();

      // Sets up the poll embed
      embed.setTitle(`${prompt}`);
      embed.setColor(eCol(style.e.default));
      embed.setDescription(`${content}`);
      embed.setFooter(`Poll created by ${message.author.tag} - ${stamp()}`, message.author.avatarURL());

      // Sends the embed
      return message.channel.send({embeds: [embed]})
        .then (async poll => {
          // Sends a temporary alert if the poll was trimmed (anti-spam)
          let alert;
          if(sliced)
            alert = await poll.reply({embeds: [genRejectEmbed(message, "Custom poll trimmed", "Since you do not have any \`\"poll\"\` roles or the \`Manage Messages\` permission, your poll was trimmed down to 4 options to avoid spam.", {col: style.e.warn, e: getEmoji(message, e.warn, e.alt.warn)})]});
          // Awaits reactions
          for (rx of rxns) {
            await poll.react(rx);
          }
          return alert;
      }).then (async alert => {
        // Deletes the alert 10 seconds after emojis are added (if present)
        if(sliced) {
          setTimeout(() => {
            alert.delete();
          }, 10000);
        }
      });
    }
  },
};

exports.help = {
  "name": "poll",
  "description": "Creates a poll in the current channel.",
  "usage": [`${process.env.prefix}poll <type> <prompt> [options]`, `${process.env.prefix}poll <prompt> -<e1> [o1] [-<e2> [o2]] …`],
  "params": ["<type> <prompt> [options]", "<prompt> -<e1> [o1] [-<e2> [o2]] …"],
  "default": 0,
  "helpurl": "https://l375.weebly.com/gyrocmd-poll",
  "weight": 4,
  "hide": false,
  "wip": false,
  "dead": false
};
