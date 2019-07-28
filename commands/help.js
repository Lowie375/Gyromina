const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = {
  execute(message, args) {
    if (process.env.exp === 1) {
    message.client.commands = new Discord.Collection();

    fs.readdir('./commands/', (err, files) => {
      if(err) console.error(err);

      let cmds = files.filter(f => f.split('.').pop() === 'js');
      if(cmds.length <= 0) {
        console.log('Error - No commands found');
        return;
      }

      //cmds.forEach(f => {
        //const command = require(`./commands/${f}`);
        //message.client.commands.set(command.help.name, command);
      //});

    });

    if (args.length >= 1) {
      const commandName = args[0];
      const cmdy = message.client.commands.get(commandName)
        || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
      const cmdx = require(`./${commandName}.js`);
/*
      const embed = new Discord.RichEmbed()
        .setAuthor(process.env.prefix + cmdx.help.name, message.client.user.avatarURL)
        .setColor(0x7effaf)
        .setFooter("Requested by " + message.author.tag + " / <> is required, [] is optional.", message.author.avatarURL)
        .addField(cmdx.help.description, "Aliases: TBD\nUsage: " + cmdx.help.usage)

      message.channel.send({embed});*/
    } else {
      // generic help
    }
  } else {
    // Gets the gyrominaWarning emoji
    const warning = client.emojis.get("493570621599383552");

    message.channel.send(`${warning} This command is unavailable.`);
    if(message.author.id === process.env.ownerID) {
      message.channel.send(`Enable experimental mode to run this command.`)
    }
  }
  },
};

module.exports.help = {
  "name": "help",
  "aliases": ["commands", "cmds", "command", "cmd"],
  "description": "Provides command help.",
  "usage": `${process.env.prefix}help [command]`,
  "hide": false,
  "wip": true
};
