# rsp-blc

A programatic script to run broken-link-checker on a site with minimal console logging. It's a bit slower then running broken-link-checker directly.

## Setup

You can clone the repo, install the packages, and run the script to crawl a site looking for broken links. Make sure you have the following requirements installed: node (v12.22.12+) and yarn (v1.22.19+).

```
yarn install
```

## Getting Started
Run the following to scan a site for its broken links.

```
yarn run -u <BASE_URL>
```
or
```
node ./scripts/blcReport.js -u <BASE_URL>
```

## Usage

`-u <BASE_URL>` The url of the site to scan (required).
```
yarn run -u <BASE_URL>
```

`-r` Include the redirected urls (http code 308).
```
yarn run -u <BASE_URL> -r
```

`-t` Include the too many request urls (http code 429).
```
yarn run -u <BASE_URL> -t
```

`-e` Include the urls excluded by robot files.
```
yarn run -u <BASE_URL> -e
```
