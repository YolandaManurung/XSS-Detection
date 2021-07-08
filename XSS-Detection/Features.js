const C45 = require('c4.5');
const fileSystem = require('fs');
const CSVparser = require('papaparse');
const swal = require('sweetalert2');

var scraperapiClient = require('scraperapi-sdk')('cfe85b2c97eb745f9b899e6147a4ddf0')
const { requestUrl, compareUrl } = require('./url-encoder'); // Encoding functions
const { payload } = require('./payload');
const { url } = require('inspector');
const apiWHOIS = 'https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_GPYdwM0FKzQ3OC5Dx9dHljb1Fl1i2&outputFormat=JSON&domainName=';

const urlWindow = window.location.href;
const newUrl = new URL(urlWindow);

function setCookie(cookie_name, cookie_value, expires_days) {
    var date_now = new Date();
    date_now.setTime(date_now.getTime() + (expires_days * 24 * 60 * 60 * 1000));
    var expires_time = "expires="+date_now.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value + ";" + expires_time + ";path=/";
}
  
function getCookie(cookie_name) {
  var get_cname = cookie_name + "=";
  var cookie_split = document.cookie.split(';');
  for(var i = 0; i < cookie_split.length; i++) {
    var cookies = cookie_split[i];
    while (cookies.charAt(0) == ' ') {
      cookies = cookies.substring(1);
    }
    if (cookies.indexOf(get_cname) == 0) {
      return cookies.substring(get_cname.length, cookies.length);
    }
  }
  return "";
}

function isValidURL(string) {
    try {
        url = new URL(string);
        var res = string.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    } catch (_) {
        return false;  
    }

    return (res !== null);
};

async function DOM_parser(url){
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

function isNumeric(n) {
    return !isNaN(n);
}

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

function ngram(str) {
    var ngram_list = [];
    var urlSplit = str.split(/[^a-zA-Z0-9\/]/g);

    var n = 0;
    for (i = 0; i < urlSplit.length; i++) {
        if (urlSplit[i] != "") {
            ngram_list[n] = urlSplit[i];
            n++;
        }
    }

    return ngram_list;    
}

/////////////////////////////////////////////////////////////////

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
    // Note: If the port number is default (80 for http and 443
    //       for https), most browsers will display 0 or nothing.
    var result = window.location.port;

    if (result == '') {
        port = "Tidak ada port";
    } else {
        port = "Terdapat port"; 
    }
    return port;
}

