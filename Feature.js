const urlParser = require('./urlParser');
const htmlParser = require('./htmlParser');
const apiWHOIS = require('./apiWHOIS');

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

function ServerFormHandler(parser, domainURL){
    const anchors = parser.getElementsByTagName('a');
    for (let anchor of anchors) {
        let href = anchor.attributes.href;
        if (href){
            getDomainFromAnchor = isValidURL(href.value);
            if (getDomainFromAnchor == true){
                var getDomainFromAnchor = urlParser.domainURL(href.value);
                if (getDomainFromAnchor != domainURL){
                    urlOfServerFormHandler = 'Mengarah ke domain berbeda';
                } else {
                    urlOfServerFormHandler = 'Mengarah ke domain sendiri'
                }
            }             
        }
    }
    return (urlOfServerFormHandler);
}

async function AbnormalURL(urlInWHOISInfo){
    if (urlInWHOISInfo){
        if (urlInWHOISInfo.WhoisRecord.dataError == "IN_COMPLETE_DATA" || urlInWHOISInfo.WhoisRecord.dataError == "MISSING_WHOIS_DATA"|| urlInWHOISInfo.WhoisRecord.parseCode == 0) {
            urlInWHOIS = "Tidak tersimpan di database whois";
        } else {
            urlInWHOIS = "Tersimpan di database whois";
        }
    } else {
        urlInWHOIS = "Tidak tersimpan di database whois";
    }
    
    return urlInWHOIS;
}

function obfuscatedCode(url){

}

function numberOfThirdsPartyDomain(url){
    var count_subdomain = 0;
    var subDomainLenght = 0;

    var linkSplit = url.split("?");
    var linkSplitSubdomain = linkSplit[1].split(".").reverse();

    if (linkSplitSubdomain[linkSplitSubdomain.length-1] == 'www') {
        subDomainLenght = linkSplitSubdomain.length-1;
    } else {
        subDomainLenght = linkSplitSubdomain.length;
    }

    if (linkSplitSubdomain[1] == 'co') {
        for (i = 3; i < subDomainLenght; i++) {
            count_subdomain=count_subdomain+1;
          }
    } else {
        for (i = 2; i < subDomainLenght.length; i++) {
            count_subdomain=count_subdomain+1;
          }
    }
    if (count_subdomain > 2){
        numberOf_subdomain = '>2';
    } else if (count_subdomain == 2){
        numberOf_subdomain = '2';
    } else {
        numberOf_subdomain = '>= 0 dan < 2';
    }
    return (numberOf_subdomain);
}

function requestForCookie(url){
    var cookie = url.search("cookie");
    if(cookie > 0){
        url_cookie = 'Ada request cookie';
    } else {
        url_cookie = 'Tidak ada request cookie';
    }
}

function htmlTags(url){

}

function htmlProperties(url){

}

function eventHandler(url){

}

function domObjects(url){

}

function javascriptMethod(url){

}

async function features(url){
    var dom = await htmlParser.DOM_parser(url);
    var parser = urlParser.convertToURL(url);
    var domain = urlParser.domainURL(url);
    var api_whois = await apiWHOIS.connectionToWHOIS(domain);

    // console.log(api_https_lookup);
    // console.log(api_whois);
    // console.log(api_wot);

    let abnormal_URL = await AbnormalURL(api_whois);
    let length_URL = URLLength(url);
    let request_URL = requestURL_CrossSite(dom.dom, domain);
    let number_of_subdomain = numberOfThirdsPartyDomain(url);
    let URL_of_SFH = ServerFormHandler(dom.dom, domain);

    var all_features = [];
    await all_features.push(request_URL,
                            length_URL,
                            URL_of_SFH,
                            number_of_subdomain,
                            abnormal_URL);

    return all_features;
}

module.exports = { features };