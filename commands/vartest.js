const D = require('discord.js'); // discord.js
const package = require('../package.json'); // package file
const e = require('../system/emojis.json'); // emoji file
// timestamp generator, emoji checker, emoji puller, rejection embed generator
const {stamp, emojiCheck, getEmoji, genRejectEmbed} = require('../system/globalFunctions.js'); 

// Test regex
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = getEmoji(message, e.nope, e.alt.nope);

    // Checks to see if the bot owner or a contributor sent the message.
    if(message.author.id !== process.env.hostID && message.author.id !== package.authorID && !package.contributorIDs.includes(message.author.id) && !package.testerIDs.includes(message.author.id)) {
      console.log('A user attempted to run a test, but was unsuccessful!');
      return message.channel.send({embeds: [genRejectEmbed(message, "Insufficient permissions")]});
    }

    message.channel.send(`${parseInt(0x707070)}`);

    let m = rgbX.exec("rgb(255, 255, 255)");
    let n = rgbX.exec("yada blah blah");

    console.log(args);

    if (m) console.log("m!");
    if (n) console.log("n!");

    console.log(stamp());

    console.log(message.channel);
    console.log(message.channel.type)
    console.log(client.user);
    if(!message.channel.isDMBased()) {
      console.log(message.guild.me);
      let gyr = message.guild.me;
      let gPerm = [D.PermissionsBitField.Flags.SendMessages, D.PermissionsBitField.Flags.AddReactions];
      console.log(gyr.permissions);
      console.log(gyr.permissions.has([D.PermissionsBitField.Flags.ViewChannel]));
      console.log(gyr.permissions.has(D.PermissionsBitField.Flags.Administrator));
      console.log(gyr.permissions.has(gPerm));
      console.log(gyr.permissionsIn(message.channel));
      console.log(message.channel.permissionsFor(gyr));
    }

    console.log(true ? true : false);
    console.log(false ? true : false);
    console.log(0 ? true : false);
    console.log(1 ? true : false);
    console.log(2 ? true : false);
    console.log(undefined ? true : false);
    console.log(null ? true : false);

    emojiCheck();

    message.channel.send("The Test has been initiated. You may begin.")
      .then(tMsg => {
        tMsg = 0;

        const filter = (msg) => msg.author.id == message.author.id;
        const finder = message.channel.createMessageCollector({filter, time: 30000, idle: 30000});

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
  "name": "vt",
  "aliases": ["vartest"],
  "description": 'Miscellaneous test command. (contributors/testers only)',
  "usage": `${process.env.prefix}vt`,
  "params": "(contributors)",
  "default": 0,
  "weight": 1,
  "hide": true,
  "wip": false,
  "dead": false
};
