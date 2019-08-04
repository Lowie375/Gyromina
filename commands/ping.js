module.exports.run = {
  execute(message, args) {
    // Pings the channel by sending a message
    let start = Date.now();
    message.channel.send('Pinging... 🏓')
      .then(newMsg => {
        let end = Date.now();
        // Edits the message to include Gyromina's latency and Discord's latency.
        newMsg.edit(`Pong! 🏓\nLatency: \`${end - start}ms\`, Discord: \`${message.client.ping}ms\``);
      });
  },
};

module.exports.help = {
  "name": 'ping',
  "description": 'Pings Gyromina.',
  "usage": `${process.env.prefix}ping`,
  "hide": 0,
  "wip": 0
};
