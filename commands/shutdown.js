// Require the package file
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');

module.exports.run = {
  async execute(message, args, client) {
    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);
    const yep = client.emojis.cache.get(e.yep);
    
    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== package.hostID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    let tag = client.user.tag;
    await message.channel.send(`${yep}`);
    client.user.setStatus("invisible");
    console.log(`Shutting down ${tag}...`);
    await client.destroy();
    let t = new Date();
    console.log(`Successfully shut down ${tag} on ${t.toUTCString()}.\n- - - - - - - - - - -`)
  },
};

module.exports.help = {
  "name": "shutdown",
  "aliases": ["off", "stop", "quit", "shutoff"],
  "description": "Shuts down the current instance of Gyromina. (Owner only)",
  "usage": `${process.env.prefix}shutdown`,
  "params": "(owner only)",
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
