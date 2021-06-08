const htmlParser = require('./htmlParser');
const apiWHOIS = require('./apiWHOIS');
const apiGoogleIndex = require('./apiGoogleIndex');

const url = window.location.href;
const newUrl = new URL(url);

function isValidURL(string) {
    var res = string.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
};

function URLLength(url){
    var longCharacters = url.length;
    if (longCharacters > 75){
        longurl = "Lebih dari 75";
    } else if (longCharacters <= 75 && longCharacters >= 54){
        longurl = "Antara 54 dan 75";
    } else {
        longurl = "Kurang dari 54";
    }
    return longurl;
}

function nonStandardPort(url){
    try {
        var res = url.match(/^((https?:\/\/)|(www.))(?:([a-zA-Z]+)|(\d+\.\d+.\d+.\d+)):\d{4}$/g);
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

function specialCharacter(url){
    var special = new Array ('*', '|', ';', '{', '}', '<',
                             '>', '[', ']', '(', ')', '"',
                             "'", '^', ',');

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
    var duplicate = new Array ('///', '<<', '>>', '((', '))',
                               '--', '!!', '__', '==', ';;',
                               '..', '[[', ']]');

    var check = 0;
    for (i = 0; i < duplicate.length; i++){
        if (url.includes(duplicate[i])){
            check = 1;
            break;
        }
    }

    if (check == 1){
        duplicatechar = 'Terdapat duplicated character';
    } else {
        duplicatechar = 'Tidak ada duplicated character';
    }
    return duplicatechar;
}

function ServerFormHandler(parser) {
    if (!parser) {
        return "Blank atau CTO";
    }

    const anchors = parser.getElementsByTagName('a');
    var check = 0;
    var safeDomain = new Array ('facebook.com', 'instagram.com', 'flickr.com', 'youtube.com', 'linkedin.com');
    for (let anchor of anchors) {
        let href = anchor.attributes.href;
        if (href) {
            getDomainFromAnchor = isValidURL(href.value);
            if (getDomainFromAnchor == true) {
                var url_domain = newUrl.host;
                const anchorUrl = new URL(href.value);
                var getDomainFromAnchor = anchorUrl.host;
                var check = 0;
                for(i = 0; i < 5; i++){
                    if(getDomainFromAnchor.includes(safeDomain[i])){
                        check = 1;
                        break;
                    }
                };
                if (check == 0 && getDomainFromAnchor != url_domain) {
                    check = 1;
                    break;
                }
            }
        }
    }

    if (check == 1) {
        urlOfServerFormHandler = 'Mengarah ke domain berbeda';
    } else {
        urlOfServerFormHandler = 'Mengarah ke domain sendiri'
    }
    return urlOfServerFormHandler;
}

async function AbnormalURL(url) {
    var domainurl = newUrl.host;
    let response = await fetch(apiWHOIS + domainurl);   
    let urlInWHOISInfo = await response.json();
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

function obfuscatedURL(url){
    var uri = decodeURI(url);
    var uriComp = decodeURIComponent(url);
    var unesc = unescape(url);
    var base = url.slice(-2);

    if (url == uri || url == uriComp || base != "==" || url.charAt(url.length-1) != "=" || url.includes(".fromCharCode(") || url == unesc){
        deobfucation_url = "Tidak obfuscated";
    } else {
        deobfucation_url = "Ada obfuscated";
    }
    return deobfucation_url;
}

function numberOfThirdPartyDomain(url){
    var urls = decodeURIComponent(url);
    var newUrls = new URL(urls);
    var linkSplitStr = newUrls.search;

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
    var cookie = url.includes(".cookie");
    var session = url.includes("session");
    if (cookie == true || session == true){
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
    return url_cookie;
}

async function googleIndex(url) {
    const indexPage = connectionGoogleIndex(url);
    const indexDomain = connectionGoogleIndex(newUrl.host);
    
    if (indexPage == "Indexed" && indexDomain == "Indexed") {
        google_indexing = "Halaman dan domain terdaftar";
    } else if (indexPage == "Not Indexed" && indexDomain == "Not Indexed") {
        google_indexing = "Domain tidak terdaftar di google index";
    } else {
        google_indexing = "Halaman tidak terdaftar di google index";
    }
    return google_indexing;
}

function htmlTags(url){
    var tags = new Array ("<script", "<iframe", "<meta", "<h1",
                          "<form", "<img", "<textarea", "<div",
                          "<title", "<style", "<object", "<a", "<br>");

    var check = 0;
    for (i = 0; i < tags.length; i++){
        search = new RegExp(tags[i], "g");
        search_result = url.toLowerCase().match(search);
        if (search_result != null){
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
    var properties = new Array ('href=', 'http-equiv=', 'action=', 'src=', 'lowsrc=');

    var check = 0;
    for (i = 0; i < properties.length; i++){
        search = new RegExp(properties[i], "g");
        search_result = url.toLowerCase().match(search);
        if (search_result != null){
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
    var event = new Array ('onclick=', 'onmouseover=', 'onerror=', 'onload=', 'onfocus=');

    var check = 0;
    for (i = 0; i < event.length; i++){
        search = new RegExp(event[i], "g");
        search_result = url.toLowerCase().match(search);
        if (search_result != null){
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
    var objects = new Array ('window.', 'location.', 'document.',
                             'history.', 'navigator.');

    var check = 0;
    for (i = 0; i < objects.length; i++){
        search = new RegExp(objects[i], "g");
        search_result = url.toLowerCase().match(search);
        if (search_result != null){
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
    var method = new Array ('write(', 'getElementsByTagName(', 'alert(',
                            'eval(', 'open(', 'fromCharCode(');

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

function getScript(parser) {
    var list_malicious = ['setcookie', 'document.cookie', 'XMLHTTPRequest', 'unescape', 'document.write']
    var search, ur_l, http_response, check = 0;
    const scripts = parser.getElementsByTagName('script');

    for (var sscript of scripts) {
        var list_sus = [];
        var search_result;

        ur_l = window.location.href + sscript.getAttribute('src');
        http_response = httpGet(ur_l);

        for (i = 0; i < list_malicious.length; i++) {
            search = new RegExp(list_malicious[i], "g");
            search_result = http_response.match(search);

            if (search_result != null) {
                list_sus.push(search_result[0]);
            }
        }

        if (list_sus != null) {
            check = 1;
            break;
        }
    }

    if (check == 1){
        js_script = 'Terdapat javascript sus';
    } else {
        js_script = 'Tidak ada javascript sus';
    }
    return js_script;
}

async function features(url) {
    var dom = await htmlParser.DOM_parser();
    var api_whois = await apiWHOIS.connectionToWHOIS(domain);
    var api_googleIndex = await apiGoogleIndex.connectionGoogleIndex(url);

    let length_URL = URLLength(url);
    let port_on_url = nonStandardPort(url);
    let special_character = specialCharacter(url);
    let duplicated_character = duplicateCharacter(url);
    let URL_of_SFH = ServerFormHandler(dom.dom);
    let abnormal_URL = await AbnormalURL(api_whois);
    let obfuscated_URL = obfuscatedURL(url);
    let number_of_subdomain = numberOfThirdPartyDomain(url);
    let request_cookie = requestForCookie(url);
    let google_index = await googleIndex(api_googleIndex);
    let html_tags = htmlTags(url);
    let html_properties = htmlProperties(url);
    let event_handler = eventHandler(url);
    let dom_objects = domObjects(url);
    let javascript_method = javascriptMethod(url);
    // let get_script = getScript(dom.dom);

    var all_features = [];
    await all_features.push(length_URL,
                            port_on_url,
                            special_character,
                            duplicated_character,
                            URL_of_SFH,
                            abnormal_URL,
                            obfuscated_URL,
                            number_of_subdomain,
                            request_cookie,
                            google_index,
                            html_tags,
                            html_properties,
                            event_handler,
                            dom_objects,
                            javascript_method
                            // get_script,
                            );

    console.log(all_features);
    
    return all_features;
};

module.exports = { features };