module.exports.ngram = ngram_list => {
    var ngram_list = [];

    console.log(url);
    var urlSplit = url.split(/\W+/g);

    for (i = 0; i <= urlSplit.length-3; i++) {
        ngram_list[i] = urlSplit[i] + ' ' + urlSplit[i+1];
    }

    return ngram_list;
}
