// Arrays
const allNames = ["millimetres", "millimeters", "mm", "centimetres", "centimeters", "cm", "inches", "foot", "feet", "ft", "yards", "yds", "metres", "meters", "kilometres",
  "kilometers", "km", "miles", "nautical_miles", "nauticalmiles", "nmi", /* */ "nanoseconds", "nanosecs", "microseconds", "microsecs", "milliseconds", "millisecs", "seconds",
  "secs", "minutes", "mins", "hours", "hrs", "days", "weeks", "wks", "years", "yrs", /* */ "gradians", "degrees", "radians", "milliradians"];
const allCounters = ["dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist", "dist",
  "dist", /* */ "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", "time", /* */ "angles", "angles",
  "angles", "angles"];

// Values
module.exports.conv.dist = {
  ["millimetres", "millimeters", "mm"]: "1000000",
  ["centimetres", "centimeters", "cm"]: "100000",
  "inches": "39370.0787401574803150",
  ["foot", "feet", "ft"]: "3280.8398950131233596",
  ["yards", "yds"]: "1093.6132983377077865",
  ["metres", "meters"]: "1000",
  ["kilometres", "kilometers", "km"]: "1",
  "miles": "0.6213711922373340",
  ["nautical_miles", "nauticalmiles", "nmi"]: "0.5399568034557235",
}

module.exports.conv.time = {
  ["nanoseconds", "nanosecs"]: "604800000000000",
  ["microseconds", "microsecs"]: "604800000000",
  ["milliseconds", "millisecs"]: "604800000",
  ["seconds", "secs"]: "604800",
  ["minutes", "mins"]: "10080",
  ["hours", "hrs"]: "168",
  "days": "7",
  ["weeks", "wks"]: "1",
  ["years", "yrs"]: "0.0191780664289865",
}

module.exports.conv.angles = {
  "gradians": "200",
  "degrees": "180",
  "radians": "3.1415926535897932",
  "milliradians": "0.0031415926535898",
}

module.exports.conv.vol = {
  ["millilitres", "milliliters", "ml"]: "1000",
  ["litres", "liters"]: "1",
}

module.exports.conv.area = {
  ["square_metres", "squaremetres", "m^2"]: "0",
}

module.exports.conv.mass = {
  "grams": "0",
}

module.exports.conv.press = {
  "pascals": "0",
}

module.exports.conv.energy = {
  "watts": "0",
}

module.exports.conv.power = {
  "joules": "0",
}