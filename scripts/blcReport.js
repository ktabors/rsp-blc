#! /usr/bin/env node

const {SiteChecker} = require('broken-link-checker');

let options = {};
let baseURL = '';
let urlParamIndex = process.argv.indexOf('-u');
let showExcluded = process.argv.indexOf('-e') !== -1;
let showRedirects = process.argv.indexOf('-r') !== -1;
let showTooManyRequests = process.argv.indexOf('-t') !== -1;
let errorArray = [];
let excludedArray = [];
let redirectArray = [];
let tooManyRequestsArray = []

if (urlParamIndex !== -1 && urlParamIndex < process.argv.length - 1) {
  baseURL = process.argv[urlParamIndex + 1];
}

if (baseURL.length === 0) {
  console.log('No base url defined.\nUsage: `yarn run -u <BASE_URL>`');
  process.exit(1);
}

console.log(`Broken link scan of site using baseurl: \x1b[32m${baseURL}\x1b[0m`);

var siteChecker = new SiteChecker(options, {
  error: (error) => {},
  html: (tree, robots) => {},
  queue: () => {},
  junk: (result) => {},
  link: (result) => {
    if (result.broken) {
      if (result.brokenReason === 'HTTP_308') {
        let redirectMessage = `\x1b[33mBroken (${result.brokenReason}):\x1b[0m \x1b[31m${result.url.redirected || result.url.resolved || result.url.original}\x1b[0m on page: ${result.base.resolved}`;
        if (redirectArray.indexOf(redirectMessage) === -1) {
          redirectArray.push(redirectMessage);
        }
      } else if (result.brokenReason === 'HTTP_429') {
        let tooManyRequestsMessage = `\x1b[33mBroken (${result.brokenReason}):\x1b[0m \x1b[31m${result.url.redirected || result.url.resolved || result.url.original}\x1b[0m on page: ${result.base.resolved}`;
        if (tooManyRequestsArray.indexOf(tooManyRequestsMessage) === -1) {
          tooManyRequestsArray.push(tooManyRequestsMessage);
        }
      } else {//=> HTTP_404 and other errors
        let errorMessage = `\x1b[33mBroken (${result.brokenReason}):\x1b[0m \x1b[31m${result.url.redirected || result.url.resolved || result.url.original}\x1b[0m on page: ${result.base.resolved}`;
        if (errorArray.indexOf(errorMessage) === -1) {
          errorArray.push(errorMessage);
        }
      }
    } else if (result.excluded) {//=> BLC_ROBOTS
      let excludedMessage = `\x1b[34mexcluded (${result.excludedReason}):\x1b[0m ${result.url.redirected || result.url.resolved || result.url.original} on page: ${result.base.resolved}`;
      if (excludedArray.indexOf(excludedMessage) === -1) {
        excludedArray.push(excludedMessage);
      }
    }
  },
  page: (error, pageUrl, customData) => {
    console.log(`Finished checking page: \x1b[32m${pageUrl}\x1b[0m`);
  },
  end: () => {
    console.log('Broken links:')
    errorArray.forEach(error => console.log('  ', error));
    if (showRedirects) {
      console.log('Redirects:')
      redirectArray.forEach(redirect => console.log('  ', redirect));
    }
    if (showTooManyRequests) {
      console.log('Too many requests:')
      tooManyRequestsArray.forEach(tooManyRequests => console.log('  ', tooManyRequests));
    }
    if (showExcluded) {
      console.log('Excluded:')
      excludedArray.forEach(excluded => console.log('  ', excluded));
    }
    console.log(`\nBroken links: ${errorArray.length}\nRedirects: ${redirectArray.length}\nToo many requests: ${tooManyRequestsArray.length}\nExcluded: ${excludedArray.length}`);
    console.log('\n\x1b[32mSite scan complete!\x1b[0m');
  }
});

siteChecker.enqueue(baseURL, {});

let killed = () => {
  console.log('');
  errorArray.forEach(error => console.log(error));
  console.log(`\nErrors: ${errorArray.length}\nRedirects: ${redirectArray.length}\nExcluded: ${excludedArray.length}`);
  console.log('\n\x1b[32mSite scan killed!\x1b[0m');
  process.exit();
}

// CTRL+C
process.on('SIGINT', killed);
// Keyboard quit
process.on('SIGQUIT', killed);
// `kill` command
process.on('SIGTERM', killed);
