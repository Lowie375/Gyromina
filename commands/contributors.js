// Require discord.js, the package file, the style file, and the embed colour checker
const Discord = require('discord.js');
const package = require('../package.json');
const style = require('../systemFiles/style.json');
const {eCol} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {

    // Creates the crediting embed
    const embed = new Discord.MessageEmbed()
      .setAuthor("Gyromina Contributors", client.user.avatarURL())
      .setColor(eCol(style.e.default))
      .setTitle("A huge thanks to everyone who has contributed to Gyromina!")
      .setFooter(`Requested by ${message.author.tag} • Source: package.json`, message.author.avatarURL())
      .setTimestamp();

    // Creates the author field
    embed.addField("Author  💻", `[${package.author}](${package.authorLink}) - [@${package.authorGit}](https://github.com/Lowie375)`)
    
    // Creates the list of contributors
    if (package.contributors.length > 0) {
      let c;
      // Maps the first contributor
      if (package.contributorLinks[0] != "") 
        c = `[${package.contributors[0]}](${package.contributorLinks[0]}) - [@${package.contributorGits[0]}](https://github.com/${package.contributorGits[0]})`;
      else
        c = `${package.contributors[0]} - [@${package.contributorGits[0]}](https://github.com/${package.contributorGits[0]})`;
      // Maps the remaining contributors
      for (let i = 1; i < package.contributors.length; i++) {
        if (package.contributorLinks[i] != "") 
          c += `\n[${package.contributors[i]}](${package.contributorLinks[i]}) - [@${package.contributorGits[i]}](https://github.com/${package.contributorGits[i]})`;
        else
          c += `\n${package.contributors[i]} - [@${package.contributorGits[i]}](https://github.com/${package.contributorGits[i]})`;
      }
      embed.addField("Repo Contributors  💻 💾", c);
    }

    // Creates the list of testers
    if (package.testers.length > 0) {
      let t;
      // Maps the first tester
      if (package.testerLinks[0] != "")
        t = `[${package.testers[0]}](${package.testerLinks[0]})`;
      else
        t = `${package.testers[0]}`;
      // Maps the remaining testers
      for (let i = 1; i < package.testers.length; i++) {
        if (package.testerLinks[i] != "")
          t += `, [${package.testers[i]}](${package.testerLinks[i]})`;
        else
          t += `, ${package.testers[i]}`;
      }
      embed.addField("Helpers 🦟 ⌚", t);
    }

    // Sends the embed
    return message.channel.send({embed: embed});
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
