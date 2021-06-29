module.exports.ngram = str => {
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
