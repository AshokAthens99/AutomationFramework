#!/bin/bash

set -e
project_path=`pwd`
PATH="$(npm bin):$PATH"
help() {
  cat <<EOH
Usage: $0 <command>

Commands:
  help                                  - prints this message
  setup                                 - sets up workspace and requirements for development (hooks, dependencies, etc)
  setupWindows                          - perfoms the setup for windows machines
  clean                                 - cleans project space of non-source code and then runs npm install
  test [<options>]                      - runs all tests, by default reads config from driverconfig.properties
                --force                 - force the test run to continue even on warnings and failures.
                --browsers              - comma separated list of browsers (firefox,safari,chrome)
                --iosdevices            - comma separated list of ios devices (iphone4,iphone5s,iphone6,ipad4)
                --iosdevicenames        - comma separated list of ios device names (iphone4,iphone5s,iphone6,ipad4)
                --androiddevices        - comma separated list of android devices (nexus6,g3)
                --androiddevicenames    - comma separated list of android device names (nexus6,g3)
                --perfectousername      - perfecto user name
                --perfectopassword      - perfecto user password
                --browserwidth          - width of the browser
                --browserheight         - height of the browser
                --environment           - environment of the test cases to be executed
                --mochatestspecs        - regex of the test case to be executed


EOH
}

setup_postCommit() {
  if ! git config --get url.https://.insteadOf &> /dev/null; then
    git config url.https://.insteadOf git://
  fi
  gitroot=`git rev-parse --show-toplevel`

  cat > $gitroot/.git/hooks/post-commit <<'EOF'
#!/bin/sh

git fetch -p

if git status | grep diverged -q; then
  `git reset --soft HEAD^`
  echo '╚(•⌂•)╝ Your repo is behind!'
  echo 'Pull in the latest changes before committing your work'
  git status
  exit 1
fi

latestCommitHash=`git log --pretty="%H" HEAD -1`
# echo $latestCommitHash "\n\n"
latestCommitMsg=`git cat-file commit $latestCommitHash | sed '1,/^$/d'`
# echo $latestCommitMsg
# REGEX for making sure the formatting for the commit message is contain the work.story and work.pair
# /(([A-z]|[0-9]) : ([A-z]|[0-9]))|(([A-z]|[0-9]):([A-z]|[0-9]))|(([A-z]|[0-9]): ([A-z]|[0-9]))|(([A-z]|[0-9]) :([A-z]|[0-9]))/g
regex='(([A-z]|[0-9]) : ([A-z]|[0-9]))|(([A-z]|[0-9]):([A-z]|[0-9]))|(([A-z]|[0-9]): ([A-z]|[0-9]))|(([A-z]|[0-9]) :([A-z]|[0-9]))'

if [[ $latestCommitMsg =~ $regex ]]; then
  echo "Commit was successful"
else
  `git reset --soft HEAD^`
  echo "Your commit: \"$latestCommitMsg\""
  echo "Commit does not match the desired format."
  echo "Please inclue your [What-You-Worked-On : Who-Worked-On-It], e.g. [SignOn : John/Jane], in your commit message before committing again."
  echo "Workspace has been reset to just before commit; changes are still staged"
  exit 1
fi

EOF

  chmod +x $gitroot/.git/hooks/post-commit
}

requirements_checksum() {
  python -c "
import sys
from hashlib import md5

requirements_blob = open('package.json', 'rb').read()

hash = md5(requirements_blob).hexdigest()

print(hash)
"
}

requirements_up_to_date() {
  [ $(requirements_checksum) == "$(cat .requirements_checksum 2> /dev/null)" ]
}

update_requirements_checksum() {
  requirements_checksum > .requirements_checksum
}

requirements() {
  if ! requirements_up_to_date; then
    npm install
    # bower install -S
    update_requirements_checksum
  fi
}
installHomeBrew() {
  echo "Homebrew not found, being Installed..."
  echo -e "\033[1mNOTE: You may be asked to enter the Administrator Password!\033[0m"
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
}

commandLineTools() {
  echo "Checking Homebrew version..."

  # If HomeBrew is not installed, install it.
  brew -v || installHomeBrew

  # install allure CLI
  echo "Installing Allure Commandline Tool..."
  brew tap qatools/formulas
  brew install allure-commandline
}

setup() {
  setup_postCommit
  requirements
  commandLineTools
  rm .requirements_checksum
}

