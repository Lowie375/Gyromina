// Require the package file
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = client.emojis.cache.get(e.nope);
    const warning = client.emojis.cache.get(e.warn);
    
    // Finds the requested game file
    const gameName = args.shift();
    const game = client.games.get(gameName)
      || client.games.find(g => g.label.aliases && g.label.aliases.includes(gameName));
    
    // Checks if the game exists
    if (!game)
      return message.reply("I couldn't load the game you were looking for. Please check your spelling and try again.");

    // Determines the main player(s)
    var player;
    if (game.label.players[0] === 1 && game.label.players.length === 1) {
      player = message.author.id;
    } else {
      player = [message.author.id];
    }

    if(process.env.exp === "0" && game.label.indev === 1) {
      if(message.author.id === package.authorID) {
        message.channel.send(`${nope} The game \`${gameName}\` is still in development and thus has not been released to the public.\n\n${warning} Please enable **experimental mode** to play it.`);
      } else {
        message.channel.send(`${nope} The game \`${gameName}\` is still in development and thus has not been released to the public.`);
      }
    } else { 
      // Checks if game options were passed
      if (Array.isArray(args) && args.length != 0) {
        // Runs the game with options
        game.exe.start(message, client, player, args);
      } else {
        // Runs the game without options
        game.exe.start(message, client, player);
      }
    }
  }
};

exports.help = {
  "name": "play",
  "aliases": ["game", "playgame", "play-game"],
  "description": "Starts a game.",
  "usage": `${process.env.prefix}play <game> [options]`,
  "params": "<game> [options]",
  "helpurl": "https://lx375.weebly.com/gyrocmd-play",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
