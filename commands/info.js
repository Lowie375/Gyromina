const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports = {

  name: "info",
  description: "Displays Gyromina's info.",
  execute(message, args) {

    const embed = new Discord.RichEmbed()
      .setAuthor("Bot Information", message.client.user.avatarURL)
      .setColor(0x798c90)
      .setTitle(botinfo.description)
      .setDescription("~ Created by " + botinfo.author + "\n~ Running version " + botinfo.version + " on " + message.client.guilds.size + " servers")
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
      .addField("Github Repository", "[https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)");

      message.channel.send({embed});
  },
};
