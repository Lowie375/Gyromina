module.exports.run = {
  execute(message, args, client) {
    const player = message.author.id;
    
    // Finds the requested game file
    const gameName = args[0];
    const game = client.games.get(gameName)
      || client.games.find(g => g.aliases && g.aliases.includes(gameName));
    
    // Checks if the game exists
    if (!game) {
      message.channel.reply("I couldn't find the game you were looking for. Please check your spelling and try again.");
      return;
    }
    
    // Runs the game
    game.start(message, args, client, player);
  }
};

module.exports.help = {
  "name": "play",
  "aliases": ["game", "playgame", "play-game"],
  "description": "Starts a game.",
  "usage": `${process.env.prefix}play <game> [variant]`,
  "params": "<game> [variant]",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};