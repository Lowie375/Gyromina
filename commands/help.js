// Require discord.js, fs, and the refcode generator
const Discord = require('discord.js');
const fs = require('fs');
const refcode = require("../systemFiles/refcodes.js");

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

function checkArgs(x) {
  switch(x) {
    case "-sh":
      return 1;
    default:
      return 0;
  }
}

module.exports.run = {
  execute(message, args) {
    message.client.hcommands = new Discord.Collection();
    var cmds = [];

    // Reads command files
    fs.readdir('./commands/', (err, files) => {
      if(err) {
        refcode.genErrorMsg(message, err);
        console.error(err);
      }
      // Debug snippet
      //console.log(`files = ${files}`);

      // Filters out command that don't end in ".js"
      cmds = files.filter(f => f.split('.').pop() === 'js');
      if(cmds.length <= 0) {
        const nope = message.client.emojis.get("493575012276633610");
        console.log('Error - No commands found');
        message.channel.send(`${nope} No commands found!`)
        return;
      }
      
      // Debug snippet
      //console.log(`cmds = ${cmds}`);

      // Pulls command files and command name(?)
      for(const fx of cmds) {
        let command = require(`../commands/${fx}`);
        let thiscommand = fx.split(".")[0];
        message.client.hcommands.set(thiscommand, command);
      }

      // Sets up info emojis
      const ghost = message.client.emojis.get("618181399299751937");
      const beta = message.client.emojis.get("618198843301036032");
      const main = message.client.emojis.get("647926856615723008");
      const dead = message.client.emojis.get("618199093520498789");

      if (args.length >= 1 && checkArgs(args[0]) == 0) { // Detailed help

        const commandName = args[0];
        const cmdy = message.client.hcommands.get(commandName)
          || message.client.hcommands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
      
        // Debug snippet
        //console.log(`${cmdy}`);

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
        if(cmdy.help.dead === 1) {
          embed1.setColor(0xff4d4d);
        } else if(cmdy.help.wip === 1) {
          embed1.setColor(0xffcc4d);
        } else if(cmdy.help.hide === 1) {
          embed1.setColor(0xfefefe);
        } else {
          embed1.setColor(0x7effaf);
        }
        if(cmdy.help.name === commandName) {
          embed1.setTitle(ext + process.env.prefix + cmdy.help.name);
        } else {
          embed1.setTitle(ext + process.env.prefix + cmdy.help.name + " (" + process.env.prefix + commandName + ")");
        }
        if(!cmdy.help.aliases) {
          embed1.setDescription(cmdy.help.description + "\n\• Usage: " + cmdy.help.usage, "");
        } else if(Array.isArray(cmdy.help.aliases) == false) {
          embed1.setDescription(cmdy.help.description + "\n\• Alias: " + process.env.prefix + cmdy.help.aliases + "\n\• Usage: " + cmdy.help.usage, "");
        } else {
          embed1.setDescription(cmdy.help.description + "\n\• Aliases: " + process.env.prefix + cmdy.help.aliases.join(`, ${process.env.prefix}`) + "\n\• Usage: " + cmdy.help.usage, "");
        }

        // Sends the embed
        message.channel.send(embed1);

      } else { // General help

        // Creates & sets up the embed
        const embed2 = new Discord.RichEmbed();

        embed2.setColor(0x7effaf);
        embed2.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional", message.author.avatarURL);
        embed2.setAuthor("Master Command List", message.client.user.avatarURL, "https://lx375.weebly.com/gyromina/commands");
        embed2.setTitle(`Do **${process.env.prefix}help [command]** for more detailed command info.`);

        var cmdlist = "";
        var cmdctr = 0;
        // Creates the main command list
        message.client.hcommands.forEach(c => {
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
        message.client.hcommands.forEach(c => {
          if(c.help.hide === 1 || c.help.wip === 0 || c.help.dead === 1) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed2.addField("Experimental (WIP) Commands " + beta, cmdlist, true);

        // If specified, creates the hidden and depricated command lists
        if(args[0] === "-sh") {
          cmdlist = "Usage of these commands is restricted.\n";      
          cmdctr = 0;
          message.client.hcommands.forEach(c => {
            if(c.help.hide === 0 || c.help.dead === 1) return;
            cmdlist = cmdlist + setParams(c);
            cmdctr++;
          });
          if(cmdctr != 0) embed2.addField("Hidden Commands " + ghost, cmdlist, true);

          cmdlist = "These commands no longer exist.\n";      
          cmdctr = 0;
          message.client.hcommands.forEach(c => {
            if(c.help.dead === 0) return;
            cmdlist = cmdlist + setParams(c);
            cmdctr++;
          });
          if(cmdctr != 0) embed2.addField("Deprecated Commands " + dead, cmdlist, true);
        }
        message.channel.send(embed2);
      }
    });
  },
};

module.exports.help = {
  "name": "help",
  "aliases": ["commands", "cmds", "command", "cmd"],
  "description": "Provides command help.",
  "usage": `${process.env.prefix}help [command]`,
  "params": "[command]",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
