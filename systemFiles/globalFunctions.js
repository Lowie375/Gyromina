// Require colors, the emoji regex, and the style file
const color = require('colors');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
const style = require('../systemFiles/style.json');

// UTIL

/**
 * Writes to the console with time when it was ran
 * @author Nao (naoei)
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
 * @author Nao (naoei)
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

/**
 * Constrains a number between a minimum and a maximum value
 * @param {Number} n The number to constrain
 * @param {Number} min The minimum
 * @param {Number} max The maximum
 * @return {Number}
 */

exports.minMax = function(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Checks whether Gyromina has a certain permission in the channel a message was sent in
 * @param message The message object
 * @param perm An array containing the permissions to check for
 * @return {Boolean}
 */

exports.p = function(message, perm) {
  if (message.channel.type == "DM" || message.channel.isVoice()) {
    return true;
  } else {
    let gPerm = message.channel.permissionsFor(message.guild.me);
    if (perm && gPerm.has(perm))
      return true;
    else
      return false;
  }
}
/**
 * Creates a custom date timestamp for embed usage
 * @return {String}
 */

exports.stamp = function() {
  let dt = new Date();
  let now = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth()+1, dt.getUTCFullYear()];
  for(let i = 0; i <= 4; i++) {
    if(now[i].toString().length <= 1)
      now[i] = `0${now[i]}`;
  }
  return `${now[5]}/${now[4]}/${now[3]} @ ${now[2]}:${now[1]}:${now[0]} UTC`;
}

// STYLE

/**
 * Checks whether an embed's colour should be changed due to the current season
 * @param def The standard colour for the embed in question
 * @return {String}
 */

exports.eCol = function(def) {
  let dt = new Date();
  let now = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth(), dt.getUTCFullYear()];
  if(now[4] == 5 || process.env.season === "1") { // June: rainbow randomizer
    let col = Math.min(Math.floor(Math.random() * 193) + 63, 255);
    let pos = [Math.min(Math.floor(Math.random()*3), 2), Math.min(Math.floor(Math.random()*2), 1)];
    if(pos[1] === 0) { // 255 before 63
      switch(pos[0]) {
        case 0: return `${col.toString(16)}ff3f`;
        case 1: return `ff${col.toString(16)}3f`;
        case 2: return `ff3f${col.toString(16)}`;
        default: return def; // fallback
      }
    } else if(pos[1] === 1) { // 63 before 255
      switch(pos[0]) {
        case 0: return `${col.toString(16)}3fff`;
        case 1: return `3f${col.toString(16)}ff`;
        case 2: return `3fff${col.toString(16)}`;
        default: return def; // fallback
      }
    } else { // fallback: default to standard
      return def;
    }
  } else if(now[4] == 11 || process.env.season === "2") { // December: blue theme
    return style.e.winter; // subject to change
  } else if((now[4] == 4 && now[3] >= 9 && now[3] <= 15) || process.env.season === "3") { // May 13th-ish: blurple theme
    return style.e.blurple; // subject to change
  } else { // Default
    return def;
  }
}

/**
 * Checks whether an avatar should be changed due to the current season
 * @param cdn The CDN constant
 * @return {String}
 */

exports.avCol = function(cdn) {
  let dt = new Date();
  let now = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth(), dt.getUTCFullYear()];
  if(now[4] == 5 || process.env.season === "1") // June: rainbow
    return cdn.avatar.pride;
  else if(now[4] == 11 || process.env.season === "2") // December: blue theme
    return cdn.avatar.winter;
  else if((now[4] == 4 && now[3] >= 9 && now[3] <= 15) || process.env.season === "3") // May 13th-ish: blurple theme
    return cdn.avatar.blurple;
  else // Default
    return cdn.avatar.default;
}

// COLOUR

/**
 * Converts a hexadecimal colour code to RGB format
 * @author Irisu (irisuwastaken)
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
  let hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
  return `${hex[0].length > 1 ? hex[0] : `0${hex[0]}`}${hex[1].length > 1 ? hex[1] : `0${hex[1]}`}${hex[2].length > 1 ? hex[2] : `0${hex[2]}`}`;
}

/**
 * Converts a CMYK colour code to RGB format
 * @param cmyk The CMYK colour object
 * @return {JSON<number>}
 */

exports.cmykToRgb = function(cmyk) {
  let div = [cmyk.c/100, cmyk.m/100, cmyk.y/100, cmyk.k/100];

  let c = Math.min(1, div[0] * (1 - div[3]) + div[3]);
  let m = Math.min(1, div[1] * (1 - div[3]) + div[3]);
  let y = Math.min(1, div[2] * (1 - div[3]) + div[3]);

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

  switch((1-k)*100) {
    case 0: {
      return {
        c: 0, m: 0, y: 0, k: 100
      };
    }
    default: {
      return {
        c: Math.round((c - k) / (1 - k) * 100),
        m: Math.round((m - k) / (1 - k) * 100),
        y: Math.round((y - k) / (1 - k) * 100),
        k: Math.round(k * 100)
      };
    }
  }
}

/**
 * Converts a hexadecimal colour code to a colour integer
 * @param {String} hex The hexadecimal colour code (raw; no #)
 * @return {Number}
 */

exports.hexToInt = function(hex) {
  return parseInt(parseInt(hex, 16).toString(10));
}

/**
 * Converts a colour integer to a hexadecimal colour code
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

// TEMPERATURE

/**
 * Converts a temperature in degrees Fahrenheit to degrees Celcius
 * @param {Number} F The temperature, in degrees Fahrenheit
 * @return {Number}
 */

exports.FtoC = function(F) {
  return (F - 32) * 5/9;
}

/**
 * Converts a temperature in degrees Celcius to degrees Fahrenheit
 * @param {Number} C The temperature, in degrees Celcius
 * @return {Number}
 */

exports.CtoF = function(C) {
  return C * 9/5 + 32;
}

/**
 * Converts a temperature in degrees Celcius to Kelvins
 * @param {Number} C The temperature, in degrees Celcius
 * @return {Number}
 */

exports.CtoK = function(C) {
  return C + 273.15;
}

/**
 * Converts a temperature in Kelvins to degrees Celcius
 * @param {Number} K The temperature, in Kelvins
 * @return {Number}
 */

exports.KtoC = function(K) {
  return K - 273.15;
}

/**
 * Converts a temperature in degrees Fahrenheit to degrees Rankine
 * @param {Number} K The temperature, in degrees Fahrenheit
 * @return {Number}
 */

exports.FtoR = function(F) {
  return F + 459.67;
}

/**
 * Converts a temperature in degrees Rankine to degrees Fahrenheit
 * @param {Number} K The temperature, in degrees Rankine
 * @return {Number}
 */

exports.RtoF = function(R) {
  return R - 459.67;
}
