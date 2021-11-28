const D = require('discord.js'); // discord.js
const e = require('../systemFiles/emojis.json'); // emoji file
const style = require('../systemFiles/style.json'); // style file
// permission checker, RNG, emoji puller, rejection embed generator, embed colour checker
const {p, getRandomInt, getEmoji, genRejectEmbed, eCol} = require('../systemFiles/globalFunctions.js');

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
  "dead": false
};
