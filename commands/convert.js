// Require discord.js
const Discord = require('discord.js');

// Array V4: names[array#][object#] + metricNames[array#][object#] --> converter[array#][object#] + metrics[array#][object#] (0-9/10-19/20-29/etc.)
const names = [
  ["metres", "meters", "m", "inches", "in", "foot", "feet", "ft", "yards", "yds",
   "miles", "mi", "nauticalmiles", "nmi", "seconds", "secs", "s", "minutes", "mins", "hours",
   "hrs", "days", "d", "weeks", "wks", "years", "yrs", "gradians", "grads", "gon",
   "degrees", "degs", "°", "radians", "rads", "mil", "\"", "\'", "litres", "liters",
   "L", "cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3",
   "in³", "in3", "in^3", "cubicinches", "inchescubed", "inchcubed", "ft³", "ft3", "ft^3", "cubicfoot", 
   "cubicfeet", "feetcubed", "footcubed", "gallons", "usgallons", "gallonsus", "gallonus", "gal", "usgal", "galus",
   "quarts", "usquarts", "quartsus", "quartus", "qt", "usqt", "qtus", "fluidounces", "floz", "usfluidounces",
   "usfloz", "fluidouncesus", "fluidounceus", "flozus", "pints", "uspints", "pt", "uspt", "pintsus", "pintus",
   "ptus", "tablespoons", "ustablespoons", "tbsp", "ustbsp", "tablespoonsus", "tablespoonus","tbspus", "teaspoons", "usteaspoons",
   "tsp", "ustsp", "teaspoonsus", "teaspoonus", "tspus",],
  ["d000", "d000", "d000", "d001", "d001", "d002", "d002", "d002", "d003", "d003",
   "d004", "d004", "d005", "d005", "t006", "t006", "t006", "t007", "t007", "t008",
   "t008", "t009", "t009", "t010", "t010", "t011", "t011", "n012", "n012", "n012",
   "n013", "n013", "n013", "n014", "n014", "n015", "d001", "d002", "v016", "v016",
   "v016", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017",
   "v018", "v018", "v018", "v018", "v018", "v018", "v019", "v019", "v019", "v019",
   "v019", "v019", "v019", "v020", "v020", "v020", "v020", "v020", "v020", "v020",
   "v021", "v021", "v021", "v021", "v021", "v021", "v021", "v022", "v022", "v022",
   "v022", "v022", "v022", "v022", "v023", "v023", "v023", "v023", "v023", "v023",
   "v023", "v024", "v024", "v024", "v024", "v024", "v024", "v024", "v025", "v025",
   "v025", "v025", "v025", "v025", "v025",]
]; // d=dist // t=time // n=angles // v=vol // p=pressure // a=area // e=energy // m=mass // w=power // g=weight //
const converter = [
  ["m", "in", "ft", "yds", "mi", "nmi", "/sec", " min", " hrs", " days",
   " wks", " yrs", " gon", "°", " rads", " mil", "L", "m³", "in³", "ft³",
   " US gal", " US qt", " US floz", " US pt", " US tbsp", " US tsp",],
  [1609.344, 63360, 5280, 1760, 1, 1609.344/1852, 604800, 10080, 168, 7,
   1, 0.0191780664289865, 200, 180, "π", "π*1000", 1, 0.001, 1/0.016387064, 1/28.316846592,
   1/3.785411784, 4/3.785411784, 128/3.785411784, 8/3.785411784, 256/3.785411784, 768/3.785411784,]
];
const metricNames = [
  ["deci", "d", "centi", "c", "milli", "m", "kilo", "k", "mega", "M",
   "giga", "G", "tera", "T", "peta", "P", "exa", "E", "zetta", "Z",
   "yotta", "Y", "hecto", "h", "nano", "n", "pico", "p", "femto", "f", 
   "atto", "a", "zepto", "z", "yocto", "y", "micro", "μ", "u",
   "deka", "da",],
  [00, 00, 01, 01, 02, 02, 03, 03, 04, 04,
   05, 05, 06, 06, 07, 07, 08, 08, 09, 09,
   10, 10, 11, 11, 12, 12, 13, 13, 14, 14,
   15, 15, 16, 16, 17, 17, 18, 18, 18, 19,
   19]
];
const metrics = [
  ["d", "c", "m", "k", "M", "G", "T", "P", "E", "Z", 
   "Y", "h", "n", "p", "f", "a", "z", "y", "μ", "da",],
  [Math.pow(10, 1), Math.pow(10, 2), Math.pow(10, 3), Math.pow(10, -3), Math.pow(10, -6),
     Math.pow(10, -9), Math.pow(10, -12), Math.pow(10, -15), Math.pow(10, -18), Math.pow(10, -21),
   Math.pow(10, -24), Math.pow(10, -2), Math.pow(10, 9), Math.pow(10, 12), Math.pow(10, 15),
     Math.pow(10, 18), Math.pow(10, 21), Math.pow(10, 24), Math.pow(10, 6), Math.pow(10, -1),]
];
// Valid metric roots
const registered = ["meters", "meters", "m", "seconds", "secs", "s", "radians", "rads", "litres", "liters",
  "L", "cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3",];