setupWindows(){
  echo "PRE-REQ: Please install node.js, python, and Microsoft Visual Studio Express 2013 || Make sure python and node are in your PATH !!"
  setup_postCommit
  requirements
  echo "Downloading Allure Command Line Tools"
  curl -O -L 'https://github.com/allure-framework/allure-core/releases/download/allure-core-1.4.19/allure-commandline.zip'
  unzip allure-commandline.zip -d ~/allure-commandline
  echo "Adding allure.bat shell alias to bash profile in ~/.bashrc and then sourcing the file"
  echo "alias allure=~/allure-commandline/bin/allure.bat" >> ~/.bashrc
  source ~/.bashrc
  echo "Checking final install setup";
  echo "Path: " $PATH
  echo "node Version: ";node --version
  echo "npm Version: ";npm -v
  python -V
  echo "Allure Version: ";~/allure-commandline/bin/allure.bat version
  rm -f allure-commandline.zip
}

grunt() {
  "$(npm bin)/grunt" "$@"
}

mocha() {
  "$(npm bin)/mocha" "$@"
}

clean() {
  gitroot=`git rev-parse --show-toplevel`
  rm -Rf target
  rm -Rf node_modules
  rm -Rf .requirements_checksum
  rm -Rf archive-allure-results
  rm -Rf allure-results*
  rm -Rf allure-reports*
  rm -f $gitroot/.git/hooks/prepare-commit-msg
  rm -f $gitroot/.git/hooks/pre-push
  rm -Rf *.log
  npm install
}

cleanAllureReports() {
  if [ "$(echo allure-results-*)" != "allure-results-*" ]; then
    rm -rf allure-results*
  fi
  if [ "$(echo allure-reports-*)" != "allure-reports-*" ]; then
    rm -r allure-reports*
  fi
  if [ "$(echo test-*.log)" != "test-*.log" ]; then
    rm test-*.log
  fi
  if [ "$(echo archive-allure-result*)" != "archive-allure-result*" ];
  then
    find archive-allure-results -mindepth 1 -maxdepth 1 -type d -mmin +99 -exec rm -rf {} \;
  else
    mkdir archive-allure-results
  fi
}

