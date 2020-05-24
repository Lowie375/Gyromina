// Require the package file, emoji file, and some global functions (colours)
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);

    // Checks to see if the bot owner or a contributor sent the message.
    if(message.author.id !== process.env.hostID && message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id) && !package.testerIDs.includes(message.author.id)) {
      console.log('A user attempted to run a test, but was unsuccessful!');
      return message.channel.send(`${nope} Insufficient permissions!`);
    }

    message.channel.send("The Test has been initiated. You may begin.")
      .then(tMsg => {
        tMsg = 0;

        const filter = (msg) => msg.author.id == message.author.id;
        const finder = message.channel.createMessageCollector(filter, {time: 30000, idle: 30000});

        finder.on('collect', msg => {
          tMsg++;
          console.log(tMsg);
          finder.resetTimer({time: 30000, idle: 30000})
        });

        finder.on('end', (c, r) => {
          message.channel.send("The Test has concluded. Thank you for your participation.")
        })
      });
  },
};
    
exports.help = {
  "name": 'vartest',
  "aliases": 'vt',
  "description": 'Miscellaneous test command. (Contributors/testers only)',
  "usage": `${process.env.prefix}vartest`,
  "params": "(contributors only)",
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
