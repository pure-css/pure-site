module.exports = function (req, res, next) {
    res.render('grids', {
            title   : "YUI Responsive Grids",
            subTitle: "A fully-customizable responsive grid"
        }
    );
};
