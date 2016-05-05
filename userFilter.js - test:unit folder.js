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
	    },
	     {
	      "canSignon": true,
	      "region": "COL",
	      "tags": [
	        "default",
	        "member",
	        "colorado"
	      ],
	      "group": "huh",
	      "label": "COL User",
	      "password": "password7",
	      "username": "col622510010"
	    },
	     {
	      "canSignon": true,
	      "region": "COL",
	      "tags": [
	        "default",
	        "colorado"
	      ],
	      "group": "Signon",
	      "label": "COL User",
	      "password": "password7",
	      "username": "col622510010"
	    }
	  ]
	};
test.describe("Filter Users", function() {

  test.it("By tag (result: 3 users)", function(done) {
  	var userList = users.filterUsers(sampleUsers.data,'default,colorado');
    expect(userList.length).to.equal(3);
    done();
  });

  test.it("By key/value (result: 2 users)", function(done) {
  	var filterGroup = [{"canSignon": true},{"group": "Signon"}];
  	var userList = users.filterUsers(sampleUsers.data,undefined,filterGroup);
    expect(userList.length).to.equal(2);
    done();
  });
  
  test.it("By key/value and tag (result: 1 users)", function(done) {
  	var filterGroup = [{"canSignon": true},{"group": "Signon"}];
  	var userList = users.filterUsers(sampleUsers.data,'default,member',filterGroup);
    expect(userList.length).to.equal(1);
    done();
  });


});
  
