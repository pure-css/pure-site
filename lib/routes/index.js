function render(viewName, opts) {
    if (!opts) {
        return function (req, res) {
            res.render(viewName);
        };
    }
    else {
        return function (req, res) {
            res.render(viewName, opts);
        };
    }

}

module.exports = {
    render: render
};
