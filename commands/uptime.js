// Require discord.js and the heroki client
const Discord = require('discord.js');
const Heroku = require('heroku-client')
const hData = new Heroku({token: process.env.herokuAuth})

function reDate(ms) {
  // Converts milliseconds into 
  let secs = Math.floor(ms/1000); // Seconds
  let mins = Math.floor(secs/60); // Minutes
  secs -= mins*60;
  let hrs = Math.floor(mins/60); // Hours
  mins -= hrs*60;
  let days = Math.floor(hrs/24); // Days
  hrs -= days*24;

  let display = "";
  switch (days) {
    case 0: break;
    case 1: display += `${days} day, `; break;
    default: display += `${days} days, `; break;
  }
  switch (hrs) {
    case 0: break;
    case 1: display += `${hrs} hour, `; break;
    default: display += `${hrs} hours, `; break;
  }
  switch (mins) {
    case 0: break;
    case 1: display += `${mins} minute, `; break;
    default: display += `${mins} minutes, `; break;
  }
  switch (secs) {
    case 0: break;
    case 1: display += `${secs} second, `; break;
    default: display += `${secs} seconds, `; break;
  }
  // Returns the cleanted output
  return display.slice(0, -2);
}

exports.run = {
  async execute(message, args, client) {
    // Pull from app:released_at (?)
    // https://api.heroku.com/apps/${process.env.herokuID}
    // Accept: application/vnd.heroku+json; version=3

    // Gets the current time and the ready time
    var dUp = Date.parse(client.readyAt);
    var locTime = Date.now();   

    // Calculates the dyno uptime
    var dMillival = locTime - dUp;
    var dOut = reDate(dMillival);

    // Sets up the embed
    const embed = new Discord.MessageEmbed()
      .setAuthor("Gyromina Uptime", client.user.avatarURL())
      .setColor(0x7effaf)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setTimestamp();

    hData.get(`/apps/${process.env.herokuID}`)
      .then(app => {
         // API data pulled!
        let up = Date.parse(app.released_at);
        let millival = locTime - up;
        let out = reDate(millival);

        // Full embed
        embed.setTitle(out);
        embed.setDescription(`That's ${millival} milliseconds, wow!`);
        embed.addField("Dyno Uptime", dOut);

        // Sends the embed
        message.channel.send({embed: embed});
      })
      .catch (err => { // Could not pull API data
        console.error("API request failed; defaulting to minimal uptime report", err);

        // Minimal embed
        embed.setTitle(dOut);
        embed.setDescription(`That's ${dMillival} milliseconds, wow!`);

        // Sends the embed
        message.channel.send({embed: embed});
    });  
  },
};
  
exports.help = {
  "name": 'uptime',
  "aliases": ["up", "online", "readytime"],
  "description": 'Shows Gyromina\'s uptime.',
  "usage": `${process.env.prefix}uptime`,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
  
