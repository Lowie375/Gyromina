// Require colors, the emoji regex, and the style file
const color = require('colors');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
const style = require('../systemFiles/style.json');

// UTIL

/**
 * Writes to the console with time when it was ran
 * @author Nao (naoei)
 * @param message Message to log
 * @param startTime
 * @param useLocale Whether to use the user's locale or not
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
 * @param text The text to clean
 * @return {string}
 */

exports.Clean = function(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  else
    return text;
};

/**
 * Generates a random integer.
 * @param {number} min The minimum value that can be generated
 * @param {number} max The maximum value that can be generated
 * @return {number} The random integer generated
 */

exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let output = Math.floor(Math.random() * (max - min + 1)) + min
  if (output > max) output = max;
  return output;
};

/**
 * Checks whether there are any valid emojis in a list. Returns the first emoji that is part of the unicode set or a custom Discord emoji, or ["n", "null"] if there are none.
 * @param {Array<string>} eList The list to check
 * @return {Array<string>} An array with information about the emoji
 */

exports.emojiCheck = function(eList = []) {
  let match;
  let save = [];
  for(const e of eList) {
    match = regex.exec(e);
    regex.lastIndex = 0; // emojiRegex is global
    if(match)
      save.push(match[0]);
  }
  if(save.length !== 0) {
    // Unicode emoji found!
    return ["u", save[0]];
  } else {
    // Discord custom emoji (or random string), checks for proper custom emoji formatting
    for(const e of eList) {
      let pEmojiID = e.split("<")[1]
      if (pEmojiID) { // initial check passed, does the rest of it look good?
        let qEmojiID = pEmojiID.split(":");
        let junk = e.split("<")[0].length;
        if (qEmojiID[2] && e.slice(junk).startsWith("<") && qEmojiID[2].slice(-1) == ">")
          return ["c", qEmojiID[2].slice(0, -1)];
      }
      return ["n", "null"]; // Not an emoji
    }
  }
};

/**
 * Constrains a number between a minimum and a maximum value
 * @param {Number} n The number to constrain
 * @param {Number} min The minimum
 * @param {Number} max The maximum
 * @return {Number} The number, constrained between `min` and `max`
 */

exports.minMax = function(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Checks whether Gyromina has a certain permission in the channel a message was sent in
 * @param message The message object
 * @param perm An array containing the permissions to check for
 * @return {Boolean} "`true`" if Gyromina has permissions, "`false`" if not
 */

exports.p = function(message, perm) {
  if (message.channel.type == "DM" || message.channel.isVoice()) {
    return true;
  } else {
    let gPerm = message.channel.permissionsFor(message.guild.me);
    return perm && gPerm.has(perm); // this is much simpler
  }
}
/**
 * Creates a custom date timestamp for embed usage
 * @return {String} The produced timestanp
 */

exports.stamp = function() {
  let dt = new Date();
  let rawNow = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth()+1, dt.getUTCFullYear()];
  let now = rawNow.map(elem => elem.toString().padStart(2, '0'));
  return `${now[5]}-${now[4]}-${now[3]} @ ${now[2]}:${now[1]} UTC`;
}

// STYLE

/**
 * Checks whether an embed's colour should be changed due to the current season
 * @param def The standard colour for the embed in question
 * @return {String} The embed colour to use
 */

