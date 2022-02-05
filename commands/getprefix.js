const S = require('@discordjs/builders'); // slash command builder
const {respond, getRandomInt} = require('../system/globalFunctions.js'); // RNG, responder

const msgResp = [
  "Wait… you probably knew that already. Oh well!",
  "Hey, wait a minute…",
  "See, you used it just now!",
  "Look, I even found it in your message!"
];

exports.run = {
  execute(message, args, client) {
    var output = `My message command prefix is **\`${process.env.prefix}\`**!`;
    return respond((message.gyrType == "msg" ? `${output}\n*${msgResp[getRandomInt(0, msgResp.length-1)]}*` : output), [message, message], {reply: true, eph: true});
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": "getprefix",
  "aliases": ["prefix"],
  "description": "Gets Gyromina's message command prefix.",
  "usage": `/getprefix`,
  "default": 1,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": false,
    "builder": new S.SlashCommandBuilder()
      .setName("getprefix")
      .setDescription("Gets Gyromina's message command prefix")
  }
};
