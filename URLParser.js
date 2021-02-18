function convertToURL(url) {
    const parser = new URL(url);
    return parser;
}

function domainURL(link) {
    var parser = convertToURL(link);
    var host = '';
    var hn = parser.hostname.split('.').reverse();
    if (hn[1] == 'co') {
        host = hn[2] + '.' + hn[1] + '.' + hn[0];
    } else {
        host = hn[1] + '.' + hn[0];
    }
    return host;
}

module.exports = { convertToURL, domainURL };