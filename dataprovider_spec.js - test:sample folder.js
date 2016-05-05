
var env = require('../../lib/env');
var test = require('selenium-webdriver/testing');
var _ = require("underscore-node");

var createSignOnPage = require('../../pages/common/signon_page');
test.describe("kp-dataprovider", function () {

    var signOnPage; // landingPage, inboxPage, messageDetailsPage;

    test.beforeEach(function () {
        signOnPage = createSignOnPage(env.driver(), env.config, env.where);
    });

    test.it("should pass multiple test with group", function (done) {

        var usersByGroup = env.users.findByGroup('Signon');
        _.each(usersByGroup, function (user) {
            env.driver().manage().deleteAllCookies();
            signOnPage.signon(user);
            done();
        });

    });

});

