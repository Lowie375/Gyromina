const S = require('@discordjs/builders'); // slash command builder
const {respond} = require('../systemFiles/globalFunctions.js'); // responder

exports.run = {
  execute(message, args, client) {
    // Pings the channel by sending a message
    let start = Date.now();
    respond('Pinging… 🏓', [message, message])
      .then(newMsg => {
        let end = Date.now();
        // Edits the message to include Gyromina's latency and Discord's latency.
        respond(`Pong! 🏓\nLatency: \`${end - start}msec\` / Discord: \`${client.ws.ping}msec\``, [message, newMsg], {edit: true});
      });
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};

exports.help = {
  "name": "ping",
  "description": "Pings Gyromina.",
  "usage": `${process.env.prefix}ping`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": false,
    "builder": new S.SlashCommandBuilder()
      .setName("ping")
      .setDescription("Pings Gyromina")
  }
};
