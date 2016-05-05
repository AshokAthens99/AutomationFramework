
'use strict';

var env = require('../../lib/env');
var test = require('selenium-webdriver/testing');
var createLdapConnection=require('../../lib/ldapConnector');
var allureReporter = require('../../lib/allureReporter');
var createSignOnPage = require('../../pages/common/signon_page');
var winston = require('winston');

test.describe("allure test suite", function() {

    var signOnPage,landingPage,inboxPage,messageDetailsPage;

    test.beforeEach(function() {
        signOnPage = createSignOnPage(env.driver(), env.config, env.where);
    });

    test.it('allure test', function(done) {
        // allure.description('Test description 1');
        allure.createStep('This step will pass', function () {
            winston.info('Hello world!', {timestamp: Date.now(), pid: process.pid});
            winston.log('info', 'test message', 123);
            winston.warn('warn', 'test message', 456);
            winston.error('error', 'test message', 789);
            signOnPage.signon(env.users.findByTag('default'));
            allureReporter.takeScreenshot('Passing test case screenshot');
        })();

        done();
    });

});