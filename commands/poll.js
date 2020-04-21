module.exports.run = {

};

module.exports.help = {
  "name": "poll",
  "description": "Creates a poll. Type \'yn\' creates a yes/no poll, and type \'ynn\' creates a yes/neutral/no poll. Custom polls can be made using the 2nd syntax (e# = emoji, o# = option text), with 1-20 options per poll.",
  "usage": `${process.env.prefix}poll <type> <prompt> \n   **--OR--** ${process.env.prefix}poll <prompt> -<e1> <o1> -[e2] [o2] …`,
  "params": ["<type> <prompt>", "<prompt> -<e1> <o1> -[e2] [o2] …"],
  "helpurl": "https://lx375.weebly.com/gyrocmd-poll",
  "hide": 0,
  "wip": 1,
  "dead": 0,
};