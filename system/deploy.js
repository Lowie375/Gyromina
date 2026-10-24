const D = require('discord.js'); // discord.js

const slashCommands = [];

/** Deploys slash commands locally to hostGuildID
 * @param {D.Client} client The Discord client object
 * @return {boolean} `true` if an error occurred, `false` if not (deployment successful)
 */
exports.localDeploy = async function(client) {
  // collects slash command builders
  client.commands.forEach(c => {
    if(c.help.s && c.help.s.builder)
      slashCommands.push(c.help.s.builder.toJSON());
  });

  // connects to REST API
  const rest = new D.REST({version: '10'}).setToken(process.env.token);

  try {
    // registers commands
    await rest.put(
      D.Routes.applicationGuildCommands(process.env.clientID, process.env.hostGuildID),
      {body: slashCommands},
    );
    return false;
  } catch (error) {
    // generates an error message & logs the error
    console.error(error.stack);
    return true;
  }
}

/** Requests a global slash command deploy + removes locally deployed slash commands
 * @param {D.Client} client The Discord client object
 * @return {boolean} `true` if an error occurred, `false` if not (deployment successful)
 */
exports.globalDeploy = async function(client) {
  // collects slash command builders
  client.commands.forEach(c => {
    if(c.help.s && c.help.s.builder)
      slashCommands.push(c.help.s.builder.toJSON());
  });

  // connects to REST API
  const rest = new D.REST({version: '10'}).setToken(process.env.token);

  try {
    // registers commands globally
    await rest.put(
      D.Routes.applicationCommands(process.env.clientID),
      {body: slashCommands},
    );
    /* // removes locally deployed slash commands
    let guild = client.guilds.cache.get(process.env.hostGuildID);
    guild.commands.cache.forEach((k, v) => {
      guild.commands.delete(k);
    });*/
    return false;
  } catch (error) {
    // generates an error message & logs the error
    console.error(error.stack);
    return true;
  }
}
