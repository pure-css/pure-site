// This file checks that we get a HTTP 200 status code and the appropriate
// content type for all the routes defined in the app.

'use strict';

/*global describe, it */

process.env.NODE_ENV = 'production';

var request = require('supertest');
var app     = require('../app');

// Question: Is there an easy way to dynamically maintain this list?
// (especially the list of layouts...)

var routes = [
    '/',
    '/start/',
    '/layouts/',
    '/layouts/blog/',
    '/layouts/email/',
    '/layouts/gallery/',
    '/layouts/marketing/',
    '/layouts/pricing/',
    '/layouts/side-menu/',
    '/layouts/tucked-menu-vertical/',
    '/layouts/tucked-menu/',
    '/base/',
    '/grids/',
    '/forms/',
    '/buttons/',
    '/tables/',
    '/menus/',
    '/tools/',
    '/customize/',
    '/extend/'
];

var opt = process.argv[process.argv.length - 1];
var m = opt.match(/^--host=(.*)/);
if (!m) {
    throw new Error('Missing required --host parameter');
}

var host = m[1];

console.log('Testing host: ' + host);

request = request(host);

describe('Functional tests', function () {
    routes.forEach(function (routePath) {
            it('correctly responds on the ' + routePath + ' route', function (done) {
                request.get(routePath)
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(done);
            });
        });
});
