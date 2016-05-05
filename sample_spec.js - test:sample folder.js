
'use strict';

var env = require('../../lib/env');
var test = require('selenium-webdriver/testing');
var createLdapConnection=require('../../lib/ldapConnector');

var allureReporter = require('../../lib/allureReporter');
var webdriver = require('selenium-webdriver');
var createSamplePage = require('../../pages/sample/sample_page');
var createSignOnPage = require('../../pages/common/signon_page');

test.describe("CommonMethod", function() {

    var samplePage,signOnPage;
    var ldapUtil;

    test.beforeEach(function() {
        samplePage = createSamplePage(env.driver(), env.config, env.where);
        signOnPage = createSignOnPage(env.driver(), env.config, env.where);
        //ldapUtil=createLdapConnection();
    });


    //Checks the status of radio button and clicks it
    test.it("FindDoc location @smoke", function(done) {
        signOnPage.signon(env.users.findByTag('default'),"My health manager");
        samplePage.clickfacility();
        done();
    });

    //Validating title and the text in the page
    test.it("My Health Menu @smoke", function(done) {
        signOnPage.signon(env.users.findByTag('default'));
        samplePage.textValue();
        done();
    });


//Select from drop down
    test.it("drop down test @regression", function(done) {
        signOnPage.signon(env.users.findByTag('sca-unit'));
        samplePage.proxyPicker();
        done();
    });

    //Select from drop down
    test.it("page load test @regression", function(done) {
        signOnPage.signon(env.users.findByTag('sca-unit'));
        samplePage.pageLoad();
        done();
    });

});