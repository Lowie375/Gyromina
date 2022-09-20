const D = require('discord.js'); // discord.js
const e = require('../system/emojis.json'); // emoji file
// permission checker, emoji puller, rejection embed generator
const {p, getEmoji, genRejectEmbed} = require('../system/globalFunctions.js'); 

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const nope = getEmoji(message, e.nope, e.alt.nope);
    const warning = getEmoji(message, e.warn, e.alt.warn);
    
    // Finds the requested game file
    const gameName = args.shift();
    const game = client.games.get(gameName)
      || client.games.find(g => g.label.aliases && g.label.aliases.includes(gameName));
    
    // Checks if the game exists
    if (!game)
      return message.reply({embeds: [genRejectEmbed(message, `\`${gameName}\` game not found`, "Please check your spelling and try again.")]});

    // Checks if Gyromina has permission to add reactions (if the game requires them)
    if(game.label.reactions && !p(message, [D.PermissionsBitField.Flags.AddReactions]))
      return message.reply({embeds: [genRejectEmbed(message, "Gyromina is missing permissions", `Gyromina can't run this game without reactions!\nPlease ask a server administrator to enable the \`Add Reactions\` permission for ${client.user.tag} and try again.`)]});

    // Determines the main player(s)
    var player;
    if (game.label.players[0] === 1 && game.label.players.length === 1) {
      player = message.author.id;
    } else {
      player = [message.author.id];
    }

    if(process.env.exp === "0" && game.label.indev) {
      if(message.author.id === process.env.hostID) {
        message.channel.send({embeds: [genRejectEmbed(message, "Game unavailable", `\`${gameName}\` is still in development and thus has not been released to the public.\nPlease enable **experimental mode** to play it.`)]});
      } else {
        message.channel.send({embeds: [genRejectEmbed(message, "Game unavailable", `\`${gameName}\` is still in development and thus has not been released to the public.`)]});
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
  "description": `Starts a game. (Use **${process.env.prefix}help -g** to view the game library)`,
  "usage": `${process.env.prefix}play <game> [options]`,
  "params": "<game> [options]",
  "default": 0,
  "helpurl": "https://l375.weebly.com/gyrocmd-play",
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false
};
