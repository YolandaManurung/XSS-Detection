const apiURLDecode = 'https://urldecode.org/?mode=decode&text=';

async function connectionToURLDecode(domain){
    let response = await fetch(apiURLDecode + domain);   
    
    var string = document.getElementsByName("text")[0].value;
    const parsers = new DOMParser();
    var dom = parsers.parseFromString(string, 'text/html');
    
    let commits = await response.json();
    let res = DOM_parser()
    return commits;
}

console.log(connectionToURLDecode('http://www.eia.org.uk/view.php?id=948%22%3E%3Cscript%3Ealert%28document.cookie%29%3C/script%3E'));
// module.exports = { connectionToWHOIS };