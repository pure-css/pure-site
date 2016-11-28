/*global describe, it*/

process.env.NODE_ENV = 'production';

var app      = require('../../app.js');
var request  = require('supertest');
var expect   = require('chai').expect;

app.get('/500', function (req, res) {
    throw new Error('dummy error');
});

describe('Error cases', function () {
    describe('GET /', function () {
        it('should respond with 200', function (done) {
            request(app).get('/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('GET /404', function () {
        it('should respond with 404', function (done) {
            request(app).get('/404')
                .expect(404)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });

    describe('GET /500', function () {
        it('should respond with 500', function (done) {
            request(app).get('/500')
                .expect(500)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(done);
        });
    });
});
