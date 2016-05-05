var users = require('../../lib/users');
var test = require('selenium-webdriver/testing');
var expect = require('chai').expect;

var sampleUsers = {
	  "data": [
	    {
	      "canSignon": true,
	      "region": "COL",
	      "tags": [
	        "default",
	        "member",
	        "colorado"
	      ],
	      "group": "Signon",
	      "label": "COL User",
	      "password": "password7",
	      "username": "col622510010"
	    }
	  ]
	};

test.describe("findby tag", function() {
  test.it("should find user by single tag", function(done) {
  	var credential = users.findByLocalTag(['colorado'], sampleUsers.data);
    expect(credential.username).to.equal("col622510010");
    expect(credential.password).to.equal("password7");
    done();
  });

  test.it("should find user by multiple tag", function(done) {
  	var credential = users.findByLocalTag(['colorado', 'member'], sampleUsers.data);
    expect(credential.username).to.equal("col622510010");
    expect(credential.password).to.equal("password7");
    done();
  });
});