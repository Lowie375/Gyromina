# ​ [![Gyromina, a multipurpose Discord bot][gyro-banner]][info]

[![Discord.js Version][djs-img]][djs-link]
[![Bot Version][version-img]][main-pkg]
[![Indev Version][indev-version-img]][indev-pkg]
[![Dependency Status][dependency-img]][dependency-link]
[![License][license-img]](LICENSE)  
[![Last Commit (main)][main-commit-img]][main-tree-link]
[![Last Commit (indev-branch)][indev-commit-img]][indev-tree-link]
[![Build Status][build-img]][build-link]
[![Gyromina Dev Discord][discord-img]][discord]

## About

### "Fun + function, all in one."

Created by **[L375](https://l375.weebly.com/about) \([@Lowie375](https://github.com/Lowie375)\)**, with contributions & support from **Nao \([@naoei](https://github.com/naoei)\)**, **Irisu \([@irisuwastaken](https://github.com/irisuwastaken)\)**, and **[@alazymeme](https://github.com/alazymeme)**

Latest stable build: v1.2.2  
<!-- Latest indev build: v1.2.0 -->

Gyromina is entirely open source and licensed under the [MIT license](LICENSE)

### External Links

**[Info Pages][info]** - **[Commands][commands]** - **[Changelog][log]** - **[Invite Link][invite]** - **[Development Server][discord]**

### Overview

Gyromina is a multipurpose Discord bot, made to be a fun and functional addition to any Discord server.

Gyromina contains an assortment of features, including a random colour and number generator, a unit converter, a library of minigames, a custom poll creator, miscellaneous fun commands, and more!

### Events/Seasons

Occasionally, Gyromina will get some special features and UI changes during certain events throughout the year!

The **winter** event is currently active!  
For the month of December, Gyromina's default UI colour will shift to light blue.

## Setup

### General (for server owners/admins)

* Follow this link: **[https://discord.com/api/oauth2/authorize?client_id=490590334758420481&permissions=412317248576&scope=bot%20applications.commands][invite]**
* Choose a server to add Gyromina to
* Make sure all requested permissions are enabled
  * Critical: **`Send Messages`**, **`View Channels`**, **`Read Message History`**, **`Add Reactions`**, **`Attach Files`**, **`Embed Links`**
  * Highly recommended: **`Send Messages in Threads`**, **`Use External Emojis`**, **`Manage Messages`**
* **[Toggle any configuration options as desired](docs/SERVER_CONFIG.md)**
* **You're good to go! Have fun!**

### Test or Local Bots (for contributors/debuggers)

#### Requirements

* Discord bot token
* Discord server + channel access

#### Config

* Fork/download source code + `npm install` in terminal
* **[Configure environment variables](docs/ENV_CONFIG.md)** (`>=1.2.0` = **`v10`** configuration)
* Run using your native runtime/debugger/host and you're good to go!

## Additional Info

### Bug Reports

Please see the "**[If you are reporting a bug](docs/CONTRIBUTING.md#if-you-are-reporting-a-bug)**" section of **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for bug-reporting protocol.

### Changelog

Gyromina's changelog can be found at **[https://l375.weebly.com/gyro-log][log]**.

### Code of Conduct

The community Code of Conduct can be found under **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)**.

## Contributing

Contributions to Gyromina are always welcome! I'm a novice, so I don't know the best tips, tricks, and optimizations for JavaScript/Node. A little help can go a long way.

Please see **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** for contribution information + general style notes and **[docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)** for the community code of conduct.

### Contributors

[![Major Contributor 💻][maj-contrib-label]][maj-contrib-label]
[![Minor Contributor 💾][min-contrib-label]][min-contrib-label]
[![Debugger 🦟][debugger-label]][debugger-label]
[![Beta Tester ⌚][tester-label]][tester-label]

* 💻 [L375](https://l375.weebly.com/about) - [@Lowie375](https://github.com/Lowie375)
* 💻 Nao - [@naoei](https://github.com/naoei)
* 💻 Irisu - [@irisuwastaken](https://github.com/irisuwastaken)
* 💾 alazymeme - [@alazymeme](https://github.com/alazymeme)

<!-- ### Helpers -->

<!-- Links -->
[commands]: https://l375.weebly.com/gyro-commands
[info]: https://l375.weebly.com/gyromina
[invite]: https://discord.com/api/oauth2/authorize?client_id=490590334758420481&permissions=412317248576&scope=bot%20applications.commands
[log]: https://l375.weebly.com/gyro-log
[discord]: https://discord.gg/Bsaz4r7

[main-pkg]: https://github.com/Lowie375/Gyromina/blob/main/package.json
[indev-pkg]: https://github.com/Lowie375/Gyromina/blob/indev-branch/package.json

[djs-link]: https://discord.js.org
[dependency-link]: https://depfu.com/github/Lowie375/Gyromina?project_id=33026
[contributors-link]: https://github.com/Lowie375/Gyromina/graphs/contributors
[main-tree-link]: https://github.com/Lowie375/Gyromina/tree/main
[indev-tree-link]: https://github.com/Lowie375/Gyromina/tree/indev-branch
[build-link]: https://scrutinizer-ci.com/g/Lowie375/Gyromina

<!-- Banners -->
[gyro-banner]: https://cdn.discordapp.com/attachments/492389515478958101/815054288644472842/GyrominaBannerRMOpen.png
[gyro-banner-pride]: https://cdn.discordapp.com/attachments/429364141355171840/842935847594491924/GyrominaBannerRMOpen-pride.png

<!-- Labels -->
[djs-img]: https://img.shields.io/github/package-json/dependency-version/Lowie375/Gyromina/discord.js
[version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina?label=release%20version
[indev-version-img]: https://img.shields.io/github/package-json/v/Lowie375/Gyromina/indev-branch?label=indev%20version
[dependency-img]: https://img.shields.io/depfu/Lowie375/Gyromina
[main-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina?label=last%20commit%20%28main%29
[indev-commit-img]: https://img.shields.io/github/last-commit/Lowie375/Gyromina/indev-branch?label=last%20commit%20%28indev-branch%29
[license-img]: https://img.shields.io/github/license/Lowie375/Gyromina
[build-img]: https://img.shields.io/scrutinizer/build/g/Lowie375/Gyromina
[discord-img]: https://img.shields.io/discord/409876373134508052?color=5865f2&label=%20&logo=discord&logoColor=ffffff

[maj-contrib-label]: https://img.shields.io/badge/major%20contributor-%F0%9F%92%BB-00b275
[min-contrib-label]: https://img.shields.io/badge/minor%20contributor-%F0%9F%92%BE-00b275
[debugger-label]: https://img.shields.io/badge/debugger-%F0%9F%A6%9F-00b275
[tester-label]: https://img.shields.io/badge/beta%20tester-%E2%8C%9A-00b275
