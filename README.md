Pure CSS Website
================

[![Build Status](http://img.shields.io/travis/yahoo/pure-site.svg?style=flat-square)](https://travis-ci.org/yahoo/pure-site)
[![Dependency Status](https://david-dm.org/yahoo/pure-site.svg)](https://david-dm.org/yahoo/pure-site)

The website which showcases [Pure CSS][Pure].


[Pure]: https://github.com/yahoo/pure


Running Locally
---------------

This is a node.js site which uses Express.js, which means it's very easy to get
running locally.

```shell
$ npm install
$ npm start
```

To run the health checks:

```
$ grunt health.check
```

By default, it will run the tests using the local instance (running on port 5000)
But you can also specify a remote host:

```
$ grunt health.check --host=foo
```

### Auto-Building of Browser Assets

This site uses an integrated [Broccoli][] build process. When the site is
running in development mode, Broccoli will be watching everything in the
`public/` directory and rebuild when something changes.

This makes it much easier to work on browser-side features without needed to
manually kick off the build process or restart the server.

### Running with Pure Served Locally

Since this website dogfoods [`pure`][Pure] it's a great testbed to try out local
changes you're making to Pure. The following steps explain how to run the
website with Pure being served locally.

Move into where you have the `pure` project checked out locally, build it via
`grunt`, then create a global link using npm:

```shell
$ cd pure/
$ grunt
$ npm link
```

Now you'll need to move into where you have this project checked out locally,
install the website's npm dependencies (if you haven't done so already),
link `pure` in `pure-site` using npm, then start up the server with the
--pure-local argument:

```shell
$ cd ../pure-site/
$ npm link purecss
$ node server.js --pure-local
```

**Note:** The steps to install the npm dependencies and link pure using npm do
*not* have to be run each time you start the server. Also, you can leave the
server running and rebuild `pure` via `grunt` and you'll see the changes in your
browser after refreshing!


[Broccoli]: https://github.com/broccolijs/broccoli


Running in Production
---------------------

To run the site in production mode you must first run the build via Grunt, and
set the `NODE_ENV` environment variable to `production`:

```shell
$ grunt
$ NODE_ENV=production node server
```


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/pure-site/blob/master/LICENSE.md
