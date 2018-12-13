// List of 'proofs'
const proof = ["because that's just how it is.\n**Deal with it.**",
  "because smart people think so.\n**Deal with it.**",
  "because Gyromina said so.\n**Deal with it.**", 
  "for some odd reason.\n**Deal with it.**", 
  "because Gyromina is too slow to argue.\n**Deal with it.**",
  "because Gyromina heard that was true.\n**Deal with it.**",
  ".\n**Deal with it.**",
  "because Gyromina was never told otherwise.\n**Deal with it.**"];

// Basic RNG
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {

  name: "prove",
  description: "\'Proves\' that the input is true.",
  execute(message, args) {

    if (!args.length) {
      message.reply("you didn't give me anything to prove!")
    } else {
      const [...statement] = args;

      var num = getRandomInt(0, proof.length);
      if (num >= (proof.length - 1)) {
        num = proof.length - 1;
      }

      const selected = proof[num];

      message.channel.send(statement.join(" ") + " " + selected);
    }
  },
};
