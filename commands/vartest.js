module.exports.run = {
  execute(message, args) {
    const nope = message.client.emojis.get("493575012276633610");

    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== process.env.ownerID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to run a test, but was unsuccessful!')
      return;
    }

    /*if(1 === "1") {
      message.channel.send("Yeah!");
    } else {
      message.channel.send("bleh.");
    }*/

    console.log("test");

  },
};
    
module.exports.help = {
  "name": 'vartest',
  "aliases": 'vt',
  "description": 'Miscellaneous test command.',
  "usage": `${process.env.prefix}vartest`,
  "hide": 1,
  "wip": 0
};