const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
const e = require('../systemFiles/emojis.json'); // emoji file
const style = require('../systemFiles/style.json'); // style file
// permission checker, embed colour checker, timestamp generator, responder, emoji puller, rejection embed generator
const {p, eCol, stamp, respond, getEmoji, genRejectEmbed} = require('../systemFiles/globalFunctions.js');

function setParams(c) {
  var list = `${c.help.default === 1 ? "/" : process.env.prefix}**${c.help.name}**`
  // Checks for parameters, and adds them as necessary
  if(!c.help.params) {
    list += "\n";
  } else if(!Array.isArray(c.help.params)) {
    list += ` ${c.help.params}\n`;
  } else {
    list += ` ${c.help.params[0]}\n`;
    for(let i = 1; i < c.help.params.length; i++) {list += `*or* ${process.env.prefix}**${c.help.name}** ${c.help.params[i]}\n`;}
  }
  return list;
}

function setGameOptions(g) {
  var list = `**${g.label.name}**`
  // Checks for parameters, and adds them as necessary
  if(!g.label.options) {
    list += "\n";
  } else if(!Array.isArray(g.label.options)) {
    list += ` ${g.label.options}\n`;
  } else {
    list += ` ${g.label.options[0]}\n`;
    for(let i = 1; i < g.label.options.length; i++) {list += `or **${g.label.name}** ${g.label.options[i]}\n`;}
  }
  return list;
}

function checkArgs(args) {
  const checks = ["-sh", "-g", "-c"];
  let output = 0;
  for (let i = 0; i < checks.length; i++) {
    if (args.includes(checks[i]))
      output += Math.pow(2, i);
  }
  for (let j = 0; j < args.length; j++) {
    if (checks.includes(args[j])) {
      args.splice(j, 1);
      j--;
    }
  }
  return output;
}

function split(list, weight) {
  // Splits the command/game list into multiple parts to save vertical space in the embed
  let splitList = list.split('\n');
  splitList.pop();
  let totWeight = 0;
  for (w of weight) {
    totWeight += w;
  }
  // Checks the weight of the list
  if(totWeight <= 12) // Light: 1 list
    return splitList.join('\n');
  else if(totWeight <= 24) // Moderate: 2 lists
    return splitCore(splitList, 2, weight, totWeight);
  else // Heavy: 3 lists
    return splitCore(splitList, 3, weight, totWeight);
}

