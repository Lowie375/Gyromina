const Discord = require('discord.js');

// New array: converter[array#][object#] - 11/22/33/44
const converter = [
  ["millimetres", "millimeters", "mm", "centimetres", "centimeters", "cm", "inches", "in", "foot", "feet",
   "ft", "yards", "yds", "metres", "meters", "kilometres", "kilometers", "km", "miles", "mi",
   "nauticalmiles", "nautical_miles", "nmi", "nanoseconds", "nanosecs", "microseconds", "microsecs", "milliseconds", "millisecs", "seconds",
   "secs", "minutes", "mins", "hours", "hrs", "days", "weeks", "wks", "years", "yrs",
   "gradians", "grads", "degrees", "degs", "radians", "rads", "milliradians", "millirads", "millilitres", "milliliters",
   "ml", "litres", "liters"],
  ["dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist",
   "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist",
   "dist", "dist", "dist", "time", "time", "time", "time", "time", "time", "time",
   "time", "time", "time", "time", "time", "time", "time", "time", "time", "time",
   "angles", "angles", "angles", "angles", "angles", "angles", "angles", "angles", "vol", "vol",
   "vol", "vol", "vol"],
  ["1000000", "1000000", "1000000", "100000", "100000", "100000", "39370.0787401574803150", "39370.0787401574803150", "3280.8398950131233596", "3280.8398950131233596",
   "3280.8398950131233596", "1093.6132983377077865", "1093.6132983377077865", "1000", "1000", "1", "1", "1", "0.6213711922373340", "0.6213711922373340",
   "0.5399568034557235", "0.5399568034557235", "0.5399568034557235", "604800000000000", "604800000000000", "604800000000", "604800000000", "604800000", "604800000", "604800",
   "604800", "10080", "10080", "168", "168", "7", "1", "1", "0.0191780664289865", "0.0191780664289865",
   "200", "200", "180", "180", "π", "π", "π/1000", "π/1000", "1000", "1000",
   "1000", "1", "1"]
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
  // Name cleanup
  switch(x) {
    case "nauticalmiles":
    case "nautical_miles":
      result = "nautical miles"; break;
    case "squaremetres":
    case "square_metres":
      result = "square metres"; break;
    case "squaremeters":
    case "square_meters":
      result = "square meters"; break;
    case "m^2":
      result = "m²"; break;
  }
  // Plural handling if args[0] == 1
  if(args[0] == 1) {
    switch (result) {
      case "feet":
        result = "foot"; break;
      case (result.slice(-1) == "s"):
        result = result.slice(0, -1); break;
    }
  }
  return result;
}

function search(y = 0, args, argNum) {
  var checkCtr = 0;
  var save = [];
  // Checks for exact matches
  for (let i = 0; i < converter[0].length; i++) {
    if(converter[y][i] === (args[argNum])) {
      checkCtr++;
      save.push(i);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for non-exact matches (shortened words)
  for (let i = 0; i < converter[0].length; i++) {
    if(converter[y][i].startsWith(args[argNum])) {
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
      if(converter[2][save[0]] != converter[2][save[i]]) return "null";
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
  execute(message, args) {
    switch(args.length) {
      case 0: message.reply("I can\'t convert something if I don't have any values or units to convert between!"); return;
      case 1: message.reply("I can\'t convert something if you don't tell me the unit it's in!"); return;
      case 2: message.reply("I can\'t convert something if you don't tell me what unit to convert it to!"); return;
    }
    // Finds & pulls conversion data
    var pos1 = search(0, args, 1);
    if (errorPull(pos1, message) != 0) return;
    var pos2 = search(0, args, 2);
    if (errorPull(pos2, message) != 0) return;

    var type1 = converter[1][pos1];
    var type2 = converter[1][pos2];

    // Checks if the units can be converted between
    if (type1 != type2) {
      message.reply("I can\'t convert between 2 unlike units! Please check your units and try again.");
      return;
    }
    var name1 = nameCases(converter[0][pos1], args);
    var name2 = nameCases(converter[0][pos2], args);

    // Initialises conversion values
    var val1, val2, output, round;
    if(converter[2][pos1] != valCases(converter[2][pos1])) {
      val1 = valCases(converter[2][pos1]);
      var val1exact = converter[2][pos1];
    } else {
      val1 = converter[2][pos1];
    }
    if(converter[2][pos2] != valCases(converter[2][pos2])) {
      val2 = valCases(converter[2][pos2]);
      var val2exact = converter[2][pos2];
    } else {
      val2 = converter[2][pos2];
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
      .setTitle(`${args[0]} ${name1} equals…\n\`${output} ${name2}\``)
      .setColor(0x7effaf);

    if(round != "null") embed.setDescription(`…or about ${round} ${name2}`);
    message.channel.send(embed);

  }
}

module.exports.help = {
  "name": "convert",
  "aliases": "unit",
  "description": "Converts a value from one unit to another.",
  "usage": `${process.env.prefix}convert <value> <unit> <newUnit>`,
  "params": "<value> <unit> <newUnit>",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};