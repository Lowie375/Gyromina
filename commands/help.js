const { prefix } = require('../config.json');

module.exports = {

  name: "help",
  description: "Lists all of Gyromina's commands.",
  execute(message, args) {

    if (!args.length) {
      // generic help
    } else {
      // specific help
    }
  },
};
