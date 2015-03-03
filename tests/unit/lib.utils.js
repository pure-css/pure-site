/*global describe, it*/

process.env.NODE_ENV = 'production';

var libutils = require('../../lib/utils');
var expect   = require('chai').expect;

describe('lib/utils', function () {
    describe('error()', function () {
        it('constructs an error object', function () {
            expect(libutils.error(400))
                .to.be.instanceof(Error)
                .and.to.have.property('status')
                    .that.equals(400);
        });
    });

    describe('extend()', function () {
        it('augments an object', function () {
            expect(libutils.extend({}, {a: 'foo'}, {b: 'bar'}))
                .to.be.an('object')
                .and.to.include.keys('a', 'b');
        });
    });

    describe('passError()', function () {
        it('passes an error asynchronously to a callback', function (done) {
            libutils.passError(function (reason) {
                expect(reason).to.equal('whatever');
                done();
            })('whatever');
        });
    });

    describe('passValue()', function () {
        it('passes a value asynchronously to a callback', function (done) {
            libutils.passValue(function (err, value) {
                expect(err).to.be.null;
                expect(value).to.equal('whatever');
                done();
            })('whatever');
        });
    });
});
