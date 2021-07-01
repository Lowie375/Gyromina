// Require discord.js, some global functions (temperature conversions + embed colour checker), and the style file
const Discord = require('discord.js');
const {FtoC, CtoF, CtoK, KtoC, FtoR, RtoF, eCol} = require('../systemFiles/globalFunctions.js');
const style = require('../systemFiles/style.json');

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
   "tsp", "ustsp", "teaspoonsus", "teaspoonus", "tspus", "impgallons", "gallonsimp", "gallonimp", "impgal", "galimp",
   "impquarts", "quartsimp", "quartimp", "impqt", "qtimp", "imppints", "pintsimp", "pintimp", "imppt", "ptimp",
   "impfluidounces", "fluidouncesimp", "fluidounceimp", "impfloz", "flozimp", "imptablespoons", "tablespoonsimp", "tablepsoonimp", "imptbsp", "tbspimp",
   "impteaspoons", "teaspoonsimp", "teaspoonimp", "tspimp", "imptsp", "uscups", "cupsus", "cupus", "usc", "cus",
   "uslegalcups", "legalcupsus", "legalcupus", "cups", "impcups", "cupsimp", "cupimp","impc", "cimp", "pascals", 
   "Pa", "atmospheres", "atm", "torr", "bar", "mmHg", "psi", "lb/sqin","lb/in^2", "lb/in²",
   "lb/in2", "mb", "mbar", "millibar", "squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared",
   "m²", "m^2", "m2", "squareinches", "inchessquared", "inchsquared", "in²", "in^2", "in2", "squarefeet",
   "squarefoot", "feetsquared", "footsquared", "ft²", "ft^2", "ft2", "squareyards", "yardssquared", "yardsquared", "yd²",
   "yd^2", "yd2", "squaremiles", "milessquared", "milesquared", "mi²", "mi^2", "mi2", "acres", "ac",
   "hectares", "ha", "grams", "g", "ustons", "tonsus", "tonus", "imptons", "tonsimp", "tonimp",
   "tons", "pounds", "lb", "ounces", "oz", "stones", "st", "tonnes", "t", "slug",
   "sl", "joules", "j", "watthours", "w•hr", "w·hr", "whr", "calories", "cal", "gramcalories",
   "smallcalories", "btu", "britishthermalunits", "britishtherm", "imptherm", "thermimp", "quad", "quadrillionbtu", "ustherm", "thermus",
   "electronvolts", "ev", "footpounds", "ftlb", "ft⋅lb", "ft•lb", "celcius", "centigrade", "degreescelcius", "degreecelcius",
   "c", "°c", "fahrenheit", "degreesfahrenheit", "degreefahrenheit", "f", "°f", "kelvins", "k", "rankines",
   "degreesrankine", "degreerankine", "r", "ra", "°r", "°ra", "watts", "watt", "w", "horsepower",
   "hp", "mechanicalhorsepower", "tonsofcooling", "tonofcooling", "coolingtons", "tonsofrefrigeration", "tonofrefrigeration", "refrigerationtons", "tr", "tor",
   "britishthermalunitsperhour", "btuperhour", "btu/hr", "britishthermalunitperhour", "h", "newtons", "n", "gramsforce", "gramforce", "gramsofforce",
   "gramofforce", "gf", "ouncesforce", "ounceforce", "ouncesofforce", "ounceofforce", "ozf", "poundsforce", "poundforce", "poundsofforce",
   "poundofforce", "lbf", "ustonsforce", "ustonforce", "tonsforceus", "tonforceus", "ustonsofforce", "ustonofforce", "tonsofforceus", "tonofforceus",
   "ustonf", "tonfus", "imptonsforce", "imptonforce", "tonsforceimp", "tonforceimp", "imptonsofforce", "imptonofforce", "tonsofforceimp", "tonofforceimp",
   "imptonf", "tonfimp", "tonsforce", "tonforce", "tonsofforce", "tonofforce", "tonf", "ukgallons", "gallonsuk", "gallonuk",
   "ukgal", "galuk", "ukquarts", "quartsuk", "quartuk", "ukqt", "qtuk", "ukpints", "pintsuk", "pintuk",
   "ukpt", "ptuk", "ukfluidounces", "fluidouncesuk", "fluidounceuk", "ukfloz", "flozuk", "uktablespoons", "tablespoonsuk", "tablepsoonuk",
   "uktbsp", "tbspuk", "ukteaspoons", "teaspoonsuk", "teaspoonuk", "tspuk", "uktsp", "ukcups", "cupsuk", "cupuk",
   "ukc", "cuk", "quadrillionbritishthermalunits", "uktons", "tonsuk", "tonuk", "uktherm", "thermuk", "uktonsforce", "uktonforce",
   "tonsforceuk", "tonforceuk", "uktonsofforce", "uktonofforce", "tonsofforceuk", "tonofforceuk", "uktonf", "tonfuk", "l",
  ],
  ["d000", "d000", "d000", "d001", "d001", "d002", "d002", "d002", "d003", "d003",
   "d004", "d004", "d005", "d005", "t006", "t006", "t006", "t007", "t007", "t008",
   "t008", "t009", "t009", "t010", "t010", "t011", "t011", "n012", "n012", "n012",
   "n013", "n013", "n013", "n014", "n014", "n015", "d001", "d002", "v016", "v016",
   "v016", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017",
   "v018", "v018", "v018", "v018", "v018", "v018", "v019", "v019", "v019", "v019",
   "v019", "v019", "v019", "v026", "v020", "v020", "v020", "v026", "v020", "v020",
   "v027", "v021", "v021", "v021", "v027", "v021", "v021", "v028", "v028", "v022",
   "v022", "v022", "v022", "v022", "v029", "v023", "v029", "v023", "v023", "v023",
   "v023", "v030", "v024", "v030", "v024", "v024", "v024", "v024", "v031", "v025",
   "v031", "v025", "v025", "v025", "v025", "v026", "v026", "v026", "v026", "v026",
   "v027", "v027", "v027", "v027", "v027", "v029", "v029", "v029", "v029", "v029",
   "v028", "v028", "v028", "v028", "v028", "v030", "v030", "v030", "v030", "v030",
   "v031", "v031", "v031", "v031", "v031", "v032", "v032", "v032", "v032", "v032",
   "v033", "v033", "v033", "v034", "v034", "v034", "v034", "v034", "v034", "p035",
   "p035", "p036", "p036", "p037", "p038", "p037", "p039", "p039", "p039", "p039",
   "p039", "p040", "p040", "p040", "a041", "a041", "a041", "a041", "a041", "a041",
   "a041", "a041", "a041", "a042", "a042", "a042", "a042", "a042", "a042", "a043",
   "a043", "a043", "a043", "a043", "a043", "a043", "a044", "a044", "a044", "a044",
   "a044", "a044", "a045", "a045", "a045", "a045", "a045", "a045", "a046", "a046",
   "a047", "a047", "m048", "m048", "m049", "m049", "m049", "m050", "m050", "m050",
   "m050", "m051", "m051", "m052", "m052", "m053", "m053", "m054", "m054", "m055",
   "m055", "e056", "e056", "e057", "e057", "e057", "e057", "e058", "e058", "e058",
   "e058", "e059", "e059", "e060", "e060", "e060", "e061", "e061", "e062", "e062",
   "e063", "e063", "e064", "e064", "e064", "e064", "k065", "k065", "k065", "k065",
   "k065", "k065", "k066", "k066", "k066", "k066", "k066", "k067", "k067", "k068",
   "k068", "k068", "k068", "k068", "k068", "k068", "w069", "w069", "w069", "w070",
   "w070", "w070", "w071", "w071", "w071", "w071", "w071", "w071", "w071", "w071",
   "w072", "w072", "w072", "w072", "t008", "f073", "f073", "f074", "f074", "f074",
   "f074", "f074", "f075", "f075", "f075", "f075", "f075", "f076", "f076", "f076",
   "f076", "f076", "f077", "f077", "f077", "f077", "f077", "f077", "f077", "f077",
   "f077", "f077", "f078", "f078", "f078", "f078", "f078", "f078", "f078", "f078",
   "f078", "f078", "f078", "f078", "f078", "f078", "f078", "v026", "v026", "v026",
   "v026", "v026", "v027", "v027", "v027", "v027", "v027", "v029", "v029", "v029",
   "v029", "v029", "v028", "v028", "v028", "v028", "v028", "v030", "v030", "v030",
   "v030", "v030", "v031", "v031", "v031", "v031", "v031", "v034", "v034", "v034",
   "v034", "v034", "e061", "m050", "m050", "m050", "e060", "e060", "f078", "f078",
   "f078", "f078", "f078", "f078", "f078", "f078", "f078", "f078", "v016",
  ]
]; // d=distance // t=time // n=angle // v=vol // p=pressure // a=area // m=mass // e=energy // k=temperature // w=power // f=force/weight //
const converter = [
  ["m", "in", "ft", "yd", "mi", "nmi", "/sec", " min", " hrs", " days",
   " wks", " yrs", " gon", "°", "/rads", " mil", "L", "m³", "in³", "ft³",
   " US gal", " US qt", " US floz", " US pt", " US tbsp", " US tsp", " Imperial gal", " Imperial qt", " Imperial floz", "Imperial pt",
   " Imperial tbsp", "Imperial tsp", " US cup", " US legal cup", " Imperial cup", "Pa", "atm", "torr", "bar", "psi",
   "mbar", "m²", "in²", "ft²", "yd²", "mi²", "ac", "ha", "g", " US ton",
   " Imperial ton", "lb", "oz", "st", "t", "sl", "J", "W·h", "cal", "BTU",
   " Imperial therm", "quad", " US therm", "ev", "ft⋅lb", "°C", "°F", "K", "°R", "W",
   "hp", "TR", "BTU/h", "N", "gf", "ozf", "lbf", " US tonf", " Imperial tonf"],
  [1609.344, 63360, 5280, 1760, 1, 1609.344/1852, 604800, 10080, 168, 7,
   1, 7/365, 200, 180, "π", "π*1000", 1, 0.001, 1/0.016387064, 1/28.316846592,
   1/3.785411784, 4/3.785411784, 128/3.785411784, 8/3.785411784, 256/3.785411784, 768/3.785411784, 1/4.546, 4/4.546, 160/4.546, 8/4.546,
   256/4.546, 768/4.546, 16/3.785411784, 1/0.24, 16/4.546, 101325, 1, 760, 1.01325, 14.6959409,
   1013.25, 2589988.110336, 4014489600, 27878400, 3097600, 1, 1/640, 258.9988110336, 907184.74, 1,
   1/1.12, 2000, 32000, 2000/14, 90.718474, 907184.74/14593.903, 1, 1/3600, 1/4.184, 100/1.65923500225396087980032,
   10000000/1.65923500225396087980032, Math.pow(10, 17)/1.65923500225396087980032, 10000000/1.659631173184781539, Math.pow(10, 19)/1.602176565, 0.73756214927726542848, null, null, null, null, 1,
   0.0013410220895949744128, 0.000284345136094, 3.412141633, 9.80665, 1000, 32000000/907184.74, 2000000/907184.74, 1000/907184.74, 1000/1016046.9088] 
];
const metricNames = [
  ["deci", "d", "centi", "c", "milli", "m", "kilo", "k", "mega", "M",
   "giga", "G", "tera", "T", "peta", "P", "exa", "E", "zetta", "Z",
   "yotta", "Y", "hecto", "h", "nano", "n", "pico", "p", "femto", "f", 
   "atto", "a", "zepto", "z", "yocto", "y", "micro", "μ", "u", "deka",
   "da"],
  [00, 00, 01, 01, 02, 02, 03, 03, 04, 04,
   05, 05, 06, 06, 07, 07, 08, 08, 09, 09,
   10, 10, 11, 11, 12, 12, 13, 13, 14, 14,
   15, 15, 16, 16, 17, 17, 18, 18, 18, 19,
   19]
];
const metrics = [
  ["d", "c", "m", "k", "M", "G", "T", "P", "E", "Z", 
   "Y", "h", "n", "p", "f", "a", "z", "y", "μ", "da"],
  [Math.pow(10, 1), Math.pow(10, 2), Math.pow(10, 3), Math.pow(10, -3), Math.pow(10, -6),
     Math.pow(10, -9), Math.pow(10, -12), Math.pow(10, -15), Math.pow(10, -18), Math.pow(10, -21),
   Math.pow(10, -24), Math.pow(10, -2), Math.pow(10, 9), Math.pow(10, 12), Math.pow(10, 15),
     Math.pow(10, 18), Math.pow(10, 21), Math.pow(10, 24), Math.pow(10, 6), Math.pow(10, -1)]
];

