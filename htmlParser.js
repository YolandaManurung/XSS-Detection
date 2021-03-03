async function DOM_parser(){
    var string = document.documentElement.outerHTML;
    const parsers = new DOMParser();
    var dom = parsers.parseFromString(string, 'text/html');
    return { string: string, dom: dom }
}

module.exports = { DOM_parser };