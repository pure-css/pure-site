function render(viewName, layoutPath) {
    if (!layoutPath) {
        return function (req, res) {
            res.render(viewName);
        };
    }
    else {
        return function (req, res) {
            res.render(viewName, { layout: layoutPath });
        };
    }

}

module.exports = {
    render: render
};
