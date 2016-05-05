module.exports = function webdriverTestSuite(name, grunt, directories) {
    'use-strict';
    require('grunt-mocha-test/tasks/mocha-test')(grunt);
    process.env.BROWSER = grunt.option("browser") || "phantomjs";
    process.env.ENVIRONMENT = grunt.option("environment") || "dev1";
    process.env.PLATFORM = grunt.option("platform") || "desktop";
    process.env.DEVICE_ID = grunt.option("deviceid");
    process.env.MOBILE_OS = grunt.option("mobileos");
    process.env.PERFECTO_USERNAME = grunt.option("perfectousername");
    process.env.PERFECTO_PASSWORD = grunt.option("perfectopassword");
    process.env.BROWSER_WIDTH = grunt.option("browserwidth") || undefined;
    process.env['BROWSER_HEIGHT'] = grunt.option("browserheight");
    process.env['seleniumtimeout'] = grunt.option("seleniumtimeout");

    process.env.RESULTSDIRSUFFIX = grunt.option("resultsdirsuffix") || "gird"; 

    var tasks = process.env.ENVIRONMENT === "local-unknown" ? ["copy:dist", "build:app-config", "connect:dist"] : ["mochaTest:" + name];
    var d = new Date();
    var allureReportFolderName = 'allure-results' + grunt.option("resultsdirsuffix"); // + d.getFullYear() + ("00"+(d.getMonth()+1)).slice(-2) + ("00"+d.getDate()).slice(-2) +"-"+d.getTime();
    var config = {
        mochaTest: {}
    };
    config.mochaTest[name] = {
        options: {
            reporter: 'mocha-allure-reporter',
            reporterOptions: {
                targetDir: allureReportFolderName
            },
            timeout: 60000,
            logErrors: true,
            captureFile: directories.target + '/' + name + '/test-results.txt'
        },
        src: grunt.option("mochatestspecs").split(",")
    };
    console.log("mocha grep config=" + config.mochaTest[name]['options']['grep']);
    grunt.event.once("connect.dist.listening", function() {
        grunt.task.run("mochaTest:" + name);
    });
    grunt.registerTask('test:' + name, 'runs the ' + name + ' selenium tests', tasks);
    grunt.config.merge(config);
}