const bent = require('bent'); // bent
const colors = require('colors'); // colors
const package = require('../package.json'); // package file
// console timestamper, mention cleaner, rejection embed generator
const {Write, Clean, genRejectEmbed} = require("../system/globalFunctions.js"); 

// replaced deprecated 'request' with 'bent': may not work the same, but this function is deprecated anyway, so hopefully it'll be fine
const post = bent('POST', [200, 201, 202]);
const get = bent('GET', [200, 202]);

let startTime;
const githubApiEndpoint = `https://api.github.com/repos/${process.env.gitUsername}/${process.env.gitRepoName}`;

let version = "";

exports.run = {
  execute(message, args, client) {
    // we wont need to change these so might as well put them as consts
    const vers = args[0];
    const announce = args.join(" ").toString().includes("-a");
    const forceVerification = args.join(" ").toString().includes("-y");
    const softRelease = args.join(" ").toString().includes("-s");

    version = vers;

    //check stuff
    if (version === undefined)
      return message.channel.send({embeds: [genRejectEmbed(message, "No version number provided")]});

    if (message.author.id !== package.authorID)
      return message.channel.send({embeds: [genRejectEmbed(message, "Insufficient permissions")]}); // replace w/ error embed

    if (!forceVerification) {
      let filter = m => m.author.id === message.author.id;
      const input = message.channel.createMessageCollector({filter});

      message.channel.send(`Are you absolutely sure you want to release ${Clean(version)}?`);

      filter = m => m.content.toLowerCase().trim() === "cancel" && m.author.id === message.author.id;
      const cancelChecker = message.channel.createMessageCollector({filter, time: 60000});

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
      

    function main() {
      message.channel.send("Releasing…")
        .then(relMsg => {

          Write(`Releasing version ${version} ${forceVerification === true ? "(Forced)" : ""}`);

          GetChangelogString(str => {
            let string = `Gyromina v${version} has been released! this now fixes and adds:\n` + str;

            if (!announce) {
              let pLog = client.channels.cache.get(process.env.progressLog)
              pLog.send(string);
            }

            if (!softRelease)
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
    url: `${githubApiEndpoint}/releases`,
    body: JSON.stringify({
      name: `v${version}`,
      tag_name: version,
      body: changeLogText,
      draft: true, // we dont want to release it just yet until we confirm about everything.
      published_at: Date.now()
    })
  };

  Write(`Creating release ${version}…`.blue, startTime, false);

  AuthenticatedBlockingPerform(options, post, (res, bod) => {
    Write(`Version ${version} released!`);
  });
}

function AuthenticatedBlockingPerform (options, bentFunc, func) {
  options.headers = {
    'Authorization': `token ${process.env.gitToken}`,
    'User-Agent': 'Gyromina',
    'content-type': 'application/json',
  };

  bentFunc(options, (err, res, bod) => {
    if (err) console.error(err);

    func(res, bod);
  });
}

function GetChangelogString (func) {
  startTime = Date.now();

  Write(`Fetching pull requests`.yellow, startTime, false);

  getPullRequests(prs => {
    let str = "";

    for (let i = 0; i < prs.length; i++)
    {
      let pr = prs[i];

      str += `- ${pr.title} | ${pr.user.login}\n${pr.body}\n`
    }

    func(str);
  });

  function getPullRequests(prs) {
    let pullRequest = [];

    // Gets the last release
    getLastGithubRelease(release => {
      let miniOptions = {
        url: `${githubApiEndpoint}/pulls?state=closed`
      };

      AuthenticatedBlockingPerform(miniOptions, get, (resMini, bodMini) => {
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
            url: pr.url
          };

          AuthenticatedBlockingPerform(prOption, get, (prRes, prBod) => {
            let json = JSON.parse(prBod);
            pullRequest.push(json);

            Write(`Got ${pr.title} (${pr.html_url})`.yellow, startTime, false);

            prs(pullRequest);
          })
        }
      })
    });
  }

  function getLastGithubRelease(func) {
    let options = {
      url: `${githubApiEndpoint}/releases`
    };

    AuthenticatedBlockingPerform(options, get, (res, bod) => {
      let json = JSON.parse(bod);

      func(json[0]);
    })
  }
}

exports.help = {
  "name": "release",
  "aliases": ["deploy", "rel", "dep"],
  "description": "Deploys a new version of Gyromina. [DEPRECATED AS OF VERSION 1.2.0]",
  "usage": `${process.env.prefix}release`,
  "default": 0,
  "weight": 1,
  "hide": true,
  "wip": false,
  "dead": true
};
