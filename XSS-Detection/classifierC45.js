const Features = require('./Features');
const htmlParser = require('./htmlParser');
const cookies = require('./cookies');
const C45 = require('c4.5');
const fileSystem = require('fs');
const CSVparser = require('papaparse');
const swal = require('sweetalert2');

function isNumeric(n) {
    return !isNaN(n);
}

async function getScript() {
    var dom = await htmlParser.DOM_parser();
    if (!dom.string) {
        return "Tidak ada javascript sus";
    }

    if (dom.string.includes('script>')) {
        js_script = "Ada";
    } else {
        js_script = "Tidak";
    }

    return js_script;
}

(async () => {
    const url = window.location.href;
    const newUrl = new URL(url);
    var get_script = await getScript();
    var domain = newUrl.host;
    var cookie = cookies.getCookie(domain);
    
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
        console.log(cookie);
        console.log("Processing the detection..")
        var getFeatures = await Features.features(url);
        console.log(getFeatures);
        await fileSystem.readFile('DatasetNew(fin).csv', 'utf-8', function(err, data) {
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
                        console.log(model.classify(getFeatures));
                        cookies.setCookie(domain, model.classify(getFeatures), 1);
                        if (model.classify(getFeatures) == 'XSS' && get_script == 'Ada') {
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
                    });
                }
            });
        });
    }
})();
