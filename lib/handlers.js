var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');

//define all the handlers
var handlers = {};


/*
HTML handlers
*/

//index handlers
handlers.index = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Here should bbe some title',
            'head.description': 'Here should be some description',
            'body.class': 'index'
        };

        //read in a template as a string
        helpers.getTemplate('index', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//create account
handlers.accountCreate = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Create an account',
            'head.description': 'Sign Up for few seconds',
            'body.class': 'accountCreate'
        };

        //read in a template as a string
        helpers.getTemplate('accountCreate', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//create new session
handlers.sessionCreate = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Login to your account',
            'head.description': 'Please enter your phone number and password',
            'body.class': 'sessionCreate'
        };

        //read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//session has been deleted
handlers.sessionDeleted = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Logged out',
            'head.description': 'You have been logged out from your account',
            'body.class': 'sessionDeleted'
        };

        //read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//edit an account
handlers.accountEdit = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Account settings',
            'body.class': 'accountEdit'
        };

        //read in a template as a string
        helpers.getTemplate('accountEdit', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//account has been deleted page
handlers.accountDeleted = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){

        //prepare data for interpolation
        var templateData = {
            'head.title': 'Account deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted'
        };

        //read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, function(err, str){
            if(!err && str){
                //add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str){
                    if(!err && str){
                        //return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    };
                });
            } else {
                callback(500, undefined, 'html');
            };
        });
    } else {
        callback(405, undefined, 'html');
    };
};

//favicon
handlers.favicon = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){
        //read in the favicons data
        helpers.getStaticAsset('favicon.ico', function(err, data){
            if(!err && data){
                //callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            };
        });
    } else {
        callback(405);
    };
};

//public assets
handlers.public = function(data, callback){
    //reject any request that isn't a GET
    if(data.method == 'get'){
        //get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if(trimmedAssetName.length > 0){
            //read the assets data
            helpers.getStaticAsset(trimmedAssetName, function(err, data){
                if(!err && data){
                    //determine the content type
                    var contentType = 'plain';
                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    };
                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    };
                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    };
                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    };
                    //callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                };
            });
        } else {
            callback(404);
        }
    } else {
        callback(405);
    };
};

/*
JSON API handlers
*/

//ping handler
handlers.ping = function(data, callback){
    callback(200);
};

//not found handlers
handlers.notFound = function(data, callback){
    callback(404);
};

/*
users
*/
handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    };
};

//container for the user submethods
handlers._users = {};

//required data, firstName, secondName, phone, password, tosAgreement
//optional data: none
handlers._users.post = function(data, callback){
    //all required fields are filled 
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  

    if(firstName && lastName && phone && password && tosAgreement){
        //user doesn't exist
        _data.read('users', phone, function(err, data){
            if(err){    
                //hash the paasword
                var hashedPassword = helpers.hash(password);

                //create the user object
                if(hashedPassword){
                    var userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };
    
                    //store the user 
                    _data.create('users', phone, userObject, function(err){
                        if(!err){
                            callback(200);
                        } else {
                            callback(500, {'Error': 'Could not create the new user'});
                        };
                    });  
                } else {
                    callback(500, {'Error': 'Could not hash the new users password'});
                }; 
            } else {
                //user already exist
                callback(400, {'Error': 'A user with this phone number already exists'});
            };
        });
    } else {
        callback(400, {'Error': 'Missing requirement field'})
    };
};

//required data: phone
//optional data: none
handlers._users.get = function(data, callback){
    //chaeck that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        //get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        //verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
            if(tokenIsValid){
                //lookup the user
                _data.read('users', phone, function(err, data){
                    if(!err && data){
                        //remove the hashed password from the user object before returning it to requestor
                        delete data.hashedPassword;
                        callback(200, data);
                    } else { 
                        callback(404);
                    };
                });
            } else {
                callback(403, {'Error': 'Missing required token in header or token is invalid'});
            };
        });
    } else {
        callback(400, {'Error': 'Missing required field'})
    };
};

//required data: phone
//optional data: firstName, lastName, password(at least one must be specified)
handlers._users.put = function(data, callback){
    //check for the required thing
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //check for th eoptional things
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    //error if the phone is valid
    if(phone){
        //error if nothing is sent to update
        if(firstName || lastName || password){

            //get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

            //verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
                if(tokenIsValid){
                    //lookup the user
                    _data.read('users', phone, function(err, userData){
                        if(!err && userData){
                            //update the field neccessary
                            if(firstName){
                                userData.firstName = firstName;
                            };
                            if(lastName){
                                userData.lastName = lastName;
                            };
                            if(password){
                                userData.hashedPassword = helpers.hash(password);
                            };

                            //store the new updates
                            _data.update('users', phone, userData, function(err){
                                    if(!err){
                                    callback(200);
                                    } else {
                                        callback(500, {'Error': 'Could not update the user'});
                                    };
                                });
                        } else {
                            callback(400, {'Error': 'The specified user does not exist'});
                        };
                    });
                } else {
                    callback(403, {'Error': 'Missing required token in header or token is invalid'});
                };
            });
        } else {
            callback(400, {'Error': 'Missing fields to update'})
        }
    } else {
        callback(400, {'Error': 'Missing required field'})
    }
};  

