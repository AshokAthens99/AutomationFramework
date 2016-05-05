'use strict';

var env = require('../../lib/env');
var until = require('selenium-webdriver').until;
var webdriver = require('selenium-webdriver');
var expect = require('chai').expect;
var by = webdriver.By;
var screenshot = require ('../../lib/screenshot');
var allureReporter = require('../../lib/allureReporter');
var helper = require('../../lib/helper');
var locator = require('../../locators.json').locator;

module.exports = function(driver, config, where, URL) {
    var auditURL = URL; // set from within the test
    // var auditURL = config[where].audit // set assuming that there is an "audit" attribute of the specific environment in the support/environments.json
    var auditLog = {
        guidEntry: by.css('[name=DisattributesauditlogtestportletFormText]'),
        userIdEntry: by.css('[name=DisattributesauditlogtestportletUserId]'),
        submitButton: by.css('[name=DisattributesauditlogtestportletFormSubmit'),
        deleteButton: by.xpath('//input[@name="DisattributesauditlogtestportletFormSubmit"][2]'),
        deleteTxnButton: by.xpath('//div[@id="mainContent"]/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/div/div/form/input[5]'),
        auditForm: by.css('form'),
        auditResultHeader1: by.xpath('//div[@id="mainContent"]/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/div/div/table/tbody/tr/td/table/tbody/tr/td'),
        auditResultHeader2: by.xpath('//td[@id="log1"]/table/tbody/tr/td'),
        auditResultHeader3: by.xpath('//td[@id="log2"]/table/tbody/tr/td')
    };

    function ready(selectors) {
        var waiters = selectors.map(function(selector) {
            return driver.wait(until.elementLocated(selector), env.timeOut);
        });

        webdriver.promise.all(waiters).then(function(elements) {
            helper.take();
            elements.forEach(function(element) {
                expect(element).to.exist;
            });
        });
    }

    return {
        verifyPage: function() {
            ready([
                auditLog.guidEntry,
                auditLog.userIdEntry,
                auditLog.submitButton,
                auditLog.deleteButton,
                auditLog.deleteTxnButton
            ]);
            allureReporter.takeScreenshot('Audit Log landing page screenshot');
        },
        verifyLandingPage: function(){
            ready([
                auditLog.auditResultHeader1,
                auditLog.auditResultHeader2,
                auditLog.auditResultHeader3
            ]);
            allureReporter.takeScreenshot('Audit Log results page screenshot');
        },
        getAuditLogs: function(userInfo){
            var userGuid = userInfo.guid;
            var userId = userInfo.userId;
            console.log("user guid: " + userGuid + " || user id:" + userId);
            driver.get(auditURL);
            this.verifyPage();
            var auditForm = driver.findElement(auditLog.auditForm);
            driver.findElement(auditLog.guidEntry).sendKeys(userGuid);
            driver.findElement(auditLog.userIdEntry).sendKeys(userId);
            driver.findElement(auditLog.submitButton).click().then(function(){
                driver.wait(until.stalenessOf(auditForm),env.timeOut);
            });
            this.verifyLandingPage();
        }
    }
};

// AUDIT LOG DATA
// https://hqac.kaiserpermanente.org//health/care/distestattributespage
//        <hqa | hqab | hqac | hint1 | hint2 | hint3>
// User ID: gga001841986
// GUID: 100020597
// Enter guid: 		css=input[name="DisattributesauditlogtestportletFormText"]
// Enter Userid: 	css=input[name="DisattributesauditlogtestportletUserId"]
// [Submit]: 		css=input[name="DisattributesauditlogtestportletFormSubmit"]
//					xpath=(//input[@name='DisattributesauditlogtestportletFormSubmit'])[1]
// [Delete]: 		xpath=(//input[@name='DisattributesauditlogtestportletFormSubmit'])[2]
// [DeleteTxn]: 	xpath=(//input[@name='DisattributesauditlogtestportletFormSubmit'])[3]