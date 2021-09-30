// Require discord.js, the package file, the style file, the embed colour checker, and the timestamp generator
const D = require('discord.js');
const package = require('../package.json');
const style = require('../systemFiles/style.json');
const {eCol, stamp} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {

    // Creates the crediting embed
    const embed = new D.MessageEmbed()
      .setAuthor("Gyromina Contributors", client.user.avatarURL())
      .setColor(eCol(style.e.default))
      .setTitle("A huge thanks to everyone who has contributed to Gyromina!")
      .setFooter(`Requested by ${message.author.tag} - Source: package.json - ${stamp()}`, message.author.avatarURL())
    
    // Creates the list of contributors
    let c;
    // Maps the author (first contributor)
    if (package.authorLink != "") 
      c = `[${package.author}](${package.authorLink}) - [@${package.authorGit}](https://github.com/${package.authorGit})`;
    else
      c = `${package.author} - [@${package.authorGit}](https://github.com/${package.authorGit})`;
    // Maps the remaining contributors
    for (let i = 0; i < package.contributors.length; i++) {
      if (package.contributorLinks[i] != "") 
        c += `\n[${package.contributors[i]}](${package.contributorLinks[i]}) - [@${package.contributorGits[i]}](https://github.com/${package.contributorGits[i]})`;
      else
        c += `\n${package.contributors[i]} - [@${package.contributorGits[i]}](https://github.com/${package.contributorGits[i]})`;
    }
    embed.addField("Repo Contributors  💻 💾", c);

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
    return message.channel.send({embeds: [embed]});
  },
};

exports.help = {
  "name": "contributors",
  "aliases": ["credits", "developers", "devs", "contrib", "helpers", "team"],
  "description": "Lists all of Gyromina's contributors.",
  "usage": `${process.env.prefix}contributors`,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
