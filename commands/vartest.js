// Require the package file, emoji file, permission checker, and timestamp generator
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');
const {p, stamp} = require('../systemFiles/globalFunctions.js');

// Test regex
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = p(message, ['USE_EXTERNAL_EMOJIS']) ? client.emojis.cache.get(e.nope) : e.alt.nope;

    // Checks to see if the bot owner or a contributor sent the message.
    if(message.author.id !== process.env.hostID && message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id) && !package.testerIDs.includes(message.author.id)) {
      console.log('A user attempted to run a test, but was unsuccessful!');
      return message.channel.send(`${nope} Insufficient permissions!`);
    }

    message.channel.send(parseInt(0x707070));

    let m = rgbX.exec("rgb(255, 255, 255)");
    let n = rgbX.exec("yada blah blah");

    console.log(args);

    if (m) console.log("m!");
    if (n) console.log("n!");

    console.log(stamp());

    console.log(message.channel);
    console.log(message.channel.type)
    console.log(client.user);
    if(message.channel.type != "dm" && message.channel.type != "voice") {
      console.log(message.guild.me);
      let gyr = message.guild.me;
      let gPerm = ['SEND_MESSAGES', 'ADD_REACTIONS'];
      console.log(gyr.permissions);
      console.log(gyr.permissions.has(['VIEW_CHANNEL']));
      console.log(gyr.permissions.has('ADMINISTRATOR'));
      console.log(gyr.permissions.has(gPerm));
      console.log(gyr.permissionsIn(message.channel));
      console.log(message.channel.permissionsFor(gyr));
    }

    message.channel.send("The Test has been initiated. You may begin.")
      .then(tMsg => {
        tMsg = 0;

        const filter = (msg) => msg.author.id == message.author.id;
        const finder = message.channel.createMessageCollector(filter, {time: 30000, idle: 30000});

        finder.on('collect', () => {
          tMsg++;
          console.log(tMsg);
          finder.resetTimer({time: 30000, idle: 30000})
        });

        finder.on('end', () => {
          message.channel.send("The Test has concluded. Thank you for your participation.")
        })
      });
  },
};
    
exports.help = {
  "name": 'vartest',
  "aliases": ['vt'],
  "description": 'Miscellaneous test command. (Contributors/testers only)',
  "usage": `${process.env.prefix}vartest`,
  "params": "(contributors only)",
  "weight": 1,
  "hide": 1,
  "wip": 0,
  "dead": 0,
};
