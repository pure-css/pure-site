/*global describe, it*/

process.env.NODE_ENV = 'production';

var liblayouts = require('../../lib/layouts');
var expect     = require('chai').expect;

describe('lib/layouts', function () {
    var layout;

    describe('load()', function () {
        it('returns an array', function (done) {
            liblayouts.load(function (err, data) {
                if (err) throw err;
                expect(data).to.be.an('array');
                expect(data).to.have.length(8);
                layout = data[0];
                done();
            });
        });
    });

    describe('archive()', function () {
        it('does something', function () {
            var stream = require('stream');
            expect(liblayouts.archive(layout))
                .to.be.an.instanceof(stream.Stream);
        });
    });
});
