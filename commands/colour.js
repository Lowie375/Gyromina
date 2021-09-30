// Require discord.js and some global functions (colour conversions, Clean, minMax)
const D = require('discord.js');
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex, rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb, Clean, minMax} = require('../systemFiles/globalFunctions.js');
const {colNames} = require('../systemFiles/globalArrays.js');

// Regex setup
const hexX = /^(0x|#|\b)([a-f\d]{6})/i;
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;
const cmykX = /^cmyk\((\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;
const hslX = /^hsl\((\d+)°?[, ]+(\d+)%?[, ]+(\d+)%?\)/;
const hsvX = /^h[cs][vb]\((\d+)°?[, ]+(\d+)%?[, ]+(\d+)%?\)/;

function extract(xc) {
  if(rgbX.test(xc)) {
    // xc -> RGB object
    let m = rgbX.exec(xc);
    return ["rgb", 1, {r: minMax(m[1], 0, 255), g: minMax(m[2], 0, 255), b: minMax(m[3], 0, 255)}];
  } else if(hslX.test(xc)) {
    // xc -> HSL object
    let n = hslX.exec(xc);
    return ["hsl", 2, {h: minMax(n[1], 0, 360), s: minMax(n[2], 0, 100), l: minMax(n[3], 0, 100)}];
  } else if(hsvX.test(xc)) {
    // xc -> HSV object
    let o = hsvX.exec(xc);
    return ["hsv", 3, {h: minMax(o[1], 0, 360), s: minMax(o[2], 0, 100), v: minMax(o[3], 0, 100)}]
  } else if(cmykX.test(xc)) {
    // xc -> CMKY object
    let p = cmykX.exec(xc);
    return ["cmyk", 4, {c: minMax(p[1], 0, 100), m: minMax(p[2], 0, 100), y: minMax(p[3], 0, 100), k: minMax(p[4], 0, 100)}];
  }  else if(!isNaN(parseInt(xc, 10)) || hexX.test(xc)) {
    // xc -> int or hex, secondary check needed
    let q = hexX.exec(xc);
    if(q && (xc.startsWith("#") || xc.startsWith("0x") || /[a-f]+/i.test(xc) || /^0+/.test(q))) { // hex check
      // xc -> hex code
      return ["hex", 0, q[2]];
    } else if(!isNaN(parseInt(xc, 10)) && /(\d+)/i.exec(xc)[1].length != 6) { // int check
      // xc -> int
      return ["int", 5, parseInt(xc, 10)];
    } else { // ambiguous case
      // xc -> int; default
      return ["amb", 5, parseInt(xc, 10)];
    }
  } else {
    const r = colNames[0].find(elem => elem.toLowerCase() == xc.toLowerCase());
    if(r) { // xc -> colName -> hex code
      return ["name", 0, colNames[1][colNames[0].indexOf(r)], r];
    } else { // xc -> null; unsupported format
      return [null, null];
    }
  }
}

exports.run = {
  execute(message, args, client) {
    if (args.length === 0)
      return message.reply(`I can't get colour data for a non-existent colour!`)

    // Decoding
    var [...code] = args;
    var col = extract(Clean(code.join(" ")));
    
    // Individual colour setup
    var hex;
    var rgb;
    var hsl;
    var hsv;
    var cmyk;
    var int;

    // Colour conversions
    switch(col[0]) {
      case "hex":
      case "name": {
        hex = col[2];
        int = hexToInt(hex);
        rgb = hexToRgb(`#${hex}`);
        hsl = rgbToHsl(rgb);
        hsv = rgbToHsv(rgb);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      case "rgb": {
        rgb = col[2];
        hsl = rgbToHsl(rgb);
        hsv = rgbToHsv(rgb);
        cmyk = rgbToCmyk(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "hsl": {
        hsl = col[2]
        rgb = hslToRgb(hsl);
        hsv = rgbToHsv(rgb);
        cmyk = rgbToCmyk(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "hsv": {
        hsv = col[2]
        rgb = hsvToRgb(hsv);
        hsl = rgbToHsl(rgb);
        cmyk = rgbToCmyk(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "cmyk": {
        cmyk = col[2];
        rgb = cmykToRgb(cmyk);
        hsl = rgbToHsl(rgb);
        hsv = rgbToHsv(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "int":
      case "amb": {
        int = Math.max(0, Math.min(col[2], Math.pow(2, 24)-1));
        hex = intToHex(int);
        rgb = hexToRgb(`#${hex}`);
        hsl = rgbToHsl(rgb);
        hsv = rgbToHsv(rgb);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      default:
        return message.reply(`Invalid colour code/name. Please check your syntax and try again.`);
    }

    // Encoding
    var strand = [`#${hex}`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`, `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`, `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, `int: ${int}`];
    var head = strand.splice(col[1], 1);
    if(col[0] == "name")
      head[0] = `${col[3]} (${head[0]})`;
    else if(colNames[1].includes(hex))
      head[0] += ` (${colNames[0][colNames[1].indexOf(hex)]})`;

    // Output setup
    const embed = new D.MessageEmbed()
      .setTitle(head[0])
      .setDescription(strand.join("\n"));
    switch(hex) {
      case "ffffff": embed.setColor(0xfefefe); break; // override because #ffffff is transparent
      default: embed.setColor(parseInt(`0x${hex}`)); break;
    }
      
    // Sends the embed
    switch (col[0]) {
      case "amb": return message.reply({content: `Ambiguous input detected, defaulting to a colour integer. If this is a hex code, add \`#\` or \`0x\` in front of it and try again.`, embeds: [embed]});
      default: return message.reply({content: `Here you go!`, embeds: [embed]});
    }
  }
}

exports.help = {
  "name": "colour",
  "aliases": ["color", "col", "cdat", "coldata", "cdata"],
  "description": 'Displays colour data.',
  "usage": `${process.env.prefix}colour <colour>`,
  "params": "<colour>",
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
