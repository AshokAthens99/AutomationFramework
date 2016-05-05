//var Allure = require('mocha-allure-reporter');
//global.allure = new Allure();
var env = require('./env');

module.exports = {
	
	addStory: function(story){
		allure.description(story);
	},

	takeScreenshot: function(scName, scrollToElement) {
		if(scrollToElement != undefined) {
			return env.driver().executeScript('arguments[0].scrollIntoView()', scrollToElement).then(function(){
				env.driver().takeScreenshot().then(function(image){
          allure.createAttachment(scName, new function() {
            	return new Buffer(image, 'base64');
        	}, 'image/png');
        });
			});
    } else {
      return env.driver().takeScreenshot().then(function(image) {
          console.log("Creating Screenshot for " + scName);
          allure.createAttachment(scName, new function() {
              return new Buffer(image, 'base64');
        	}, 'image/png');
      });
    }	
  }
}