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

// Declares CBX characters for future use
const genChars = ["0", "1", "2", "3", "5", "8", "l", "@", "w", "n", "?", "x", "-", "i", "!", "y", "h", "%", "t", "q", "j", "s", "r", "#", "k", ":", "&", "f", "m", "z", "e", "u"];

// Basic RNG
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
// Custom decimal converter
function toCBX(num, mul) {
  var factor = 1;
  var output = "";

  // Auto-determines necessary factors
  while((num/mul) > Math.pow(mul, factor)) {
    factor++;
  }

  while(factor >= 0) {
    var modi = Math.floor(num / Math.pow(mul, factor));
    if(output != "") {
      output = output + genChars[modi];
    } else {
      output = genChars[modi];
    }
    num -= modi*Math.pow(mul, factor);
    factor--;
  }
  return output;
}
// Reference code generator
function genRefCode() {
  const d = new Date();
  var yr = d.getUTCFullYear();
  var mn = d.getUTCMonth()+1;
  var dy = d.getUTCDay();
  var time = d.getUTCHours()*10000 + d.getUTCMinutes()*100 + d.getUTCSeconds() + 10101;
  var inte1 = getRandomInt(1024, 32768);
  var inte2 = getRandomInt(32, 1024);
  // Debug snippet
  //console.log(`yr: ${yr}, mn: ${mn}, dy: ${dy}, time: ${time}, inte1: ${inte1}, inte2: ${inte2}`);

  var rCode = toCBX(inte1, 32) + toCBX(dy, 32) + toCBX(mn, 32) + toCBX(inte2, 32) + toCBX(time, 32) + toCBX(yr, 32);
  return rCode;
}

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!\n- - - - - - - - - - -`);

  // Sets Gyromina's current status
  if(process.env.exp === "1") {
    // Debug/test status
    client.user.setStatus("idle");
    client.user.setActivity(`L375 code. / ${process.env.prefix}help`, { type: "WATCHING"});
  } else {
    // Normal status
    client.user.setStatus("online");
    client.user.setActivity(`with Discord! / ${process.env.prefix}help`);
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
      // Logs the error
      console.error(error);

      // Gets the 'gyrominaWarning' emoji
      const warning = client.emojis.get("493570621599383552");
      // Generates a reference code
      const newRef = genRefCode();
      console.log(`REFCODE: ${newRef}\n- - - - - - - - - - -`);

      // Sends a warning message in the channel
      const embed3 = new Discord.RichEmbed()
        .setTitle(warning + " Something went wrong...")
        .setColor(0xffcc4d)
        .setDescription("\• Found a bug? Report it [here](https://github.com/Lowie375/Gyromina/issues).\n\• Reference code: \`" + newRef + "\`");
      message.channel.send(embed3);

      // Sends the error to the bot owner
      let xcl = message.channel.client;
      const L3 = xcl.fetchUser(process.env.ownerID)
      .then(L3 => {
        L3.send(`REFCODE: \`${newRef}\` \n\`\`\`js${error.stack}\`\`\``);
      });
    }
  }
});

// Warns when there is a warning with a bot
client.on("warn", w => console.warn(w));

// Logs into Discord with Gyromina's token
client.login(process.env.token);
