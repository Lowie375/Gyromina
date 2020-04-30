// Require the package file
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');

module.exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);

    // Checks to see if the bot owner or a contributor sent the message.
    if(message.author.id !== package.hostID && message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id)) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to run a test, but was unsuccessful!')
      return;
    }

    console.log(client.users.cache.get(package.authorID));

    if("yes" == "Yes") {
      message.channel.send("Yeah!");
    } else {
      message.channel.send("bleh.");
    }
    console.log("xenon" % 1);

    if("yes" === "Yes") {
      message.channel.send("Yeah!");
    } else {
      message.channel.send("bleh.");
    }
    console.log(1 % 1);

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
