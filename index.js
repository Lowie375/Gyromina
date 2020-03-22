// Require discord.js, fs, package.json, and the refcode generator
const Discord = require('discord.js');
const fs = require('fs');
const refcode = require("./systemFiles/refcodes.js");
const package = require('./package.json');

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
    client.user.setActivity(`L375 code / ${process.env.prefix}help / ${package.version}`, { type: "WATCHING"});
  } else {
    // Normal status
    client.user.setStatus("online");
    client.user.setActivity(`with Discord! / ${process.env.prefix}help / ${package.version}`);
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
  
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  // Checks if the command exists. If not, returns.
  if(!command) return;

  // Checks if the command is unstable. If so, displays a warning instead of running the command.
  if(process.env.exp === "0" && command.help.wip === 1) {
    const warning2 = client.emojis.get("618198843301036032");
    const nope = client.emojis.get("618199093520498789");

    if(message.author.id === package.authorID) {
      message.channel.send(`${nope} The \`${commandName}\` command is currently unavailable.\n\n${warning2} Please enable **experimental mode** to run it.`);
    } else {
      message.channel.send(`${nope} The \`${commandName}\` command is currently unavailable.`);
    }
} else { 
    try {
      command.run.execute(message, args, client);
    }
    catch (error) {
      // Generates an error message & logs the error
      refcode.genErrorMsg(message, error);
      console.error(error);
    }
  }
});

// Warns when there is a warning with a bot
client.on("warn", w => console.warn(w));

// Logs into Discord with Gyromina's token
client.login(process.env.token);
