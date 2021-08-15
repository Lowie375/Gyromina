// Require discord.js, some global functions (temperature conversions + embed colour checker), some global arrays (conversion), and the style file
const D = require('discord.js');
const {FtoC, CtoF, CtoK, KtoC, FtoR, RtoF, eCol} = require('../systemFiles/globalFunctions.js');
const {unitNames, converter, metricNames, metrics, registeredMetrics, metricDoubles, metricTriples} = require('../systemFiles/globalArrays.js');
const style = require('../systemFiles/style.json');

// Splitter separators + extraneous cases
const separators = /[_-]/;
const ex = /^(cubic|square)/;

function expandUnit(u) {
  switch (u) {
    case "d": return "distance";
    case "t": return "time";
    case "n": return "angle";
    case "v": return "volume";
    case "p": return "pressure";
    case "a": return "area";
    case "m": return "mass";
    case "e": return "energy";
    case "k": return "temperature";
    case "w": return "power";
    case "f": return "force/weight";
    default: return "undefined";
  }
}

function powerCheck(root) {
  if(metricTriples.includes(root))
    return 3;
  else if(metricDoubles.includes(root))
    return 2;
  else
    return 1;
}

function metricCheck(x) {
  if (x.length == 0) {
    // No unit; prefix IS unit
    return 2;
  }
  for (let i = 0; i < registeredMetrics.length; i++) {
    if(registeredMetrics[i].startsWith(x))
      return 0;
  }
  return 2;
}

function metricExSlicer(x, pos) {
  let m = ex.exec(x);
  if (m) { // Extraneous slicer
    return x.slice(0, pos) + x.slice(pos + m[1].length)
  } else {
    return x.slice(pos);
  }
}

function exCheck(x) {
  let m = ex.exec(x);
  if (m)
    return x.slice(m[1].length);
  else
    return x;
}

