// Require the RNG and the emoji file
const {getRandomInt} = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');

exports.run = {
  execute(message, args, client) {
    const yep = client.emojis.cache.get(e.yep);
    const nope = client.emojis.cache.get(e.nope);

    let max = getRandomInt(1, 3);
    var del = getRandomInt(0, max);

    if (del == 0) {
      setTimeout(() => {
        message.channel.send(`${nope} Content could not be delelte'd`);
      }, 350);
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
