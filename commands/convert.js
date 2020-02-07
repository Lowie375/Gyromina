const Discord = require('discord.js');

// Array V4: names[array#][object#] + metrics[array#][object#] --> converterV3[array#][object#] (0-9/10-19/20-29/etc.)
const names = [
  ["metres", "meters", "m", "inches", "in", "foot", "feet", "ft", "yards", "yds",
    "miles", "mi", "nauticalmiles", "nmi", "seconds", "secs", "s", "minutes", "mins", "hours",
    "hrs", "days", "d", "weeks", "wks", "years", "yrs", "gradians", "grads", "gon",
    "degrees", "degs", "°", "radians", "rads", "milliradians", "millirads", "mil", "litres", "liters",
    "L", "cubicmetres", "cubicmeters", "m³", "m3", "m^3", "in³", "in3", "in^3", "cubicinches",
    "ft³", "ft3", "ft^3", "cubicfoot", "cubicfeet", "gallons", "usgallons", "gallonsus", "gallonus", "gal",
    "usgal", "galus", "quarts", "usquarts", "quartsus", "quartus", "qt", "usqt", "qtus", "fluidounces",
    "floz", "usfluidounces", "usfloz", "fluidouncesus", "fluidounceus", "flozus", "pints", "uspints", "pt", "uspt",
    "pintsus", "pintus", "ptus", "tablespoons", "ustablespoons", "tbsp", "ustbsp", "tablespoonsus", "tablespoonus","tbspus",
    "teaspoons", "usteaspoons", "tsp", "ustsp", "teaspoonsus", "teaspoonus", "tspus", "\"", "\'"
    ], // GOOD!
    // WIP below:
  ["d0", "d0", "d0", "d1", "d1", "d2", "d2", "d2", "d3", "d3",
    "d4", "d4", "d5", "d5", "t6", "t6", "t6", "t7", "t7", "t8",
    "t8", "t9", "t9", "t10", "t10", "t11", "t11", // good until here
    
    "n12", 
    "t12", "t13", "t13", "t14", "t14", "t15", "t16", "t16", "t17", "t17",
    "n18", "n18", "n19", "n19", "n20", "n20", "n21", "n21", "v22", "v22",
    "v22", "v23", "v23", "v24", "v24", "v24", "v24", "d5", "n18", "t15",
    "t9", "t10", "t11", "n21", "v24", "v24", "v24", "t10", "v22", "v22",
    "v22", "v22", "v22", "v22", "v22", "v25", "v25", "v25", "v25", "v25",
    "v26", "v26", "v26", "v26", "v26", "v26", "v26", "v27", "v27", "v27",
    "v27", "v27", "v27", "v28", "v28", "v28", "v28", "v28", "v28", "v29",
    "v29", "v29", "v29", "v29", "v29", "v29", "v29", "v29", "v29", "v30",
    "v30", "v30", "v30", "v30", "v30", "v31", "v31", "v31", "v31", "v31",
    "v31", "v32", "v32", "v32", "v32", "v32", "v32",]
]; // d=dist // t=time // n=angles // v=vol // p=pressure // a=area // e=energy // m=mass // w=power // g=weight //

const converter = [
  ["m", "in", "ft", " yds", "mi", "nmi", "/sec", " min", " hrs", " days",
    " wks", " yrs", " gon", "°", " rads", " mil", "L", "m³", "in³", "ft³",
    " US gal", " US qt", " US floz", " US pt", " US tbsp", " US tsp"], // GOOD!
  // WIP below:
  [1609344, 160934.4, 63360, 5280, 1760, 1609.344, 1.609344, 1, 1609.344/1852, 604800000000000,
    604800000000, 604800000, 604800, 10080, 168, 7, 1, 0.0191780664289865, 200, 180,
    "π", "π/1000", 1000, 1, 0.001, 1/0.016387064, 1/28.316846592, 1/3.785411784, 4/3.785411784, 128/3.785411784,
    8/3.785411784, 256/3.785411784, 768/3.785411784]
];

function metricCases(x) {
  return x;
}

function cleanArgs(args) {
  let cleaned = [];
  return args;
}

function valCases(x) {
  var result = x;
  switch(x) {
    case "π": result = Math.PI; break;
    case "π/1000": result = Math.PI/1000; break;
  }
  return result;
}

function nameCases(x, args) {
  var result = x;
  // Plural handling if args[0] == 1
  if(args[0] == 1) {
    switch (result) {
      case (result.slice(-1) == "s"):
        result = result.slice(0, -1); break;
    }
  }
  return result;
}

function search(args, argNum) {
  var checkCtr = 0;
  var save = [];
  // Checks for exact matches
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i] === (args[argNum])) {
      checkCtr++;
      save.push(i);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for non-exact matches (shortened words)
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i].startsWith(args[argNum])) {
      checkCtr++;
      save.push(i);
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
      if(names[1][save[0]] != names[1][save[i]]) return "null";
    }
    return names[1][save[0]];
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
    pos1 = pos1.slice(1);
    var type2 = pos2.slice(0, 1);
    pos2 = pos2.slice(1);

    // Checks if the units can be converted between
    if (type1 != type2) {
      message.reply("I can\'t convert between 2 unlike units! Please check your units and try again.");
      return;
    }
    var name1 = nameCases(converter[0][pos1], cArgs);
    var name2 = nameCases(converter[0][pos2], cArgs);

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
    if (isNaN(output) == 1) {
      message.reply("I can't convert non-numerical values! Please enter a valid number and try again.");
      return;
    }

    // Creates an approximation to go alongside the full conversion, if necessary
    if(!cArgs[4] || cArgs[4] < 0) {
      round = Math.round(output*10)/10;
    } else if (cArgs[4] == 0) {
      round = "null";
      output = Math.round(output);
    } else {
      round = Math.round(output);
      output = Math.round(output*Math.pow(10, cArgs[4]))/Math.pow(10, cArgs[4]);
    }
    if(round == output && output % 1 != 0) round = Math.round(output);
    if(round == output && output % 1 == 0) round = "null";

    // Creates and sends the embed
    const embed = new Discord.RichEmbed()
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
  "hide": 0,
  "wip": 1,
  "dead": 0,
};