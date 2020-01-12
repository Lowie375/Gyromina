const package = require('../package.json');

module.exports.run = {
  execute(message, args, client) {
    const nope = client.emojis.get("618199093520498789");

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
  "description": 'Miscellaneous test command. (Contributors only)',
  "usage": `${process.env.prefix}vartest`,
  "params": "(contributors only)",
  "hide": 1,
  "wip": 0,
  "dead": 0,
};