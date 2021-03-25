// Require the package file and the permission checker
const e = require('../systemFiles/emojis.json');
const {p} = require('../systemFiles/globalFunctions.js');

exports.run = {
  async execute(message, args, client) {
    // Emoji setup
    const nope = p(message, ['USE_EXTERNAL_EMOJIS']) ? client.emojis.cache.get(e.nope) : e.alt.nope;
    const yep = p(message, ['USE_EXTERNAL_EMOJIS']) ? client.emojis.cache.get(e.yep) : e.alt.yep;
    
    // Checks to see if the bot host sent the message.
    if(message.author.id !== process.env.hostID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    let tag = client.user.tag;
    await message.channel.send(`${yep}`);
    await client.user.setStatus("invisible");
    console.log(`Shutting down ${tag}...\n- - - - - - - - - - -`);
    await client.destroy();
  },
};

exports.help = {
  "name": "shutdown",
  "aliases": ["off", "stop", "quit", "shutoff"],
  "description": "Shuts down the current instance of Gyromina. (Owner/host only)",
  "usage": `${process.env.prefix}shutdown`,
  "params": "(owner/host only)",
  "weight": 1,
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
