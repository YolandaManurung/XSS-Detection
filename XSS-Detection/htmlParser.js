async function DOM_parser(){
    const parsers = new DOMParser();
    try {
        var response = await fetch(url, {
            mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        });
    } catch (_) {
        return false;
    }

    switch (response.status) {
        case 200:
            var string = await response.text();
            var dom = parsers.parseFromString(string, 'text/html');
            break;
        case 404:
            return false;
    }
    return {string: string, dom: dom}
}

module.exports = { DOM_parser };