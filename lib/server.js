var http = require ('http');
var https = require('https');
var url = require('url');
var path = require('path');
var fs = require('fs');
var util = require('util');
var debug = util.debuglog('server');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var handlers = require('./handlers');
var helpers = require('./helpers');


//instantiate the server module
var server = {};

//instance the http server
server.httpServer = http.createServer(function(req, res){
    server.unifiedServer(req, res);
});

//instance the https server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    server.unifiedServer(req, res);
});

//all the server all the server logic for both the http and https
server.unifiedServer = function(req, res) {
    //get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    //get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as an object
    var queryStringObject = parsedUrl.query;

    //get http method
    var method = req.method.toLowerCase(); 

    //get hte headers as an objext
    var headers = req.headers;

    //get the payload if any
    var decoder = new StringDecoder('utf-8');

    //placeholder for the string
    var buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        //choose the handler this request should go to. if doesn't found use the notFound handler
        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        //construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        //route the request to the handler specified in the rputer
        chosenHandler (data, function(statusCode, payload){
            // Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            //use the status code called backby the handler or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            //conver the payload to a string
            var payloadString = '';
            if(contentType == 'json'){
              res.setHeader('Content-Type', 'application/json');
              payload = typeof(payload) == 'object'? payload : {};
              payloadString = JSON.stringify(payload);
            };
            if(contentType == 'html'){
              res.setHeader('Content-Type', 'text/html');
              payloadString = typeof(payload) == 'string'? payload : '';
            };
            if(contentType == 'favicon'){
              res.setHeader('Content-Type', 'image/x-icon');
              payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'plain'){
              res.setHeader('Content-Type', 'text/plain');
              payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'css'){
              res.setHeader('Content-Type', 'text/css');
              payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'png'){
              res.setHeader('Content-Type', 'image/png');
              payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'jpg'){
              res.setHeader('Content-Type', 'image/jpeg');
              payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            //return the response
            res.setHeader('Content-Type', 'application/json'); //return with JSON way
            res.writeHead(statusCode);
            res.end(payloadString);
            //if the responce is 200 print green otherwise print red
            if(statusCode == 200){
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            };
        });
    }); 
};

//define a router
server.router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.accountEdit,
    'account/deleted' : handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'checks/all' : handlers.checksList,
    'checks/create' : handlers.checksCreate,
    'checks/edit' : handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'api/checks' : handlers.checks,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
};

//init script
server.init = function(){
    //start the http server 
    server.httpServer.listen(config.httpPort, function(){
    console.log('\x1b[36m%s\x1b[0m', 'The server is listening on port ' + config.httpPort);
    });

    //start the https server 
    server.httpsServer.listen(config.httpsPort, function(){
    console.log('\x1b[36m%s\x1b[0m', 'The server is listening on port ' + config.httpsPort);
});
}

module.exports = server;