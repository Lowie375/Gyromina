import { Client } from 'discord.js';
import { getEmoji, GyrominaEmoji } from '../system/emoji';
import { getRandomInt, respond, genRejectEmbed } from '../system/globalFunctions';
import { Caller } from './command';
import { EmbedCol, resolveEmbedCol } from './style';

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
    output += genChars[modi];
    num -= modi * Math.pow(mul, factor);
    factor--;
  }
  return output;
}

/** Generates a Gyromina error reference code
 * @return Reference code
 */
export function createRefcode(): string {
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

/** Generates and logs an error message
 * @param {D.Message} message The Discord message object
 * @param {D.Client} client The Discord client object
 * @param {Error} error The error thrown
 */
export function logError(message: Caller, client: Client, error: Error): void {
  // Emoji setup
  const warning = getEmoji(message, GyrominaEmoji.Warning);

  // Generates a reference code
  const newRef = createRefcode();
  // Logs the error
  console.error(`REFCODE: ${newRef}\n`, error);

  // Sends a rejection embed with the reference code in the channel
  const embed = genRejectEmbed(message, "Something went wrong…", `Found a bug? Report it [here](https://github.com/Lowie375/Gyromina/issues).\nReference code: \`${newRef}\``, {col: resolveEmbedCol(EmbedCol.Error), e: warning});
  respond({embeds: [embed]}, [message, message], {reply: true, eph: true});
  
  // Sends the error to the Gyromina log channel
  const log = client.channels.cache.get(process.env.errorLog);
  log.send(`REFCODE: \`${newRef}\`\n\`\`\`js${error.stack}\`\`\``);
}

/** Generates and logs a warning message
 * @param {D.Client} client The Discord client object
 * @param {Error} w The warning thrown
 */
export function logWarning(client: Client, w: Error) {
  // Sends the warning to the Gyromina log channel
  const log = client.channels.cache.get(process.env.errorLog);
  log.send(`WARNING\n\`\`\`js${w.stack}\`\`\``);
}
