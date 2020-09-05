// Require discord.js and the RNG
//const Discord = require('discord.js');
const {getRandomInt} = require('../systemFiles/globalFunctions.js');

// Arrays
const icecream = ["🍦", "🍦", "🍦", "🍦", "🍦", "🍦", "🍧", "🍧", "🍧", "🍧", "🍧", "🍧",
  "🍨", "🍨", "🍨", "🍨", "🍨", "🍨", "🥛", "🧊", "📎"];
const yums = [
  "Mmm… delicious!",
  "Ooh, yummy!",
  "Yum yum, delicious!",
  "Enjoy!",
  "There you are!",
  "Dig in!",
  "My mouth is watering… yum!",
  "Wow, that looks delicious!",
  "_\\\*makes another ice cream for themself\\\*_",
  "Wow, that looks so good!",
  "Ta-dah!",
  "Bon appetit!",
  "_\\\*smiles happily\\\*_",
  "You're going to love this one!",
  "My favourite!",
  "Yummy!",
  "Tasty!"
];
const uhoh = [
  "Hold up…",
  "Wait a minute…",
  "Uh oh…",
  "Oh no…",
  "Wait…"
];

exports.run = {
async execute(message, args, client) {
    // Makes the ice cream
    var crm = getRandomInt(0, icecream.length-1);
    var yum = getRandomInt(0, yums.length-1);
    
    // Sends the ice cream, yay!
    await message.channel.send("Coming right up!")
      .then (async order => {
        // Prepares the order
        try {
          await message.channel.send(`${icecream[crm]}`);
          let ono = getRandomInt(0, uhoh.length-1);
          switch (crm) { // Checks for special cases and edits accordingly
            case 18: order.edit(`${uhoh[ono]} that's cream, not \*ice\* cream! 😱`); break;
            case 19: order.edit(`${uhoh[ono]} that's ice, not ice \*cream\*! 😱`); break;
            case 20: order.edit(`${uhoh[ono]} how did \*that\* get in there?!? 😱`); break;
            default: order.edit(`${yums[yum]}`); break;
          }
        } catch {
          let ono = getRandomInt(0, uhoh.length-1);
          order.edit(`${uhoh[ono]} the ice cream machine broke down! 😱`);
        }
    });
  }
};

exports.help = {
  "name": "icecream",
  "aliases": ["gelato", "froyo", "ice-cream", "frozenyogurt", "shavedice"],
  "description": "Makes some lovely ice cream.",
  "usage": `${process.env.prefix}icecream`,
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
