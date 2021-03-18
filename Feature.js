const urlParser = require('./urlParser');
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

}

function numberForDomain(url){
    var count_domain = 0;
    var domainLenght = 0;

    var linkSplit = url.split("//");
    // console.log(linkSplit);
    var linkSplitStr = linkSplit[1].split("/");
    // console.log("SplitStr: "+ linkSplitStr);
    var linkSplitDomain = linkSplitStr[0].split(".").reverse();
    // console.log(linkSplitDomain);

    domainLenght = linkSplitDomain.length;

    if (linkSplitDomain[1] == 'co') {
        domainLenght--;
    }

    for (i = 1; i < domainLenght; i++) {
        count_domain++;
    }

    // console.log(linkSplitDomain.length);
    // console.log(domainLenght);
    // console.log(count_domain);
    if (count_domain == 1){
        number_of_domain = 'Satu domain';
    } else if (count_domain == 2){
        number_of_domain = 'Dua domain';
    } else {
        number_of_domain = 'Lebih dari dua domain';
    }
    return (number_of_domain);
}

function numberOfThirdPartyDomain(url){
    var linkSplit = url.split("//");
    // console.log(linkSplit);

    var check = 0;
    for (i = 1; i < linkSplit.length; i++){
        if (linkSplit[i].includes("http") || linkSplit[i].includes("https")){
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

function requestForCookie(url) {
    var cookie = url.include("cookie");
    if (cookie == true) {
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
}

function htmlTags(url) {
    var tags = new Array("<script>", "<iframe>", "<meta>", "<form>", "<img>", "<textarea>", "<div>");
    var index, check = 0;
    for (index = 0; index < tags.length; index++) {
        if (url.include(tags[index])) {
            check = 1;
            break;
        }
    }
    if (check == 1) {
        tag_html = 'Terdapat HTML tags';
    } else {
        tag_html = 'Tidak ada HTML tags';
    }
    return tag_html;
}

function htmlProperties(url) {
    var properties = new Array('href', 'http-equiv', 'action', 'src', 'lowsrc');
    var index, check = 0;
    for (index = 0; index < properties.length; index++) {
        if (url.include(properties[index])) {
            check = 1;
            break;
        }
    }
    if (check == 1) {
        properties_html = 'Terdapat HTML properties';
    } else {
        properties_html = 'Tidak ada HTML properties';
    }
    return properties_html;
}

function eventHandler(url) {
    var event = new Array('onclick', 'onmouseover', 'onerror', 'onload', 'onfocus');
    var index, check = 0;
    for (index = 0; index < event.length; index++) {
        if (url.include(event[index])) {
            check = 1;
            break;
        }
    }
    if (check == 1) {
        handler = 'Terdapat EventHandler';
    } else {
        handler = 'Tidak ada EventHandler';
    }
    return handler;
}

function domObjects(url) {
    var objects = new Array('windows', 'location', 'document');
    var index, check = 0;
    for (index = 0; index < objects.length; index++) {
        if (url.include(objects[index])) {
            check = 1;
            break;
        }
    }
    if (check == 1) {
        objects_dom = 'Terdapat DOM objects';
    } else {
        objects_dom = 'Tidak ada DOM objects';
    }
    return objects_dom;
}

function javascriptMethod(url) {
    var method = new Array('write', 'getElementsByTagName', 'alert', 'eval', 'fromCharCode');
    var index, check = 0;
    for (index = 0; index < method.length; index++) {
        if (url.include(method[index])) {
            check = 1;
            break;
        }
    }
    if (check == 1) {
        js_method = 'Terdapat javascript method';
    } else {
        js_method = 'Tidak ada javascript method';
    }
    return js_method;
}

async function features(url) {
    var dom = await htmlParser.DOM_parser(url);
    var parser = urlParser.convertToURL(url);
    var domain = urlParser.domainURL(url);
    var api_whois = await apiWHOIS.connectionToWHOIS(domain);

    // console.log(api_https_lookup);
    // console.log(api_whois);
    // console.log(api_wot);

    let abnormal_URL = await AbnormalURL(api_whois);
    let length_URL = URLLength(url);
    let request_cookie = requestForCookie(url);
    let request_URL = requestURL_CrossSite(dom.dom, domain);
    let number_of_subdomain = numberOfThirdsPartyDomain(url);
    let URL_of_SFH = ServerFormHandler(dom.dom, domain);
    let html_tags = htmlTags(url);
    let html_properties = htmlProperties(url);
    let event_handler = eventHandler(url);
    let dom_objects = domObjects(url);
    let javascript_method = javascriptMethod(url);

    var all_features = [];
    await all_features.push(request_URL,
        length_URL,
        URL_of_SFH,
        number_of_subdomain,
        abnormal_URL,
        request_cookie,
        html_tags,
        html_properties,
        event_handler,
        dom_objects,
        javascript_method);

    return all_features;
}

module.exports = { features };