function deepCleanArgs(args, list, j, k) {
  let save = [];
  let checkCtr = 0;
  
  for (var item of list) {
    // Checks if the prefixes match
    let exArg = exCheck(args[j]);
    if(exArg.startsWith(metricNames[0][item[0]].slice(0, k)) && metricNames[0][item[0]].slice(0, k).length == k) {
      checkCtr++;
      save.push(item);
    }
  }
  if (checkCtr == 1) {
    let arr = [save[0][1], k]
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

  for (let j = 1; j <= 2; j++) {
    // Removes separators
    args2[j] = args[j].replace(separators, "");
    
    // Checks if the argument is a single character
    if (args2[j].length <= 1) {
      // Single character; no prefix
      cleaned[j] = args2[j];
    } else {
      // Determines possible metric prefixes
      let exArg = exCheck(args2[j]);
      for (let i = 0; i < metricNames[0].length; i++) {
        if(exArg.startsWith(metricNames[0][i])) {
          checkCtr++;
          save.push([i, metricNames[1][i]]);
        }
      }
      // Checks if a prefix was found
      if (checkCtr == 0) { // No prefix; leave things as-is
        cleaned[j] = args2[j];
      } else { // Prefix; check if the prefix is exclusive
        if (checkCtr == 1) { // Exclusive
          cleaned[j+3] = save[0][1];
          cleaned[j] = args2[j].slice(1);
        } else if (checkCtr != 0 && checkCtr != 1) {
          // Checks if the prefixes have the same index
          let index = save[0][1];
          for (item of save) {
            if(item[1] != index)
              index = -1;
          }
          // Checks if the index remained the same throughout
          if (index != -1) { // Technically exclusive; find the longest prefix
            let max = metricNames[0][save[0][0]].length
            for (item of save) {
              if(metricNames[0][item[0]].length > max)
                max = metricNames[0][item[0]].length;
            }
            cleaned[j+3] = save[0][1];
            cleaned[j] = metricExSlicer(args2[j], max);
          } else {
            // Runs a deeper check
            let dpr = deepCleanArgs(args2, save, j, 2);
            cleaned[j+3] = dpr[0];
            cleaned[j] = metricExSlicer(args2[j], dpr[1]);
          }
        }
    
        // Checks if the prefix was actually a valid prefix
        let validate = metricCheck(cleaned[j]);
        switch(validate) {
          case 0: // OK, continue
            break;
          case 1: { // Extraneous, perform additional check
            let checkOutput = metricCheckAddl(cleaned[j], cleaned[j+3]);
            if (checkOutput != null) {
              cleaned[j] = checkOutput;
              break;
            }
          }
          case 2: // Not a prefix, undo split
            cleaned[j] = args2[j];
            cleaned[j+3] = -1;
            break;
        }
      }
      checkCtr = 0;
      save.splice(0, save.length);
    }
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
  if(result.startsWith("/")) {
    result = result.slice(1);
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

function search(arg) {
  let checkCtr = 0;
  let save = [];
  // Checks for exact matches
  for (let i = 0; i < unitNames[0].length; i++) {
    if(unitNames[0][i] === arg) {
      checkCtr++;
      save.push(unitNames[1][i]);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for plural-exact matches (add an s)
  checkCtr = 0;
  for (let i = 0; i < unitNames[0].length; i++) {
    if(unitNames[0][i] === arg.concat("s")) {
      checkCtr++;
      save.push(unitNames[1][i]);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for non-exact matches (shortened words)
  checkCtr = 0;
  for (let i = 0; i < unitNames[0].length; i++) {
    if(unitNames[0][i].startsWith(arg)) {
      checkCtr++;
      save.push(unitNames[1][i]);
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

function errorPull(x, message, arg) {
  switch (x) {
    case "err": message.reply(`The unit you specified (${arg}) couldn\'t be found! Please check your spelling and try again.`); return 1;
    case "null": message.reply(`The unit you specified (${arg}) wasn\'t specific enough! Please check your spelling and try again.`); return 1;
    default: return 0;
  }
}

exports.run = {
  execute(message, args, client) {
    switch(args.length) {
      case 0: return message.reply(`I can\'t convert something if I don't have any values or units to convert between! Please add a value and try again.`);
      case 1: return message.reply(`I can\'t convert something if you don't tell me its unit! Please add the appropriate unit and try again.`);
      case 2: return message.reply(`I can\'t convert something if you don't tell me what unit to convert it to! Please add the desired unit and try again.`);
    }
    
    var cArgs = cleanArgs(args);
    
    // Finds & pulls conversion data
    var pos1 = search(cArgs[1]);
    if (errorPull(pos1, message, args[1]) != 0) return;
    var pos2 = search(cArgs[2]);
    if (errorPull(pos2, message, args[2]) != 0) return;

    var type1 = pos1.slice(0, 1);
    pos1 = parseInt(pos1.slice(1), 10);
    var type2 = pos2.slice(0, 1);
    pos2 = parseInt(pos2.slice(1), 10);

    // Checks if the units can be converted between
    if (type1 != type2)
      return message.reply(`I can\'t convert between 2 unlike units (${expandUnit(type1)} & ${expandUnit(type2)})! Please check your units and try again.`);
    
    var name1 = nameCases(converter[0][pos1], cArgs, 4, 1);
    var name2 = nameCases(converter[0][pos2], cArgs, 5, 0);

    // Initialises conversion values
    var val1;
    var val2;
    var output;
    var round;

    // Sets conversion variables
    let vc1 = valCases(converter[1][pos1]);
    if(converter[1][pos1] != vc1) {
      val1 = vc1;
      var val1exact = converter[1][pos1];
    } else {
      val1 = converter[1][pos1];
    }
    let vc2 = valCases(converter[1][pos2])
    if(converter[1][pos2] != vc2) {
      val2 = vc2;
      var val2exact = converter[1][pos2];
    } else {
      val2 = converter[1][pos2];
    }
    
    switch(type1) {
      default: {
        // Performs the conversion
        output = cArgs[0] * val2 / val1;
        break;
      }
      case "k": {
        // Temperature; performs a custom conversion
        let starter;
        switch(pos1) {
          case 65: starter = [cArgs[0], "C"]; break; // C 
          case 66: starter = [cArgs[0], "F"]; break; // F
          case 67: starter = [KtoC(cArgs[0]), "C"]; break; // K
          case 68: starter = [RtoF(cArgs[0]), "F"]; break; // R
          default: starter = ["NaN", "X"]; break; // err!
        }
        switch(starter[1]) {
          case "C": {
            switch(pos2) {
              case 65: output = starter[0]; break; // -> C
              case 66: output = CtoF(starter[0]); break; // -> F
              case 67: output = CtoK(starter[0]); break; // -> K
              case 68: output = FtoR(CtoF(starter[0])); break; // -> R
              default: output = "NaN"; break; // -> err!
            }
            break;
          }
          case "F": {
            switch(pos2) {
              case 65: output = FtoC(starter[0]); break; // -> C
              case 66: output = starter[0]; break; // -> F
              case 67: output = CtoK(FtoC(starter[0])); break; // -> K
              case 68: output = FtoR(starter[0]); break; // -> R
              default: output = "NaN"; break; // -> err!
            }
            break;
          }
          default:
            output = "NaN"; break;
        }
        break;
      }
    }
    // Metric handling
    if (cArgs[5] != -1)
      output = output * Math.pow(metrics[1][cArgs[5]], powerCheck(cArgs[2]));
    if (cArgs[4] != -1)
      output = output / Math.pow(metrics[1][cArgs[4]], powerCheck(cArgs[1]));
    // Checks if the conversion was valid
    if (isNaN(output))
      return message.reply(`I can't convert non-numerical values! Please enter a valid number and try again.`);

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

    // Creates the embed
    const embed = new D.MessageEmbed()
      .setTitle(`${cArgs[0]}${name1} equals…\n\`${output}${name2}\``)
      .setColor(eCol(style.e.default));
    // Adds a rounded output, if suitable
    if(round != "null") embed.setDescription(`…or about ${round}${name2}`);

    // Sends the embed
    return message.channel.send({embeds: [embed]});
  }
}

exports.help = {
  "name": "convert",
  "aliases": "unit",
  "description": "Converts a value from one unit to another.",
  "usage": `${process.env.prefix}convert <value> <unit> <newUnit> [places]`,
  "params": "<value> <unit> <newUnit> [places]",
  "helpurl": "https://l375.weebly.com/gyrocmd-convert",
  "weight": 3,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
