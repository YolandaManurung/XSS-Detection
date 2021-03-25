const urlParser = require('./URLParser');
const htmlParser = require('./htmlParser');
const apiWHOIS = require('./apiWHOIS');

function isValidURL(string) {
    var res = string.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
};

function URLLength(url) {
    var longCharacters = url.length;
    if (longCharacters > 75) {
        longurl = "Lebih dari 75";
    } else if (longCharacters <= 75 && longCharacters >= 54) {
        longurl = "Antara 54 dan 75";
    } else {
        longurl = "Kurang dari 54";
    }
    return longurl;
}

function ServerFormHandler(parser, domainURL) {
    const anchors = parser.getElementsByTagName('a');
    for (let anchor of anchors) {
        let href = anchor.attributes.href;
        if (href) {
            getDomainFromAnchor = isValidURL(href.value);
            if (getDomainFromAnchor == true) {
                var getDomainFromAnchor = urlParser.domainURL(href.value);
                if (getDomainFromAnchor != domainURL) {
                    urlOfServerFormHandler = 'Mengarah ke domain berbeda';
                    break;
                } else {
                    urlOfServerFormHandler = 'Mengarah ke domain sendiri'
                }
            }
        }
    }
    return (urlOfServerFormHandler);
}

async function AbnormalURL(urlInWHOISInfo) {
    if (urlInWHOISInfo) {
        if (urlInWHOISInfo.WhoisRecord.dataError == "IN_COMPLETE_DATA" || urlInWHOISInfo.WhoisRecord.dataError == "MISSING_WHOIS_DATA" || urlInWHOISInfo.WhoisRecord.parseCode == 0) {
            urlInWHOIS = "Tidak tersimpan di database whois";
        } else {
            urlInWHOIS = "Tersimpan di database whois";
        }
    } else {
        urlInWHOIS = "Tidak tersimpan di database whois";
    }

    return urlInWHOIS;
}

function obfuscatedCode(url) {
    var uri = decodeURI(url);
    var uriComp = decodeURIComponent(url);
    var base = url.slice(-2);
    var unesc = unescape(url);

    if (url == uri || url == uriComp || base == "==" || url.charAt(url.length-1) == "=" || url == unesc){
        obfucation_url = "Tidak obfuscated";
    } else {
        obfucation_url = "Ada obfuscated";
    }
    return obfucation_url;
}

function numberOfThirdPartyDomain(url){
    var urls = decodeURIComponent(url)
    var urlSplit = urls.split(/\/\/(.+)/)[1];
    var linkSplitStr = urlSplit.split(/\/(.+)/);

    var check = 0;
    for (i = 1; i < linkSplitStr.length; i++){
        if ((linkSplitStr[i].includes("http") || linkSplitStr[i].includes("https"))){
            check = 1;
            break;
        }
    }

    if (check == 1){
        thirdPartyDomain = "Ada third-party domain";
    } else {
        thirdPartyDomain = "Tidak ada third-party domain";
    }
    return thirdPartyDomain;
}

