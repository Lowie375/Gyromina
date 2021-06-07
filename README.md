# ​ [![Gyromina, a multipurpose Discord bot][gyro-banner-pride]][info]

[![Discord.js Version][djs-img]][djs-link]
[![Bot Version][version-img]][master-pkg]
[![Indev Version][indev-version-img]][indev-pkg]
[![Dependency Status][dependency-img]][dependency-link]
[![Top Language][lang-img]][lang-link]
[![License][license-img]](LICENSE)  
[![Last Commit (master)][master-commit-img]][master-tree-link]
[![Last Commit (indev-branch)][indev-commit-img]][indev-tree-link]
[![Build Status][build-img]][build-link]
[![Scrutinizer Code Quality][code-quality-img]][code-quality-link]

## About

### "Fun + function, all in one."

Created by **[L375](https://l375.weebly.com/about) \([@Lowie375](https://github.com/Lowie375)\)**, with contributions & support from **Laica \([@Altenhh](https://github.com/Altenhh)\)**, **[@nakanino](https://github.com/nakanino)**, and **[@alazymeme](https://github.com/alazymeme)**

Latest stable build: v1.1.4  

Gyromina is entirely open source and licensed under the [MIT license](LICENSE)

### External Links

**[Info Pages][info]** / **[Commands][commands]** / **[Changelog][log]** / **[Invite Link][invite]**

### Overview

Gyromina is a multipurpose Discord bot, made to be a fun and functional addition to any Discord server.

Gyromina contains an assortment of features, including a random colour and number generator, a unit converter, a library of minigames, a custom poll creator, miscellaneous fun commands, and more!

### Events + Seasons 🏳️‍🌈 🏳️‍⚧️

Occasionally, Gyromina will get some special features and UI changes during certain events throughout the year!

The **pride** event is currently active and will remain active throughout the month of June!  
Gyromina was created by an openly LGBTQIA+ creator who is absolutely proud to be who they are and eternally grateful to be residing in an accepting area of the world. As a show of support for the LGBTQIA+ community, Gyromina will don a rainbow profile picture and have some special easter eggs enabled.

💗💛💙 💛🤍💜🖤 💙❤️🖤

## Setup

### General (for server owners/admins)

* Follow this link: **[https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot][invite]**
* Choose a server to add Gyromina to
* Make sure all requested permissions are enabled
  * Critical: **`Send Messages`**, **`View Channels`**, **`Read Message History`**, **`Add Reactions`**
  * Highly recommended: **`Use External Emojis`**, **`Manage Messages`**
* You're good to go! Have fun!

### Test or Local Bots (for contributors/debuggers)

#### Requirements

* Discord bot token + channel access

#### Config

* Fork/download source code + `npm install` in terminal
* Configure environment variables (`1.1.x` = **`v9`** setup)
  * `token`/`prefix`: Self-explanatory; Discord bot token/prefix
  * `exp`: `"1"` to enable experimental commands, `"0"` to disable  
  (WARNING: experimental commands may break! use at your own risk!)
  * `hostID`: Your Discord user ID (enables local use of `shutdown` and `vartest`)
  * `errorLog`/`eventLog`: Discord channel IDs for logging errors/events
* Optional environment variable config
  * `season`: Style override; `"0"` to disable, `"1"` for pride, `"2"` for winter, `"3"` for blurple
  * `progressLog`: Discord channel ID (used with `release`)
  * `gitToken`/`gitUsername`/`gitRepoName`: GitHub auth token/username/repo name (token scope = `repo`; used with `release`)
  * `herokuAuth`/`herokuID`: Heroku auth token/project ID (used with `uptime`)
* Run using your native runtime/debugger/host and you're good to go!

## Bug Reports

Please see the "**[If you are reporting a bug](docs/CONTRIBUTING.md#if-you-are-reporting-a-bug)**" section of **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for bug-reporting protocol.

## Changelog

Gyromina's changelog can be found at **[https://l375.weebly.com/gyro-log][log]**.

## Code of Conduct

The community Code of Conduct can be found under **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)**.

## Contributing

Contributions to Gyromina are always welcome! I'm a novice, so I don't know the best tips, tricks, and optimizations for JavaScript/Node. A little help can go a long way.

Please see **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for contribution information + general style notes and **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)** for the community code of conduct.

## Contributors

[![Major Contributor 💻][maj-contrib-label]][maj-contrib-label]
[![Minor Contributor 💾][min-contrib-label]][min-contrib-label]
[![Debugger 🦟][debugger-label]][debugger-label]
[![Beta Tester ⌚][tester-label]][tester-label]

* 💻 [L375](https://l375.weebly.com/about) - [@Lowie375](https://github.com/Lowie375)
* 💻 Laica - [@Altenhh](https://github.com/Altenhh)
* 💻 nakanino - [@nakanino](https://github.com/nakanino)
* 💾 alazymeme - [@alazymeme](https://github.com/alazymeme)

<!-- ### Helpers -->

<!-- Links -->
[commands]: https://l375.weebly.com/gyro-commands
[info]: https://l375.weebly.com/gyromina
[invite]: https://discordapp.com/oauth2/authorize?client_id=490590334758420481&permissions=537259072&scope=bot
[log]: https://l375.weebly.com/gyro-log

[master-pkg]: https://github.com/Lowie375/Gyromina/blob/master/package.json
[indev-pkg]: https://github.com/Lowie375/Gyromina/blob/indev-branch/package.json

[djs-link]: https://discord.js.org
[dependency-link]: https://david-dm.org/Lowie375/Gyromina
[contributors-link]: https://github.com/Lowie375/Gyromina/graphs/contributors
[master-tree-link]: https://github.com/Lowie375/Gyromina/tree/master
[indev-tree-link]: https://github.com/Lowie375/Gyromina/tree/indev-branch
[lang-link]: https://github.com/Lowie375/Gyromina/search?l=javascript
[build-link]: https://scrutinizer-ci.com/g/Lowie375/Gyromina
[code-quality-link]: https://scrutinizer-ci.com/g/Lowie375/Gyromina

<!-- Banners -->
[gyro-banner]: https://cdn.discordapp.com/attachments/492389515478958101/815054288644472842/GyrominaBannerRMOpen.png
[gyro-banner-pride]: https://cdn.discordapp.com/attachments/429364141355171840/842935847594491924/GyrominaBannerRMOpen-pride.png

<!-- Labels -->
[djs-img]: https://img.shields.io/github/package-json/dependency-version/Lowie375/Gyromina/discord.js
[version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina
[indev-version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina/indev-branch?label=indev%20version
[dependency-img]: https://david-dm.org/Lowie375/Gyromina.svg
[master-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina?label=last%20commit%20%28master%29
[indev-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina/indev-branch?label=last%20commit%20%28indev-branch%29
[license-img]: https://img.shields.io/github/license/Lowie375/Gyromina
[lang-img]: https://img.shields.io/github/languages/top/Lowie375/Gyromina
[build-img]: https://img.shields.io/scrutinizer/build/g/Lowie375/Gyromina
[code-quality-img]: https://img.shields.io/scrutinizer/quality/g/Lowie375/Gyromina

[maj-contrib-label]: https://img.shields.io/badge/major%20contributor-%F0%9F%92%BB-00b275
[min-contrib-label]: https://img.shields.io/badge/minor%20contributor-%F0%9F%92%BE-00b275
[debugger-label]: https://img.shields.io/badge/debugger-%F0%9F%A6%9F-00b275
[tester-label]: https://img.shields.io/badge/beta%20tester-%E2%8C%9A-00b275
