// Require discord.js and the package file
const Discord = require('discord.js');
const botinfo = require('../package.json');

module.exports.run = {
  execute(message, args, client) {
    const embed = new Discord.MessageEmbed()
      .setAuthor("The Gyroscopic Dictionary", client.user.avatarURL())
      .setColor(0x7effaf)
      .setTitle("Gy·ro·mi·na\n/jīräminə/")
      .setDescription(`*noun:*\n[1] A multipurpose Discord bot created by <@${botinfo.authorID}>, with contributions & support from <@${botinfo.contributorIDs[0]}> and <@${botinfo.contributorIDs[1]}> (Homura#5331), currently running version ${botinfo.version} on ${client.guilds.cache.size} servers\n[2] \"${botinfo.tagline}\"`)
      .setFooter(`Requested by ${message.author.tag} / Source: package.json`, message.author.avatarURL())
      .setTimestamp()
      .addField("*Origin*", "​***\`    L-V3R7     --->    Gyromina   \`***\n*\` Jul 07, 2018        Sep 20, 2018 \`\nMore information: [https://lx375.weebly.com/gyromina](https://lx375.weebly.com/gyromina)*")
      .addField("*Usage*", "*\"You can invite Gyromina to your Discord server using this link: [https://discord.now.sh/490590334758420481?p537259072](https://discord.now.sh/490590334758420481?p537259072)\"*")
      .addField("*See also*", "​*Github repository: [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)\n​[Project Manager](https://github.com/Lowie375/Gyromina/projects/1)"
        + " / [Report a Bug](https://github.com/Lowie375/Gyromina/issues) / [Bug Tracker](https://github.com/Lowie375/Gyromina/projects/2)*")
      .setThumbnail('https://cdn.discordapp.com/avatars/490590334758420481/5630ed9ee4b27498147e569ac52641f1.png')

    message.channel.send({embed: embed});
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
