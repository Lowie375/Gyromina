// Require discord.js, fs, colors, the package file, the emoji file, the permission checker, and the refcode generator
const D = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const package = require('./package.json');
const e = require('./systemFiles/emojis.json');
const {p} = require('./systemFiles/globalFunctions.js');
const {genErrorMsg, genWarningMsg} = require('./systemFiles/refcodes.js');

// Console colour theme
colors.setTheme({
  main: "brightCyan",
  nope: "brightRed",
});

// Creates a new instance of the Discord Client
const client = new D.Client({intents: [D.Intents.FLAGS.GUILDS, D.Intents.FLAGS.GUILD_MESSAGES, D.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, D.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, D.Intents.FLAGS.DIRECT_MESSAGES, D.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});
client.commands = new D.Collection();
client.games = new D.Collection();

// Pulls out the command and game files
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
const gameFiles = fs.readdirSync('./gameFiles').filter(f => f.endsWith('.js'));

// Declares emojis
var nope, warning;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.help.name, command);
}
for (const file of gameFiles) {
  const game = require(`./gameFiles/${file}`);
  client.games.set(game.label.name, game);
}

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!\n- - - - - - - - - - -`.main);
  // Event logger
  const eventLog = client.channels.cache.get(process.env.eventLog);
  eventLog.send(`Logged in as ${client.user.tag}, ready for action!`);

  // Sets Gyromina's current status
  if(process.env.exp === "1") {
    // Debug/test status
    client.user.setStatus("idle");
    client.user.setActivity(`with the debugger! / ${process.env.prefix}vt / v${package.version}`);
  } else {
    // Normal status
    client.user.setStatus("online");
    client.user.setActivity(`with threads! / ${process.env.prefix}help / v${package.version}`);
  }

  // Emoji setup
  nope = client.emojis.cache.get(e.nope);
  warning = client.emojis.cache.get(e.warn);
});

client.on('messageCreate', message => {
  // Filters out messages that don't begin with Gyromina's prefix, as well as messages sent by bots
  if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

  // Checks if the message was sent in a non-voice guild channel where Gyromina has message-sending and channel-viewing permissions. If not, returns
  if (message.channel.type != "DM" && !message.channel.isVoice() && !p(message, [D.Permissions.FLAGS.SEND_MESSAGES, D.Permissions.FLAGS.VIEW_CHANNEL, D.Permissions.FLAGS.READ_MESSAGE_HISTORY])) return;

  // Initializes arguments
  var args;

  // Splits arguments: with spaces included if the command is "prove", normally otherwise
  if (message.content.startsWith(`${process.env.prefix}prove`)) {
    args = message.content.slice(process.env.prefix.length).split(" ");
  } else {
    args = message.content.slice(process.env.prefix.length).split(/ +/);
  }
  
  // Searches for the command
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  // Checks if the command exists. If not, returns
  if(!command) return;

  // Checks if the command is experimental/unstable. If so, displays a warning instead of running the command
  if(process.env.exp === "0" && command.help.wip === 1) {
    if(message.author.id === process.env.hostID) {
      message.reply(`${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? nope : e.alt.nope} The \`${commandName}\` command is currently unavailable.\n${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? warning : e.alt.warn} Please enable **experimental mode** to run it.`);
    } else {
      message.reply(`${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? nope : e.alt.nope} The \`${commandName}\` command is currently unavailable.`);
    }
  } else {
    // Final prep before running
    message.gyrType = "msg"; // notes that this was triggered by a command message

    try {
      command.run.execute(message, args, client);
      // 'message' = message or interaction object (outdated name is for consistency)
    }
    catch (error) {
      // Generates an error message & logs the error
      genErrorMsg(message, client, error);
    }
  }
});

// todo: add interaction pickup snippet
client.on('interactionCreate', async interact => {
  // handle the interaction, begin implementing some alternate code for things?
  if (interact.isCommand()) { // slash command
    console.log(interact);

    // Searches for the command
    const commandName = interact.commandName;
    const command = client.commands.get(commandName)
      || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

    // Checks if the command exists. If not, returns
    if(!command) return;
    // Checks if the command is interaction-enabled. If not, returns
    if(!command.help.s) return;

    if(process.env.exp === "0" && (command.help.wip === 1 || command.help.s.wip === true)) {
      if(interact.user.id === process.env.hostID) {
        await interact.reply({content: `${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? nope : e.alt.nope} The \`${commandName}\` command is currently unavailable.\n${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? warning : e.alt.warn} Please enable **experimental mode** to run it.`, ephemeral: true});
      } else {
        await interact.reply({content: `${p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? nope : e.alt.nope} The \`${commandName}\` command is currently unavailable.`, ephemeral: true});
      }
    } else {
      // Pulls arguments (will likely integrate into individual commands as command.run.slashArgs() due to slash command framework)
      var args = command.run.slashArgs(interact);  
      // will also need to run tests on ping/pong haha

      // Final prep before running
      interact.gyrType = "interact"; // notes that this was triggered by a slash command interaction
      interact.author = interact.user // for consistency w/ the "message" object

      try {
        command.run.execute(interact, args, client);
        // 'message' = message or interaction object (outdated name is for consistency)
      }
      catch (error) {
        // Generates an error message & logs the error
        genErrorMsg(interact, client, error);
      }
    }
  } else { // component interaction
    return;
  }
});

// Catches emitted warnings
client.on('warn', w => {
  // Generates a warning message & logs the warning
  genWarningMsg(client, w);
  console.warn(w.nope);
});

// Emits uncaught promise rejection warnings
process.on('unhandledRejection', error => {
  genWarningMsg(client, error);
  console.error('Promise Rejection -'.nope, error)
});

// Logs into Discord with Gyromina's token
client.login(process.env.token);
