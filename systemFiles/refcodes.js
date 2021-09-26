// Require discord.js, colors, the permission checker, the RNG, and the emoji + style files
const D = require('discord.js');
const colors = require('colors');
const {p, getRandomInt} = require('../systemFiles/globalFunctions.js');
const e = require('../systemFiles/emojis.json');
const style = require('../systemFiles/style.json');

// Declares CBX characters for future use
const genChars = ["0", "1", "2", "3", "5", "8", "l", "a", "w", "n", "p", "x", "-", "i", "_", "y", "h", "b", "t", "q", "j", "s", "r", "v", "k", "c", "g", "f", "m", "z", "e", "u"];

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
      output += genChars[modi];
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
  const dt = new Date();
  var yr = dt.getUTCFullYear();
  var mn = dt.getUTCMonth() + 1;
  var dy = dt.getUTCDate();
  var time = dt.getUTCHours() * 10000 + dt.getUTCMinutes() * 100 + dt.getUTCSeconds() + 10101;
  var inte1 = getRandomInt(1024, 32767);
  var inte2 = getRandomInt(32, 1023);
  var rCode = `${toCBX(inte1, 32)}${toCBX(dy, 32)}${toCBX(mn, 32)}${toCBX(inte2, 32)}${toCBX(time, 32)}${toCBX(yr, 32)}`;
  return rCode;
}

/**
 * Generates an error message
 * @param message The Discord message object
 * @param client The Discord client object
 * @param error The error thrown
 */

// Reference code generator
exports.genErrorMsg = function(message, client, error) {
  // Emoji setup
  const warning = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.warn) : e.alt.warn;

  // Generates a reference code
  const newRef = genCode();
  // Logs the error
  console.error(`REFCODE: ${newRef}\n`.nope, error);

  // Sends a warning message in the channel
  const embed = new D.MessageEmbed()
    .setTitle(`${warning} Something went wrong…`)
    .setColor(style.e.error)
    .setDescription(`Found a bug? Report it [here](https://github.com/Lowie375/Gyromina/issues).\nReference code: \`${newRef}\``);
  message.channel.send({embeds: [embed]});
  
  // Sends the error to the Gyromina log channel
  const log = client.channels.cache.get(process.env.errorLog);
  log.send(`REFCODE: \`${newRef}\`\n\`\`\`js${error.stack}\`\`\``);
}

/**
 * Generates a warning message
 * @param client The Discord client object
 * @param w The warning thrown
 */

// Warning generator
exports.genWarningMsg = function(client, w) {
  // Sends the warning to the Gyromina log channel
  const log = client.channels.cache.get(process.env.errorLog);
  log.send(`WARNING\n\`\`\`js${w.stack}\`\`\``);
}

/**
 * Generates a raw reference code (for miscellaneous use)
 * @return {string}
 */

exports.codeRNG = function() {
  return genCode();
}
