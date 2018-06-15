/*
frontend logic
*/

//container for frontend app
var app = {};

//config
app.config = {
    'sessionToken': false
};

//AJAX client for the rest API
app.client = {};

//interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback){

    //set the default
    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' ? path : '/';
    method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;

    //for each query string parameter sent add it to the path
    var requestUrl = path + '?';
    var counter = 0;
    for(var queryString in queryStringObject){
        if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if(counter > 1){
                requestUrl += '&';
            };

            //add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        };
    };

    //form the http request as a JSON
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-Type' , 'application/json');

    //for each header sent, add it to the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        };
    };

    //if there is a current session token set add that as a header
    if(app.config.sessionToken){
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    };

    //when the request comes back handle the response
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE){
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            //callback if requested
            if(callback){
                try{
                    var parsedResponce = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponce);
                } catch(e) {
                    callback(statusCode, false);
                };
            };
        };
    };

    //send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
};
