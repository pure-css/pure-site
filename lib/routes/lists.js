module.exports = function (req, res, next) {
    res.render('lists', {
            title: "YUI List CSS",
            subTitle: "Simple CSS for HTML Lists"
        }
    );
};
