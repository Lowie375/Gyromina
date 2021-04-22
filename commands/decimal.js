// quip list for badly formatted fractions; subject to change
const quips = [
  ["You may want to practice your pizza slicing.", 0],
  ["Long division who?", 0],
  ["That fraction doesn't look right…", 1],
  ["What a messy fraction.", 0],
  ["Something's off about that fraction…", 1],
  ["I don't think I've seen a fraction like that before…", 1],
];
const qExt = [
  ["Anyway,", "anyway,"],
  ["Regardless,", "regardless,"],
  ["Either way,", "either way,"],
  ["Anywho,", "anywho,"],
  ["Oh well,", "oh well,"],
];

// fraction regex
const whole = /^\d+$/
const frac = /^\d+[/⁄÷∕]\d+$/ig

function argComb(args) {
  let wSave = [];
  let fSave = [];
  // run through and classify matching args
  for(const arg of args) {
    if(whole.exec(arg))
      wSave.push(arg);
    else if(frac.exec(arg))
      fSave.push(arg);
  }
  // todo: check for dupes/matches
  return args;
}

exports.run = {
  execute(message, args, client) {
    // PSEUDO:
    // check if properly formatted (regex?)
    // egg: check if improper/mixed combo, add a quip + qExt if true
    // divide fractional portion
    // add whole (if present)
    // return
  }
};

exports.help = {
  "name": "decimal",
  "aliases": ["decim", "dec", "ftod", "fd"],
  "description": "Converts a fraction (in base 10) to a decimal.",
  "usage": `${process.env.prefix}decimal [whole] <num>/<denom>`,
  "params": "[whole] <num>/<denom>",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};