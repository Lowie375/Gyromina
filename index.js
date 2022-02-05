const D = require('discord.js'); // discord.js
const fs = require('fs'); // fs
const H = require('heroku-client'); // Heroku client
const colors = require('colors'); // colors
const package = require('./package.json'); // package file
const e = require('./system/emojis.json'); // emoji file
 // deploy functions
const {localDeploy, globalDeploy} = require('./system/deploy.js');
 // permission checker, RNG, emoji puller
const {p, getRandomInt, getEmoji, s} = require('./system/globalFunctions.js');
 // status array
const {statBlock, seasonalStatBlock} = require('./system/globalArrays.js');
 // refcode generators
const {genErrorMsg, genWarningMsg} = require('./system/refcodes.js');

// Splitter exception regex
const excX = /^prove/i;

// Console colour theme
colors.setTheme({
  main: "brightCyan",
});

// Creates a new instance of the Discord Client
const client = new D.Client({
  intents: [D.Intents.FLAGS.GUILDS, D.Intents.FLAGS.GUILD_MESSAGES, D.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, D.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, D.Intents.FLAGS.DIRECT_MESSAGES, D.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
  partials: ['CHANNEL']
});
// Creates command + game collections
client.commands = new D.Collection();
client.games = new D.Collection();

// Pulls out the command and game files
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js')).sort();
const gameFiles = fs.readdirSync('./games').filter(f => f.endsWith('.js')).sort();

// Collects a list of all commands and games
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.help.name, command);
}
for (const file of gameFiles) {
  const game = require(`./games/${file}`);
  client.games.set(game.label.name, game);
}

// Pulls Heroku data on launch
const hData = new H({token: process.env.herokuAuth})

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', async () => {

  console.log(colors.main(`Logging in as ${client.user.tag}...`));
  // Event logger
  const eventLog = client.channels.cache.get(process.env.eventLog);
  eventLog.send(`Logging in as ${client.user.tag}...`);

  // Fetch Heroku data
  await hData.get(`/apps/${process.env.herokuID}`)
    .then(app => {
      client.herokuRel = Date.parse(app.released_at);
      console.log(colors.main(`Heroku release time (${client.herokuRel}) successfully logged!`))
      eventLog.send("Heroku release time successfully logged!");
  }).catch(err => {
      // API pull unsuccessful
      console.error("Heroku API pull unsuccessful -", err.stack)
      eventLog.send("Heroku API pull unsuccessful.");
      client.herokuRel = false;
  })

  // Sets Gyromina's current status + deploys commands
  if(process.env.exp === "1") {
    // Debug/test status
    client.user.setStatus("idle");
    let fullBlock = statBlock[1].concat(seasonalStatBlock[s()]);
    client.user.setActivity(`${fullBlock[getRandomInt(0, fullBlock.length-1)]} - ${process.env.prefix}vt - v${package.version}`);
    // Deploys slash commands locally (to test guild)
    await localDeploy(client).then(res => {
      if(!res) {
        console.log(colors.main(`Local slash command deployment complete!`));
        eventLog.send(`Local slash command deployment complete!`);
      } else {
        console.error(`Local slash command deployment failed.`);
        eventLog.send(`Local slash command deployment failed.`);
      }
    });
  } else {
    // Normal status
    client.user.setStatus("online");
    let fullBlock = statBlock[0].concat(seasonalStatBlock[s()], statBlock[2]);
    client.user.setActivity(`${fullBlock[getRandomInt(0, fullBlock.length-1)]} - ${process.env.prefix}help - v${package.version}`);
    // Checks slash command deployment method
    if(process.env.exp !== "0") {
      // Deploys slash commands locally (to test guild)
      await localDeploy(client).then(res => {
        if(!res) {
          console.log(colors.main(`Local slash command deployment complete!`));
          eventLog.send(`Local slash command deployment complete!`);
        } else {
          console.error(`Local slash command deployment failed.`);
          eventLog.send(`Local slash command deployment failed.`);
        }
      });
    } else if(!client.herokuRel || client.readyAt - client.herokuRel <= 43200000) {
      // Deploys slash commands globally (if within 12h of last Gyromina deploy)
      await globalDeploy(client).then(res => {
        if(!res) {
          console.log(colors.main(`Global slash command deployment requested, commands should be deployed within the hour.`));
          eventLog.send(`Global slash command deployment requested, commands should be deployed within the hour.`);
        } else {
          console.error(`Global slash command deployment failed.`);
          eventLog.send(`Global slash command deployment failed.`);
        }
      });
    }
  }
  // Logs launch completion
  console.log(colors.main(`Launch complete, ready for action!\n- - - - - - - - - - -`));
  eventLog.send("Launch complete, ready for action!")
});