function splitCore(splitList, count, weight, totWeight) {
  // Core functionality for split()
  let endLists = [[], [], []];
  let weightLists = [0, 0, 0];

  // Calcuates the target weight for each embed field
  let target = totWeight/count;

  // Splits everything into lists
  for (let i = 0; i < count; i++) {
    while(splitList.length != 0 && weightLists[i] < target) {
      // Checks if adding new element would imbalance the list too much
      let w = weight.shift();
      if(i != count-1 && weightLists[i] + w > target && Math.abs(target-weightLists[i]-w) > Math.abs(target-weightLists[i])) {
        weight.unshift(w);
        break;
      }
      // Adds an element
      endLists[i].push(splitList.shift());
      weightLists[i] += w;
      while(splitList.length != 0 && splitList[0].startsWith("*or*")) {
        // Adds linked elements
        endLists[i].push(splitList.shift());
      }
    }
  }
  // Returns the concatenated lists
  switch (count) {
    case 2:
      return [endLists[0].join("\n"), endLists[1].join("\n")];
    case 3:
      return [endLists[0].join("\n"), endLists[1].join("\n"), endLists[2].join("\n")];
  }
}

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const ghost = getEmoji(message, e.ghost, e.alt.ghost);
    const beta = getEmoji(message, e.beta, e.alt.beta);
    const main = getEmoji(message, e.main, e.alt.main);
    const dead = getEmoji(message, e.dead, e.alt.dead);

    // Checks for special arguments
    var conditions = 0;
    if (args) conditions = checkArgs(args);

    // Creates embed + button row shells
    const embed = new D.MessageEmbed();
    const buttons = new D.MessageActionRow();

    if (args.length >= 1 && ((conditions & 2) === 0 || (conditions & 4) !== 0)) { // Detailed command help

      const commandName = args[0];
      const cmdy = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

      if(!cmdy) // return an (ephemeral) rejection message
        return respond({embeds: [genRejectEmbed(message, `\`${commandName}\` command not found`, "Please check your spelling and try again.")]}, [message, message], {eph: true});

      // Begins preparing embed data
      var ext = "";
      if(cmdy.help.dead) ext += `${dead} `;
      if(cmdy.help.wip) ext += `${beta} `;
      if(cmdy.help.hide) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed.setFooter(`Requested by ${message.author.tag} - <required>, [optional] - ${stamp()}`, message.author.avatarURL());
      if(cmdy.help.dead)
        embed.setColor(style.e.dead);
      else if(cmdy.help.wip)
        embed.setColor(style.e.wip);
      else if(cmdy.help.hide)
        embed.setColor(style.e.hide);
      else
        embed.setColor(eCol(style.e.default));

      if(cmdy.help.name === commandName) {
        switch(cmdy.help.default) {
          case 1: embed.setTitle(`${ext}/${cmdy.help.name} (${process.env.prefix}${cmdy.help.name})`); break;
          default: embed.setTitle(`${ext}${process.env.prefix}${cmdy.help.name}${cmdy.help.s ? ` (/${cmdy.help.name})` : ""}`); break;
        }
      } else {
        switch(cmdy.help.default) {
          case 1: embed.setTitle(`${ext}/${cmdy.help.name} (${process.env.prefix}${commandName}, ${process.env.prefix}${cmdy.help.name})`); break;
          default: embed.setTitle(`${ext}${process.env.prefix}${cmdy.help.name} (${process.env.prefix}${commandName}${cmdy.help.s ? `, /${cmdy.help.name}` : ""})`); break;
        }
      }
      let desc = `${cmdy.help.description}`;

      if(cmdy.help.aliases && !Array.isArray(cmdy.help.aliases))
        desc += `\n*Alias: ${process.env.prefix}**${cmdy.help.aliases}***`;
      else if(cmdy.help.aliases)
        desc += `\n*Aliases: ${process.env.prefix}**${cmdy.help.aliases.join(`**, ${process.env.prefix}**`)}***`;
      
      if(!Array.isArray(cmdy.help.usage)) {
        desc += `\n*Usage: ${cmdy.help.usage}*`;
      } else {
        desc += `\n*Usage: ${cmdy.help.usage[0]}*`;
        for(let i = 1; i < cmdy.help.usage.length; i++) {desc += `\n   ***or** ${cmdy.help.usage[i]}*`;}
      }

      // Sets the embed description
      embed.setDescription(desc);

      // Adds a button if a helpurl is present
      if(cmdy.help.helpurl) {
        buttons.addComponents(
          new D.MessageButton()
          .setStyle('LINK')
          .setLabel(`More information about ${process.env.prefix}${cmdy.help.name}`)
          .setURL(cmdy.help.helpurl)
        );
      }
    } else if (args.length >= 1 && (conditions & 2) !== 0) { // Detailed game help

      const gameName = args[0];
      const gmz = client.games.get(gameName)
      || client.games.find(gm => gm.label.aliases && gm.label.aliases.includes(gameName));

      if(!gmz) // return an (ephemeral) rejection message
      return respond({embeds: [genRejectEmbed(message, `\`${gameName}\` game not found`, "Please check your spelling and try again.")]}, [message, message], {eph: true});

      // Begins preparing embed data
      var ext = "";
      if(gmz.label.deleted) ext += `${dead} `;
      if(gmz.label.indev) ext += `${beta} `;
      if(gmz.label.exclusive) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed.setFooter(`Requested by ${message.author.tag} - <required>, [optional] - ${stamp()}`, message.author.avatarURL());
      if(gmz.label.deleted)
        embed.setColor(style.e.dead);
      else if(gmz.label.indev)
        embed.setColor(style.e.wip);
      else if(gmz.label.exclusive)
        embed.setColor(style.e.hide);
      else
        embed.setColor(eCol(style.e.default));
      
      if(gmz.label.name === gameName)
        embed.setTitle(`${ext}${gmz.label.name}`);
      else
        embed.setTitle(`${ext}${gmz.label.name} (${gameName})`);

      let desc = `${gmz.label.description}`;

      if(gmz.label.aliases && !Array.isArray(gmz.label.aliases))
        desc += `\n*Alias: **${gmz.label.aliases}***`;
      else if(gmz.label.aliases)
        desc += `\n*Aliases: **${gmz.label.aliases.join(`**, **`)}***`;
      
      if (gmz.label.options && !Array.isArray(gmz.label.optionsdesc)) {
        desc += `\n*Options:*\n*${gmz.label.optionsdesc}*`;
      } else if (gmz.label.options) {
        desc += `\n*Options:*\n*${gmz.label.optionsdesc[0]}*`;
        for(let i = 1; i < gmz.label.optionsdesc.length; i++) {desc += `\n*${gmz.label.optionsdesc[i]}*`;}
      }

      // Sets the embed description
      embed.setDescription(desc);

      // Adds a button if a helpurl is present
      if(gmz.label.helpurl) {
        buttons.addComponents(
          new D.MessageButton()
          .setStyle('LINK')
          .setLabel(`More information about ${gmz.label.name}`)
          .setURL(gmz.label.helpurl)
        );
      }
    } else if((conditions & 2) !== 0 && (conditions & 4) === 0) { // General game help

      // Sets up the embed
      embed.setColor(eCol(style.e.default));
      embed.setFooter(`Requested by ${message.author.tag} - <required>, [optional] - ${stamp()}`, message.author.avatarURL());
      embed.setAuthor("Game Library", client.user.avatarURL(), "https://l375.weebly.com/gyromina/");
      embed.setTitle(`Do **${process.env.prefix}help -g [game]** for more detailed game info.`);

      var glist = "";
      var gctr = 0;
      var gweight = [];
      // Creates the main game list
      client.games.forEach(g => {
        if(g.label.exclusive || g.label.indev || g.label.deleted) return;   
        glist = glist + setGameOptions(g);
        gctr++;
        gweight.push(g.label.weight);
      });
      if(gctr != 0) {
        // Checks if a list split is needed
        let splitList = split(glist, gweight);
        if(!Array.isArray(splitList)) { // Short list, no splitting needed
          embed.addField(`Ready to launch ${main}`, `${splitList}`, true);
        } else { // Splitting needed
          let inlineCtr = 1;
          embed.addField(`Ready to launch [${inlineCtr}] ${main}`, `${splitList.shift()}`, true);
          for(l of splitList) {
            inlineCtr++;
            embed.addField(`[${inlineCtr}]`, `${l}`, true);
          }
        }
      }

      // If possible, creates the indev game list
      if(process.env.exp === "1") {
        glist = "**Still in development; play at your own risk!**\n";
      } else {
        glist = "These games have not been released.\n";
      }
      gctr = 0;
      client.games.forEach(g => {
        if(g.label.exclusive || !g.label.indev || g.label.deleted) return;
        glist = glist + setGameOptions(g);
        gctr++;
      });
      if(gctr != 0) embed.addField(`In Development ${beta}`, `${glist}`, true);

      // If specified, creates the hidden and depricated command lists
      if((conditions & 1) !== 0) {
        glist = "These games are only available to contributors for testing.\n";      
        gctr = 0;
        client.games.forEach(g => {
          if(!g.label.exclusive || g.label.deleted) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed.addField(`Exclusive Games ${ghost}`, `${glist}`, true);

        glist = "These games have been removed from the game library.\n";      
        gctr = 0;
        client.games.forEach(g => {
          if(!g.label.deleted) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed.addField(`Removed Games ${dead}`, `${glist}`, true);
      }
    } else { // General command help

      // Sets up the embed
      embed.setColor(eCol(style.e.default));
      embed.setFooter(`Requested by ${message.author.tag} - <required>, [optional] - ${stamp()}`, message.author.avatarURL());
      embed.setAuthor("Main Command List", client.user.avatarURL(), "https://l375.weebly.com/gyromina/commands");
      embed.setTitle(`Do **${process.env.prefix}help [command]** for more detailed command info.`);

      var cmdlist = "";
      var cmdctr = 0;
      var weight = [];
      // Creates the main command list
      client.commands.forEach(c => {
        if(c.help.hide || c.help.wip || c.help.dead) return;   
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
        weight.push(c.help.weight);
      });
      if(cmdctr != 0) {
        // Checks if a list split is needed
        let splitList = split(cmdlist, weight);
        if(!Array.isArray(splitList)) { // Short list, no splitting needed
          embed.addField(`Main List ${main}`, `${splitList}`, true);
        } else { // Splitting needed
          let inlineCtr = 1;
          embed.addField(`Main List [${inlineCtr}] ${main}`, `${splitList.shift()}`, true);
          for(l of splitList) {
            inlineCtr++;
            embed.addField(`[${inlineCtr}]`, `${l}`, true);
          }
        }
      }

      // If possible, creates the experimental command list
      if(process.env.exp === "1") {
        cmdlist = "**Unstable commands; use at your own risk!**\n";
      } else {
        cmdlist = "These commands are currently unavailable.\n";
      }
      cmdctr = 0;
      client.commands.forEach(c => {
        if(c.help.hide || !c.help.wip || c.help.dead) return;
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
      });
      if(cmdctr != 0) embed.addField(`Experimental (WIP) ${beta}`, `${cmdlist}`, true);

      // If specified, creates the hidden and depricated command lists
      if((conditions & 1) !== 0) {
        cmdlist = "Usage of these commands is restricted.\n";      
        cmdctr = 0;
        client.commands.forEach(c => {
          if(!c.help.hide || c.help.dead) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed.addField(`Hidden ${ghost}`, `${cmdlist}`, true);

        cmdlist = "These commands are no longer functional nor maintained.\n";      
        cmdctr = 0;
        client.commands.forEach(c => {
          if(!c.help.dead) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed.addField(`Deprecated ${dead}`, `${cmdlist}`, true);
      }
    }

    // Sends the embed (and buttons, if present)
    switch(args.length) {
      case 0: { // tries to send generic help in DM
        const user = client.users.cache.get(message.author.id)
        if(buttons.components.length === 0) {
          return user.send({embeds: [embed]})
            .then(() => { // reacts to show that the DM was successful
              if (message.gyrType == "msg" && p(message, [D.Permissions.FLAGS.ADD_REACTIONS]))
                message.react(getEmoji(message, e.yep, e.alt.yep, true));
              else 
                respond(`${getEmoji(message, e.yep, e.alt.yep)} Help sent in DMs!`, [message, message], {reply: true});
          }).catch(error => { // sends in channel if DM fails
              console.error(`Could not send generic help in DMs, defaulting to channel`, error)
              respond({embeds: [embed]}, [message, message], {eph: true});
          });
        } else { // buttons!
          return user.send({embeds: [embed], components: [buttons]})
            .then(() => { // reacts to show that the DM was successful
              if (message.gyrType == "msg" && p(message, [D.Permissions.FLAGS.ADD_REACTIONS]))
                message.react(getEmoji(message, e.yep, e.alt.yep, true));
              else 
                respond(`${getEmoji(message, e.yep, e.alt.yep)} Help sent in DMs!`, [message, message], {reply: true});
          }).catch(error => { // sends in channel if DM fails
              console.error(`Could not send generic help in DMs, defaulting to channel`, error)
              respond({embeds: [embed], components: [buttons]}, [message, message], {eph: true});
          });
        }
      }
      default: { // sends detailed help in channel
        if(buttons.components.length === 0)
          return respond({embeds: [embed]}, [message, message], {reply: true});
        else
          return respond({embeds: [embed], components: [buttons]}, [message, message], {reply: true});
      }
    }
  },
  slashArgs(interact) {
    // template: "loose" args
    let opts = [
      interact.options.getString("options")
    ];
    for(let i = 0; i < opts.length; i++) {
      if(opts[i] === null)
        opts[i] = "";
    }
    return opts.join(" ");
  },
};

exports.help = {
  "name": "help",
  "aliases": ["commands", "cmds", "command", "cmd", "gamelist", "cmdlist", "commandlist", "whatis"],
  "description": "Provides command and game help. [options] can include queries and a command/game.",
  "usage": `${process.env.prefix}help [options]`,
  "params": "[options]",
  "default": 0,
  "helpurl": "https://l375.weebly.com/gyrocmd-help",
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": false,
    "builder": new S.SlashCommandBuilder()
      .setName("help")
      .setDescription("Provides command and game help")
      .addStringOption(o => o.setName("options").setDescription("Any queries and/or a command/game").setRequired(false))
  },
};
