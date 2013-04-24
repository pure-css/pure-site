//Required for express to work in Manhattan
//Shouldn't not be required!!
process.chdir(__dirname);

var http = require('http'),
    app  = require('./app'),
    port = app.get('port');

http.createServer(app).listen(port, function () {
    console.log(app.get('name') + ' Server listening on ' + port);
});
