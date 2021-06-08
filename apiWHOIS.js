const apiWHOIS = 'https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_MUU77fxi6N57F5pnrN9dyXyK5K4Sn&outputFormat=JSON&domainName=';

async function connectionToWHOIS(domain){
    let response = await fetch(apiWHOIS + domain);   
    let commits = await response.json();
    return commits;
}

module.exports = { connectionToWHOIS };