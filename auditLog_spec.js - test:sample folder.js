/////////////////////////////////////////
//
//  Basic test will just got to audit log URL as per the test suite and then
//  open the audit log table with user-guid combo.  For meaningul use, you would want
//  to modify an "auditLog_page.js" <-- Variable below, to verify your landing page and necessary elements.
//
/////////////////////////////////////
'use strict';

var env = require('../../lib/env');
var test = require('selenium-webdriver/testing');

var createAuditPage = require('../../pages/sample/auditLog_page.js');
var auditURL = 'https://hqac.kaiserpermanente.org//health/care/distestattributespage';
test.describe("audit ; audit-Log", function() {
    var auditLogPage;

    test.beforeEach(function() {
        auditLogPage = createAuditPage(env.driver(), env.config, env.where, auditURL);
    });

    test.it("Search audit log for user-guid combo", function(done) {
        // For now URL of audit log is hardcoded into the page class.
        // var auditURL = 'https://hqac.kaiserpermanente.org//health/care/distestattributespage';
        auditLogPage.getAuditLogs(env.users.findByTag('audit'));
        done();
    });
});