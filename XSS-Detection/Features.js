const C45 = require('c4.5');
const fileSystem = require('fs');
const CSVparser = require('papaparse');
const swal = require('sweetalert2');

const apiWHOIS = 'https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_MUU77fxi6N57F5pnrN9dyXyK5K4Sn&outputFormat=JSON&domainName=';

const url = window.location.href;
const parser = new URL(url);

function domainURL(link) {
    var parser = new URL(link);
    var host = '';
    var hn = parser.hostname.split('.').reverse();
    if (hn[1] == 'co' || hn[1] == "org") {
        host = hn[2] + '.' + hn[1] + '.' + hn[0];
    } else {
        host = hn[1] + '.' + hn[0];
    }
    return host;
}

function isValidURL(string) {
    var res = string.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
};

async function DOM_parser(){
    const parsers = new DOMParser();
    var response = await fetch(url);
    switch (response.status) {
        case 200:
            var string = await response.text();
            var dom = parsers.parseFromString(string, 'text/html');
            break;
        case 404:
            console.log('Not Found');
            break;
    }
    return {string: string, dom: dom}
}

function isNumeric(n) {
    return !isNaN(n);
}

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

function ServerFormHandler(parser) {
    if (!parser) {
        return "Blank atau CTO";
    }

    const anchors = parser.getElementsByTagName('a');
    var check = 0;
    for (let anchor of anchors) {
        let href = anchor.attributes.href;
        if (href) {
            getDomainFromAnchor = isValidURL(href.value);
            if (getDomainFromAnchor == true) {
                var url_domain = domainURL(url);
                var getDomainFromAnchor = domainURL(href.value);
                if (getDomainFromAnchor != url_domain) {
                    check = 1;
                    break;
                }
            }
        }
    }

    if (check == 1) {
        urlOfServerFormHandler = 'Mengarah ke domain berbeda';
    } else if (!parser) {
        urlOfServerFormHandler = "Blank atau CTO";
    } else {
        urlOfServerFormHandler = 'Mengarah ke domain sendiri'
    }
    return urlOfServerFormHandler;
}

async function AbnormalURL() {
    var domainurl = domainURL(url);
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
    var base = url.slice(-2);
    var unesc = unescape(url);

    if (url == uri || url == uriComp || base == "==" || url.charAt(url.length-1) == "=" || url == unesc){
        deobfucation_url = "Tidak obfuscated";
    } else {
        deobfucation_url = "Ada obfuscated";
    }
    return deobfucation_url;
}

function numberOfThirdPartyDomain(url){
    var urls = decodeURIComponent(url);
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
    var properties = new Array ('href', 'http-equiv', 'action', 'src', 'lowsrc');

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

(async () => {
    var dom = await DOM_parser();

    let length_URL = URLLength(url);
    let port_on_url = nonStandardPort(url);
    let special_character = specialCharacter(url);
    let duplicated_character = duplicateCharacter(url);
    let URL_of_SFH = ServerFormHandler(dom.dom);
    let abnormal_URL = await AbnormalURL();
    let obfuscated_URL = obfuscatedURL(url);
    let number_of_subdomain = numberOfThirdPartyDomain(url);
    let request_cookie = requestForCookie(url);
    // let google_index = googleIndex(url);
    let html_tags = htmlTags(url);
    let html_properties = htmlProperties(url);
    let event_handler = eventHandler(url);
    let dom_objects = domObjects(url);
    let javascript_method = javascriptMethod(url);

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
                            // google_index,
                            html_tags,
                            html_properties,
                            event_handler,
                            dom_objects,
                            javascript_method);

    // return all_features;
    console.log(all_features);

    await fileSystem.readFile('DatasetNew(final).csv', 'utf-8', function(err, data) {
        if (err) {
            console.log(err);
            return false;
        }
        CSVparser.parse(data, {
            complete: function (result) {
                var headers = result.data[0];
                var features = headers.slice(1, -1);
                var target = headers[headers.length-1];

                var trainingData = result.data.slice(1).map(function(d) {
                    return d.slice(1);
                });

                var featureTypes = trainingData[0].map(function(d) {
                    return isNumeric(d) ? 'number' : 'category';
                });

                var c45 = C45();
            
                c45.train ({
                    data: trainingData,
                    target: target,
                    features: features,
                    featureTypes: featureTypes
                }, function(error, model) {
                    if (error) {
                        console.error(error);
                    }
                    if (model.classify(all_features) == 'XSS') {
                        swal.fire ({
                            icon: 'warning',
                            title: 'This website has XSS attack!',
                            html: "<b>It can steal your data.</b> Want to visit this website?",
                            showCancelButton: true,
                            cancelButtonText: "Yes",
                            confirmButtonText: "No",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "javascript:history.back()";
                            }
                        });
                    }
                    console.log(model.classify(all_features));
                });
            }
        });
    });
})();