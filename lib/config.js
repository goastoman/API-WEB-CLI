//container
var environments = {};

//staging default envirement
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Deloitte Consulting LLC, Blockchain Lab.',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:3000/'
    }
};

//production staging
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsAlsoASecret',
    'maxChecks': 10,
    'twilio': {
        'accountSid' : '',
        'authToken': '',
        'fromPhone': ''
    },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Deloitte Consulting LLC, Blockchain Lab.',
        'yearCreated': '2018',
        'baseUrl': 'https://localhost:5000/'
    }
};

//determine which env was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check that the current env is one of the listed env if not default to staging
var environmentsToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//export the module
module.exports = environmentsToExport;