exports.eCol = function(def) {
  let dt = new Date();
  let now = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth(), dt.getUTCFullYear()];
  if(process.env.season === "-1") { // Force default style
    return def;
  } else if(now[4] == 5 || process.env.season === "1") { // June: rainbow randomizer
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
 * @return {String} The avatar ID to use
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

/**
 * Responds to a message or interaction
 * @param {object|string} resp A response object to send
 * @param {object} msg The message or interaction object
 * @param {object} options An options object with response-specific options
 * @param {string} options.type
 * @param {boolean?} options.edit
 * @param {boolean?} options.reply
 * @param {boolean?} options.eph
 * @param {boolean?} options.follow
 * @return {function} The appropriate message or interaction response function
 */
// options = {type: "msg", edit: false, reply: false, eph: false, follow: false}

exports.respond = async function(resp, msg, options) {
  let response = typeof(resp) == "string" ? {content: resp} : resp;
  switch(options.type) {
    case "msg": { // respond to command message/channel
      // binary flags, wow!
      let optsFlag = 0;
      if(options.reply && options.reply === true) optsFlag += Math.pow(2, 0);
      if(options.edit && options.edit === true) optsFlag += Math.pow(2, 1);
      // check flags + react accordingly
      switch (optsFlag) {
        case 3:
        case 2: // edit (reply ignored)
          return msg.edit(response);
        case 1: // reply
          return msg.reply(response);
        default: // default (standard)
          return msg.channel.send(response);
      }
    }
    case "interact": { // respond to slash command interaction
      // binary flags, wow!
      let optsFlag = 0;
      if(options.follow && options.follow === true) optsFlag += Math.pow(2, 0);
      if(options.edit && options.edit === true) optsFlag += Math.pow(2, 1);
      response.ephemeral = options.eph ? options.eph : false; // if ephemeral, make it ephemeral
      // check flags + react accordingly
      switch(optsFlag) { // i'm using binary flags, wow!
        case 3:
        case 2: // edit (follow ignored)
          return msg.editReply(response);
        case 1: // follow
          return msg.followUp(response);
        default: // default (reply)
          return msg.reply(response);
      }
    }
    default: return undefined; // error
  }
}

// COLOUR

/**
 * Converts a hexadecimal colour code to RGB format
 * @author Irisu (irisuwastaken)
 * @param {string} hex The hexadecimal colour code (preceded by a #)
 * @return {object<number>} An RGB colour object
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
 * @param {object} rgb The RGB colour object
 * @param {number} rgb.r
 * @param {number} rgb.g
 * @param {number} rgb.b
 * @return {String} A hexadecimal colour code
 */

exports.rgbToHex = function(rgb) {
  let hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
  return `${hex[0].length > 1 ? hex[0] : `0${hex[0]}`}${hex[1].length > 1 ? hex[1] : `0${hex[1]}`}${hex[2].length > 1 ? hex[2] : `0${hex[2]}`}`;
}

/**
 * Converts a CMYK colour code to RGB format
 * @param {object} cmyk The CMYK colour object
 * @param {number} cmyk.c
 * @param {number} cmyk.m
 * @param {number} cmyk.y
 * @param {number} cmyk.k
 * @return {object} An RGB colour object
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
 * @param {object} rgb The RGB colour object
 * @param {number} rgb.r
 * @param {number} rgb.g
 * @param {number} rgb.b
 * @return {object} A CMYK colour object
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
 * @return {Number} A colour integer
 */

exports.hexToInt = function(hex) {
  return parseInt(parseInt(hex, 16).toString(10));
}

/**
 * Converts a colour integer to a hexadecimal colour code
 * @param {Number} int The colour integer
 * @return {String} A hexadecimal colour code
 */

exports.intToHex = function(int) {
  let res = int.toString(16)
  while (res.length < 6) {
    res = "0".concat(res);
  }
  return res;
}

/**
 * Converts an RGB colour code to HSL format
 * @param {object} rgb The RGB colour object
 * @param {number} rgb.r
 * @param {number} rgb.g
 * @param {number} rgb.b
 * @return {object} An HSL colour object
 */

exports.rgbToHsl = function(rgb) {
  let v = Math.max(rgb.r, rgb.g, rgb.b);
  let m = Math.min(rgb.r, rgb.g, rgb.b);
  let c = (v - m);

  let h;
  switch(v) {
    case m: h = 0; break; // all the same, fallback to 0
    case rgb.r: h = ((rgb.g-rgb.b) / c) + 0; break; // v = r
    case rgb.g: h = ((rgb.b-rgb.r) / c) + 2; break; // v = g
    case rgb.b: h = ((rgb.r-rgb.g) / c) + 4; break; // v = b
    default: return "err"; // error
  }
  if(h < 0) h += 6;
  if(h >= 6) h -= 6;

  let l = (v + m) * 0.5;
  let s;
  switch(l) {
    case 255:
    case 0:
      s = 0; break;
    default:
      s = c / (255 - Math.abs(2*l - 255)); break;
  }

  return {
    h: Math.round(h * 60),
    s: Math.round(s * 100),
    l: Math.round(l * 100/255),
  };
}

/**
 * Converts an HSL colour code to RGB format
 * @param {object} hsl The HSL colour object
 * @param {number} hsl.h
 * @param {number} hsl.s
 * @param {number} hsl.l
 * @return {object<number>} An RGB colour object
 */

exports.hslToRgb = function(hsl) {
  let div = [hsl.h/60, hsl.s/100, hsl.l/100];
  let c = (1 - Math.abs(2 * div[2] - 1)) * div[1];
  let x = (1 - Math.abs(div[0] % 2 - 1)) * c;
  let rgb;

  if(div[0] >= 6) div[0] -= 6;
  if(div[0] < 0) div[0] += 6;

  if(div[0] >= 0 && div[0] < 1)
    rgb = [c, x, 0];
  else if(div[0] >= 1 && div[0] < 2)
    rgb = [x, c, 0];
  else if(div[0] >= 2 && div[0] < 3)
    rgb = [0, c, x];
  else if(div[0] >= 3 && div[0] < 4)
    rgb = [0, x, c];
  else if(div[0] >= 4 && div[0] < 5)
    rgb = [x, 0, c];
  else if(div[0] >= 5 && div[0] < 6)
    rgb = [c, 0, x];
  else
    return "err";

  let m = div[2] - (c * 0.5)

  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255)
  }
}

