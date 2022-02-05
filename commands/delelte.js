const D = require('discord.js'); // discord.js
const e = require('../system/emojis.json'); // emoji file
const style = require('../system/style.json'); // style file
// permission checker, RNG, emoji puller, rejection embed generator, embed colour checker
const {p, getRandomInt, getEmoji, genRejectEmbed, eCol} = require('../system/globalFunctions.js');

exports.run = {
  execute(message, args, client) {

    let max = getRandomInt(1, 3);
    var del = getRandomInt(0, max);

    message.channel.sendTyping();
    if (del === 0 || !p(message, [D.Permissions.FLAGS.MANAGE_MESSAGES])) {
      setTimeout(() => {
        return message.channel.send({embeds: [genRejectEmbed(message, "Content could not be delelte'd")]});
      }, getRandomInt(250, 450));
    } else {
      message.delete()
        .then(() => {
          message.channel.send({embeds: [genRejectEmbed(message, "[Content delelte'd]", false, {col: eCol(style.e.accept), e: getEmoji(message, e.yep, e.alt.yep)})]});
        })
        .catch((e) => {
          console.log(e.stack);
          message.channel.send({embeds: [genRejectEmbed(message, "Content could not be delelte'd")]});
      });
    }
  },
  /*slashArgs(interact) {
    // template: "loose" args
    let opts = [
      interact.options.getString("message")
    ];
    for(let i = 0; i < opts.length; i++) {
      if(opts[i] === null)
        opts[i] = "";
    }
    return opts.join(" ");
  },*/
};

exports.help = {
  "name": "delelte",
  "aliases": ["delete", "delele"],
  "description": "\'Attempts\' to delete the trigger message.",
  "usage": `${process.env.prefix}delelte [message]`,
  "params": "[message]",
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false/*,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("delelte")
      .setDescription("\'Attempts\' to delete the trigger message")
      .addStringOption(o => o.setName("message").setDescription("The message to attempt to delete").setRequired(false))
  }*/
};
