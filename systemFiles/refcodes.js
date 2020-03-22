// Require discord.js and the RNG
const Discord = require('discord.js');
const { getRandomInt } = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');

// Declares CBX characters for future use
const genChars = ["0", "1", "2", "3", "5", "8", "l", "@", "w", "n", "?", "x", "-", "i", "!", "y", "h", "%", "t", "q", "j", "s", "r", "#", "k", ":", "&", "f", "m", "z", "e", "u"];

// Custom decimal converter
function toCBX(num, mul) {
  var factor = 1;
  var output = "";
  // Auto-determines necessary factors
  while ((num / mul) > Math.pow(mul, factor)) {
    factor++;
  }
  while (factor >= 0) {
    var modi = Math.floor(num / Math.pow(mul, factor));
    if (output != "") {
      output = output + genChars[modi];
    }
    else {
      output = genChars[modi];
    }
    num -= modi * Math.pow(mul, factor);
    factor--;
  }
  return output;
}

function genCode() {
  const d = new Date();
  var yr = d.getUTCFullYear();
  var mn = d.getUTCMonth() + 1;
  var dy = d.getUTCDay();
  var time = d.getUTCHours() * 10000 + d.getUTCMinutes() * 100 + d.getUTCSeconds() + 10101;
  var inte1 = getRandomInt(1024, 32768);
  var inte2 = getRandomInt(32, 1024);
  // Debug snippet
  //console.log(`yr: ${yr}, mn: ${mn}, dy: ${dy}, time: ${time}, inte1: ${inte1}, inte2: ${inte2}`);
  var rCode = toCBX(inte1, 32) + toCBX(dy, 32) + toCBX(mn, 32) + toCBX(inte2, 32) + toCBX(time, 32) + toCBX(yr, 32);
  return rCode;
}

// Reference code generator
exports.genErrorMsg = function(message, client, error) {
  // Emoji setup
  const warning = client.emojis.get(e.warn);

  // Generates a reference code
  const newRef = genCode();
  console.log(`REFCODE: ${newRef}\n- - - - - - - - - - -`);

  // Sends a warning message in the channel
  const embed3 = new Discord.RichEmbed()
    .setTitle(warning + " Something went wrong...")
    .setColor(0xffcc4d)
    .setDescription("\• Found a bug? Report it [here](https://github.com/Lowie375/Gyromina/issues).\n\• Reference code: \`" + newRef + "\`");
  message.channel.send(embed3);
  
  // Sends the error to the Gyromina log channel
  const log = client.channels.get(process.env.errorLog);
  log.send(`REFCODE: \`${newRef}\`\n\`\`\`js${error.stack}\`\`\``);
}

// Warning generator
exports.genWarningMsg = function(message, client, w) {
  // Sends the warning to the Gyromina log channel
  const log = client.channels.get(process.env.errorLog);
  log.send(`WARNING\n\`\`\`js${w.stack}\`\`\``);
}
