// Require discord.js, fs, and the config file
const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token, ownerID } = require('./config.json');

// Creates a new instance of the Discord Client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Pulls out the command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!\n- - - - - - - - - - -`);
  client.user.setActivity(`with Discord! / ${prefix}info`);

  // Sets Gyromina's current status
  client.user.setStatus("online");
});

client.on('message', message => {

  // Filters out messages that don't begin with Gyromina's prefix, as well as messages sent by bots.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
      command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      console.log('- - - - - - - - - - -');
      // Gets the 'gyrominaWarning' emoji
      const warning = client.emojis.get("493570621599383552");
      message.reply(`\n${warning} Something went wrong...`);
  }
});

client.on("warn", (warn) => console.warn(e));

// Logs into Discord with Gyromina's token
client.login(token);
