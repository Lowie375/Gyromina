const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports.run = {
  execute(message, args, client) {
    /*/ Old embed framework
    const embed = new Discord.RichEmbed()
      .setAuthor("Bot Information", client.user.avatarURL)
      .setColor(0x7effaf)
      .setTitle(botinfo.description)
      .setDescription("\• Created by <@"+botinfo.authorID+">, with contributions & support from <@"+botinfo.contributorIDs[0]+">\n\• Currently running version "+botinfo.version+" on "+client.guilds.size+" servers")
      .setFooter("Requested by "+message.author.tag, message.author.avatarURL)
      .addField("Gyromina Info Pages", "​   [https://lx375.weebly.com/gyromina](https://lx375.weebly.com/gyromina)")
      .addField("Invite Link", "​   [https://discord.now.sh/490590334758420481?p1141234752](https://discord.now.sh/490590334758420481?p1141234752)")
      .addField("Github Repository", "​   [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)\n​   [Project Manager](https://github.com/Lowie375/Gyromina/projects/1)"
        + " / [Report a Bug](https://github.com/Lowie375/Gyromina/issues) / [Bug Tracker](https://github.com/Lowie375/Gyromina/projects/2)");

    message.channel.send({embed});
    */
    // New embed framework

    const embed2 = new Discord.RichEmbed()
      .setAuthor("Dictionary", client.user.avatarURL)
      .setColor(0x7effaf)
      .setTitle("Gy·ro·min·a\n/ˈjīräminə/")
      .setDescription("*noun:*\n[1] A multipurpose Discord bot created by <@"+botinfo.authorID+">, with contributions & support from <@"+botinfo.contributorIDs[0]+">, currently running version "+botinfo.version+" on "+client.guilds.size+" servers\n[2] \""+botinfo.tagline+"\"")
      .setFooter("Requested by "+message.author.tag+" / Source: package.json", message.author.avatarURL)
      .addField("*Origin*", "​*More information: [https://lx375.weebly.com/gyromina](https://lx375.weebly.com/gyromina)*")
      .addField("*Usage*", "*\"You can invite Gyromina to your Discord server by following this link: [https://discord.now.sh/490590334758420481?p1141234752](https://discord.now.sh/490590334758420481?p1141234752)\"*")
      .addField("*See also*", "​*Github repository: [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)\n​[Project Manager \(Github\)](https://github.com/Lowie375/Gyromina/projects/1)"
        + " / [Report a Bug \(Github\)](https://github.com/Lowie375/Gyromina/issues) / [Bug Tracker \(Github\)](https://github.com/Lowie375/Gyromina/projects/2)*");

    message.channel.send(embed2);
  },
};

module.exports.help = {
  "name": "info",
  "aliases": "information",
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
