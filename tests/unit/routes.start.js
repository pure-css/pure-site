/*global describe, it*/

process.env.NODE_ENV = 'production';

var express  = require('express');
var layouts  = require('../../routes/start');
var request  = require('supertest');
var expect   = require('chai').expect;

var app = require('../../app');

describe('routes/start', function () {
    describe('/start/', function () {
        it('should return 200', function (done) {
            request(app).get('/start/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('/start/css?mq=100', function () {
        it('should return some JSON content', function (done) {
            request(app).get('/start/css?mq=100')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(done);
        });
    });

    describe('/start/css?mq=foo bar', function () {
        it('should return 400', function (done) {
            request(app).get('/start/css?mq=foo bar')
                .expect(400)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('/start/download', function () {
        it('should trigger the download of the starter kit', function (done) {
            request(app).get('/start/download')
                .expect(200)
                .expect('Content-Disposition', 'attachment; filename="pure-start.zip"')
                .end(done);
        });
    });
});
