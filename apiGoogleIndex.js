var scraperapiClient = require('scraperapi-sdk')('c7750f83e263808680535aa227aa5244')
const { requestUrl, compareUrl } = require('./url-encoder'); // Encoding functions

function matchResponse(url, res, compare, utfEncoded) {
    let matchURL = false

    if (url.includes(`'`)) {
      matchURL = (res.includes(`href="${compare}"`) | res.includes(`href="${utfEncoded}"`));
    } else {
      matchURL = res.includes(`href="${compare}"`);
    }

    return matchURL
}

async function connectionGoogleIndex(url) {
    const request = requestUrl(url);
    const compare = compareUrl(url, false);
    const utfEncoded = compareUrl(url, true);

    var response = await scraperapiClient.get(request);

    const indexation = matchResponse(url, response, compare, utfEncoded)
        ? 'Indexed'
        : 'Not Indexed'

    return indexation;
}

module.exports = { connectionGoogleIndex };