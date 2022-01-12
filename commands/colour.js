const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
const e = require('../systemFiles/emojis.json'); // emoji file
const style = require('../systemFiles/style.json'); // style file
// colour conversions, mention cleaner, minMax constrainer, rejection embed generator, emoji puller, responder
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex, rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb, Clean, minMax, genRejectEmbed, getEmoji, respond} = require('../systemFiles/globalFunctions.js');
// colour name array
const {colNames} = require('../systemFiles/globalArrays.js');

// Regex setup
const hexX = /^(0x|#|\b)([a-f\d]{6})/i;
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;
const cmykX = /^cmyk\((\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;
const hslX = /^hsl\((\d+)°?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;
const hsvX = /^h[cs][vb]\((\d+)°?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;
const intX = /^int: {0,}(\d+)|^(\d+)[id]/i;

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
  } else if(!isNaN(parseInt(xc, 10)) || intX.test(xc) || hexX.test(xc)) {
    // xc -> int or hex, secondary check needed
    let q = intX.exec(xc);
    let r = hexX.exec(xc);
    if(r && (xc.startsWith("#") || xc.startsWith("0x") || /[a-f]+/i.test(xc) || /^0+/.test(r))) { // hex check
      // xc -> hex code
      return ["hex", 0, r[2]];
    } else if(q !== null) { // int check 1
      // xc -> int (through q)
      return ["int", 5, (isNaN(parseInt(q[1], 10)) ? parseInt(q[2], 10) : parseInt(q[1], 10))];
    } else if((!isNaN(parseInt(xc, 10)) && /(\d+)/i.exec(xc)[1].length != 6)) { // int check 2
      // xc -> int (direct)
      return ["int", 5, parseInt(xc, 10)];
    } else { // ambiguous case
      // xc -> hex; default
      return ["amb", 0, xc];
    }
  } else {
    const s = colNames[0].find(elem => elem.toLowerCase() == xc.toLowerCase());
    if(s) { // xc -> colName -> hex code
      return ["name", 0, colNames[1][colNames[0].indexOf(s)], s];
    } else { // xc -> null; unsupported format
      return [null, null];
    }
  }
}

function slashExtract(index, xc) {
  if(index === "0" && hexX.test(xc)) {
    let r = hexX.exec(xc);
    return ["hex", 0, r[2]];
  } else if(index === "1" && rgbX.test(xc)) {
    let m = rgbX.exec(xc);
    return ["rgb", 1, {r: minMax(m[1], 0, 255), g: minMax(m[2], 0, 255), b: minMax(m[3], 0, 255)}];
  } else if(index == "2" && hslX.test(xc)) {
    let n = hslX.exec(xc);
    return ["hsl", 2, {h: minMax(n[1], 0, 360), s: minMax(n[2], 0, 100), l: minMax(n[3], 0, 100)}];
  } else if(index == "3" && hsvX.test(xc)) {
    let o = hsvX.exec(xc);
    return ["hsv", 3, {h: minMax(o[1], 0, 360), s: minMax(o[2], 0, 100), v: minMax(o[3], 0, 100)}]
  } else if(index == "4" && cmykX.test(xc)) {
    let p = cmykX.exec(xc);
    return ["cmyk", 4, {c: minMax(p[1], 0, 100), m: minMax(p[2], 0, 100), y: minMax(p[3], 0, 100), k: minMax(p[4], 0, 100)}];
  } else if(index == "5" && (!isNaN(parseInt(xc)) || intX.test(xc))) {
    if(!isNaN(parseInt(xc))) {
      return ["int", 5, parseInt(xc, 10)];
    } else {
      let q = intX.exec(xc);
      return ["int", 5, (isNaN(parseInt(q[1], 10)) ? parseInt(q[2], 10) : parseInt(q[1], 10))];
    }
  } else {
    const s = colNames[0].find(elem => elem.toLowerCase() == xc.toLowerCase());
    if(index == "6" && s) {
      return ["name", 0, colNames[1][colNames[0].indexOf(s)], s];
    } else {
      return [null, null];
    }
  }
}

exports.run = {
  execute(message, args, client) {
    if(args.length === 0)
      return respond({embeds: [genRejectEmbed(message, "No colour provided", "Gyromina can't get colour data for a non-existent colour! Please check your spelling and try again.")]}, [message, message], {reply: true, eph: true});

      var col;
    if(message.gyrType == "slash") {
      // check formatting
      let index = args.shift();
      let [...code] = args;
      col = slashExtract(index, Clean(code.join(" ")));
    } else {
      // decode format
      let [...code] = args;
      col = extract(Clean(code.join(" ")));
    }
    
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
      case "amb":
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
      case "int": {
        int = minMax(col[2], 0, Math.pow(2, 24)-1);
        hex = intToHex(int);
        rgb = hexToRgb(`#${hex}`);
        hsl = rgbToHsl(rgb);
        hsv = rgbToHsv(rgb);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      default:
        return respond({embeds: [genRejectEmbed(message, "Invalid colour", "Please check your syntax and try again.")]}, [message, message], {reply: true, eph: true});
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
      case "amb": {
        let blurb = "Defaulted to a hex code.\nIf this is a colour integer, add \`i\` or \`d\` to the end of it and try again."
        return respond({content: `Here you go!`, embeds: [genRejectEmbed(message, "Ambiguous input", blurb, {col: style.e.warn, e: getEmoji(message, e.warn, e.alt.warn)}), embed]}, [message, message], {reply: true});
      }
      default: return respond({content: `Here you go!`, embeds: [embed]}, [message, message], {reply: true});
    }
  },
  slashArgs(interact) {
    // template: choose one
    let opts = [
      interact.options.getString("hex"),
      interact.options.getString("rgb"),
      interact.options.getString("hsl"),
      interact.options.getString("hsv"),
      interact.options.getString("cmyk"),
      interact.options.getNumber("int"),
      interact.options.getString("name")
    ];
    for(let i = 0; i < opts.length; i++) {
      if(opts[i] !== null)
        return `${i} ${opts[i].toString()}`
    }
    return "";
  },
};


exports.help = {
  "name": "col",
  "aliases": ["colour", "color", "cdat", "coldata", "cdata"],
  "description": 'Displays colour data.',
  "usage": `${process.env.prefix}col <colour>`,
  "params": "<colour>",
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": { // for slash-enabled commands
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("col")
      .setDescription("Displays colour data (accepts exactly one of the options provided)")
      .addStringOption(o => o.setName("hex").setDescription("A hexadecimal colour code: #<hex>").setRequired(false))
      .addStringOption(o => o.setName("rgb").setDescription("An RGB colour code: rgb(<r>, <g>, <b>)").setRequired(false))
      .addStringOption(o => o.setName("hsl").setDescription("An HSL colour code: hsl(<h>, <s>, <l>)").setRequired(false))
      .addStringOption(o => o.setName("hsv").setDescription("An HSV colour code: hsv(<h>, <s>, <v>)").setRequired(false))
      .addStringOption(o => o.setName("cmyk").setDescription("A CMYK colour code: cmyk(<c>, <m>, <y>, <k>)").setRequired(false))
      .addNumberOption(o => o.setName("int").setDescription("A colour integer: <int>").setRequired(false))
      .addStringOption(o => o.setName("name").setDescription("A legacy/custom colour name: <name>").setRequired(false))
  }
};