client.on('messageCreate', message => {
  // Filters out messages that don't begin with Gyromina's prefix, as well as messages sent by bots
  if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

  // Checks if the message was sent in a non-voice guild channel where Gyromina has message-sending and channel-viewing permissions. If not, returns
  if (message.channel.type != "DM" && !message.channel.isVoice() && !p(message, [D.Permissions.FLAGS.SEND_MESSAGES, D.Permissions.FLAGS.VIEW_CHANNEL, D.Permissions.FLAGS.READ_MESSAGE_HISTORY])) return;
  // Checks if the message was sent in a thread that Gyromina can't send messages in. If so, returns
  if (message.channel.isThread() && !p(message, [D.Permissions.FLAGS.SEND_MESSAGES_IN_THREADS])) return;

  // Initializes arguments
  var args;

  // Splits arguments: with spaces included if the command matches the exception regex, normally otherwise
  if (excX.test(message.content.slice(process.env.prefix.length))) {
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

  // Run prep
  message.gyrType = "msg"; // notes that this was triggered by a command message

  // Checks if the command is experimental/unstable. If so, displays a warning instead of running the command
  if(process.env.exp !== "1" && command.help.wip) {
    if(message.author.id === process.env.hostID) {
      message.reply(`${getEmoji(message, e.nope, e.alt.nope)} The \`${commandName}\` command is currently unavailable.\n${getEmoji(message, e.warn, e.alt.warn)} Please enable **experimental mode** to run it.`);
    } else {
      message.reply(`${getEmoji(message, e.nope, e.alt.nope)} The \`${commandName}\` command is currently unavailable.`);
    }
  } else {
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

client.on('interactionCreate', async interact => {
  // handle the interaction, begin implementing some alternate code for things?
  if (interact.isCommand()) { // slash command
    // Searches for the command
    const commandName = interact.commandName;
    const command = client.commands.get(commandName)
      || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

    // Checks if the command exists. If not, returns
    if(!command) return;
    // Checks if the command is interaction-enabled. If not, returns
    if(!command.help.s) return;

    // Run prep
    interact.gyrType = "slash"; // notes that this was triggered by a slash command interaction
    interact.author = interact.user // for consistency w/ the "message" object

    if(process.env.exp !== "1" && (command.help.wip || command.help.s.wip)) {
      if(interact.user.id === process.env.hostID) {
        await interact.reply({content: `${getEmoji(interact, e.nope, e.alt.nope)} The \`${commandName}\` command is currently unavailable.\n${getEmoji(interact, e.warn, e.alt.nope)} Please enable **experimental mode** to run it.`, ephemeral: true});
      } else {
        await interact.reply({content: `${getEmoji(interact, e.nope, e.alt.nope)} The \`${commandName}\` command is currently unavailable.`, ephemeral: true});
      }
    } else {
      // Pulls arguments
      var args = command.run.slashArgs(interact);
      // Prepares arguments
      if (excX.test(interact.commandName) && args.length !== 0)
        args = args.split(" ");
      else if(args.length !== 0)
        args = args.split(/ +/);
      else
        args = [];

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
  console.warn(w);
});

// Emits uncaught promise rejection warnings
process.on('unhandledRejection', error => {
  genWarningMsg(client, error);
  console.error('Promise Rejection -', error.stack)
});

// Logs into Discord with Gyromina's token
client.login(process.env.token);
