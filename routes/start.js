'use strict';
var utils = require('../lib/utils'),
    mediaquery = require('css-mediaquery');
/*
    Routes for /start/ could be any of the following:
    * `/start/`
    * `/start/?cols=6&med=48em&lrg=60em`
    * `/start/?cols=6&sm=screen and (min-device-width: 480px)`
*/
module.exports = function (req, res, next) {

    var query = normalizeQuery(utils.extend({}, req.query));

    //if we have columns, then normalize them into an array.
    if (query.cols) {
        query.cols = normalizeCols(query.cols);
    }

    res.expose(query, 'app.start.query');
    res.render('start');
};

// Takes in a string input for number of columns and converts it into an array.
function normalizeCols (cols) {
    //cols will always be a string, so we can convert the string to an array of 1 or more integers.
    return cols.split(",").map(function (x) {
        return parseInt(x);
    });
}


/*
Checks to see if media queries are valid, by following these steps:
    Does the query param value parse as a media query?
        If yes? return true.
        If not, then assume it's a width value, so wrap it with "screen and (min-width: " + value + ")"
    Does it now parse as a media query?
        If yes, return true.
        If not, return false.
*/
function isValidMQ (mqStr) {
    //This regex splits up a string that contains a sequences of letters or numbers ("48em", "480px") into an array of grouped letters and numbers (["48", "em"], ["480", "px"])
    var RE_SEPARATE_NUM_LETTERS = /[a-zA-Z]+|[0-9]+/g,
        captures;
    try {
        mediaquery.parse(mqStr);
    } catch (e) {
        //invalid media query, so let's check that there's some floated value in here, and if there is, we will prepend/append some strings
        captures = mqStr.match(RE_SEPARATE_NUM_LETTERS);
        if (captures.length === 2 && parseFloat(captures[0])) {
            mqStr = 'screen and (min-width: ' + mqStr + ')';
        }

        else {
            return false;
        }
        try {
            mediaquery.parse(mqStr);
        } catch (e) {
            //still not a valid media query
            return false;
        }
    }

    return mqStr;
}

/*
    This function takes in a `req.query` object, validates all the media queries within it, removes the incorrect media queries, and then returns a modified `req.query` object, with only valid values within in.
*/
function normalizeQuery (obj) {
    var query = obj,
        mq = utils.extend({}, query);
    delete mq.cols;
    delete mq.fonts;
    delete mq.prefix;

    Object.keys(mq).forEach(function (key) {
        var validMqStr = isValidMQ(mq[key]);
        if (!validMqStr) {
            //remove the media query from `query` if it's not valid.
            delete query[key];
        }
        else {
            //update the media query in `query` with the legitimate one.
            query[key] = validMqStr;
        }
    });

    return query;
}
