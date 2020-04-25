module.exports.run = {
  execute(message, args, client) {

    // Pseudocode time!
      // check if poll is valid (has type/prompt/options/etc.)
      // create embed shell
      // check poll type
      // CASE 1: preset poll
        // add prompt
        // react with options (await)
      // CASE 2: custom poll
        // add prompt
        // handle emojis + descriptors
        // METHOD I:
          // join array + .split("-") + .shift()
          // .split(" ") to temp array
          // join + push to final array
        // METHOD II:
          // detect using .startsWith("-")
          // split off to temp array
          // join + push to final array
        // add emojis + descriptors
        // reach with options (await)
      // post poll embed
      // done!
    
  },
};

module.exports.help = {
  "name": "poll",
  "description": "Creates a poll in the current channel.",
  "usage": `${process.env.prefix}poll <type> <prompt> -[options]\n   **--OR--** ${process.env.prefix}poll <prompt> -<e1> [o1] -[e2] [o2] …`,
  "params": ["<type> <prompt> -[options]", "<prompt> -<e1> [o1] -[e2] [o2] …"],
  "helpurl": "https://lx375.weebly.com/gyrocmd-poll",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};