// Valid metric roots
const registered = ["meters", "meters", "m", "seconds", "secs", "s", "radians", "rads", "litres", "liters",
  "L", "cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3",
  "pascals", "Pa", "squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared", "m²", "m^2",
  "m2", "grams", "g", "joules", "j", "watthours", "w•hr", "w·hr", "whr", "calories",
  "cal", "watts", "w", "newtons", "n", "gramsforce", "gramforce", "gramsofforce", "gramofforce", "gf",
  "l"];

// Prefix powers (doubling/tripling/etc)
const metricDoubles = ["squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared", "m²", "m^2", "m2"];
const metricTriples = ["cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3"];

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
  for (let i = 0; i < registered.length; i++) {
    if(registered[i].startsWith(x))
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
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i] === arg) {
      checkCtr++;
      save.push(names[1][i]);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for plural-exact matches (add an s)
  checkCtr = 0;
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i] === arg.concat("s")) {
      checkCtr++;
      save.push(names[1][i]);
    }
  }
  if (searchCheck(save, checkCtr) != "err" && searchCheck(save, checkCtr) != "null") return searchCheck(save, checkCtr);
  // Checks for non-exact matches (shortened words)
  checkCtr = 0;
  for (let i = 0; i < names[0].length; i++) {
    if(names[0][i].startsWith(arg)) {
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

function errorPull(x, message, arg) {
  switch (x) {
    case "err": message.channel.send(`the unit you specified (${arg}) couldn\'t be found, <@${message.author.id}>! Please check your spelling and try again.`); return 1;
    case "null": message.channel.send(`the unit you specified (${arg}) wasn\'t specific enough, <@${message.author.id}>! Please check your spelling and try again.`); return 1;
    default: return 0;
  }
}

exports.run = {
  execute(message, args, client) {
    switch(args.length) {
      case 0: return message.channel.send(`I can\'t convert something if I don't have any values or units to convert between, <@${message.author.id}>! Please add a value and try again.`);
      case 1: return message.channel.send(`I can\'t convert something if you don't tell me its unit, <@${message.author.id}>! Please add the appropriate unit and try again.`);
      case 2: return message.channel.send(`I can\'t convert something if you don't tell me what unit to convert it to, <@${message.author.id}>! Please add the desired unit and try again.`);
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
      return message.channel.send(`I can\'t convert between 2 unlike units (${expandUnit(type1)} & ${expandUnit(type2)}), <@${message.author.id}>! Please check your units and try again.`);
    
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
      return message.channel.send(`I can't convert non-numerical values, <@${message.author.id}>! Please enter a valid number and try again.`);

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
    const embed = new Discord.MessageEmbed()
      .setTitle(`${cArgs[0]}${name1} equals…\n\`${output}${name2}\``)
      .setColor(eCol(style.e.default));
    // Adds a rounded output, if suitable
    if(round != "null") embed.setDescription(`…or about ${round}${name2}`);

    // Sends the embed
    return message.channel.send(embed);
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
