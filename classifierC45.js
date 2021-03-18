const Feature = require('./Feature');
const C45 = require('c4.5');
const fileSystem = require('fs');
const CSVparser = require('papaparse');
const swal = require('sweetalert2');

function isNumeric(n) {
    return !isNaN(n);
}

(async() => {
    var getFeatures = await allFeatures.features();

    await fileSystem.readFile('Dataset_XSS_Non_XSS.csv', 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            return false;
        }
        CSVparser.parse(data, {
            complete: function(result) {
                var headers = result.data[0];
                var features = headers.slice(1, -1);
                var target = headers[headers.length - 1];

                var trainingData = result.data.slice(1).map(function(d) {
                    return d.slice(1);
                });

                var featureTypes = trainingData[0].map(function(d) {
                    return isNumeric(d) ? 'number' : 'category';
                });

                var c45 = C45();

                c45.train({
                    data: trainingData,
                    target: target,
                    features: features,
                    featureTypes: featureTypes
                }, function(error, model) {
                    if (error) {
                        console.error(error);
                    }

                    if (model.classify(getFeatures) == 'xss') {
                        swal.fire({
                            imageUrl: 'data:image/png;base64,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',
                            imageWidth: 50,
                            imageHeight: 50,
                            imageAlt: 'Icon Warning',
                            title: 'This website contains XSS!',
                            text: "Don't visit this website! It is dangerous!!"
                        })
                    }
                });
            }
        });
    });
})();