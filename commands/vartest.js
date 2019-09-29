const package = require('../package.json');

module.exports.run = {
  execute(message, args) {
    const nope = message.client.emojis.get("493575012276633610");

    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id)) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to run a test, but was unsuccessful!')
      return;
    }

    if("xenon" % 1 === 0) {
      message.channel.send("Yeah!");
    } else {
      message.channel.send("bleh.");
    }
    console.log("xenon" % 1);

    /*if(1 % 1 === 0) {
      message.channel.send("Yeah!");
    } else {
      message.channel.send("bleh.");
    }
    console.log(1 % 1);*/

  },
};
    
module.exports.help = {
  "name": 'vartest',
  "aliases": 'vt',
  "description": 'Miscellaneous test command. (contributors only)',
  "usage": `${process.env.prefix}vartest`,
  "hide": 1,
  "wip": 0
};