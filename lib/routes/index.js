function render(viewName) {
    return function (req, res) {
        res.render(viewName);
    };
}

module.exports = {
    render: render
};
