'use strict';

var env = require('../../lib/env');
var createSignOnPage = require('../../pages/common/signon_page');
var projectlinks = require('../../data/environments.json').links;
var projectUsers = require('../../data/users').users;
var allureReporter = require('../../lib/allureReporter');
var helper = require('../../lib/helper');

test.describe("kp-login", function () {
  

  
  //var driver = env.driver();
  var user =  {
      "canSignon": true,
      "region": "Ncal",
      "tags": [
        "default",
        "member",
        "ncal"
      ],
      "group": "Signon",
      "label": "Ncal User",
      "password": "password7",
      "username": "mrn14434988"
    };
    

  test.it("AEM SignOn", function(done) {
    console.log('it1');
    var signOnPage = createSignOnPage(env.driver());
    signOnPage.kpSignOn(user,"aem");
    done();
  });

  test.it("Portal SignOn", function(done) {
    console.log('it2')
    var signOnPage = createSignOnPage(env.driver());
    signOnPage.kpSignOn(user,"portal");
    done();
  });

  test.it("Rwd SignOn", function(done) {
    console.log('it3')
    var signOnPage = createSignOnPage(env.driver());
    signOnPage.kpSignOn(user,"rwd");
    done();
  });

  test.it("Contextual AEM SignOn", function(done) {
    console.log('it4')
    var signOnPage = createSignOnPage(env.driver());
    signOnPage.kpSignOn(user, "aem", projectlinks["mcc1"]);
    done();
  });

  test.it("should redirect",function(done){
    helper.redirectUrl(projectlinks["health-records-threaten"]);
    helper.verifyTitle("Health Records Threaten");
    done();
  });


});
