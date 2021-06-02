// Require discord.js, the package file, the cdn + style files, and the embed colour checker
const Discord = require('discord.js');
const botinfo = require('../package.json');
const cdn = require('../systemFiles/cdn.json');
const style = require('../systemFiles/style.json');
const {eCol, avCol, stamp} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Sets up the embed description
    var desc = `*noun:*\n[1] A multipurpose Discord bot created by [${botinfo.author}](${botinfo.authorLink}), with contributions & support from `;
    for (let i = 0; i <= Math.min(2, botinfo.contributors.length-1); i++) {
      // Adds a credit + custom link (if present) or GitHub link (if not)
      if(botinfo.contributorLinks[i] != "")
        desc += `[${botinfo.contributors[i]}](${botinfo.contributorLinks[i]})`;
      else
        desc += `[${botinfo.contributors[i]}](https://github.com/${botinfo.contributorGits[i]})`;

      // Adds the word "and", a comma, or both
      if(botinfo.contributors.length == i+2 && botinfo.contributors.length != 4) {
        switch(botinfo.contributors.length) {
          case 2: desc += "and "; break;
          default: desc += ", and "; break;
        }
      } else {
        desc += ", ";
      }
    }

    // Credits additional people as "others" if appropriate
    if (botinfo.contributors.length > 3) desc += "and others, ";
    // Closes off the description
    desc += `currently running v${botinfo.version} on ${client.guilds.cache.size} servers\n[2] \"${botinfo.tagline}\"`;

    // Creates the info embed
    const embed = new Discord.MessageEmbed()
      .setAuthor("The Gyroscopic Dictionary", client.user.avatarURL())
      .setColor(eCol(style.e.default))
      .setTitle("Gy·ro·mi·na\n/jīräminə/")
      .setDescription(desc)
      .setFooter(`Requested by ${message.author.tag} - Source: package.json - ${stamp()}`, message.author.avatarURL())
      .addField("*Origin:*", "​***\`    L-V3R7     --->    Gyromina   \`***\n*\` Jul 07, 2018        Sep 15, 2018 \`\nMore information: [https://l375.weebly.com/gyromina](https://l375.weebly.com/gyromina)*")
      .addField("*Usage:*", "*\"You can invite Gyromina to your Discord server using this link: [https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot](https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot)\"*")
      .addField("*See also:*", "​*\`GitHub repository\`: [https://github.com/Lowie375/Gyromina](https://github.com/Lowie375/Gyromina)\n​[Project Manager](https://github.com/Lowie375/Gyromina/projects/1)"
        + " / [Report a Bug](https://github.com/Lowie375/Gyromina/issues) / [Bug Tracker](https://github.com/Lowie375/Gyromina/projects/2)*")
      .setThumbnail(avCol(cdn));

    // Sends the embed
    return message.channel.send({embed: embed});
  },
};

exports.help = {
  "name": "info",
  "aliases": ["information", "about"],
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
