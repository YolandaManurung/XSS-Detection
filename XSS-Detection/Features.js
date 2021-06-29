const htmlParser = require('./htmlParser');
const apiWHOIS = require('./apiWHOIS');
const apiGoogleIndex = require('./apiGoogleIndex');
const ngram = require('./ngram');
const payload = require('./payload');

function isValidURL(string) {
    try {
        url = new URL(string);
        var res = string.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    } catch (_) {
        return false;  
    }

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

function nonStandardPort(){
    var result = window.location.port;

    if (result == '') {
        port = "Tidak ada port";
    } else {
        port = "Terdapat port"; 
    }
    return port;
}

function specialCharacter(url){
    var special = ['*', '|', ';', '{', '}', '<',
                   '>', '[', ']', '(', ')', '"',
                   "'", '^', ',', '%', '\"'];
    
    for (i = 0; i < special.length; i++){
        if (url.includes(special[i])){
            return 'Terdapat special character';
        }
    }

    return 'Tidak ada special character';
}

function duplicateCharacter(url){    
    var duplicate = ['///', '--', '!!', '__', '==', ';;', '..'];
    var key1 = ['<<', '((', '[[', '""', "''"];
    var key2 = ['>>', '))', ']]', '""', "''"];

    for (i = 0; i < duplicate.length; i++){
        if (url.includes(duplicate[i]) || (i < key1.length && (url.includes(key1[i]) && url.includes(key2[i])))){
            return 'Terdapat duplicated character';
        }
    }

    return 'Tidak ada duplicated character';
}

function ServerFormHandler(parser) {
    if (!parser) {
        return "Blank atau CTO";
    }

    const anchors = parser.getElementsByTagName('a');
    var safeDomain = ['facebook.com', 'instagram.com', 'twitter.com', 'youtube.com', 'linkedin.com', 'flickr.com'];
    for (let anchor of anchors) {
        let href = anchor.attributes.href;
        var temp = 0;
        if (href && isValidURL(href.value)) {
            var url_domain = newUrl.host;
            var anchorUrl = new URL(href.value);
            var getDomainFromAnchor = anchorUrl.host;
            for(i = 0; i < safeDomain.length; i++){
                if(getDomainFromAnchor.includes(safeDomain[i])){
                    temp = 1;
                    break;
                }
            };
            if (temp == 0 && getDomainFromAnchor != url_domain) {
                return 'Mengarah ke domain berbeda';
            }
        }
    }

    return 'Mengarah ke domain sendiri'
}

async function AbnormalURL() {
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
    var base = url.slice(-2);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    
    if (base === "==" || url.charAt(url.length-1) === "=" || url.includes(".fromCharCode(") || base64Matcher.test(url)) {
        deobfucation_url = "Ada obfuscated";
    } else {
        deobfucation_url = "Tidak obfuscated";
    }
    return deobfucation_url;
}

function numberOfThirdPartyDomain(url){
    var linkSplitStr = unescape(url);
    for (i = 1; i < linkSplitStr.length; i++){
        if ((linkSplitStr[i].includes("http") || linkSplitStr[i].includes("https"))){
            return "Ada third-party domain";
        }
    }
    return "Tidak ada third-party domain";
}

function requestForCookie(url){
    var cookie = url.includes("cookie");
    var session = url.includes("session");

    if (cookie == true || session == true){
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
    return url_cookie;
}

async function googleIndex(indexPage, indexDomain) {    
    if (indexPage == "Indexed" && indexDomain == "Indexed") {
        google_indexing = "Halaman dan domain terdaftar";
    } else if (indexPage == "Not Indexed" && indexDomain == "Not Indexed") {
        google_indexing = "Domain tidak terdaftar di google index";
    } else {
        google_indexing = "Halaman tidak terdaftar di google index";
    }

    return google_indexing;
}

function htmlTags(url_list){
    var tags = ["script", "iframe", "meta",
                "form", "img", "textarea",
                "title", "div"," style", "marquee"];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < tags.length; j++){
            if (url_list[i] === (tags[j])){
                console.log("Tags: " + url_list[i]);
                return 'Terdapat HTML tags';
            }
        }
    }

    return 'Tidak ada HTML tags';
}

function htmlProperties(url_list){
    var properties = ['href', 'equiv', 'action',
                      'src', 'lowsrc'];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < properties.length; j++){
            if (url_list[i] === (properties[j])){
                console.log("Properties: " + url_list[i]);
                return 'Terdapat HTML properties';
            }
        }    
    }
    return 'Tidak ada HTML properties';
}

function eventHandler(url_list){
    var event = ['onclick', 'onmouseover', 'onerror',
                 'onload', 'onfocus'];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < event.length; j++){
            if (url_list[i] === (event[j])){
                console.log("EventHandler: " + url_list[i]);
                return 'Terdapat EventHandler';
            }
        }    
    }

    return 'Tidak ada EventHandler';
}

