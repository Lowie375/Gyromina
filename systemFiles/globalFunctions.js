// Require colors and the emoji regex
const color = require('colors');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();

/**
 * Writes to the console with time when it was ran
 * @param message
 * @param startTime
 * @param useLocale
 */

exports.Write = function(message, startTime = null, useLocale = true) {
  let currentTime = Date.now() - startTime;
  let body = "";

  if (!useLocale && currentTime > 0) {
    body = currentTime.toString().padEnd(8).green + message;
  } else if (useLocale) {
    let time = new Date(Date.now()).toLocaleTimeString();
    body = time.padEnd(12).green + message;
  } else body = message;

  console.log(body)
};

/**
 * Clears out any @Everyone's.
 * @return {string}
 */

exports.Clean = function(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203).replace(/@/g, "@" + String.fromCharCode(8203)))
  else
    return text;
};

exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.emojiCheck = function(e) {
  let match;
  let save = [];
  while (match = regex.exec(e)) {
    save.push(match[0]);
  }
  if(save.length != 0) {
    // Unicode emoji found!
    return ["u", save[0]];
  } else {
    // Discord custom emoji (or random string), checks for proper custom emoji formatting
    let pEmojiID = e.split("<")[1]
    if (!pEmojiID)
      return ["n", "null"]; // Not an emoji

    let qEmojiID = pEmojiID.split(":");
    let junk = e.split("<")[0].length;
    if (!qEmojiID[2] || !e.slice(junk).startsWith("<") || qEmojiID[2].slice(-1) != ">")
      return ["n", "null"]; // Not an emoji

    return ["c", qEmojiID[2].slice(0, -1)];
  }
};