const package = require('../package.json');

module.exports.run = {
    execute(message, args) {
        process.env.github = JSON.parse(process.env.github);

        // we wont need to change these so might as well put them as consts
        const version = args[0];
        const announce = args[1];
        const forceverification = args[2] === "-y";


    }
};

module.exports.help = {
    "name": "deploy",
    "aliases": ["deploy", "rel", "dep"],
    "description": "Deploys a new version of Gyromina. (Owner only)",
    "usage": `${process.env.prefix}release <Version> [AnnounceToDiscord?] [-y]`,
    "params": "(owner only)",
    "hide": 1,
    "wip": 1,
    "dead": 0,
};

// Functions
