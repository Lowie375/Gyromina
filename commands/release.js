const { Write, Clean } = require("../GlobalFunctions");
const colors = require('colors');
let request = require('request');
let json = JSON.parse(process.env.github);

let startTime;
const githubApiEndpoint = `https://api.github.com/repos/${json.username}/${json.repoName}`;

let version = "";

module.exports.run = {
    execute(message, args, client) {
        // we wont need to change these so might as well put them as consts
        const vers = args[0];
        const announce = args[1] === "false";
        const forceVerification = args.join(" ").toString().includes("-y");

        version = vers;

        //check stuff
        if (version === undefined)
            return message.channel.send("You have not provided a version number.");

        if (!forceVerification)
        {
            let filter = m => m.author.id === message.author.id;
            const input = message.channel.createMessageCollector(filter);

            message.channel.send(`Are you absolutely sure you want to release ${Clean(version)}?`);

            filter = m => m.content.toLowerCase().trim() === "cancel" && m.author.id === message.author.id;
            const cancelChecker = message.channel.createMessageCollector(filter, {
                time: 60000
            });

            cancelChecker.on('collect', m => {
                cancelChecker.stop();
                input.stop();
                message.channel.send("Cancelled!");
            });

            input.on('collect', m => {
                if (m.content.toLowerCase().trim() === "cancel") return;

                cancelChecker.stop();
                input.stop();

                main();
            });
        }
        else
            main();

        function main()
        {
            message.channel.send("Releasing...")
                .then(relMsg => {

                    Write(`Releasing version ${version} ${forceVerification === true ? "(Forced)" : ""}`);

                    GetChangelogString(str => {
                        let string = `Gyromina V${version} has been released! this now fixes and adds:\n` + str;

                        if (!announce)
                            client.channels.get(process.env.logChannel).send(string);

                        CreateGithubRelease(string);

                        relMsg.edit("Released!").then(() => {
                            setTimeout(() => relMsg.delete(), 2000)
                        });
                    });
                });
        }
    }
};

// Functions
function CreateGithubRelease (changeLogText) {
    let options = {
        method: "post",
        url: `${githubApiEndpoint}/releases`,
        body: JSON.stringify({
            name: `v${version}`,
            tag_name: version,
            body: changeLogText,
            draft: true, // we dont want to release it just yet until we confirm about everything.
            published_at: Date.now()
        })
    };

    Write(`Creating release ${version}...`.blue, startTime, false);

    AuthenticatedBlockingPerform(options, (res, bod) => {
        Write(`Version ${version} released!`);
    });
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
    startTime = Date.now();

    Write(`Fetching pull requests`.yellow, startTime, false);

    getPullRequests(prs => {
        let str = "";

        for (let i = 0; i < prs.length; i++)
        {
            let pr = prs[i];

            str += `- ${pr.title} | ${pr.user.login}\n`
        }

        func(str);
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
                let releaseJson = release;

                for (let i = 0; i < miniJson.length; i++)
                {
                    let pr = miniJson[i];

                    if (pr.merged_at == null) continue;

                    let mergedAtDate = new Date(pr.merged_at);
                    let publishedatDate;

                    if (releaseJson === undefined || releaseJson.published_at === undefined) publishedatDate = new Date(0);

                    if (mergedAtDate < publishedatDate) continue;

                    let prOption = {
                        method: "get",
                        url: pr.url
                    };

                    AuthenticatedBlockingPerform(prOption, (prRes, prBod) => {
                        let json = JSON.parse(prBod);
                        pullRequest.push(json);

                        Write(`Got ${pr.title} (${pr.html_url})`.yellow, startTime, false);

                        prs(pullRequest);
                    })
                }
            })
        });
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

module.exports.help = {
    "name": "release",
    "aliases": ["deploy", "rel", "dep"],
    "description": "Deploys a new version of Gyromina. (Owner only)",
    "usage": `${process.env.prefix}release <version> [announceToDiscord?] [-y]`,
    "params": "<version> [announceToDiscord?] [-y] (owner only)",
    "hide": 1,
    "wip": 1,
    "dead": 0,
};
