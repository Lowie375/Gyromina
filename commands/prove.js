// Require some global functions (RNG + Clean)
const {getRandomInt, Clean} = require('../systemFiles/globalFunctions.js');

// List of 'proofs'
const proof = [
  "because that's just how it is.",
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
  "because it helps Gyromina sleep at night.",
  "for whatever reason.",
  "because you just have to face the facts sometimes.",
  "because Gyromina is too busy eating ice cream to argue.",
  "because."];

exports.run = {
  execute(message, args, client) {
    if (args.length === 0)
      return message.reply(`You didn't give me anything to prove!`);
    
    const [...statement] = args;

    // Generates a 'proof'
    var num = getRandomInt(0, proof.length-1);
    const selected = proof[num];

    // Sends the evidence ('proof')
    return message.channel.send(`${Clean(statement.join(" "))}${selected == "." ? "" : " "}${selected}\n**Deal with it.**`);
  }
};

exports.help = {
  "name": "prove",
  "description": "\'Proves\' that the input is true.",
  "usage": `${process.env.prefix}prove <statement>`,
  "params": "<statement>",
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
