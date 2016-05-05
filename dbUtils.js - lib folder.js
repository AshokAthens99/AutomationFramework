var java = require('java');
var fs = require('fs');
var test = require('selenium-webdriver/testing');
var dbConfig = require('../data/dbconfig.json');
var env = require('./env');

java.options.push("-Djava.awt.headless=true");

java.classpath.push(process.cwd()+'/jar/kp-webdriver-db-utils.jar');
java.classpath.push(process.cwd()+'/jar/ojdbc14.jar');
java.classpath.push(process.cwd()+'/jar/gson-2.2.2.jar');

var dbEnv = env.where; 
var dbConnectString = "jdbc:oracle:thin:@" + dbConfig[dbEnv].host + ":" + dbConfig[dbEnv].port + ":" 
					+ dbConfig[dbEnv].sid;

var dbUtil = java.newInstanceSync('com.kp.webdriver.db.utils.DBUtil', 
	dbConnectString, dbConfig[dbEnv].user, dbConfig[dbEnv].password);

module.exports = {
	executeQuerySync: function(query) {
		return dbUtil.executeQuerySync(query);
	}, 
	executeStatementSync: function(stmt) {
		return dbUtil.executeStatementSync(stmt);
	}
}
