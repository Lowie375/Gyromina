// Require colors and the emoji regex
const color = require('colors');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();

// UTIL

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

/**
 * Generates a random integer.
 * @param min The minimum value that can be generated
 * @param max The maximumn value that can be generated
 * @return {number}
 */

exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let output = Math.floor(Math.random() * (max - min + 1)) + min
  if (output > max) output = max;
  return output;
};

/**
 * Checks whether an emoji is part of the unicode set, a custom Discord emoji, or not an emoji at all.
 * @param e The emoji to check
 * @return {Array<string>}
 */

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
    let pEmojiID = e[0].split("<")[1]
    if (!pEmojiID)
      return ["n", "null"]; // Not an emoji

    let qEmojiID = pEmojiID.split(":");
    let junk = e[0].split("<")[0].length;
    if (!qEmojiID[2] || !e[0].slice(junk).startsWith("<") || qEmojiID[2].slice(-1) != ">")
      return ["n", "null"]; // Not an emoji

    return ["c", qEmojiID[2].slice(0, -1)];
  }
};

// COLOUR

/**
 * Converts a hexadecimal colour code to RGB format
 * @param {string} hex The hexadecimal colour code (preceded by a #)
 * @return {JSON<number>}
 */

exports.hexToRgb = function(hex) { 
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts an RGB colour code to hexadecimal format
 * @param rgb The RGB colour object
 * @return {String}
 */

exports.rgbToHex = function(rgb) { 
  return `${rgb.r.toString(16)}${rgb.g.toString(16)}${rgb.b.toString(16)}`;
}

/**
 * Converts a CMYK colour code to RGB format
 * @param cmyk The CMYK colour object
 * @return {JSON<number>}
 */

exports.cmykToRgb = function(cmyk) {
  let d = [cmyk.c/100, cmyk.m/100, cmyk.y/100, cmyk.k/100];

  let c = Math.min(1, d[0] * (1 - d[3]) + d[3]);
  let m = Math.min(1, d[1] * (1 - d[3]) + d[3]);
  let y = Math.min(1, d[2] * (1 - d[3]) + d[3]);

  return {
    r: Math.round((1 - c) * 255),
    g: Math.round((1 - m) * 255),
    b: Math.round((1 - y) * 255),
  };
}

/**
 * Converts an RGB colour code to CMYK format
 * @param rgb The RGB colour object
 * @return {JSON<number>}
 */

exports.rgbToCmyk = function(rgb) {
  let c = (255 - rgb.r) / 255;
  let m = (255 - rgb.g) / 255;
  let y = (255 - rgb.b) / 255;

  let k = Math.min(c, m, y);

  return {
    c: Math.round((c - k) / (1 - k) * 100),
    m: Math.round((m - k) / (1 - k) * 100),
    y: Math.round((y - k) / (1 - k) * 100),
    k: Math.round(k * 100)
  };
}

/**
 * Converts a hexidecimal colour code to a colour integer
 * @param {String} hex The hexadecimal colour code (raw; no #)
 * @return {Number}
 */

exports.hexToInt = function(hex) {
  return parseInt(parseInt(hex, 16).toString(10));
}

/**
 * Converts a colour integer to a hexidecimal colour code
 * @param {Number} int The colour integer
 * @return {String}
 */

exports.intToHex = function(int) {
  let res = int.toString(16)
  while (res.length < 6) {
    res = "0".concat(res);
  }
  return res;
}

/**
 * Constrains a number between a minimum and a maximum value
 * @param {Number} x The number to constrain
 * @param {Number} min The minimum
 * @param {Number} max The maximum
 * @return {Number}
 */

exports.minMax = function(n, min, max) {
  return Math.max(min, Math.min(max, n));
}