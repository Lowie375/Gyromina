const package = require('../package.json');

module.exports.run = {
  execute(message, args, client) {
    const player = message.author.id;
    args.shift();
    const options = args;
    
    // Finds the requested game file
    const gameName = args[0];
    const game = client.games.get(gameName)
      || client.games.find(g => g.label.aliases && g.label.aliases.includes(gameName));
    
    // Checks if the game exists
    if (!game) {
      message.reply("I couldn't find the game you were looking for. Please check your spelling and try again.");
      return;
    }
    
    if(process.env.exp === "0" && game.label.indev === 1) {
      const warning = client.emojis.get("618198843301036032");
      const nope = client.emojis.get("618199093520498789");
  
      if(message.author.id === package.authorID) {
        message.channel.send(`${nope} The game \`${gameName}\` is still in development and thus has not been released to the public.\n\n${warning} Please enable **experimental mode** to play it.`);
      } else {
        message.channel.send(`${nope} The game \`${gameName}\` is still in development and thus has not been released to the public.`);
      }
    } else { 
      // Runs the game
      game.exe.start(message, options, client, player);
    }
  }
};

module.exports.help = {
  "name": "play",
  "aliases": ["game", "playgame", "play-game"],
  "description": "Starts a game.",
  "usage": `${process.env.prefix}play <game> [options] …`,
  "params": "<game> [options] …",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};
