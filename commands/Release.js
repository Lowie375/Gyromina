const package = require('../package.json');
const functions = require('../GlobalFunctions');
let request = require('request');
let json = JSON.parse(process.env.github);

const startTime = Date.now();
const githubApiEndpoint = `https://api.github.com/repos/${json.username}/${json.repoName}`;

module.exports.run = {
    execute(message, args) {
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
function CreateGithubRelease (changeLogText, uri, func) {
    let options = {
        method: "post",
        url: uri
    }
}

function AuthenticatedBlockingPerform (options, func) {
    options.headers = {
        'Authorization': `token ${json.token}`,
        'User-Agent': 'Gyromina',
        'content-type': 'application/json',
    };

    request(options, (err, res, bod) => {
        if (err) console.error(err);

        func(res, bod);
    });
}

function GetChangelogString (func)
{
    getPullRequests(prs => {

    });

    function getPullRequests(prs)
    {
        let pullRequest = [];

        // Gets the last release
        getLastGithubRelease(release => {
            let miniOptions = {
                method: "get",
                url: `${githubApiEndpoint}/pulls?state=closed`
            };

            AuthenticatedBlockingPerform(miniOptions, (resMini, bodMini) => {
                let miniJson = JSON.parse(bodMini);
                let releaseJson = JSON.parse(release);

                for (let pr in miniJson)
                {
                    if (miniJson.merged_at == null) continue;
                    if (miniJson.merged_at < releaseJson.published_at) continue;

                    functions.Write(`Got ${miniJson.title}!`, startTime, false);

                    let prOption = {
                        method: "get",
                        url: `${githubApiEndpoint}/pulls/${miniJson.number}`
                    };

                    AuthenticatedBlockingPerform(prOption, (prRes, prBod) => {
                        let json = JSON.parse(prBod);
                        pullRequest.push(json);
                    })
                }
            })
        });

        prs(pullRequest);
    }

    function getLastGithubRelease(func)
    {
        let options = {
            method: "get",
            url: `${githubApiEndpoint}/releases`
        };

        AuthenticatedBlockingPerform(options, (res, bod) => {
            let json = JSON.parse(bod);

            func(json[0]);
        })
    }
}