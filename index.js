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
  if(process.env.exp === "1") {
    // Debug/test status
    client.user.setStatus("idle");
    client.user.setActivity(`L375 code. / ${process.env.prefix}info`, { type: "WATCHING"});
  } else {
    // Normal status
    client.user.setStatus("online");
    client.user.setActivity(`with Discord! / ${process.env.prefix}info`);
  }
});

client.on('message', message => {

  // Filters out messages that don't begin with Gyromina's prefix, as well as messages sent by bots.
  if (!message.content.startsWith(process.env.prefix) 
    || message.author.bot) return;
  
  var args;

  // Splits arguments: with spaces included if the command is "prove", normally otherwise
  if (message.content.startsWith(process.env.prefix + "prove")) {
    args = message.content.slice(process.env.prefix.length).split(" ");
  } else {
    args = message.content.slice(process.env.prefix.length).split(/ +/);
  }
  
  //const args = message.content.slice(process.env.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  // Checks if the command exists. If not, returns.
  if(!command) return;

  // Checks if the command is unstable. If so, displays a warning instead of running the command.
  if(process.env.exp === "0" && command.help.wip === 1) {
    const warning2 = client.emojis.get("493570621599383552");
    const nope = client.emojis.get("493575012276633610");

    if(message.author.id === process.env.ownerID) {
      message.channel.send(`${nope} The \`${commandName}\` command is currently unavailable.\n\n${warning2} Please enable **experimental mode** to run it.`);
    } else {
      message.channel.send(`${nope} The \`${commandName}\` command is currently unavailable.`);
    }
} else { 
    try {
      command.run.execute(message, args, client);
    }
    catch (error) {
      // Logs the error & sends it to the bot owner
      console.error(error);
      console.log('- - - - - - - - - - -');
      const user = client.users.get(process.env.ownerID);
      user.send(error);
      
      // Gets the 'gyrominaWarning' emoji
      const warning = client.emojis.get("493570621599383552");
      // Sends a warning message in the channel
      message.channel.send(`${warning} Something went wrong...`);
    }
  }
});

// Warns when there is a warning with a bot
client.on("warn", w => console.warn(w));

// Logs into Discord with Gyromina's token
client.login(process.env.token);
