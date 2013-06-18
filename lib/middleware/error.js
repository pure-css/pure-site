var STATUS_CODES = require('http').STATUS_CODES;

exports.notfound = function (req, res) {
    var status = STATUS_CODES[404];

    res.status(404);
    res.format({
        'html': function () { res.render('error', {status: status}); },
        'text': function () { res.send(status); }
    });
};

exports.server = function (err, req, res, next) {
    var status = STATUS_CODES[500];

    res.status(500);
    res.format({
        'html': function () { res.render('error', {status: status}); },
        'text': function () { res.send(status); }
    });
};
