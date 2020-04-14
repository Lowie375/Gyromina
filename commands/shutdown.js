// Require the package file
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');

module.exports.run = {
  execute(message, args, client) {

    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);
    const yep = client.emojis.cache.get(e.yep);
    
    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== package.authorID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    message.channel.send(`${yep}`);
    client.user.setStatus("invisible");
    console.log(`Shutting down ${client.user.tag}...\n- - - - - - - - - - -`);
    client.destroy();
  },
};

module.exports.help = {
  "name": "shutdown",
  "aliases": ["off", "stop", "quit"],
  "description": "Shuts down Gyromina. (Owner only)",
  "usage": `${process.env.prefix}shutdown`,
  "params": "(owner only)",
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
