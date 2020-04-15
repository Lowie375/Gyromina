// Require discord.js
const Discord = require('discord.js');

module.exports.run = {
  execute(message, args, client) {
    // Gets the current time and time the bot went online (ready time)
    var up = Date.parse(client.readyAt);
    var locTime = Date.now();

    // Calculates the uptime (in milliseconds)
    var millival = locTime - up;

    // Seconds
    var secs = Math.floor(millival/1000);
    // Minutes
    var mins = Math.floor(secs/60);
    secs -= mins*60;
    // Hours
    var hrs = Math.floor(mins/60);
    mins -= hrs*60;
    // Days
    var days = Math.floor(hrs/24);
    hrs -= days*24;

    // Sets up the main uptime display
    var display = ``;
    if (days == 1)
      display += `${days} day, `;
    else if (days != 0)
      display += `${days} days, `;

    if (hrs == 1)
      display += `${hrs} hour, `;
    else if (hrs != 0)
      display += `${hrs} hours, `;

    if (mins == 1)
      display += `${mins} minute, `;
    else if (mins != 0)
      display += `${mins} minutes, `;

    if (secs == 1)
      display += `${secs} second, `;
    if (secs != 0)
      display += `${secs} seconds, `;

    const embed = new Discord.MessageEmbed()
      .setAuthor("Gyromina Uptime", client.user.avatarURL())
      .setColor(0x7effaf)
      .setTitle(`${display.slice(0, -2)}`)
      .setDescription(`That's ${millival} milliseconds, wow!`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setTimestamp();

    // Sends the embed
    message.channel.send({embed: embed});
  },
};
  
module.exports.help = {
  "name": 'uptime',
  "aliases": ["up", "online", "readytime"],
  "description": 'Shows Gyromina\'s uptime.',
  "usage": `${process.env.prefix}uptime`,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
  
