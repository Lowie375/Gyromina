const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports.run = {
  execute(message, args) {

    const embed = new Discord.RichEmbed()
      .setAuthor("Bot Information", message.client.user.avatarURL)
      .setColor(0x7effaf)
      .setTitle(botinfo.description)
      .setDescription("~ Created by L375#6740, with support from Alten#4148\n~ Currently running version " + botinfo.version + " on " + message.client.guilds.size + " servers")
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
      .addField("Gyromina Info Pages", "[https://lx375.weebly.com/Gyromina](https://lx375.weebly.com/gyromina)")
      .addField("Github Repository", "[https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)");

    message.channel.send({embed});
  },
};

module.exports.help = {
  "name": "info",
  "aliases": "information",
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "hide": false,
  "wip": false
};
