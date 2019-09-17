// Require discord.js, fs, and the refcode generator
const Discord = require('discord.js');
const fs = require('fs');
const refcode = require("../systemFiles/refcodes.js");

module.exports.run = {
  execute(message, args) {
    message.client.hcommands = new Discord.Collection();
    var cmds = [];

    // Reads command files
    fs.readdir('./commands/', (err, files) => {
      if(err) {
        // Gets the 'gyrominaWarning' emoji
        const warning = client.emojis.get("493570621599383552");
        // Generates a reference code
        const newRef = refcode.genRefCode();
        console.log(`REFCODE: ${newRef}\n- - - - - - - - - - -`);

        const embed4 = new Discord.RichEmbed()
          .setTitle(warning + " Something went wrong...")
          .setColor(0xffcc4d)
          .setDescription("\• Found a bug? Report it [here](https://github.com/Lowie375/Gyromina/issues).\n\• Reference code: \`" + newRef + "\`");
        message.channel.send(embed4);

        // Sends the error to the bot owner
        let xcl = message.channel.client;
        const L3 = xcl.fetchUser(process.env.ownerID)
        .then(L3 => {
          L3.send(`REFCODE: \`${newRef}\` \n\`\`\`js${err.stack}\`\`\``);
        });

        console.error(err);
      }

      // Debug snippet
      //console.log(`files = ${files}`);

      // Filters out command that don't end in ".js"
      cmds = files.filter(f => f.split('.').pop() === 'js');
      if(cmds.length <= 0) {
        const nope = message.client.emojis.get("493575012276633610");
        console.log('Error - No commands found');
        message.channel.send(`${nope} Error - No commands found!`)
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
      //const gone = message.client.emojis.get("618199093520498789");

      if (args.length >= 1) { // Detailed help

        const commandName = args[0];
        const cmdy = message.client.hcommands.get(commandName)
          || message.client.hcommands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
      
        // Debug snippet
        //console.log(`${cmdy}`);

        if(!cmdy) return;

        // Creates the embed
        let embed1 = new Discord.RichEmbed();
        var ext = "";
        if(cmdy.help.wip === 1) ext += beta;
        if(cmdy.help.hide === 1) ext += ghost;
        //if(cmdy.help.dead === 1) ext += gone;

        // Sets up the embed
        embed1.setColor(0x7effaf);
        embed1.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional.", message.author.avatarURL);
        if (cmdy.help.name === commandName) {
          embed1.setTitle(process.env.prefix + cmdy.help.name + " " + ext);
        } else {
          embed1.setTitle(`${process.env.prefix}${cmdy.help.name} (${process.env.prefix}${commandName}) ${ext}`);
        }
        if(!cmdy.help.aliases) {
          embed1.addField(cmdy.help.description, "\• Usage: " + cmdy.help.usage);
        } else if(Array.isArray(cmdy.help.aliases) == false) {
          embed1.addField(cmdy.help.description, "\• Alias: " + process.env.prefix + cmdy.help.aliases + "\n\• Usage: " + cmdy.help.usage);
        } else {
          embed1.addField(cmdy.help.description, "\• Aliases: " + process.env.prefix + cmdy.help.aliases.join(`, ${process.env.prefix}`) + "\n\• Usage: " + cmdy.help.usage);
        }

        // Sends the embed
        message.channel.send(embed1);

      } else { // General help

        // Creates & sets up the embed
        const embed2 = new Discord.RichEmbed();

        embed2.setColor(0x7effaf);
        embed2.setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional.", message.author.avatarURL);
        embed2.setAuthor("Master Command List", message.client.user.avatarURL, "https://lx375.weebly.com/gyromina/commands");
        embed2.setTitle(`Do **${process.env.prefix}help [command]** for more detailed command info.`);

        var cmdlist = "";
        var cmdctr = 0;
        message.client.hcommands.forEach(c => {
          if(c.help.hide === 1 || c.help.wip === 1) return;
          
          if(c.help.params) cmdlist = cmdlist + "\• " + process.env.prefix + "**" + c.help.name + "** " + c.help.params + "\n";
          if(!c.help.params) cmdlist = cmdlist + "\• " + process.env.prefix + "**" + c.help.name + "**\n"
          cmdctr++;
        });
        if(cmdctr != 0) embed2.addField("Main Commands", cmdlist, true);

        if(process.env.exp === "1") {
          cmdlist = "**Unstable commands; use at your own risk!**\n";
        } else {
          cmdlist = "These commands are currently unavailable.\n";
        }
        cmdctr = 0;
        message.client.hcommands.forEach(c => {
          if(c.help.hide === 1 || c.help.wip === 0) return;

          if(c.help.params) cmdlist = cmdlist + "\• " + process.env.prefix + "**" + c.help.name + "** " + c.help.params + "\n";
          if(!c.help.params) cmdlist = cmdlist + "\• " + process.env.prefix + "**" + c.help.name + "**\n"
          cmdctr++;
        });
        if(cmdctr != 0) embed2.addField("Experimental (WIP) Commands " + beta, cmdlist, true);

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
  "wip": 0
};
