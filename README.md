# ​ ![Gyromina, a multipurpose Discord bot][gyro-banner]

[![Discord.js Version][djs-img]][djs-link]
[![Bot Version][version-img]](package.json)
[![Dependencies Status][dependency-img]][dependency-link]
[![Last Commit][commit-img]][commit-img]
[![Contributors][contributors-img]][contributors-link]
[![License][license-img]](LICENSE)

## About

### "Fun + function, all in one."

Created by L375#6740 \([@Lowie375](https://www.github.com/Lowie375)\), with contributions & support from Alten#4148 \([@Altenhh](https://www.github.com/Altenhh)\) and Homura#5331

Latest stable build: 0.12.0

Gyromina is licensed under the terms of the [MIT license](LICENSE)

### External Links

**[Info Pages][info]** / **[Commands][commands]** / **[Changelog][log]** / **[Invite Link][invite]**

### Functionality

Gyromina can do a bunch of things, like generate random colours and numbers, play minigames, perform unit conversions, create polls, and more!

## Setup

### General (for server owners/admins)

* Follow this link: [https://discord.now.sh/490590334758420481?p537259072][invite]
* Choose a server to add Gyromina to
* Make sure all requested permissions are enabled (namely Manage Webhooks and Manage Messages)
* You're good to go! Have fun!

### Test Bots (for contributors/debuggers)

#### Discord bot token + channel access required

* Fork/download source code + `npm install` in terminal
* Configure environment variables
  * `token`/`prefix`: Self-explanatory; Discord bot token/prefix
  * `exp`: `"1"` to enable experimental commands, `"0"` to disable
  * `progressLog`/`errorLog`: Discord channel IDs for integrated commit/error logs
  * `gitToken`/`gitUsername`/`gitRepoName`: Optional; only used with `release`
* Configure package file
  * `hostID` = Your Discord user ID (enables local use of `shutdown` and `vartest`)
* Run using your native runtime/debugger and you're good to go!

## Contributing

Contributions to Gyromina are always welcome! I'm still an amateur programmer, so I don't know all the best tips, tricks, and optimisation techniques for JavaScript and Node. A little help goes a long way.
Please see **CONTRIBUTING.md** (TBA) for general style notes, contribution code of conduct, and other relevant notes.

## Contributors

[![Major Contributor 💻][maj-contrib-label]][maj-contrib-label]
[![Minor Contributor 📗][min-contrib-label]][min-contrib-label]
[![Debugger 🦟][debugger-label]][debugger-label]

### Author

* 💻 L375#6740 - [@Lowie375](https://www.github.com/Lowie375)

### Repo Contributors

* 💻 Alten#4148 - [@Altenhh](https://www.github.com/Altenhh)
* 📗 Homura#5331 - @Homurasama

<!-- ### Helpers -->

<!-- ### Testers -->

<!-- Links + images -->
[commands]: https://lx375.weebly.com/gyro-commands
[gyro-banner]: https://cdn.discordapp.com/attachments/429364141355171840/703428268501762119/GyrominaPlasmaBanner.png
[info]: https://lx375.weebly.com/gyromina
[invite]: https://discord.now.sh/490590334758420481?p537259072
[log]: https://lx375.weebly.com/gyro-log

[djs-link]: https://discord.js.org
[dependency-link]: https://david-dm.org/Lowie375/Gyromina
[contributors-link]: https://github.com/Lowie375/Gyromina/graphs/contributors

[djs-img]: https://img.shields.io/github/package-json/dependency-version/Lowie375/Gyromina/discord.js
[version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina
[dependency-img]: https://david-dm.org/Lowie375/Gyromina.svg
[commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina/0.12.0
[contributors-img]: https://img.shields.io/github/contributors/Lowie375/Gyromina
[license-img]: https://img.shields.io/github/license/Lowie375/Gyromina

[maj-contrib-label]: https://img.shields.io/badge/major%20contributor-%F0%9F%92%BB-7effaf
[min-contrib-label]: https://img.shields.io/badge/minor%20contributor-%F0%9F%93%97-7effaf
[debugger-label]: https://img.shields.io/badge/debugger-%F0%9F%A6%9F-7effaf
