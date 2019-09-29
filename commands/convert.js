const cvfile = require('../systemFiles/conversions.js')

// Arrays
const allNames = ["millimetres", "millimeters", "mm", "centimetres", "centimeters", "cm", "inches", "foot", "feet", "ft", "yards", "yds", "metres", "meters", "kilometres",
  "kilometers", "km", "miles", "nautical_miles", "nauticalmiles", "nmi", /* */ "nanoseconds", "nanosecs", "microseconds", "microsecs", "milliseconds", "millisecs", "seconds",
  "secs", "minutes", "mins", "hours", "hrs", "days", "weeks", "wks", "years", "yrs", /* */ "gradians", "degrees", "radians", "milliradians", /* */ ];
const allCounters = ["dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist",
  "dist", /* */ "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", /* */ "angles", "angles",
  "angles", "angles", /* */];

module.exports.run = {
  execute(message, args) {

    var ctr1 = 0;
    var name = "x";

    message.channel.send(name);

  }
}

module.exports.help = {
  "name": "convert",
  "aliases": "unit",
  "description": "Converts a value from one unit to another.",
  "usage": `${process.env.prefix}convert <value> <unit> <newUnit>`,
  "params": "<value> <unit> <newUnit>",
  "hide": 0,
  "wip": 1
};