/**
 * Converts an RGB colour code to HSV format
 * @param {object} rgb The RGB colour object
 * @param {number} rgb.r
 * @param {number} rgb.g
 * @param {number} rgb.b
 * @return {object<number>} An HSV colour object
 */

exports.rgbToHsv = function(rgb) {
  let v = Math.max(rgb.r, rgb.g, rgb.b);
  let m = Math.min(rgb.r, rgb.g, rgb.b);
  let c = (v - m);

  let h;
  switch(v) {
    case m: h = 0; break; // all the same, fallback to 0
    case rgb.r: h = ((rgb.g-rgb.b) / c) + 0; break; // v = r
    case rgb.g: h = ((rgb.b-rgb.r) / c) + 2; break; // v = g
    case rgb.b: h = ((rgb.r-rgb.g) / c) + 4; break; // v = b
    default: return "err"; // error
  }
  if(h < 0) h += 6;
  if(h >= 6) h -= 6;

  let s;
  switch(v) {
    case 0:
      s = 0; break;
    default:
      s = c / v; break;
  }
  
  return {
    h: Math.round(h * 60),
    s: Math.round(s * 100),
    v: Math.round(v * 100/255),
  };
}

/**
 * Converts an HSV colour code to RGB format
 * @param {object} hsv The HSV colour object
 * @param {number} hsv.h
 * @param {number} hsv.s
 * @param {number} hsv.v
 * @return {object<number>} An RGB colour object
 */

exports.hsvToRgb = function(hsv) {
  let div = [hsv.h/60, hsv.s/100, hsv.v/100];
  let c = div[1] * div[2];
  let x = (1 - Math.abs(div[0] % 2 - 1)) * c;
  let rgb;

  if(div[0] >= 6) div[0] -= 6;
  if(div[0] < 0) div[0] += 6;

  if(div[0] >= 0 && div[0] < 1)
    rgb = [c, x, 0];
  else if(div[0] >= 1 && div[0] < 2)
    rgb = [x, c, 0];
  else if(div[0] >= 2 && div[0] < 3)
    rgb = [0, c, x];
  else if(div[0] >= 3 && div[0] < 4)
    rgb = [0, x, c];
  else if(div[0] >= 4 && div[0] < 5)
    rgb = [x, 0, c];
  else if(div[0] >= 5 && div[0] < 6)
    rgb = [c, 0, x];
  else
    return "err";

  let m = div[2] - c;

  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255)
  }  
}

// TEMPERATURE

/**
 * Converts a temperature in degrees Fahrenheit to degrees Celcius
 * @param {Number} F The temperature in degrees Fahrenheit
 * @return {Number} A temperature in degrees Celcius
 */

exports.FtoC = function(F) {
  return (F - 32) * 5/9;
}

/**
 * Converts a temperature in degrees Celcius to degrees Fahrenheit
 * @param {Number} C The temperature in degrees Celcius
 * @return {Number} A temperature in degrees Fahrenheit
 */

exports.CtoF = function(C) {
  return C * 9/5 + 32;
}

/**
 * Converts a temperature in degrees Celcius to Kelvins
 * @param {Number} C The temperature in degrees Celcius
 * @return {Number} A temperature in Kelvins
 */

exports.CtoK = function(C) {
  return C + 273.15;
}

/**
 * Converts a temperature in Kelvins to degrees Celcius
 * @param {Number} K The temperature in Kelvins
 * @return {Number} A temperature in degrees Celcius
 */

exports.KtoC = function(K) {
  return K - 273.15;
}

/**
 * Converts a temperature in degrees Fahrenheit to degrees Rankine
 * @param {Number} F The temperature in degrees Fahrenheit
 * @return {Number} A temperature in degrees Rankine
 */

exports.FtoR = function(F) {
  return F + 459.67;
}

/**
 * Converts a temperature in degrees Rankine to degrees Fahrenheit
 * @param {Number} R The temperature in degrees Rankine
 * @return {Number} A temperature in degrees Fahrenheit
 */

exports.RtoF = function(R) {
  return R - 459.67;
}
