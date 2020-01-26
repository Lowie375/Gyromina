// Require discord.js, fs, and the refcode generator
const Discord = require('discord.js');
const fs = require('fs');

function setParams(c) {
  var list = "\• " + process.env.prefix + "**" + c.help.name + "**"
  // Checks for parameters, and adds them as necessary
  if(!c.help.params) {
    list = list + "\n";
  } else if(Array.isArray(c.help.params) == false) {
    list = list + " " + c.help.params + "\n";
  } else {
    list = list + " " + c.help.params[0];
    for(let i = 1; i < c.help.params.length; i++) list = list + " **--OR--** " + process.env.prefix + c.help.name + " " + c.help.params[i];
    list = list + "\n"
  }
  return list;
}

function setGameOptions(g) {
  var list = "\• " + process.env.prefix + "**" + g.label.name + "**"
  // Checks for parameters, and adds them as necessary
  if(!g.label.options) {
    list = list + "\n";
  } else if(Array.isArray(g.label.options) == false) {
    list = list + " " + g.label.options + "\n";
  } else {
    list = list + " " + g.label.options[0];
    for(let i = 1; i < g.label.options.length; i++) list = list + " **--OR--** " + process.env.prefix + g.label.name + " " + g.label.options[i];
    list = list + "\n"
  }
  return list;
}

function checkArgs(args) {
  const checks = ["-sh", "-g"];
  let output = [];
  for (let i = 0; i < checks.length; i++) {
    if (args.includes(checks[i]))
      output.push(1);
    else
      output.push(0);
  }
  for (let j = 0; j < args.length; j++) {
    if (checks.includes(args[j])) {
      args.splice(j, 1);
      j--;
    }
  }
  return output;
}

