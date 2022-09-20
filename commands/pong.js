const D = require('discord.js'); // discord.js
 // responder
const {respond} = require('../system/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Pings the channel by sending a message
    let start = Date.now();
    respond('Ponging…? 🏓', [message, message])
      .then(newMsg => {
        let end = Date.now();
        // Edits the message to include Gyromina's latency and Discord's latency.
        respond(`Ping? 🏓\nLatency: \`${end - start}msec\` / Discord: \`${client.ws.ping}msec\``, [message, newMsg], {edit: true});
      });
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};
  
exports.help = {
  "name": "pong",
  "description": `Pongs Gyromina. (Functions similarly to ${process.env.prefix}ping)`,
  "usage": `${process.env.prefix}pong`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": false,
    "builder": new D.SlashCommandBuilder()
      .setName("pong")
      .setDescription("Pongs Gyromina")
  }
};
