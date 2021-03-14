const negNum = /^-\d/;

function typeComb(args) {
  let save = [];
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
          output.push("r");
          break;
      }
      args.splice(i, 1);
      i--;
    }
  }
  switch(save.length) {
    case 0: return "x";
    case 1: return save[0];
    default: {
      for (let j = 1; j < save.length; j++) {if (save[0] != save[j]) return "n";}
      return save[0];
    }
  }
}

function runner(num, runoff) {

}

function dec(num) {
  // Puts decimal portion over a power of 10 + makes note of how many times the number can be divided
  var nFrac = num[1];
  var div = nFrac.length;
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
  return [nFrac, dFrac];
}

exports.run = {
  execute(message, args, client) {
    if (args.length == 0)
      return message.channel.send(`I need a number to convert to a fraction, <@${message.author.id}>!`);

    var type = typeComb(args);

    var num = args[0].split(".").slice(1);
  }
};

exports.help = {
  "name": "fraction",
  "aliases": ["frac", "dtof", "df"],
  "description": "Converts a decimal to a simplified fraction",
  "usage": `${process.env.prefix}fraction <decimal> [queries]`,
  "params": "<decimal> [queries]",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};
