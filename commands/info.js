const D = require('discord.js'); // discord.js
const botinfo = require('../package.json'); // package file
const cdn = require('../system/cdn.json'); // cdn file
const style = require('../system/style.json'); // style file
// responder, embed colour checker, avatar checker, timestamp generator
const {respond, eCol, avCol, stamp} = require('../system/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Sets up the embed description
    var desc = `***noun:***\n\`[1]\` A multipurpose Discord bot created by [${botinfo.author}](${botinfo.authorLink}), with contributions & support from `;
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
    desc += `currently running v${botinfo.version} on ${client.guilds.cache.size} servers\n\`[2]\` \"${botinfo.tagline}\"`;

    // Creates the info embed
    const embed = new D.EmbedBuilder()
      .setAuthor({name: "The Gyroscopic Dictionary", iconURL: client.user.avatarURL()})
      .setColor(eCol(style.e.default))
      .setTitle("**Gy·ro·mi·na**   \`/ˈdʒaɪrɔmɪnə/\`")
      .setDescription(desc)
      .setFooter({text: `Requested by ${message.author.tag} - Source: package.json - ${stamp()}`, iconURL: message.author.avatarURL()})
      .addFields(
        {name: "*Origin:*", value: "​***\`    L-V3R7     --->    Gyromina   \`***\n*\` Jul 07, 2018        Sep 15, 2018 \`*"},
        {name: "*Usage:*", value: "*\"You can invite Gyromina to your Discord server and view more information about Gyromina using the buttons below!\"*"},
        {name: "*See also:*", value: "​*\`JavaScript\`, \`Node.js\`, \`discord.js\`, \`open source bot\`*"}
      )
      .setThumbnail(avCol(cdn));

    // Creates info buttons
    const inviteBtn = new D.ActionRowBuilder().addComponents(
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('Invite link')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=490590334758420481&permissions=412317248576&scope=bot%20applications.commands'),
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('More information')
        .setURL('https://l375.weebly.com/gyromina'),
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('GitHub')
        .setURL('https://github.com/Lowie375/Gyromina')
    );
    const githubBtn = new D.ActionRowBuilder().addComponents(
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('Project Manager')
        .setURL('https://github.com/Lowie375/Gyromina/projects/1'),
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('Report a Bug')
        .setURL('https://github.com/Lowie375/Gyromina/issues'),
      new D.ButtonBuilder()
        .setStyle('LINK')
        .setLabel('Bug Tracker')
        .setURL('https://github.com/Lowie375/Gyromina/projects/2')
    );

    // Sends the embed
    return respond({embeds: [embed], components: [inviteBtn, githubBtn]}, [message, message]);
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": "info",
  "aliases": ["information", "about"],
  "description": "Displays Gyromina's info.",
  "usage": `${process.env.prefix}info`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": false,
    "builder": new D.SlashCommandBuilder()
      .setName("info")
      .setDescription("Displays Gyromina's info")
  }
};