//required data: phone
//optional data: firstName, lastName, password(at least one must be specified)
handlers._users.delete = function(data, callback){
     //chaeck that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        //get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        //verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
            if(tokenIsValid){
                //lookup the user
                _data.read('users', phone, function(err, userData){
                    if(!err && userData){
                        _data.delete('users', phone, function(err){
                            if(!err){
                                //delete each of the checks associated with this user
                                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []; 
                                var checksToDelete = userChecks.length;
                                if(checksToDelete > 0){
                                    var checksDeleted = 0;
                                    var deletionErrors = false;
                                    //loop through the checks
                                    userChecks.forEach(function(checkId){
                                        _data.delete('checks', checkId, function(err){
                                            if(err){
                                                deletionErrors = true;
                                            };
                                            checksDeleted++;
                                            if(checksDeleted == checksToDelete){
                                                if(!deletionErrors){
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error': 'Errors encounted while attempting to delete all of the users checks. All checks may not have been deleted successfully'})
                                                };
                                            };
                                        });
                                    });
                                } else {
                                    callback(200);
                                };
                            } else {
                                callback(500, {'Error': 'Could not delete specified user'});
                            };
                        });
                    } else { 
                        callback(400, {'Error': 'Could not find the specified user'});
                    };
                });
            } else {
                callback(403, {'Error': 'Missing required token in header or token is invalid'});
            };
        });     
    } else {
        callback(400, {'Error': 'Missing required field'})
    };
};

/*
tokens
*/
handlers.tokens = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    };
};

//container for all the tokens methods
handlers._tokens = {};

//required data: phone, password
//optional data: none       
handlers._tokens.post = function(data, callback){
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(phone && password){
        //lookup the user who maches that phone number
        _data.read('users', phone, function(err, userData){
            if(!err && userData){
                //hash the sent password and compare it to the password stored in the user object
                var hashedPassword = helpers.hash(password);
                if(hashedPassword == userData.hashedPassword){
                    //if valid create a new token with a random name and set expiretion fdate 1 hour in a future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };

                    //store the token
                    _data.create('tokens', tokenId, tokenObject, function(err){
                        if(!err){
                            callback(200, tokenObject);
                        } else {
                            callbac(500, {'Error': 'Could not create the new token'});
                        };
                    });
                } else {
                    callback(400, {'Error': 'Password did not mutch the specified users stored password'})
                };
            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            };
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    };
};

//required data: id
//optional data: none  
handlers._tokens.get = function(data, callback){
    //check that the id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //lookup the token
        _data.read('tokens', id, function(err, tokenData){
            if(!err && tokenData){
                callback(200, tokenData);
            } else { 
                callback(404);
            };
        });
    } else {
        callback(400, {'Error': 'Missing required field or dield is invalid'})
    };
};

//required data: id, extend
//optional data: none  
handlers._tokens.put = function(data, callback){
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
        //lookup the token
        _data.read('tokens', id, function(err, tokenData){
            if(!err && tokenData){
                //check to the make sure that the token isn't alreary expired
                if(tokenData.expires > Date.now()){
                    //set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    //store the new updates
                    _data.update('tokens', id, tokenData, function(err){
                        if(!err){
                            callback(200);
                        } else {
                            callback(500, {'Error': 'Could not update the tokens expiration'})
                        };
                    });
                } else {
                    callback(400, {'Error': 'The token has already expired and cannot be extended'})
                };
            } else {
                callback(400, {'Error': 'Specified token does not exist'});
            };
        });
    } else {
        callback(400, {'Error': 'Missing required field(s) or field(s) are invalid'});
    };
};

//required data: id
//optional data: none   
handlers._tokens.delete = function(data, callback){
     //chaeck that the id number is valid
     var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
     if(id){
         //lookup the token
         _data.read('tokens', id, function(err, tokenData){
             if(!err && tokenData){
                 //
                 _data.delete('tokens', id, function(err){
                     if(!err){
                         callback(200);
                     } else {
                         callback(500, {'Error': 'Could not delete specified token'});
                     };
                 });
             } else { 
                 callback(400, {'Error': 'Could not find the specified token'});
             };
         });
     } else {
         callback(400, {'Error': 'Missing required field'})
     };
};

//verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback){
    //lookup the token
    _data.read('tokens', id, function(err, tokenData){
        if(!err && tokenData){
            //check that the token is for given user and not expired
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true);
            } else {
                callback(false);
            };
        } else {
            callback(false);
        };
    });
};

