const D = require('discord.js'); // discord.js
// RNG, responder, season checker
const {getRandomInt, respond, s} = require('../system/globalFunctions.js');

const flag = "🏳️‍🌈";
const quips = [["Casserole in the closet!", 1],
  ["Who took the casserole out of the closet?", 1],
  ["Who put the casserole on the window sill?", 0],
  ["Eggplant casserole… what do I do with *this*?", 0],
  ["Come get your casserole, fresh out the closet!", 1]
];

exports.run = {
  execute(message, args, client) {
    // Quip setup
    var quip = getRandomInt(0, quips.length-1);
    // Checks if the quip is pride-related
    var output = quips[quip][0];
    if (quips[quip][1] === 1 && s() === 1)
      output += ` ${flag}`;
    // Sends the quip
    return respond(output, [message, message]);
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": 'casserole',
  "description": 'Makes a quip about casseroles and closets.',
  "usage": `${process.env.prefix}casserole`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new D.SlashCommandBuilder()
      .setName("casserole")
      .setDescription("Makes a quip about casseroles and closets")
  }
};
