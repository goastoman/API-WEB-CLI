var server = require('./lib/server');
var workers = require('./lib/workers');

//declare the app
var app = {};

//initialization 
app.init = function(){
    //start the server
    server.init();
    //start the workers
    workers.init();
};

//execute
app.init();

module.exports = app;
