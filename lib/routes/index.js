function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }

        res.render(viewName);
    };
}

module.exports = {
    render: render
};