function specialCharacter(url){
    if (!url) {
        return 'Tidak ada special character';
    }
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
    if (!url) {
        return 'Tidak ada duplicated character';
    }
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
        var check = 0, temp = 0;
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
                console.log(getDomainFromAnchor);
                check = 1;
                break;
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

async function AbnormalURL() {
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
    if (!url) {
        return "Tidak obfuscated";        
    }

    try {
        var decodeURL = decodeURI(url);
        var decodeCom = decodeURIComponent(url);
    } catch (_) {}

    var base = url.slice(-2);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    
    if (base === "==" || url.charAt(url.length-1) === "=" || url.includes(".fromCharCode(") || base64Matcher.test(url) || decodeURL != decodeCom) {
        deobfucation_url = "Ada obfuscated";
    } else {
        deobfucation_url = "Tidak obfuscated";
    }
    return deobfucation_url;
}

function numberOfThirdPartyDomain(url){
    if (!url) {
        return "Tidak ada third-party domain";
    }

    var linkSplitStr = unescape(url);
    if ((linkSplitStr.includes("http") || linkSplitStr.includes("https"))){
        return "Ada third-party domain";
    }
    return "Tidak ada third-party domain";
}

function requestForCookie(url){
    if (!url) {
        return 'Tidak ada request cookie';
    }
    var cookie = url.includes("cookie");
    var session = url.includes("session");

    if (cookie == true || session == true){
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
    return url_cookie;
}

function googleIndex(url) {
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

function tagsCode(url){
    try {
        url = decodeURI(url);
    } catch (_) {}
    url_list = ngram(url.toLowerCase());

    if (!url_list) {
        return 'Tidak ada tags';
    }

    var tags = ['script', 'iframe', 'meta', 'form', 'location',
                'textarea', 'title', 'div', 'style', 'marquee',
                'href', 'equiv', 'action', 'open', 'lowsrc',
                'onclick', 'onmouseover', 'onerror', 'onload',
                'onfocus', 'window', 'img', 'document', 'src',
                'history', 'navigator','write', 'alert', 'eval',
                'getElementsByTagName', 'fromCharCode'];

    for (i = 0; i < url_list.length; i++) {
        for (j = 0; j < tags.length; j++){
            if (url_list[i] === (tags[j])){
                // console.log("Tags: " + url_list[i]);
                return 'Terdapat tags';
            }
        }
    }

    return 'Tidak ada tags';
}

function obfuscatedJS(parser) {
    if (!parser) {
        return "Blank";
    }

    const scripts = parser.getElementsByTagName('script');
    for (var sscript of scripts) {
        var escapeJS = unescape(sscript);
        if (escapeJS !== sscript) {
            return "Terdapat Obfus Js";
        }
    }

    return "Tidak terdapat Obfus Js";
}

async function keywordJS(parser) {
    if (!parser) {
        return "Blanks";
    }

    var list_malicious = ['alert', 'eval', 'document.cookie', 'setcookie', 'document.createEelement',
                          'createXMLHTTPRequest', 'child_process', 'window.location', 'setTimeout', 'unescape',
                          'escape', 'ActiveXObject', 'fromCharCode', 'replace', 'document.addEventListener',
                          'attachEvent', 'createElement', 'getElementById', 'document.write', 'split',
                          'onerror', 'setAttribute', 'console.log', 'charCodeAt', 'dateObject.toGMTString',
                          'toString', 'GetCookie', 'element.appendChild', 'charAt', 'decode',
                          'location.replace', 'getUserAgent', 'String.split', 'concat', 'exec']
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

function payloadHTML(string, url) {
    if (string) {
        for (i = 0; i < payload.length; i++) {
            var ppayload = payload[i];
            if (ppayload.includes("{id}")) {
                str = ppayload.split("{id}");
                ppayload = str[0];
            }
    
            if (string.includes(ppayload)) {
                console.log("Payload: " + ppayload);
                return "Terdapat Payload in HTML";
            }
        }    
    }
    if (url) {
        urlParam = decodeURIComponent(url.toLowerCase());
        for (i = 0; i < payload.length; i++) {
            if (payload[i].includes("{id}")) {
                var str = payload[i].split("{id}");
                if (urlParam.includes(str[0].toLowerCase())) {
                    return "Terdapat Payload in HTML";
                }
            }
        }
    }

    return "Tidak terdapat Payload in HTML";
}

function getScript(string, parser) {
    if (!string || !parser) {
        return "Tidak ada javascript sus";
    }
    const scripts = parser.getElementsByTagName('script');

    if (string.includes('script>') || scripts) {
        js_script = "Terdapat javascript";
    } else {
        js_script = "Tidak ada javascript";
    }

    return js_script;
}

(async () => {
    var urlParam;
    if (urlWindow.includes("?")) {
        param = urlWindow.split("?");
        urlParam = param[param.length - 1];
        console.log(decodeURIComponent(urlParam));
    }
    var domain = newUrl.host;
    var cookie = getCookie(domain);
    var dom = await DOM_parser(urlWindow);

    console.time('Waktu deteksi');
    console.time('Waktu fitur with');
    let length_URL = URLLength(urlWindow);
    let port_on_url = nonStandardPort();
    let special_character = specialCharacter(urlParam);
    let duplicated_character = duplicateCharacter(urlParam);
    let URL_of_SFH = ServerFormHandler(dom.dom);
    let abnormal_URL = await AbnormalURL(urlWindow);
    let obfuscated_URL = obfuscatedURL(urlParam);
    let number_of_subdomain = numberOfThirdPartyDomain(urlParam);
    let request_cookie = requestForCookie(urlParam);
    let google_index = await googleIndex(urlWindow);
    let tags_code = tagsCode(urlParam);
    let keyword_in_js = await keywordJS(dom.dom);
    let obfuscated_js = obfuscatedJS(dom.dom);
    let payload_html = payloadHTML(dom.string, urlParam);
    let get_script = getScript(dom.string, dom.dom);
    console.timeEnd('Waktu fitur with');

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
                            tags_code,
                            keyword_in_js,
                            obfuscated_js,
                            payload_html,
                            );

    console.log(all_features);
    console.log("with: " + get_script);

    if (cookie != "") {
        console.log("There is a cookie.");
        console.log(cookie);
        if (cookie == 'XSS'){
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
    } else {
        var c45 = C45();
        await fileSystem.readFile('Dataset_XSS_NonXSS_With.csv', 'utf-8', function(err, data) {
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
    
                
                    console.time('Waktu klasifikasi with');
                    c45.train ({
                        data: trainingData,
                        target: target,
                        features: features,
                        featureTypes: featureTypes
                    }, function(error, model) {
                        if (error) {
                            console.error(error);
                        }
                        // setCookie(domain, model.classify(all_features), 1);
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
                        console.log("With API: " + model.classify(all_features));
                    });
                    // console.log(c45.toJSON());
                    console.timeEnd('Waktu klasifikasi with');
                    console.timeEnd('Waktu deteksi');
                }
            });
        });
        // await fileSystem.appendFile('model.json', c45.toJSON(), function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        // });
    }
})();