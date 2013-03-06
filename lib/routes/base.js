module.exports = function (req, res, next) {
    res.render('base', {
            title   : "Normalize.css",
            subTitle: "A modern, HTML5-ready alternative to CSS resets"
        }
    );
};
