// Require discord.js and fs
const Discord = require('discord.js');
const fs = require('fs');

// Creates a new instance of the Discord Client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Pulls out the command files
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.help.name, command);
}

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!\n- - - - - - - - - - -`);

  // Sets Gyromina's current status
  client.user.setStatus("online");
  client.user.setActivity(`with Discord! / ${process.env.prefix}info`);

  // Degub/test phase status
  //client.user.setStatus("idle");
  //client.user.setActivity(`L375 struggle. / ${process.env.prefix}info`, { type: "WATCHING"});
});

client.on('message', message => {

  // Filters out messages that don't begin with Gyromina's prefix, as well as messages sent by bots.
  if (!message.content.startsWith(process.env.prefix) 
    || message.author.bot) return;
  
  /*var splitter;
  
  if (message.content.startsWith(process.env.prefix + "prove")) {
    splitter = " \";
  } else {
    splitter = / +/;
  }
  
  const args = message.content.slice(process.env.prefix.length).split(splitter);*/
  
  const args = message.content.slice(process.env.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  if (!command) return;

  try {
      command.execute(message, args, client);
  }
  catch (error) {
      console.error(error);
      console.log('- - - - - - - - - - -');
      // Gets the 'gyrominaWarning' emoji
      const warning = client.emojis.get("493570621599383552");
      message.reply(`\n${warning} Something went wrong...`);
  }
});

// Warns when there is a warning with a bot
client.on("warn", w => console.warn(w));

// Logs into Discord with Gyromina's token
client.login(process.env.token);