function domObjects(url_list){
    var objects = ['window', 'location', 'document',
                   'history', 'navigator'];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < objects.length; j++){
            if (url_list[i] === (objects[j])){
                console.log("DOM Object(s): " + url_list[i]);
                return 'Terdapat DOM objects';
            }
        }    
    }

    return 'Tidak ada DOM objects';
}

function javascriptMethod(url_list){
    var method = ['write', 'getElementsByTagName', 'alert',
                  'eval', 'open', 'fromCharCode'];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < method.length; j++){
            if (url_list[i] === (method[j])){
                console.log("JS Method: " + url_list[i]);
                return 'Terdapat javascript method';
            }
        }
    }

    return 'Tidak ada javascript method';
}

function obfuscatedJS(parser) {
    if (!parser) {
        return "Blank";
    }

    const scripts = parser.getElementsByTagName('script');
    for (var sscript of scripts) {
        var escapeJS = unescape(sscript);
        if (escapeJS != sscript) {
            return "Terdapat Obfus Js";
        }
    }

    return "Tidak terdapat Obfus Js";
}

async function keywordJS(parser) {
    if (!parser) {
        return "Blank";
    }

    var list_malicious = ['eval', 'document.cookie', 'setcookie',
                          'XMLHTTPRequest', 'child_process', 'window.location']
    var search, ur_l, http_response;
    const scripts = parser.getElementsByTagName('script');

    for (var sscript of scripts) {
        var search_result;
        ur_l = sscript.getAttribute('src')
        if (ur_l != null) {
            protocol = new RegExp('http', "g");
            if (!ur_l.match(protocol)) {
                ur_l = window.location.href + ur_l;
            }
            http_response = await DOM_parser(ur_l);
            if (http_response.string) {
                for (i = 0; i < list_malicious.length; i++) {
                    search = new RegExp(list_malicious[i], "g");
                    search_result = http_response.string.match(search);
                    if (search_result != null) {
                        return 'Terdapat Keyword in Js';
                    }
                }    
            }
        } else {
            for (i = 0; i < list_malicious.length; i++) {
                search = new RegExp(list_malicious[i], "g");
                search_result = sscript.textContent.match(search);
                if (search_result != null) {
                    return 'Terdapat Keyword in Js';
                }
            }    
        }
    }

    return 'Tidak terdapat Keyword in Js';
}

function payloadHTML(string) {
    if (!string) {
        return "Blank atau Connection Time Out";
    }

    for (i = 0; i < payload.length; i++) {
        if (string.includes(payload[i])) {
            console.log("Payload: " + payload[i]);
            return "Terdapat Payload in HTML";
        }
    }

    return "Tidak terdapat Payload in HTML";
}

async function features(urlWindow) {
    if (urlWindow.includes("?")) {
        param = urlWindow.split("?");
        urlParam = param[1];
    }

    const newUrl = new URL(urlWindow);
    var dom = await htmlParser.DOM_parser(urlWindow);
    var api_whois = await apiWHOIS.connectionToWHOIS(urlWindow);
    var connectPage = await apiGoogleIndex.connectionGoogleIndex(url);
    var connectDomain = await apiGoogleIndex.connectionGoogleIndex(newUrl.host);
    var url_list = ngram.ngram(urlParam.toLowerCase());

    let length_URL = URLLength(urlWindow);
    let port_on_url = nonStandardPort();
    let special_character = specialCharacter(urlParam);
    let duplicated_character = duplicateCharacter(urlParam);
    let URL_of_SFH = ServerFormHandler(dom.dom);
    let abnormal_URL = await AbnormalURL(api_whois);
    let obfuscated_URL = obfuscatedURL(urlParam);
    let number_of_subdomain = numberOfThirdPartyDomain(urlParam);
    let request_cookie = requestForCookie(urlParam);
    let google_index = await googleIndex(connectPage, connectDomain);
    let html_tags = htmlTags(url_list);
    let html_properties = htmlProperties(url_list);
    let event_handler = eventHandler(url_list);
    let dom_objects = domObjects(url_list);
    let javascript_method = javascriptMethod(url_list);
    let obfuscated_js = obfuscatedJS(dom.dom);
    let keyword_in_js = await keywordJS(dom.dom);
    let payload_html = payloadHTML(dom.string);
    let get_script = getScript(dom.string);

    var all_features = [];
    await all_features.push(
                            length_URL,
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
                            javascript_method,
                            get_script,
                            obfuscated_js,
                            keyword_in_js,
                            payload_html,
                            );

    console.log(all_features);
    
    return all_features;
};

module.exports = { features };