/*
checks
*/
handlers.checks = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    };
};

//container for the checks
handlers._checks = {};

//required data: protocol, url, method, successCodes, timeoutSeconds
//optional data: none
handlers._checks.post = function(data, callback){
    //valideta all this input
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds){
        //get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        //lookup the users from the token
        _data.read('tokens', token, function(err, tokenData){
            if(!err && tokenData){
                var userPhone = tokenData.phone;

                //lookup the used data
                _data.read('users', userPhone, function(err, userData){
                    if(!err && userData){
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];      
                        //verify that the user has less than the number of max-checks-per-user(5)
                        if(userChecks.length < config.maxChecks){
                            //create a random id for the check
                            var checkId = helpers.createRandomString(20);
                            //create the check object and include the users phone
                            var checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            };

                            //save the object
                            _data.create('checks', checkId, checkObject, function(err){
                                if(!err){
                                    //add the checkId to the users object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);
                                    //save the new user data
                                    _data.update('users', userPhone, userData, function(err){
                                        if(!err){
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {'Error' : 'Could not update the user with the new check'});
                                        };
                                    });
                                } else {
                                    callback(500, {'Error': ' Could not create the new check'});
                                };
                            });
                        } else {
                            callback(400, {'Error' : 'The user already has the max number of checks (' + config.maxChecks + ').'});
                        };
                    } else {
                        callback(403);
                    };
                });
            } else {
                callback(403);
            };
        });
    } else {
        callback(400, {'Error': 'Missing required inputs or inputs are invalid'});
    };
};

//required data: id
//optional data: none
handlers._checks.get = function(data, callback){
    //chaeck that the phone number is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //look up the check
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                //get the token from the headers
                var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                //verify that the given token is valid for belong to the user who created the check
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                    if(tokenIsValid){
                        //return the check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    };
                });
            } else {
                callback(404);
            };
        });       
    } else {
        callback(400, {'Error': 'Missing required field'})
    };
};

//required data: id
//optional data: protocol, url, method, sucessCode, timeoutSeconds - one must be sent
handlers._checks.put = function(data, callback){
    //check for the required thing
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    //check for th eoptional things
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
 
    //check that the id is valid
    if(id){
        if(protocol || url || method || successCodes || timeoutSeconds){
            //lookuop the check
            _data.read('checks', id, function(err, checkData){
                if(!err && checkData){
                    //get the token from the headers
                    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    //verify that the given token is valid for belong to the user who created the check
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                        if(tokenIsValid){
                            //update the check where neccessary
                            if(protocol){
                                checkData.protocol = protocol;
                            };
                            if(url){
                                checkData.url = url;
                            };
                            if(method){
                                checkData.method = method;
                            };
                            if(successCodes){
                                checkData.successCodes = successCodes;
                            };
                            if(timeoutSeconds){
                                checkData.timeoutSeconds = timeoutSeconds;
                            };

                            //store the updates
                            _data.update('checks', id, checkData, function(err){
                                if(!err){
                                    callback(200);
                                } else {
                                    callback(500, {'Error': 'Could not update the check'});
                                }
                            })
                        } else {
                            callback(403);
                        };
                    });
                } else {
                    callback(400, {'Error': 'Check ID didn not exist'});
                };
            });
        } else {
            callback(400, {'Error': 'Missing fields to update'});
        };
    } else {
        callback(400, {'Error': 'Missing required field'});
    };
};

//required data: id
//optional data: none
handlers._checks.delete = function(data, callback){
    //check that the phone number is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    
    if(id){
        //lookup the check
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                //get the token from the headers
                var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

                //verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                    if(tokenIsValid){
                        //delete the ckeckData
                        _data.delete('checks', id, function(err){
                           if(!err){
                                //lookup the user
                                _data.read('users', checkData.userPhone, function(err, userData){
                                    if(!err && userData){
                                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []; 
                                        //remove the deleted checks
                                        var checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1){
                                            userChecks.splice(checkPosition, 1);
                                            //resave the users data
                                            userData.checks = userChecks;
                                            _data.update('users', checkData.userPhone, userData, function(err){
                                                if(!err){
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error': 'Could not update the user'});
                                                };
                                            });
                                        } else {
                                            callback(500, {'Error': 'Could not find the check on the users object so could not remove it'})
                                        };
                                    } else { 
                                        callback(500, {'Error': 'Could not find the user who created the check, so could not remove the check from the list of checks on their user object'});
                                    };
                                });
                           } else {
                                callback(500, {'Error': 'Could not delete the check data'})
                           };
                        });
                    } else {
                        callback(403);
                    };
                });
            } else {
                callback(400, {'Error': 'The check ID specified could not be found'});
            };
        });  
    } else {
        callback(400, {'Error': 'Missing valid id'})
    }; 
};

module.exports = handlers;