module.exports.run = {
  execute(message, args, client) {
    client.hcommands = new Discord.Collection();
    client.lgames = new Discord.Collection();

    // Reads command and game files
    const cmds = fs.readdirSync('./commands/').filter(f => f.split('.').pop() === 'js');
    if(cmds.length <= 0) {
      const nope = client.emojis.get("618199093520498789");
      console.log('Error - No commands found');
      message.channel.send(`${nope} No commands found!`)
      return;
    }
    const gms = fs.readdirSync('./gameFiles/').filter(f => f.split('.').pop() === 'js');
    if(cmds.length <= 0) {
      const nope = client.emojis.get("618199093520498789");
      console.log('Error - No games found');
      message.channel.send(`${nope} No games found!`)
      return;
    }

    // Pulls command and game info
    for(const fx of cmds) {
      let command = require(`../commands/${fx}`);
      let thisCommand = fx.split(".")[0];
      client.hcommands.set(thisCommand, command);
    }
    for(const gx of gms) {
      let game = require(`../gameFiles/${gx}`);
      let thisGame = gx.split(".")[0];
      client.lgames.set(thisGame, game);
    }

    // Sets up info emojis
    const ghost = client.emojis.get("618181399299751937");
    const beta = client.emojis.get("618198843301036032");
    const main = client.emojis.get("647926856615723008");
    const dead = client.emojis.get("618199093520498789");

    // Checks for special arguments
    var conditions = [];
    if (args) conditions = checkArgs(args);

    if (args.length >= 1 && conditions[1] == 0) { // Detailed command help

      const commandName = args[0];
      const cmdy = client.hcommands.get(commandName)
        || client.hcommands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

      if(!cmdy) return;

      // Creates the embed
      let embed1 = new Discord.RichEmbed();
      var ext = "";
      if(cmdy.help.dead === 1) ext += `${dead} `;
      if(cmdy.help.wip === 1) ext += `${beta} `;
      if(cmdy.help.hide === 1) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed1.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional", message.author.avatarURL);
      if(cmdy.help.dead === 1)
        embed1.setColor(0xff4d4d);
      else if(cmdy.help.wip === 1)
        embed1.setColor(0xffcc4d);
      else if(cmdy.help.hide === 1)
        embed1.setColor(0xfefefe);
      else
        embed1.setColor(0x7effaf);

      if(cmdy.help.name === commandName)
        embed1.setTitle(ext + process.env.prefix + cmdy.help.name);
      else
        embed1.setTitle(ext + process.env.prefix + cmdy.help.name + " (" + process.env.prefix + commandName + ")");

      if(!cmdy.help.aliases)
        embed1.setDescription(cmdy.help.description + "\n\• Usage: " + cmdy.help.usage);
      else if(Array.isArray(cmdy.help.aliases) == false)
        embed1.setDescription(cmdy.help.description + "\n\• Alias: " + process.env.prefix + cmdy.help.aliases + "\n\• Usage: " + cmdy.help.usage);
      else
        embed1.setDescription(cmdy.help.description + "\n\• Aliases: " + process.env.prefix + cmdy.help.aliases.join(`, ${process.env.prefix}`) + "\n\• Usage: " + cmdy.help.usage);

      // Sends the embed
      message.channel.send(embed1);

    } else if (args.length >= 1 && conditions[1] == 1) { // Detailed game help

      const gameName = args[0];
      const gmz = client.lgames.get(gameName)
      || client.lgames.find(gm => gm.label.aliases && gm.label.aliases.includes(gameName));

      if(!gmz) return;

      // Creates the embed
      let embed3 = new Discord.RichEmbed();
      var ext = "";
      if(gmz.label.deleted === 1) ext += `${dead} `;
      if(gmz.label.indev === 1) ext += `${beta} `;
      if(gmz.label.exclusive === 1) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed3.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional", message.author.avatarURL);
      if(gmz.label.deleted === 1)
        embed3.setColor(0xff4d4d);
      else if(gmz.label.indev === 1)
        embed3.setColor(0xffcc4d);
      else if(gmz.label.exclusive === 1)
        embed3.setColor(0xfefefe);
      else
        embed3.setColor(0x7effaf);
      
      if(gmz.label.name === gameName)
        embed3.setTitle(ext + process.env.prefix + gmz.label.name)
      else
        embed3.setTitle(ext + process.env.prefix + gmz.label.name + " (" + process.env.prefix + gameName + ")");

      let desc = gmz.label.description;
      if(Array.isArray(gmz.label.aliases) == false)
        desc += "\n\• Alias: " + process.env.prefix + gmz.label.aliases;
      else if(gmz.label.aliases >= 2)
        desc += "\n\• Aliases: " + process.env.prefix + gmz.label.aliases.join(`, ${process.env.prefix}`);
      if (gmz.label.options) desc += "\n\nOptions:\n" + gmz.label.optionsdesc;
      
      embed3.setDescription(desc);

      // Sends the embed
      message.channel.send(embed3);

    } else if (conditions[1] == 1) { // General game help

      // Creates & sets up the embed
      const embed4 = new Discord.RichEmbed();

      embed4.setColor(0x7effaf);
      embed4.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional", message.author.avatarURL);
      embed4.setAuthor("Games Library", client.user.avatarURL, "https://lx375.weebly.com/gyromina/");
      embed4.setTitle(`Do **${process.env.prefix}help -g [game]** for more detailed game info.`);

      var glist = "";
      var gctr = 0;
      // Creates the main game list
      client.lgames.forEach(g => {
        if(g.label.exclusive === 1 || g.label.indev === 1 || g.label.deleted === 1) return;   
        glist = glist + setGameOptions(g);
        gctr++;
      });
      if(gctr != 0) embed4.addField("Downloaded " + main, glist, true);

      // If possible, creates the indev game list
      if(process.env.exp === "1") {
        glist = "**Still in development; play at your own risk!**\n";
      } else {
        glist = "These games have not been released.\n";
      }
      gctr = 0;
      client.lgames.forEach(g => {
        if(g.label.exclusive === 1 || g.label.indev === 0 || g.label.deleted === 1) return;
        glist = glist + setGameOptions(g);
        gctr++;
      });
      if(gctr != 0) embed4.addField("In Development " + beta, glist, true);

      // If specified, creates the hidden and depricated command lists
      if(conditions[0] == 1) {
        glist = "These games can only be played by certain people.\n";      
        gctr = 0;
        client.lgames.forEach(g => {
          if(g.label.exclusive === 0 || g.label.deleted === 1) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed4.addField("Exclusive Games " + ghost, glist, true);

        glist = "These games have been deleted from the games library.\n";      
        gctr = 0;
        client.lgames.forEach(g => {
          if(g.label.deleted === 0) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed4.addField("Removed Games " + dead, glist, true);
      }

      message.channel.send(embed4);

    } else { // General command help

      // Creates & sets up the embed
      const embed2 = new Discord.RichEmbed();

      embed2.setColor(0x7effaf);
      embed2.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional", message.author.avatarURL);
      embed2.setAuthor("Master Command List", client.user.avatarURL, "https://lx375.weebly.com/gyromina/commands");
      embed2.setTitle(`Do **${process.env.prefix}help [command]** for more detailed command info.`);

      var cmdlist = "";
      var cmdctr = 0;
      // Creates the main command list
      client.hcommands.forEach(c => {
        if(c.help.hide === 1 || c.help.wip === 1 || c.help.dead === 1) return;   
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
      });
      if(cmdctr != 0) embed2.addField("Main Commands " + main, cmdlist, true);

      // If possible, creates the experimental command list
      if(process.env.exp === "1") {
        cmdlist = "**Unstable commands; use at your own risk!**\n";
      } else {
        cmdlist = "These commands are currently unavailable.\n";
      }
      cmdctr = 0;
      client.hcommands.forEach(c => {
        if(c.help.hide === 1 || c.help.wip === 0 || c.help.dead === 1) return;
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
      });
      if(cmdctr != 0) embed2.addField("Experimental (WIP) Commands " + beta, cmdlist, true);

      // If specified, creates the hidden and depricated command lists
      if(conditions[0] == 1) {
        cmdlist = "Usage of these commands is restricted.\n";      
        cmdctr = 0;
        client.hcommands.forEach(c => {
          if(c.help.hide === 0 || c.help.dead === 1) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed2.addField("Hidden Commands " + ghost, cmdlist, true);

        cmdlist = "These commands no longer exist.\n";      
        cmdctr = 0;
        client.hcommands.forEach(c => {
          if(c.help.dead === 0) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed2.addField("Deprecated Commands " + dead, cmdlist, true);
      }
      message.channel.send(embed2);
    }
  },
};

module.exports.help = {
  "name": "help",
  "aliases": ["commands", "cmds", "command", "cmd"],
  "description": "Provides command help.",
  "usage": `${process.env.prefix}help [command/queries]`,
  "params": "[command/query]",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
