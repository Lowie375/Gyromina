// Require discord.js and the package file
const Discord = require('discord.js');
const package = require('../package.json');

exports.run = {
  execute(message, args, client) {

    // Creates the crediting embed
    const embed = new Discord.MessageEmbed()
      .setAuthor("Gyromina Contributors", client.user.avatarURL())
      .setColor(0x7effaf)
      .setTitle("A huge thanks to everyone who has contributed to Gyromina!")
      .setFooter(`Requested by ${message.author.tag} • Source: package.json`, message.author.avatarURL())
      .setTimestamp();

    // Creates the author field
    embed.addField("Author", `<@${package.authorID}> - [${package.author}](https://github.com/Lowie375)`)
    
    // Creates the list of contributors
    if (package.contributors.length > 0) {
      let c = `<@${package.contributorIDs[0]}> - [${package.contributors[0]}](${package.contributorLinks[0]})`;
      // Maps the remaining contributors
      for (let i = 1; i < package.contributors.length; i++) {
        if (package.contributorIDs[i] != "n/a") 
          c += `\n<@${package.contributorIDs[i]}> - [${package.contributors[i]}](${package.contributorLinks[i]})`;
        else
          c += `\n[${package.contributors[i]}](${package.contributorLinks[i]})`;
      }
      embed.addField("Repo Contributors - 💻 💾", c);
    }

    // Creates the list of testers
    if (package.testers.length > 0) {
      let t = `<@${package.testerIDs[0]}>`;
      // Maps the remaining testers
      for (let i = 1; i < package.contributors.length; i++) {
        c += `, <@${package.testerIDs[i]}>`;
      }
      embed.addField("Helpers - 🦟 ⌚", t);
    }

    // Sends the embed
    message.channel.send({embed: embed});
  },
};

exports.help = {
  "name": "contributors",
  "aliases": ["credits", "developers", "devs", "contrib", "helpers", "team"],
  "description": "Lists all of Gyromina's contributors.",
  "usage": `${process.env.prefix}contributors`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
