// Require the respond function
const {respond} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Pings the channel by sending a message
    let start = Date.now();
    respond('Ponging…? 🏓', message, {type: message.gyrType})
      .then(newMsg => {
        let end = Date.now();
        // Edits the message to include Gyromina's latency and Discord's latency.
        respond(`Ping? 🏓\nLatency: \`${end - start}msec\` / Discord: \`${client.ws.ping}msec\``, newMsg, {type: message.gyrType, edit: true})
        //newMsg.edit();
      });
  },
  slashArgs(interact) {
    // template: no args
    return [];
  },
};
  
exports.help = {
  "name": "pong",
  "description": `Pongs Gyromina. (Functions similarly to ${process.env.prefix}ping)`,
  "usage": `${process.env.prefix}pong`,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "name": "pong",
    "description": "Pongs Gyromina",
    "wip": true
  }
};
