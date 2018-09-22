// Require the discord.js module & the config file
const Discord = require('discord.js');
const { prefix, token, ownerID } = require('./config.json');

// Creates a new instance of the Discord Client
const client = new Discord.Client();

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!`);
  client.user.setGame("ping-pong with Discord!");
  client.user.setStatus("online");
});

client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content === `${prefix}shutdown`) {
      if(message.author.id !== ownerID) return;

      console.log(`Shutting down ${client.user.tag}...`);
      client.user.setStatus("invisible");
      client.destroy();
  }

  if (message.content === `${prefix}ping`) {
      // sends 'Pong!' back to the channel the message was sent in.
      message.channel.send('Pong! 🏓');
      console.log(client.ping);
  }
});

// Logs into Discord with Gyromina's token
client.login(token);