function requestForCookie(url){
    var cookie = url.includes("cookie");
    if (cookie == true){
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
    return url_cookie;
}

function htmlTags(url){
    var tags = new Array ("<script>", "<iframe", "<meta", "<h1",
                          "<form", "<img", "<textarea", "<div",
                          "<title", "<style", "<object", "<a", "<br>");

    var check = 0;
    for (i = 0; i < tags.length; i++){
        if (url.toLowerCase().includes(tags[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        tag_html = 'Terdapat HTML tags';
    } else {
        tag_html = 'Tidak ada HTML tags';
    }
    return tag_html;
}

function htmlProperties(url){
    var properties = new Array ('href', 'http-equiv', 'action', 'language', 'src', 'lowsrc', 'type');

    var check = 0;
    for (i = 0; i < properties.length; i++){
        if (url.includes(properties[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        properties_html = 'Terdapat HTML properties';
    } else {
        properties_html = 'Tidak ada HTML properties';
    }
    return properties_html;
}

function eventHandler(url){
    var event = new Array ('onclick', 'onmouseover', 'onerror', 'onload', 'onfocus');

    var check = 0;
    for (i = 0; i < event.length; i++){
        if (url.includes(event[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        handler = 'Terdapat EventHandler';
    } else {
        handler = 'Tidak ada EventHandler';
    }
    return handler;
}

function domObjects(url){
    var objects = new Array ('windows', 'location', 'document');

    var check = 0;
    for (i = 0; i < objects.length; i++){
        if (url.toLowerCase().includes(objects[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        objects_dom = 'Terdapat DOM objects';
    } else {
        objects_dom = 'Tidak ada DOM objects';
    }
    return objects_dom;
}

function javascriptMethod(url){
    var method = new Array ('write(', 'getElementsByTagName(', 'alert(', 'eval(', 'fromCharCode(');

    var check = 0;
    for (i = 0; i < method.length; i++){
        if (url.includes(method[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        js_method = 'Terdapat javascript method';
    } else {
        js_method = 'Tidak ada javascript method';
    }
    return js_method;
}

function specialCharacter(url){
    var special = new Array ('</', '">', '/*', '(', ')', '&', '"/>');

    var check = 0;
    for (i = 0; i < special.length; i++){
        if (url.includes(special[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        specialchar = 'Terdapat special character';
    } else {
        specialchar = 'Tidak ada special character';
    }
    return specialchar;
}

function duplicateCharacter(url){    
    var duplicate = new Array ('///', '<<', '>>', '((', '))');

    var check = 0;
    for (i = 0; i < duplicate.length; i++){
        if (url.includes(duplicate[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        duplicatechar = 'Terdapat duplicate character';
    } else {
        duplicatechar = 'Tidak ada duplicate character';
    }
    return duplicatechar;
}

function nonStandardPort(url){
    try {
        var res = url.match(/^(http(s)?:\/\/.)?(www\.)?[0-9999]*[a-zA-Z0-9@:%_\+.~#?&//=]*/g);
        result = (res !== null);
        var port = "";
        if (result == true) {
            port = "Terdapat port"; 
        } else {
            port = "Tidak ada port";
        }
        return (port);
    } catch (err) {
        console.log(err);
    }
}


async function features(url) {
    var dom = await htmlParser.DOM_parser(url);
    var parser = urlParser.convertToURL(url);
    var domain = urlParser.domainURL(url);
    var api_whois = await apiWHOIS.connectionToWHOIS(domain);

    // console.log(api_https_lookup);
    // console.log(api_whois);
    // console.log(api_wot);

    // let request_URL = requestURL_CrossSite(dom.dom, domain);

    let length_URL = URLLength(url);
    let abnormal_URL = await AbnormalURL(api_whois);
    let obfuscated_URL = obfuscatedCode(url);
    let URL_of_SFH = ServerFormHandler(dom.dom, domain);
    let request_cookie = requestForCookie(url);
    let number_of_subdomain = numberOfThirdPartyDomain(url);
    let html_tags = htmlTags(url);
    let html_properties = htmlProperties(url);
    let event_handler = eventHandler(url);
    let dom_objects = domObjects(url);
    let javascript_method = javascriptMethod(url);
    let special_character = specialCharacter(url);
    let duplicate_character = duplicateCharacter(url);
    let non_standard_port = nonStandardPort(url);

    var all_features = [];
    await all_features.push(length_URL,             // 1
                            abnormal_URL,           // 2
                            obfuscated_URL,         // 3
                            URL_of_SFH,             // 4
                            request_cookie,         // 5
                            number_of_subdomain,    // 6
                            html_tags,              // 7
                            html_properties,        // 8
                            event_handler,          // 9
                            dom_objects,            // 10
                            javascript_method,      // 11
                            special_character,      // 12
                            duplicate_character,    // 13
                            non_standard_port);     // 14

    return all_features;
}

module.exports = { features };