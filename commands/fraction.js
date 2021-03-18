const negNum = /^-\d/;

function argComb(args) {
  let save = [];
  let mixed = 0;
  let run = 0;
  // Checks for queries
  for (let i = 0; i < args.length; i++) {
    if(args[i].startsWith("-") && !negNum.exec(args[i])) {
      switch(args[i].slice(1, 2)) {
        case "t":
        case "d":
        case "n":
          output.push("t");
          break;
        case "r":
        case "_":
          output.push("r");
          run = runoffCheck(args, i);
          break;
        case "m":
          mixed = 1;
          break;
      }
      args.splice(i, 1);
      i--;
    }
  }
  switch(save.length) {
    case 0: return ["x", mixed, 0];
    case 1: return [save[0], mixed, run];
    default: {
      for (let j = 1; j < save.length; j++) {
        if (save[0] != save[j]) return ["n", mixed, 0];
      }
      return [save[0], mixed, run];
    }
  }
}

function analyze(num, s) {
/* PSEUDO:
assume r when:
- ending repetition pattern
- ...
else, assume t
*/
}

function runner(num, s, runoff) {
/* PSEUDO:
determine runoff
- if no runoff, determine repetition
- else, use given runoff
split term + runoff
- use dec() on term
- store dec places as factor
iterate runner (limit to 1023 for stability)
- multiply current test denom by decimal given + take ceiling/floor
- compare bounds to actual number
  - if match, break
  - else, move to next non-power-of-2-or-5 number
add term and runoff*factor
add whole number
return
*/
}

function dec(num, s) {
  // Puts decimal portion over a power of 10 + makes note of how many times the number can be divided
  var nFrac = parseInt(num[1]);
  var div = num[1].length;
  var dFrac = Math.pow(10, div[0]);

  // Divides numbers
  for(let i = 2; i <= 5; i+=3) {
    let j = 0;
    while(Math.mod(nFrac/i, 1) == 0 && j < div) {
      nFrac /= i;
      dFrac /= i;
      j++;
    }
  }
  // Adds the whole number component, if present and mixed not specified
  if (s[1] == 0) {
    nFrac += num[0] * dFrac;
  }
  // Returns the fraction
  return [nFrac, dFrac];
}

exports.run = {
  execute(message, args, client) {
    if (args.length == 0)
      return message.channel.send(`I need a number to convert to a fraction, <@${message.author.id}>!`);

    // Prepares the number and handles queries
    var settings = argComb(args);
    var num = args[0].split(".").slice(1);
    var frac;

    // Determines the fraction algorithm to run based on decimal type
    switch (settings[0]) {
      case "t": // terminating
        frac = dec(num, settings); break;
      case "r": // repeating
        frac = runner(num, settings); break;
      case "x": // indeterminate; further analysis needed
        frac = analyze(num, settings); break;
      default: // conflicting; throw error
        return message.channel.send(`I'm not sure what kind of decimal this is, <@${message.author.id}>.\n(Please choose either **\`-r\`**epeating or **\`-t\`**erminating, not both.)`);
    }
  }
};

exports.help = {
  "name": "fraction",
  "aliases": ["frac", "dtof", "df"],
  "description": "Converts a decimal to a simplified fraction.\nDefaults to an improper fraction.",
  "usage": `${process.env.prefix}fraction <decimal> [queries]`,
  "params": "<decimal> [queries]",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};
