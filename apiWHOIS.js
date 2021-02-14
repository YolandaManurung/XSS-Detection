const apiWHOIS = 'https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_hcFqkmueNVwugsdIeeXTOrGgOJIY7&outputFormat=JSON&domainName=';

async function connectionToWHOIS(domain){
    let response = await fetch(apiWHOIS + domain);   
    let commits = await response.json();
    return commits;
}

module.exports = { connectionToWHOIS };