// Splitter separators
const separators = ["_", "-"];

function metricCheck(x) {
  for (let i = 0; i < registered.length; i++) {
    if(registered[i].startsWith(x)){
      return 0;
    }
  }
  return 1;
}

function deepCleanArgs(args, list, j, k) {
  let save = [];
  let checkCtr = 0;
  
  for (var item of list) {
    // Checks if the prefixes match
    if(args[j].startsWith(metricNames[0][item].slice(0, k)) && metricNames[0][item].slice(0, k).length == k+1) {
      checkCtr++;
      save.push(item);
    }
  }
  if (checkCtr == 1) {
    let arr = [save[0], k]
    return arr;
  } else if (checkCtr != 0 && checkCtr != 1) {
    return deepCleanArgs(args, save, j, k+1);
  }
}

function cleanArgs(args) {
  // args[val, unit, newUnit, places] --> cleaned[val, uRoot, newURoot, places, uPrefix, newUPrefix]
  let cleaned = [args[0], "", "", args[3], -1, -1];
  let args2 = [args[0], "", "", args[3]];
  let checkCtr = 0;
  let save = [];
  
  // Removes separators
  for (let j = 1; j <= 2; j++) {
    // Splits the argument into individual characters
    let splitter = args[j].split("");
    for (let i = 0; i < splitter.length; i++) {
      if(separators.includes(splitter[i])) {
        splitter.splice(i, 1);
        i--;
      }
    }
    // Rejoins the characters into one argument
    args2[j] = splitter.join("");
  }

  for (let j = 1; j <= 2; j++) {
    // Determines possible metric prefixes
    for (let i = 0; i < metricNames[0].length; i++) {
      if(args2[j].startsWith(metricNames[0][i])) {
        checkCtr++;
        save.push(metricNames[1][i]);
      }
    }
    // Checks if a prefix was found
    if (checkCtr == 0) {
      // If not, leaves things as-is
      cleaned[j] = args2[j];
    } else {
      // Otherwise, checks if the prefix is exclusive
      if (checkCtr == 1) {
        cleaned[j+3] = save[0];
        cleaned[j] = args2[j].slice(1);
      } else if (checkCtr != 0 && checkCtr != 1) {
        // If not, runs a deeper check
        let dpr = deepCleanArgs(args2, save, j, 1);
        cleaned[j+3] = dpr[0];
        cleaned[j] = args2[j].slice(dpr[1]+1);
      }
    
      // Checks if the prefix was actually a valid prefix
      let validate = metricCheck(cleaned[j]);
      switch(validate) {
        case 0:
          // OK, continue
          break;
        case 1:
          // Not a prefix, undo split
          cleaned[j] = args2[j];
          cleaned [j+3] = -1;
          break;
      }
    }
    checkCtr = 0;
    save.splice(0, save.length);
  }
  return cleaned;
}

function valCases(x) {
  let result = x;
  switch(x) {
    case "π": result = Math.PI; break;
    case "π*1000": result = Math.PI*1000; break;
  }
  return result;
}

function pluralHandler(x) {
  if (x.slice(-1) == "s")
    x = x.slice(0, -1);
  return x;
}

function nameCases(x, args, i, plural) {
  let result = x;
  let spaceCheck = 0;
  
  // Plural handling if args[0] == 1
  if(args[0] == 1 && plural == 1) {
    result = pluralHandler(x);
  }
  // Metric space handling (1)
  if(result.slice(0, 1) == "/") {
    result.slice(1);
    spaceCheck = 1;
  }
  // Metric prefix handling
  if (args[i] != -1)
    result = metrics[0][args[i]] + result;
  // Metric space handling (2)
  if (spaceCheck == 1)
    result = " " + result;

  return result;
}

