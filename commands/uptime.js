const D = require('discord.js'); // discord.js
const S = require('@discordjs/builders'); // slash command builder
const Heroku = require('heroku-client'); // Heroku client
const colors = require('colors'); // colors
const e = require('../systemFiles/emojis.json'); // emoji file
const style = require('../systemFiles/style.json'); // style file
// permission checker, emoji colour checker, timestamp generator, responder
const {p, eCol, stamp, respond} = require('../systemFiles/globalFunctions.js');

// Extra setup
const hData = new Heroku({token: process.env.herokuAuth});

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
  // Returns the cleaned output
  return display.slice(0, -2);
}

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const dyno = p(message, [D.Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? client.emojis.cache.get(e.dyno) : e.alt.dyno;

    // Gets the current time and the ready time
    var dUp = Date.parse(client.readyAt);
    var locTime = Date.now();   

    // Calculates the dyno uptime
    var dMillival = locTime - dUp;
    var dOut = reDate(dMillival);

    // Sets up the embed
    const embed = new D.MessageEmbed()
      .setAuthor("Gyromina Uptime", client.user.avatarURL())
      .setColor(eCol(style.e.default))
      .setFooter(`Requested by ${message.author.tag} - ${stamp()}`, message.author.avatarURL())

    hData.get(`/apps/${process.env.herokuID}`)
      .then(app => {
        // API data pulled!
        let up = Date.parse(app.released_at);
        let millival = locTime - up;
        let out = reDate(millival);

        // Full embed
        embed.setTitle(out);
        embed.setDescription(`That's ${millival} milliseconds, wow!`);
        embed.addField(`${dyno}  Dyno Uptime`, dOut);

        // Sends the embed
        return respond({embeds: [embed]}, [message, message]);
      })
      .catch (err => { // Could not pull API data
        console.error(colors.nope("API request failed; defaulting to minimal uptime report"), err);

        // Minimal embed
        embed.setTitle(dOut);
        embed.setDescription(`That's ${dMillival} milliseconds, wow!`);

        // Sends the embed
        return respond({embeds: [embed]}, [message, message]);
    });  
  },
  slashArgs(interact) {
    // template: no args
    return "";
  },
};
  
exports.help = {
  "name": "uptime",
  "aliases": ["up", "online", "readytime"],
  "description": "Shows Gyromina's uptime.",
  "usage": `${process.env.prefix}uptime`,
  "default": 0,
  "weight": 1,
  "hide": false,
  "wip": false,
  "dead": false,
  "s": {
    "wip": true,
    "builder": new S.SlashCommandBuilder()
      .setName("uptime")
      .setDescription("Shows Gyromina's uptime")
  }
};
  