const {getRandomInt} = require('../systemFiles/globalFunctions.js');

const flag = "🏳️‍🌈";

const quips = [["Casserole in the closet!", 1],
  ["Who took the casserole out of the closet?", 1],
  ["Who put the casserole on the window sill?", 0],
  ["Eggplant casserole… what do I do with *this*?", 0],
];

exports.run = {
  execute(message, args, client) {
    // Quip setup
    var quip = getRandomInt(0, quips.length-1);
    var time = new Date();
    // Checks if the quip is pride-related
    var output = quips[quip][0];
    if (quips[quip][1] == 1 && time.getUTCMonth() == 5)
      output += ` ${flag}`;
    // Sends the quip
    message.channel.send(output);
  },
};

exports.help = {
  "name": 'casserole',
  "description": 'Makes a quip about casseroles and closets.',
  "usage": `${process.env.prefix}casserole`,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