function search(args, argNum) {
  let checkCtr = 0;
  let save = [];
  // Checks for exact matches
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i] === (args[argNum])) {
      checkCtr++;
      save.push(names[1][i]);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for non-exact matches (shortened words)
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i].startsWith(args[argNum])) {
      checkCtr++;
      save.push(names[1][i]);
    }
  }
  return searchCheck(save, checkCtr);
}

function searchCheck(save, ctr) {
  if(ctr == 1) {
    return save[0];
  } else if(ctr == 0) {
    return "err";
  } else {
    for(let i = 1; i < save.length; i++) {
      if(save[0] != save[i])
        return "null";
    }
    return save[0];
  }
}

function errorPull(x, message) {
  switch (x) {
    case "err": message.reply("the unit you specified couldn\'t be found! Please check your spelling and try again."); return 1;
    case "null": message.reply("the unit you specified wasn\'t specific enough! Please check your spelling and try again."); return 1;
    default: return 0;
  }
}

module.exports.run = {
  execute(message, args, client) {
    switch(args.length) {
      case 0: message.reply("I can\'t convert something if I don't have any values or units to convert between!"); return;
      case 1: message.reply("I can\'t convert something if you don't tell me the unit it's in!"); return;
      case 2: message.reply("I can\'t convert something if you don't tell me what unit to convert it to!"); return;
    }
    
    var cArgs = cleanArgs(args);
    
    // Finds & pulls conversion data
    var pos1 = search(cArgs, 1);
    if (errorPull(pos1, message) != 0) return;
    var pos2 = search(cArgs, 2);
    if (errorPull(pos2, message) != 0) return;

    var type1 = pos1.slice(0, 1);
    pos1 = parseInt(pos1.slice(1));
    var type2 = pos2.slice(0, 1);
    pos2 = parseInt(pos2.slice(1));

    // Checks if the units can be converted between
    if (type1 != type2) {
      message.reply("I can\'t convert between 2 unlike units! Please check your units and try again.");
      return;
    }
    var name1 = nameCases(converter[0][pos1], cArgs, 4, 1);
    var name2 = nameCases(converter[0][pos2], cArgs, 5, 0);

    // Initialises conversion values
    var val1, val2, output, round;
    if(converter[1][pos1] != valCases(converter[1][pos1])) {
      val1 = valCases(converter[1][pos1]);
      var val1exact = converter[1][pos1];
    } else {
      val1 = converter[1][pos1];
    }
    if(converter[1][pos2] != valCases(converter[1][pos2])) {
      val2 = valCases(converter[1][pos2]);
      var val2exact = converter[1][pos2];
    } else {
      val2 = converter[1][pos2];
    }

    // Converts and checks if the output is valid
    output = cArgs[0] * val2 / val1;
    // Metric handling
    if (cArgs[5] != -1)
      output = output * metrics[1][cArgs[5]];
    if (cArgs[4] != -1)
      output = output / metrics[1][cArgs[4]];
    if (isNaN(output) == 1) {
      message.reply("I can't convert non-numerical values! Please enter a valid number and try again.");
      return;
    }

    // Creates an approximation to go alongside the full conversion, if necessary
    if(!cArgs[3] || cArgs[3] < 0) {
      round = (Math.round(output*100)/100);
      switch(round.toString().split(".").pop().length) {
        case 0: break;
        case 1: round.toFixed(1); break;
        case 2: round.toFixed(2); break;
      }
    } else if (cArgs[3] == 0) {
      round = "null";
      output = Math.round(output);
    } else {
      round = Math.round(output);
      output = (Math.round(output*Math.pow(10, cArgs[3]))/Math.pow(10, cArgs[3])).toFixed(cArgs[3]);
    }
    if(round == output && output % 1 != 0) round = Math.round(output).toFixed(0);
    if((round == output && output % 1 == 0) || round == 0) round = "null";

    // Creates and sends the embed
    const embed = new Discord.MessageEmbed()
      .setTitle(`${cArgs[0]}${name1} equals…\n\`${output}${name2}\``)
      .setColor(0x7effaf);

    if(round != "null") embed.setDescription(`…or about ${round}${name2}`);
    message.channel.send(embed);

  }
}

module.exports.help = {
  "name": "convert",
  "aliases": "unit",
  "description": "Converts a value from one unit to another.",
  "usage": `${process.env.prefix}convert <value> <unit> <newUnit> [places]`,
  "params": "<value> <unit> <newUnit> [places]",
  "helpurl": "https://lx375.weebly.com/gyrocmd-convert",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};