var http = require('http'),
    app  = require('./app'),
    port = app.get('port');

http.createServer(app).listen(port, function () {
    console.log(app.get('name') + ' Server listening on ' + port);
});
