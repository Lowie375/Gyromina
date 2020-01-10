const Discord = require('discord.js');

// Array V3: names[array#][object#] (10 per line) --> converterV3[array#][object#] (0-9/10-19/20-29/etc.)
const names = [
  ["millimetres", "millimeters", "mm", "centimetres", "centimeters", "cm", "inches", "in", "foot", "feet",
   "ft", "yards", "yds", "metres", "meters", "kilometres", "kilometers", "km", "miles", "mi",
   "nauticalmiles", "nautical_miles", "nmi", "nanoseconds", "nanosecs", "microseconds", "microsecs", "milliseconds", "millisecs", "seconds",
   "secs", "minutes", "mins", "hours", "hrs", "days", "weeks", "wks", "years", "yrs",
   "gradians", "grads", "degrees", "degs", "radians", "rads", "milliradians", "millirads", "millilitres", "milliliters",
   "ml", "litres", "liters", "cubicmetres", "cubicmeters", "cubic_metres", "cubic_meters", "m", "gon", "d",
   "nsecs", "μsecs", "msecs", "mil", "m³", "m3", "m^3", "usecs", "cm³", "cm3",
   "cm^3", "cubiccentimetres", "cubiccentimeters", "cubic_centimetres", "cubic_centimeters", "in³", "in3", "in^3", "cubicinches", "cubic_inches",
   "ft³", "ft3", "ft^3", "cubic_foot", "cubicfoot", "cubic_feet", "cubicfeet", "gallons", "usgallons", "us_gallons",
   "gal", "usgal", "us_gal", "quarts", "usquarts", "us_quarts", "qt", "usqt", "us_qt", "fluidounces",
   "fluid_ounces", "floz", "fl_oz", "usfluidounces", "usfloz", "us_fluidounces", "us_floz", "us_fluid_ounces", "us_fl_oz", "pints",
   "uspints", "us_pints", "pt", "uspt", "us_pt", "tablespoon", "ustablespoon", "us_tablespoon", "tbsp", "ustbsp",
   "us_tbsp", "teaspoon", "usteaspoon", "us_teaspoon", "tsp", "ustsp", "us_tsp",],
  ["d0", "d0", "d0", "d1", "d1", "d1", "d2", "d2", "d3", "d3",
   "d3", "d4", "d4", "d5", "d5", "d6", "d6", "d6", "d7", "d7",
   "d8", "d8", "d8", "t9", "t9", "t10", "t10", "t11", "t11", "t12", 
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
  ["mm", "cm", "in", "ft", " yds", "m", "km", "mi", "nmi", " nsec",
   " μsec", " msec", " sec", " min", " hrs", " days", " wks", " yrs", " gon", "°",
   " rads", " mil", "mL", "L", "m³", "in³", "ft³", " US gal", " US qt", " US fl oz",
   " US pt", " US tbsp", " US tsp"],
  [1609344, 160934.4, 63360, 5280, 1760, 1609.344, 1.609344, 1, 1609.344/1852, 604800000000000,
   604800000000, 604800000, 604800, 10080, 168, 7, 1, 0.0191780664289865, 200, 180,
   "π", "π/1000", 1000, 1, 0.001, 1/0.016387064, 1/28.316846592, 1/3.785411784, 4/3.785411784, 128/3.785411784,
   8/3.785411784, 256/3.785411784, 768/3.785411784]
];

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
    // Finds & pulls conversion data
    var pos1 = search(args, 1);
    if (errorPull(pos1, message) != 0) return;
    var pos2 = search(args, 2);
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
    var name1 = nameCases(converter[0][pos1], args);
    var name2 = nameCases(converter[0][pos2], args);

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
    output = args[0] * val2 / val1;
    if (isNaN(output) == 1) {
      message.reply("I can't convert non-numerical values! Please enter a valid number and try again.");
      return;
    }

    // Creates an approximation to go alongside the full conversion, if necessary
    if(!args[4] || args[4] < 0) {
      round = Math.round(output*10)/10;
    } else if (args[4] == 0) {
      round = "null";
      output = Math.round(output);
    } else {
      round = Math.round(output);
      output = Math.round(output*Math.pow(10, args[4]))/Math.pow(10, args[4]);
    }
    if(round == output && output % 1 != 0) round = Math.round(output);
    if(round == output && output % 1 == 0) round = "null";

    // Creates and sends the embed
    const embed = new Discord.RichEmbed()
      .setTitle(`${args[0]}${name1} equals…\n\`${output}${name2}\``)
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
  "wip": 0,
  "dead": 0,
};