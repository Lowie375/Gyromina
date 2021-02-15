// Require discord.js, the cdn file, and the package file
const Discord = require('discord.js');
const cdn = require('../systemFiles/cdn.json');
const botinfo = require('../package.json');

exports.run = {
  execute(message, args, client) {
    const embed = new Discord.MessageEmbed()
      .setAuthor("The Gyroscopic Dictionary", client.user.avatarURL())
      .setColor(0x7effaf)
      .setTitle("Gy·ro·mi·na\n/jīräminə/")
      .setDescription(`*noun:*\n[1] A multipurpose Discord bot created by [${botinfo.author}](${botinfo.authorLink}), with contributions & support from [${botinfo.contributors[0]}](${botinfo.contributorLinks[0]}), [${botinfo.contributors[1]}](${botinfo.contributorLinks[1]}), and [${botinfo.contributors[2]}](${botinfo.contributorLinks[2]}), currently running v${botinfo.version} on ${client.guilds.cache.size} servers\n[2] \"${botinfo.tagline}\"`)
      .setFooter(`Requested by ${message.author.tag} • Source: package.json`, message.author.avatarURL())
      .setTimestamp()
      .addField("*Origin:*", "​***\`    L-V3R7     --->    Gyromina   \`***\n*\` Jul 07, 2018        Sep 15, 2018 \`\nMore information: [https://l375.weebly.com/gyromina](https://l375.weebly.com/gyromina)*")
      .addField("*Usage:*", "*\"You can invite Gyromina to your Discord server using this link: [https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot](https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot)\"*")
      .addField("*See also:*", "​*\`GitHub repository\`: [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)\n​[Project Manager](https://github.com/Lowie375/Gyromina/projects/1)"
        + " / [Report a Bug](https://github.com/Lowie375/Gyromina/issues) / [Bug Tracker](https://github.com/Lowie375/Gyromina/projects/2)*")
      .setThumbnail(cdn.avatar);

    message.channel.send({embed: embed});
  },
};

exports.help = {
  "name": "info",
  "aliases": "information",
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
