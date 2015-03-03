/*global describe, it*/

process.env.NODE_ENV = 'production';

var express  = require('express');
var layouts  = require('../../routes/layouts');
var request  = require('supertest');
var expect   = require('chai').expect;

var app = require('../../app');

describe('routes/layouts', function () {
    describe('/layouts/', function () {
        it('should return 200', function (done) {
            request(app).get('/layouts/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('/layouts/blog/', function () {
        it('should return 200', function (done) {
            request(app).get('/layouts/blog/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('/layouts/blog/download', function () {
        it('should trigger the download of a layout', function (done) {
            request(app).get('/layouts/blog/download')
                .expect(200)
                .expect('Content-Disposition', 'attachment; filename="pure-layout-blog.zip"')
                .end(done);
        });
    });
});
