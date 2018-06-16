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

//bind the logout button
app.bindLogoutButton = function(){
    document.getElementById("logoutButton").addEventListener("click", function(e){
        //stop it from redirecting anywhere
        e.preventDefault();
        //log out the user
        app.logUserOut();
    });
};

//log the user out then redirect them
app.logUserOut = function(redirectUser){
    //set redirectUser to default to true
    redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;
    //get the current token id
    var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    //send the current token to the tokens endpoint to delete it
    var queryStringObject = {
        'id': tokenId
    };
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function(statusCode, responsePayload){
        //set the app.config token as false
        app.setSessionToken(false);
        //send the user to the logged out page
        if(redirectUser){
            window.location = '/session/deleted';
        };
    });
};

//bind the form
app.bindForms = function(){
    if(document.querySelector("form")){
        var allForms = document.querySelectorAll("form");
        for(var i = 0; i < allForms.length; i++){
            allForms[i].addEventListener("submit", function(e){

                //stop it from submiting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = this.method.toUpperCase();

                //hide the error message if its currently shown due to a previous error
                document.querySelector("#" + formId + " .formError").style.display = 'hidden';

                //hide the success message (if it's currently shown due to a previous error)
                if(document.querySelector("#"+formId+" .formSuccess")){
                    document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
                }

                //turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for(var i = 0; i < elements.length; i++){
                    if(elements[i].type !== 'submit'){
                        var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                        if(elements[i].name == '_method'){
                            method = valueOfElement;
                        } else {
                            payload[elements[i].name] = valueOfElement;
                        };
                    };
                };

                //if the method is DELETE the payload should be a queryStringObject instead
                var queryStringObject = method == 'DELETE' ? payload : {};

                //call the API
                app.client.request(undefined, path, method, queryStringObject, payload, function(statusCode, responsePayload){
                    //display an error on the form if needed
                    if(statusCode !== 200){

                        if(statusCode !== 403){
                            //log the user out
                            app.logUserOut();
                        } else {
                            //try to get the error from the api or set a default error message
                            var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'Sorry, an error has occured. Please try again';

                            //set the formError field with the error text
                            document.querySelector("#" + formId + " .formError").innerHTML = error;

                            //show (unhide) the form error field on the form
                            document.querySelector("#" + formId + " .formError").style.display = 'block';
                        };
                    } else {
                        //if successful, send to form response processor
                        app.formResponseProcessor(formId,payload,responsePayload);
                    };
                });
            });
        };
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
    //if forms saved successfully and they have success messages, show them
    var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
    if(formsWithSuccessMessages.indexOf(formId) > -1){
        document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
    };
    //if the user just deleted their account redirect them to the account-delete page
    if(formId == 'accountEdit3'){
        app.logUserOut(false);
        window.location = '/account/deleted';
    }
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

//load data on the page
app.loadDataOnPage = function(){
    //get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;
  
    //logic for account settings page
    if(primaryClass == 'accountEdit'){
        app.loadAccountEditPage();
    };
};
  
//load the account edit page specifically
app.loadAccountEditPage = function(){
        //get the phone number from the current token, or log the user out if none is there
        var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
        if(phone){
            //fetch the user data
            var queryStringObject = {
                'phone' : phone
            };

            app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload){
                if(statusCode == 200){
                    //put the data into the forms as values where needed
                    document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
                    document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
                    document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;
            
                    //put the hidden phone field into both forms
                    var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
                    for(var i = 0; i < hiddenPhoneInputs.length; i++){
                        hiddenPhoneInputs[i].value = responsePayload.phone;
                    };
                } else {
                    //if the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                    app.logUserOut();
                };
            });
        } else {
            app.logUserOut();
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

    // Bind logout logout button
    app.bindLogoutButton();

    //get the token from localstorage
    app.getSessionToken();

    //renew token
    app.tokenRenewalLoop();

    // Load data on page
    app.loadDataOnPage();
};
  
//call the init processes after the window loads
window.onload = function(){
    app.init();
};
  