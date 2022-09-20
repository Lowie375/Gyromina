const D = require('discord.js'); // discord.js
// RNG, responder
const {getRandomInt, respond} = require('../system/globalFunctions.js');

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
  "Tasty!",
  "Perfect for a hot day!"
];
const uhoh = [
  "Hold up…",
  "Wait a minute…",
  "Uh oh…",
  "Oh no…",
  "Wait…",
  "Hold on…",
  "Yikes…"
];

exports.run = {
async execute(message, args, client) {
    // Makes the ice cream
    var crm = getRandomInt(0, icecream.length-1);
    var yum = getRandomInt(0, yums.length-1);
    
    // Sends the ice cream, yay!
    await respond("Coming right up!", [message, message], {reply: true})
      .then (async order => {
        // Prepares the order
        try {
          // "works for a small amount of time"
          message.channel.sendTyping();
          setTimeout(() => {
            // sends the icecream
            respond(`${icecream[crm]}`, [message, message], {follow: true}); //[message, order]
            let ono = getRandomInt(0, uhoh.length-1);
            switch (crm) { // Checks for special cases and edits accordingly
              case 18: respond(`${uhoh[ono]} that's cream, not \*ice\* cream! 😱`, [message, order], {edit: true}); break;
              case 19: respond(`${uhoh[ono]} that's ice, not ice \*cream\*! 😱`, [message, order], {edit: true}); break;
              case 20: respond(`${uhoh[ono]} how did \*that\* get in there?!? 😱`, [message, order], {edit: true}); break;
              default: respond(`${yums[yum]}`, [message, order], {edit: true}); break;
            }
          }, getRandomInt(250, 450));
        } catch {
          let ono = getRandomInt(0, uhoh.length-1);
          respond(`${uhoh[ono]} the ice cream machine broke down! 😱`, [message, order], {edit: true});
        }
    });
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": "icecream",
  "aliases": ["gelato", "froyo", "ice-cream", "frozenyogurt", "shavedice"],
  "description": "Makes some lovely ice cream.",
  "usage": `${process.env.prefix}icecream`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new D.SlashCommandBuilder()
      .setName("icecream")
      .setDescription("Makes some lovely ice cream")
  }
};
