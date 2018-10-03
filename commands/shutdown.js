const { ownerID } = require('../config.json');

module.exports = {

  name: "shutdown",
  aliases: ["off", "stop", "quit"],
  description: "Shuts down Gyromina.",
  execute(message, args) {
    // Gets the 'gyrominaNo' emoji
    const nope = message.client.emojis.find("name", "gyrominaNo");

    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== ownerID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    message.client.user.setStatus("invisible");
    console.log(`Shutting down ${message.client.user.tag}...`);
    message.client.destroy();
  },
};
