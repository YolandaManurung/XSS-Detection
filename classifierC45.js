const allFeatures = require('./Features');
const urlParser = require('./urlParser');
const C45 = require('c4.5');
const fileSystem = require('fs');
const CSVparser = require('papaparse');
const swal = require('sweetalert2');
const cookies = require('./cookies');

function isNumeric(n) {
    return !isNaN(n);
}

(async () => {
    const url = window.location.href;
    const newUrl = new URL(url);
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
        var getFeatures = await allFeatures.features(url);
        
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
                            console.log(model.classify(all_features));
                        }
                    });
                }
            });
        });
    }
})();
