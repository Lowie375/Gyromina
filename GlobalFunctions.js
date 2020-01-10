const color = require('colors');

/**
 * Writes to the console with time when it was ran
 * @param message
 * @param startTime
 * @param useLocale
 */
exports.Write = function(message, startTime = null, useLocale = true) {
    let currentTime = Date.now() - startTime;
    let body = "";

    if (!useLocale && currentTime > 0) {
        body = currentTime.toString().padEnd(8).green + message;
    } else if (useLocale) {
        let time = new Date(Date.now()).toLocaleTimeString();
        body = time.padEnd(12).green + message;
    } else body = message;

    console.log(body)
};

/**
 * Clears out any @Everyone's.
 * @return {string}
 */
exports.Clean = function(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203).replace(/@/g, "@" + String.fromCharCode(8203)))
    else
        return text;
};