async function DOM_parser(){
    const parsers = new DOMParser();
    var response = await fetch(url);
    switch (response.status) {
        case 200:
            var string = await response.text();
            var dom = parsers.parseFromString(string, 'text/html');
            break;
        case 404:
            // console.log('Not Found');
            break;
    }
    return {string: string, dom: dom}
}

module.exports = { DOM_parser };