# ​ [![Gyromina, a multipurpose Discord bot][gyro-banner]][info]

[![Discord.js Version][djs-img]][djs-link]
[![Bot Version][version-img]](package.json)
[![Dependency Status][dependency-img]][dependency-link]
[![Last Commit (master)][master-commit-img]][master-commit-img]
[![Last Commit (indev-branch)][indev-commit-img]][indev-commit-img]
[![License][license-img]](LICENSE)

## About

### "Fun + function, all in one."

Created by **L375**#6740 \([@Lowie375](https://www.github.com/Lowie375)\), with contributions & support from **Alten**#4351 \([@Altenhh](https://www.github.com/Altenhh)\) and **Homura**#5331 \([@Homurasama](https://www.github.com/Homurasama)\)

Latest stable build: v1.0.0

Gyromina is entirely open source and is licensed under the terms of the [MIT license](LICENSE)

### External Links

**[Info Pages][info]** / **[Commands][commands]** / **[Changelog][log]** / **[Invite Link][invite]**

### Overview

Gyromina is a multipurpose Discord bot, made to be a fun and functional addition to any Discord server.

Gyromina contains an assortment of features, including a random colour and number generator, a unit converter, a library of minigames, a custom poll creator, miscellaneous fun commands, and more!

## Setup

### General (for server owners/admins)

* Follow this link: **[https://discord.now.sh/490590334758420481?p537259072][invite]**
* Choose a server to add Gyromina to
* Make sure all requested permissions are enabled (critical: **`Use External Emojis`**, **`Manage Webhooks`**, and **`Manage Messages`**)
* You're good to go! Have fun!

### Test Bots (for contributors/debuggers)

#### Requirements

* Discord bot token + channel access

#### Config

* Fork/download source code + `npm install` in terminal
* Configure environment variables
  * `token`/`prefix`: Self-explanatory; Discord bot token/prefix
  * `exp`: `"1"` to enable experimental commands, `"0"` to disable
  * `hostID`: Your Discord user ID (enables local use of `shutdown` and `vartest`)
  * `errorLog`/`eventLog`: Discord channel IDs for logging errors/events
* Optional environment variable config
  * `progressLog`: Discord channel ID (used with `release`)
  * `gitToken`/`gitUsername`/`gitRepoName`: GitHub auth token/username/repo name (token scope = `repo`; used with `release`)
  * `herokuAuth`/`herokuID`: Heroku auth token/project ID (used with `uptime`)
* Run using your native runtime/debugger and you're good to go!

## Bug Reports

Please see the "**[If you are reporting a bug](docs/CONTRIBUTING.md#if-you-are-reporting-a-bug)**" section of **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for bug-reporting protocol.

## Changelog

Gyromina's changelog can be found at **[https://lx375.weebly.com/gyro-log][log]**.

## Code of Conduct

The community Code of Conduct can be found under **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)**.

## Contributing

Contributions to Gyromina are always welcome! I'm a novice, so I don't know all the best tips, tricks, and optimizations for JavaScript and Node. A little help can go a long way.

Please see **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for contribution information + general style notes and **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)** for the community code of conduct.

## Contributors

[![Major Contributor 💻][maj-contrib-label]][maj-contrib-label]
[![Minor Contributor 💾][min-contrib-label]][min-contrib-label]
[![Debugger 🦟][debugger-label]][debugger-label]
[![Beta Tester ⌚][tester-label]][tester-label]

### Author

* 💻 L375#6740 - [@Lowie375](https://www.github.com/Lowie375)

### Repo Contributors

* 💻 Alten#4351 - [@Altenhh](https://www.github.com/Altenhh)
* 💻 Homura#5331 - [@Homurasama](https://www.github.com/Homurasama)

<!-- ### Helpers -->

<!-- Links -->
[commands]: https://lx375.weebly.com/gyro-commands
[gyro-banner]: https://cdn.discordapp.com/attachments/429364141355171840/703428268501762119/GyrominaPlasmaBanner.png
[info]: https://lx375.weebly.com/gyromina
[invite]: https://discord.now.sh/490590334758420481?p537259072
[log]: https://lx375.weebly.com/gyro-log

[djs-link]: https://discord.js.org
[dependency-link]: https://david-dm.org/Lowie375/Gyromina
[contributors-link]: https://github.com/Lowie375/Gyromina/graphs/contributors

<!-- Labels -->
[djs-img]: https://img.shields.io/github/package-json/dependency-version/Lowie375/Gyromina/discord.js
[version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina
[dependency-img]: https://david-dm.org/Lowie375/Gyromina.svg
[master-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina?label=last%20commit%20%28master%29
[indev-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina/indev-branch?label=last%20commit%20%28indev-branch%29
[license-img]: https://img.shields.io/github/license/Lowie375/Gyromina

[maj-contrib-label]: https://img.shields.io/badge/major%20contributor-%F0%9F%92%BB-7effaf
[min-contrib-label]: https://img.shields.io/badge/minor%20contributor-%F0%9F%92%BE-7effaf
[debugger-label]: https://img.shields.io/badge/debugger-%F0%9F%A6%9F-7effaf
[tester-label]: https://img.shields.io/badge/beta%20tester-%E2%8C%9A-7effaf
