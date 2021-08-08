// Require discord.js, the RNG, permission checker, and emoji file
const D = require('discord.js');
const {p, getRandomInt} = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');

exports.run = {
  execute(message, args, client) {
    const yep = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.yep) : e.alt.yep;
    const nope = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.nope) : e.alt.nope;

    let max = getRandomInt(1, 3);
    var del = getRandomInt(0, max);

    message.channel.sendTyping();
    if (del == 0 || !p(message, [D.Permissions.FLAGS.MANAGE_MESSAGES])) {
      setTimeout(() => {
        message.channel.send(`${nope} Content could not be delelte'd`);
      }, getRandomInt(250, 450));
    } else {
      message.delete()
        .then(() => {
          message.channel.send(`${yep} [Content delelte'd]`);
        })
        .catch(() => {
          message.channel.send(`${nope} Content could not be delelte'd`);
        });
    }
  },
};

exports.help = {
  "name": "delelte",
  "aliases": ["delete", "delele"],
  "description": "\'Attempts\' to delete the trigger message.",
  "usage": `${process.env.prefix}delelte`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
