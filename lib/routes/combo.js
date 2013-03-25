var combo  = require('combohandler'),
    config = require('../../config');

function send (req, res) {
    res.send(res.body);
}

module.exports = [combo.combine({rootPath: config.dirs.pub}), send];
