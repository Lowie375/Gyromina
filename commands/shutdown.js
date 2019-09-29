const package = require('../package.json');

module.exports.run = {
  execute(message, args) {
    // Gets the 'gyrominaNo' and 'gyrominaYes' emojis
    const nope = message.client.emojis.get("493575012276633610");
    const yep = message.client.emojis.get("493570632785723402");

    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== package.authorID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    message.channel.send(`${yep}`);
    message.client.user.setStatus("invisible");
    console.log(`Shutting down ${message.client.user.tag}...\n- - - - - - - - - - -`);
    message.client.destroy();
  },
};

module.exports.help = {
  "name": "shutdown",
  "aliases": ["off", "stop", "quit"],
  "description": "Shuts down Gyromina. (owner only)",
  "usage": `${process.env.prefix}shutdown`,
  "hide": 1,
  "wip": 0
};
