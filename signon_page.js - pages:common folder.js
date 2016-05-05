
'use strict';
var env = require('../../lib/env');
var until = require('selenium-webdriver').until;
var where = process.env['ENVIRONMENT'] || 'dev1';
var by = webdriver.By;
var allureReporter = require('../../lib/allureReporter');
var baseEnv = require('../../data/environments').baseUrl;

 

module.exports = function(driver) {

  console.log('inside signon');

  var signOn = {
    username: by.css('[name=username]'),
    password: by.css('[name=password]'),
    signonForm: by.css('#signonform'),
    signonButton: by.css('[name=signonButton]')
  };

  function ready(selectors) {
    var waiters = selectors.map(function(selector) {
      return driver.wait(until.elementLocated(selector), env.seleniumtimeout);
    });

    webdriver.promise.all(waiters).then(function(elements) {
      elements.forEach(function(element) {
        expect(element).to.exist;
      });
    });
  }

  return {
    verifyPage: function() {
      ready([
      signOn.username,
      signOn.password,
      signOn.signonForm]);
    },

    kpSignOn: function(credentials, signOnEnv, url) {
      var signOnUrl;
      console.log(credentials);
      if (signOnEnv){
          signOnUrl = baseEnv[signOnEnv].replace('env',where);  
      };
      if (url){
          signOnUrl = url.substring(0,url.search("//")) + "//" + where + url.substring(url.search(".kaiser"));
      };
      //console.log(signOnUrl);
      var username = credentials.username;
      var password = credentials.password;
      console.log("username is: " + username);
      expect(signOnUrl).to.exist;
      expect(username).to.exist;
      expect(password).to.exist;
      if (signOnUrl){
        driver.get(signOnUrl);
        allureReporter.takeScreenshot('Before Signon screenshot');
        this.verifyPage();
        var signonForm = driver.findElement(signOn.signonForm);
        driver.findElement(signOn.username).sendKeys(username);
        driver.findElement(signOn.password).sendKeys(password);
        allureReporter.takeScreenshot('After entering credentials screenshot');
        driver.findElement(signOn.signonButton).click().then(function(){
          driver.wait(until.stalenessOf(signonForm), env.seleniumtimeout);
        }, function(err) {
          console.log("signonForm wait timeOut after: ", env.seleniumtimeout)
          throw err;
        });
      }
    }
  }
}