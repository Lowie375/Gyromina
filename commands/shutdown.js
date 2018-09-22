const { ownerID } = require('../config.json');

module.exports = {

  name: "shutdown",
  description: "Shuts down Gyromina.",
  execute(message, args) {
    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== ownerID) {
      message.channel.send('<:no:492881073743855634> You don\'t have sufficient permissions to use that command!')
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    message.client.user.setStatus("invisible");
    console.log(`Shutting down ${message.client.user.tag}...`);
    message.client.destroy();
  },
};
