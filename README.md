Pure CSS Website
================

The website which showcases [Pure CSS][pure].


[pure]: https://github.com/yui/pure


Running Locally
---------------

This is a node.js site which uses Express.js, which means it's very easy to get
running locally.

```shell
$ npm i
$ node server
```

### Running with Pure Served Locally

Since this website dogfoods [`pure`][pure] it's a great testbed to try out local
changes you're making to Pure. The following steps explain how to run the
website with Pure being served locally, and the instruction assume you have
[Bower][] installed (if not do so now: `sudo npm -g i bower`).

Move into where you have the `pure` project checked out locally, build it via
`grunt`, then create a global link using Bower:

```shell
$ cd pure
$ grunt
$ bower link
```

Now you'll need to move into where you have this project checked out locally,
install the website's npm dependecies (if you haven't done so already),
link `pure` in `pure-site` using Bower, then start up the server:

```shell
$ cd ../pure-site
$ npm i
$ bower link pure
$ node server --pure-local
```

The `--pure-local` flag is what will serve the Pure CSS locally instead of from
the CDN.

**Note:** The steps to install the npm dependencies and link pure using Bower do
*not* have to be run each time you start the server. Also, you can leave the
server running and rebuild `pure` via `grunt` and you'll see the changes in your
browser after refreshing!


[Bower]: http://bower.io/


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yui/pure-site/blob/master/LICENSE.md
