const {REST} = require('@discordjs/rest'); // REST API
const API = require('discord-api-types/v9'); // Discord API connection

const slashCommands = [];

/** Deploys slash commands locally to hostGuildID
 * @param {object} client The Discord client object
 * @return {boolean}
 */
exports.localDeploy = async function(client) {
  // collects slash command builders
  client.commands.forEach(c => {
    if(c.help.s && c.help.s.builder)
      slashCommands.push(c.help.s.builder.toJSON());
  });

  // connects to REST API
  const rest = new REST({version: '9'}).setToken(process.env.token);

  try {
    // registers commands
    await rest.put(
      API.Routes.applicationGuildCommands(process.env.clientID, process.env.hostGuildID),
      {body: slashCommands},
    );
    return 0;
  } catch (error) {
    // generates an error message & logs the error
    console.error(error.stack);
    return 1;
  }
}

/** Requests a global slash command deploy
 * @param {object} client The Discord client object
 * @return {boolean}
 */
exports.globalDeploy = async function(client) {
  // collects slash command builders
  client.commands.forEach(c => {
    if(c.help.s && c.help.s.builder)
      slashCommands.push(c.help.s.builder.toJSON());
  });

  // connects to REST API
  const rest = new REST({version: '9'}).setToken(process.env.token);

  try {
    // registers commands globally
    await rest.put(
      API.Routes.applicationCommands(process.env.clientID),
      {body: slashCommands},
    );
    return 0;
  } catch (error) {
    // generates an error message & logs the error
    console.error(error.stack);
    return 1;
  }
}