// Require discord.js, the cdn file, and the RNG
const D = require('discord.js');
const cdn = require('../systemFiles/cdn.json');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

// Support messages
const q = ["In a pickle?",
  "Got a problem?",
  "Having trouble with something?",
  "Need someone to vent to?",
  "Need some help?",
  "In a tough situation?",
  "Feeling stressed?",
  "Feeling worried?",
  "In a rough patch?",
  "Struggling?"];
const r = ["Talk it out with Doc!",
  "Have a chat with Doc!",
  "Doc's here for you!",
  "Chill with Doc for a while!",
  "Say hi to Doc!",
  "Take a moment to relax with Doc!"];

exports.run = {
  execute(message, args, client) {
    // Generates a support message
    let gen = [getRandomInt(0, q.length-1), getRandomInt(0, r.length-1)]

    // Sets up the embed
    const embed = new D.MessageEmbed()
      .setColor(0xffef80)
      .setTitle(`${q[gen[0]]} ${r[gen[1]]}`)
      .setDescription("Doc, my duck friend, will be here as long as you need.")
      .setImage(`${cdn.doc}`);
    
    // Sends the embed
    return message.channel.send({embeds: [embed]});
  },
};

exports.help = {
  "name": "doc",
  "aliases": ["duck", "rubberduck", "rubberducky", "ducky"],
  "description": "Calls Gyromina's duck friend, Doc, for some support.",
  "usage": `${process.env.prefix}doc`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
