const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports = {

  name: "info",
  aliases: "information",
  description: "Displays Gyromina's info.",
  execute(message, args) {

    const embed = new Discord.RichEmbed()
      .setAuthor("Bot Information", message.client.user.avatarURL)
      .setColor(0x7effaf)
      .setTitle(botinfo.description)
      .setDescription("~ Created by " + botinfo.author + "\n~ Currently running version " + botinfo.version + " on " + message.client.guilds.size + " servers")
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
      .addField("Github Repository", "[https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)");

      message.channel.send({embed});
  },
};
