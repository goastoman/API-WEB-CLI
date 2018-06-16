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
    for(var queryKey in queryStringObject){
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
    xhr.setRequestHeader('Content-type' , 'application/json');

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

//bind the form
app.bindForms = function(){
    if(document.querySelector("form")){
        document.querySelector("form").addEventListener("submit", function(e){

            //stop it from submiting
            e.proventDefault();
            var formId = this.id;
            var path = this.action;
            var method = this.method.toUpperCase();

            //hide the error message if its currently shown due to a previous error
            document.querySelector("#" + formId + " .formError").style.display = 'hidden';

            //turn the inputs into a payload
            var payload = {};
            var elements = this.elements;
            for(var i = 0; i < elements.length; i++){
                if(elements[i].type !== 'submit'){
                    var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                    payload[elements[i].name] = valueOfElement;
                };
            };

            //call the API
            app.client.request(undefined, path, method, undefined, payload, function(statusCode, responsePayload){
                //display an error on the form if needed
                if(statusCode !== 200){
                    //try to get the error from the api or set a default error message
                    var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'Sorry, an error has occured. Please try again';

                    //set the formError field with the error text
                    document.querySelector("#" + formId + " .formError").innerHTML = error;

                    //show (unhide) the form error field on the form
                    document.querySelector("#" + formId + " .formError").style.display = 'block';

                } else {
                    //if successful, send to form response processor
                    app.formResponseProcessor(formId,payload,responsePayload);
                };
            });
        });
    };
};

//form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    var functionToCall = false;
    //if account creation was successful, try to immediately log the user in
    if(formId == 'accountCreate'){
        //take the phone number and password and use it to log the user in
        var newPayload = {
            'phone': requestPayload.phone,
            'password': requestPayload.password
        };

        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function(newStatusCode, newResponsePayload){
            //display an error on the form if needed
            if(newStatusCode !== 200){
                //set the formError field with the errir text
                document.querySelector('#' + formId + ' .formError').innerHTML = 'Sorry, an error has occured. Please try again';

                //show (unhide) the form error field on the form
                document.querySelector('#' + formId + ' .formError').style.display = 'block';
            } else {
                //if successful, set the token and redirect the user
                app.setSessionToken(newResponsePayload);
                window.location = '/checks/all';
            };
        });
    };
    //if login was successful set the token and redirect the user
    if(formId == 'sessionCreate'){
        app.setSessionToken(responsePayload);
        window.location = '/checks/all';
    };
};
  
//get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
    var tokenString = localStorage.getItem('token');
    if(typeof(tokenString) == 'string'){
        try{
            var token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if(typeof(token) == 'object'){
                app.setLoggedInClass(true);
            } else {
                app.setLoggedInClass(false);
            };
        } catch(e){
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        };
    };
};
  
//set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
    var target = document.querySelector("body");
    if(add){
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    };
};
  
//set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token',tokenString);
    if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    };
};
  
//renew the token
app.renewToken = function(callback){
    var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if(currentToken){
        //update the token with a new expiration
        var payload = {
            'id' : currentToken.id,
            'extend' : true,
        };
        app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
            //display an error on the form if needed
            if(statusCode == 200){
                //get the new token details
                var queryStringObject = {'id' : currentToken.id};
                app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
                    //display an error on the form if needed
                    if(statusCode == 200){
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    };
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            };
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    };
};
  
//loop to renew token often
app.tokenRenewalLoop = function(){
    setInterval(function(){
        app.renewToken(function(err){
            if(!err){
                console.log("Token renewed successfully @ "+Date.now());
            };
        });
    }, 1000 * 60);
};
  
//init (bootstrapping)
app.init = function(){

//bind all form submissions
app.bindForms();

//get the token from localstorage
app.getSessionToken();

//renew token
app.tokenRenewalLoop();

};
  
//call the init processes after the window loads
window.onload = function(){
    app.init();
};
  