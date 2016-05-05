# Kaiser Permanente - WebdriverJS Utilities

This repo is intended to be distributed as a base framework for other users. This will be done by way of git fork.
<br>
CLONE (`git clone <clone URI>`) <-- for use of exploring the repo as read-only

## Setup
`./go setup` will configure the environment and should install dependencies for mac (and other unix) machines. <br>
`./go setupWindows` will configure the environment and should install dependencies for Windows OS (7++) <br>
Try to run a test after setup; if it fails, go to section for install <br>
For additional project setup details, please refer the below link in sharepoint. Use cs\NUID and Nuid password to view the files.
[CDS - JS Automation Documentation](https://sites.sp.kp.org/teams/dto/APOQ/pqe/_layouts/15/start.aspx#/Shared%20Documents/Forms/Summary%20View.aspx?RootFolder=%2Fteams%2Fdto%2FAPOQ%2Fpqe%2FShared%20Documents%2FCDS%20%2D%20JS%20Automation%20Documentation&FolderCTID=0x01200070A01282C67F4845824D8D1517B399A9&View=%7B5D79F3A2%2D22DD%2D4F01%2DA1AA%2D4A39FD95CF1C%7D)


## INSTALL
Follow these instructions only if setup did not work (mac/unix only)<br>
 - install homebrew (recommended) <br>
     `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"` <br>
     `brew install node` installs nodeJS <br>
 - npm install <br>

## RUN TEST

### Config Properties File
A config file, driverconfig.properties, is included to easilily manage file as below before execution. Below is a break down of the properties file. <br>

mochatestspecs=This property is <b>required</b> and is the folder where your test scripts reside. e.g. test/common/signon_spec.js<br>

grep=Field which uses keywords within `test.describe` or `test.it` blocks to search for test(s) and <b>include</b> them in the execution. e.g. FindDoc location|My Health Menu<br>

environment=The single environment you wish to run your suite against. e.g dev1/hint1 etc<br>
seleniumtimeout=Numerical value for the timeout in milliseconds (ms). e.g. 5000<br>

iosdevices=Id of the Perfecto iphone device<br>
iosdevicenames=Any name that we want the allure report to show/be called. e.g. iPhone 5<br>
androiddevices=Id of the Android Perfecto device<br>
androiddevicenames=Any name that we want the allure report to show/be called. e.g. Google Nexus<br>
perfectousername=Perfecto user id<br>
perfectopassword=Perfecto Password<br>
> <b>NOTE</b> Do **NOT** commit your credentials

browsers=Comma seperated field for the browser(s) you wish to run on. e.g. firefox,chrome,safari,firefox-grid,chrome-grid<br>
browserwidth=1000<br>
browserheight=1000<br>


### Running the tests
 `./go test` will also run the tests using the values from driverconfig.properties. <br>

Use `./go help` for a full list of wrapper commands.


## RUN TEST in GRID
By default, test will be executed locally.<br>
To run on grid : Modify the driverconfig.properties file as above with browsers type as firefox-grid,chrome-grid<br>
Once modified, execute `./go test`


## Database Connection
Database Connection is achieved by using [node-oracledb](https://github.com/oracle/node-oracledb) which is officially supported by Oracle. <br>
Visit their Github page for a full list of command details; also full installation instructions can be found [here on Github](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md)

> <b>NOTE</b> the sample test is set to `.skip` by default so you'll have to uncomment that. Additionally, oracle db dependency, `"oracledb": "~1.4.0"`, must be added to package json in the dependencies or dev dependencies block. This was removed because it would cause issues if the full install instructions (above) are not followed. Additionally, I've completely commented out the test to avoid compilation and installation errors that occur when users haven't completed the oracle DB instructions above<br> <br>
> <b>NOTE</b> to execute these tests with mocha on OS X El Capitain, users must [disable System Integrity Protection -- SIP](http://www.macworld.com/article/2986118/security/how-to-modify-system-integrity-protection-in-el-capitan.html)


## Report
After Execution, allure results and reports are generated in respective folders. e.g. allure-results-firefox, allure-reports-firefox.<br>
All console logs, if not displayed at run time, will be captured in respective log files. e.g. test-firefox.log <br>
> Log files can be opened in text editor or printed via `cat test-firefox.log`

All the results are archived in archive-allure-results folder.<br>
The folders inside archive-allure-results folder will get automatically deleted after 99 minutes (this happens at test runtime)<br>
### Opening Reports
To open allure reports from command line enter either of the following commands<br>
`allure report open --report-dir=allure-reports-firefox`<br>
`allure report open -o allure-reports-firefox`<br>