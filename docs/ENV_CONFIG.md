# Environment Variable Configuration

For the env **`v10`** configuration (for Gyromina versions `>=1.2.0`)

## **Required Config**

### `token`: Discord bot token

Used to log into Discord

*example: `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW` (a fake token)*

### `prefix`: Discord bot prefix

Used to trigger message commands

*example: `z.` (Gyromina's prefix)*

### `clientID`: Discord bot client ID

Used to registed slash commands

*example: `490590334758420481` (Gyromina's client ID)*

### `exp`: Experimental mode setting

WARNING: experimental commands may be unstable, use at your own risk!

- `0` = **disabled**: experimental commands *off*, slash commands deployed *globally*
- `1` = **enabled**: experimental commands *on*, slash commands deployed *locally*
- `2` = **test-disabled**: experimental commands *off*, slash commands deployed *locally* (to be implemented)

### `hostID`: Discord user ID

(enables local use of `shutdown` and `vartest` for the user)

*example: `334335706740686849` (L375's user ID)*

### `hostGuildID`: Discord server/guild ID

(enables local registration of slash commands)

*example: `12345678901234567890` (a fake guild ID)*

### `errorLog`: Discord channel ID

(used to log errors)

*example: `12345678901234567890` (a fake channel ID)*

### `eventLog`: Discord channel ID

(used to log events)

*example: `12345678901234567890` (a fake channel ID)*

## Optional Config

### `season`: Seasonal style override

- `0` = **disabled**: style will be determined by date (default)
- `1` = **pride**: pride style will always be active
- `2` = **winter**: winter style will always be active
- `3` = **blurple**: blurple style will always be active
- `-1` = **force-default**: default style will always be active

### `herokuAuth`: Heroku auth token

(used with `uptime` to determine deployment time)

*example: `abcdefghijklmnopqrstuvwxyz1234567890` (a fake auth token)*

### `herokuID`: Heroku project ID

(used with `uptime` to determine deployment time)

*example: `gyromina` (Gyromina's project ID)*

## Deprecated Config

### `progressLog`: Discord channel ID

(used with `release` to log releases)

*example: `12345678901234567890` (a fake channel ID)*

### `gitToken`: GitHub auth token

(scope = `repo`; used with `release` to publish releases to GitHub)

*example: `abcdefghijklmnopqrstuvwxyz12345678901234` (a fake auth token)*

### `gitUsername`: GitHub username

(used with `release` to publish releases to GitHub)

*example: `Lowie375` (L375's GitHub username)*

### `gitRepoName`: GitHub repository name

(used with `release` to publish releases to GitHub)

*example: `Gyromina` (Gyromina's GitHub repository)*
