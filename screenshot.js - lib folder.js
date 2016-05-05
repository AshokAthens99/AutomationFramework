var path = require('path');
var fs = require('fs');

var basedir = './target/endtoend/screenshots/';

module.exports = {
    take: function() {
        currentTest = this.test.title;
        currentParent = this.test.parent.fullTitle();
        current = this.test;
        driver = this.driver;

        fs.readdir(path.join(basedir,currentParent,currentTest), function(err, files) {
            if (err) {
                throw err;
            }
            var count = (files.length) + 1;
            var filename =path.join((basedir+currentParent),currentTest,currentTest+'.step'+count+'.Pass'+'.png');
            driver.takeScreenshot().then(function(image){
                fs.writeFileSync(filename, image, 'base64' );
            });
        });
    },
    startTest : function (driver,test){
        this.driver = driver;
        this.test = test;
    }
};