runTestSuite() {
  goargnames=(grid local ignoreprops browsers iosdevices iosdevicenames androiddevices androiddevicenames grepinclude grepexclude)
  derivedgruntargnames=(browser resultsdirsuffix platform mobileos deviceid)
  otherargscount=2
  otherargs=("test:endtoend")
  allargnames=()
  allargs=()
  readconfig=true
  index=0

  for i in "$@"
  do
    argname=$(echo ${i%=*} | { read x; echo "${x/--/}"; })
    allargs[$((index++))]=$i
    allargnames[$index]=$argname
    if [ $argname == "ignoreprops" ]; then
      readconfig=false
    fi
  done

  if [ $readconfig == true ]; then
    configparamfile="driverconfig.properties"
    while IFS= read -r i
    do
      propname=$(echo ${i%=*} | { read x; echo "${x/--/}"; }| sed '/^ *#/d;s/#.*//')
      propvalue=$(echo ${i#*=}| sed '/^ *#/d;s/#.*//')
      ignore=false
      for argname in "${allargnames[@]}"
      do
        if [ "$propname" == "$argname" ]; then
          ignore=true
          break
        fi
      done
      if [ $ignore == false -a ${#propvalue} -gt 0 ]; then
        allargs[$((index++))]="--$i"
        allargnames[$index]=$propname
      fi
    done < "$configparamfile"
  fi

  for i in "${allargs[@]}"
  do
    isotherarg=true
    argname=$(echo ${i%=*} | { read x; echo "${x/--/}"; })
    argvalue=$(echo ${i#*=})
    for goargname in "${goargnames[@]}"
    do
      if [ "$argname" == "$goargname" ]; then
        declare "$argname"="$(echo ${i#*=})"
        isotherarg=false
        break
      fi
    done
    if [ $isotherarg == true ]; then
      for gruntargname in "${derivedgruntargnames[@]}"
      do
        if [ $argname == $gruntargname ]; then
          isotherarg=false
          break
        fi
      done
    fi
    if [ $isotherarg == true ]; then
      otherargs[$((otherargscount++))]=$i
    fi
  done

  if [ -n "$grepexclude" -a -n "$grepinclude" ]; then
    echo "Only grepinclude or grepexclude is allowed"
    exit 1
  fi

  mochatestspecs=false
  for oarg in "${otherargs[@]}"
  do
    oargname=$(echo ${oarg%=*} | { read x; echo "${x/--/}"; })
    if [ "$oargname" == "mochatestspecs" ]; then
      mochatestspecs=true
    fi
  done

  if [ $mochatestspecs == false ]; then
    echo "mochatestspecs param is required"
    exit 1
  fi

  BROWSERS=($(echo $browsers | sed "s/,/ /g"))
  IOSDEVICES=($(echo $iosdevices | sed "s/,/ /g"))
  IOSDEVICENAMES=($(echo $iosdevicenames | sed "s/,/ /g"))
  AOSDEVICES=($(echo $androiddevices | sed "s/,/ /g"))
  AOSDEVICENAMES=($(echo $androiddevicenames | sed "s/,/ /g"))

  if [ -n "$grepinclude" ]; then
    otherargs[$((otherargscount++))]="--grep=$grepinclude"
  fi

  if [ -n "$grepexclude" ]; then
    otherargs[$((otherargscount++))]="--inverse=y"
    otherargs[$((otherargscount++))]="--grep=$grepexclude"
  fi

  if [ ${#BROWSERS[@]} -ne 0 ]; then
  for browser in "${BROWSERS[@]}"
  do
    $project_path/node_modules/kp-webdriverjs-utils/runtestsuite --browser=$browser --resultsdirsuffix=-$browser "${otherargs[@]}" || ./runtestsuite --browser=$browser --resultsdirsuffix=-$browser "${otherargs[@]}"
  done
  fi

  devicecount=0
  if [ ${#IOSDEVICES[@]} -ne 0 ]; then
  for iosdeviceid in "${IOSDEVICES[@]}"
  do
    resultfolder=""
    if [ $devicecount -lt ${#IOSDEVICENAMES[@]} ]; then
      resultfolder=${IOSDEVICENAMES[${devicecount}]}
    else
      resultfolder="iosdevice$[devicecount+1]"
    fi
    devicecount=$[devicecount+1]
    echo "nohup $project_path/node_modules/kp-webdriverjs-utils/runtestsuite --platform=mobile --mobileos=iOS --deviceid=$iosdeviceid --resultsdirsuffix=$resultfolder ${otherargs[@]} > test-$resultfolder.log &"
    nohup $project_path/node_modules/kp-webdriverjs-utils/runtestsuite --platform=mobile --mobileos=iOS --deviceid=$iosdeviceid --resultsdirsuffix=-$resultfolder ${otherargs[@]} > test-$resultfolder.log || nohup ./runtestsuite --platform=mobile --mobileos=iOS --deviceid=$iosdeviceid --resultsdirsuffix=-$resultfolder ${otherargs[@]} > test-$resultfolder.log &
  done
  fi

  devicecount=0
  if [ ${#AOSDEVICES[@]} -ne 0 ]; then
  for aosdeviceid in "${AOSDEVICES[@]}"
  do
    resultfolder=""
    if [ $devicecount -lt ${#AOSDEVICENAMES[@]} ]; then
      resultfolder=${AOSDEVICENAMES[${devicecount}]}
    else
      resultfolder="aosdevice$[devicecount+1]"
    fi
    devicecount=$[devicecount+1]
    echo "nohup $project_path/node_modules/kp-webdriverjs-utils/runtestsuite --platform=mobile --mobileos=Android --deviceid=$aosdeviceid --resultsdirsuffix=-$resultfolder ${otherargs[@]} > test-$resultfolder.log &"
    nohup $project_path/node_modules/kp-webdriverjs-utils/runtestsuite --platform=mobile --mobileos=Android --deviceid=$aosdeviceid --resultsdirsuffix=-$resultfolder ${otherargs[@]} > test-$resultfolder.log || nohup ./runtestsuite --platform=mobile --mobileos=Android --deviceid=$aosdeviceid --resultsdirsuffix=-$resultfolder ${otherargs[@]} > test-$resultfolder.log &
  done
  fi
}

test(){
  requirements
  cleanAllureReports
  runTestSuite "$@"
}
if [ "$(type -t "$1")" == "function" ]; then
  "$@"
else
  echo "invalid option"
fi
