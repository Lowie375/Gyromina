module.exports = {

  name: 'ping',
  description: 'Pings Gyromina.',
  execute(message, args) {
    // Pings the channel by sending a message
    let start = Date.now();
    message.channel.send('Pinging... 🏓')
      .then(function(newMsg) {
        let end = Date.now();
        // Edits the message to include Gyromina's latency and Discord's latency.
        newMsg.edit(`Pong! 🏓\nLatency: \`${end - start}ms\`, Discord: \`${message.client.ping}ms\``);
      });
  },
};
