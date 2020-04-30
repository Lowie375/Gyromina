// Require the RNG
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

// List of 'proofs'
const proof = ["because that's just how it is.",
  "because smart people think so.",
  "because Gyromina said so.", 
  "for some odd reason.", 
  "because Gyromina is too slow to argue.",
  "because Gyromina heard that was true.",
  ".",
  "because Gyromina was never told otherwise.",
  "because it's the truth.",
  "because the RNG said so, and the RNG is always right.",
  "because the internet thinks so.",
  "because… why not.",
  "because Gyromina is never gonna tell a lie… and hurt you. _\\\*insert rickroll here\\\*_",
  "because… yes.",
  "because it helps Gyromina sleep at night."];

module.exports.run = {
  execute(message, args, client) {
    if (args.length == 0)
      return message.reply("you didn't give me anything to prove!");
    
    const [...statement] = args;

    var num = getRandomInt(0, proof.length-1);
    const selected = proof[num];

    message.channel.send(`${statement.join(" ")} ${selected}\n**Deal with it.**`);
  }
};

module.exports.help = {
  "name": "prove",
  "description": "\'Proves\' that the input is true.",
  "usage": `${process.env.prefix}prove <statement>`,
  "params": "<statement>",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
