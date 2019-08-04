const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports.run = {
  execute(message, args) {

    const embed = new Discord.RichEmbed()
      .setAuthor("Bot Information", message.client.user.avatarURL)
      .setColor(0x7effaf)
      .setTitle(botinfo.description)
      .setDescription("\• Created by <@334335706740686849>, with support from <@184061887212814336>\n\• Currently running version " + botinfo.version + " on " + message.client.guilds.size + " servers")
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
      .addField("Gyromina Info Pages", "\• [https://lx375.weebly.com/Gyromina](https://lx375.weebly.com/gyromina)")
      .addField("Invite Link", "\• [https://discord.now.sh/490590334758420481?p1141234752](https://discord.now.sh/490590334758420481?p1141234752)")
      .addField("Github Repository", "\• [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)");

    message.channel.send({embed});
  },
};

module.exports.help = {
  "name": "info",
  "aliases": "information",
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "hide": 0,
  "wip": 0
};
