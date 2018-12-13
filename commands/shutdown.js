module.exports = {

  name: "shutdown",
  aliases: ["off", "stop", "quit"],
  description: "Shuts down Gyromina.",
  execute(message, args) {
    // Gets the 'gyrominaNo' and 'gyrominaYes' emojis
    const nope = message.client.emojis.get("493575012276633610");
    const yep = message.client.emojis.get("493570632785723402");

    // Checks to see if the bot owner (L375#6740) sent the message.
    if(message.author.id !== process.env.ownerID) {
      message.channel.send(`${nope} Error - Insufficient permissions!`)
      console.log('A user attempted to shut me down, but was unsuccessful!')
      return;
    }

    // Shuts down the current instance of the Discord Client.
    message.channel.send(`${yep}`);
    message.client.user.setStatus("invisible");
    console.log(`Shutting down ${message.client.user.tag}...\n- - - - - - - - - - -`);
    message.client.destroy();
  },
};
