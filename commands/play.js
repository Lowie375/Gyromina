// Require the package file, emoji file, and permission checker
const package = require('../package.json');
const e = require('../systemFiles/emojis.json');
const {p} = require('../systemFiles/globalFunctions.js');

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = p(message, ['USE_EXTERNAL_EMOJIS']) ? client.emojis.cache.get(e.nope) : e.alt.nope;
    const warning = p(message, ['USE_EXTERNAL_EMOJIS']) ? client.emojis.cache.get(e.warn) : e.alt.warn;
    
    // Finds the requested game file
    const gameName = args.shift();
    const game = client.games.get(gameName)
      || client.games.find(g => g.label.aliases && g.label.aliases.includes(gameName));
    
    // Checks if the game exists
    if (!game)
      return message.channel.send(`I couldn't load the game you were looking for, <@${message.author.id}>. Please check your spelling and try again.`);

    // Checks if Gyromina has permission to add reactions (if the game requires them)
    if(game.label.reactions == 1 && !p(message, ['ADD_REACTIONS']))
      return message.channel.send(`I can't run this game if I can't add any reactions, <@${message.author.id}>! Please ask a server administrator to enable the 'Add Reactions' permission for Gyromina and try again.`);

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
      if (Array.isArray(args) && args.length !== 0) {
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
  "helpurl": "https://l375.weebly.com/gyrocmd-play",
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
