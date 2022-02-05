const colors = require('colors'); // colors
const e = require('../system/emojis.json'); // package file
// emoji puller, rejection embed generator
const {getEmoji, genRejectEmbed} = require('../system/globalFunctions.js');

exports.run = {
  async execute(message, args, client) {
    // Checks to see if the bot host sent the message.
    if(message.author.id !== process.env.hostID) {
      console.log('A user attempted to shut me down, but was unsuccessful!'.nope)
      return message.channel.send({embeds: [genRejectEmbed(message, "Insufficient permissions")]});
    }

    // Shuts down the current instance of the Discord Client.
    await message.channel.send(`${getEmoji(message, e.yep, e.alt.yep)}`);
    await client.user.setStatus("invisible");
    console.log(colors.main(`Shutting down ${client.user.tag}…\n- - - - - - - - - - -`));
    await client.destroy();
    return;
  },
};

exports.help = {
  "name": "shutdown",
  "aliases": ["off", "stop", "quit", "shutoff"],
  "description": "Shuts down the current instance of Gyromina. (host only)",
  "usage": `${process.env.prefix}shutdown`,
  "params": "(owner/host)",
  "default": 0,
  "weight": 2,
  "hide": true,
  "wip": false,
  "dead": false
};
