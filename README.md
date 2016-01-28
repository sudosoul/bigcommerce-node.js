# Bigcommerce Legacy API Wrapper for Node.js
Promise based connection file that allows developers to easily work with the Bigcommerce Legacy API in Node.js with support for XML and JSON. 

# Install
The following packages are required for this to work:
  1. promise
  2. request
  3. xml2js

You can install them from the CLI like so:
```
$ sudo npm install request
$ sudo npm install promise
$ sudo npm install xml2js
```
# Setup
To use this program, you should include it in your main app file:
```javascript
var connection = require('./connection');
```

From there, you must initialize the class with the following settings:
```javascript
var settings = {
    path:     "The API PATH -- WITHOUT THE '/api/v2'"
	user:     "The API UserName"
	pass:     "The API Token"
	dataType: "OPTIONAL: XML or JSON. Default is JSON"
}

var api = new connection(settings); //Instantiate class!
```

The connection class also allows you work with multiple stores, so you can instantiate as many instances as you wish, all with their own set of settings:
```javascript
var moms_store = new connection(settings1);
var dads_store = new connection(settings2);
```
# Usage -- JSON
Let's look at a few examples of how to work with this. 
These examples below all assume that the following has been placed into your app:
```javascript
var connection = require('./connection');
var settings = {
  path: 'https://store-123abc.mybigcommerce.com',
  user: 'surerob',
  pass: 'abc123-babyYouAndMe'
};
var store123 = new connection(settings);
```

#### Get Some Products ####
This program is "Promise" based, and it does not use callbacks. If you are not familiar with Promises, I recommend you read into them, as they are extremely powerful and much cleaner to use than callbacks. 
```javascript
store123.get('/products') //Make GET request to /products endpoint
  .then(function(res) {   //Assign the response data to 'res'
    for (i=0; i<res.body.length; i++) { //The actual BC response is saved in 'res.body'
      console.log(res.body[i].name);
    }
  }).catch(function(err) { //You must perform a catch after every call. 
    console.log(err): //This will be triggerred if the API responds back a status code of NOT 200. 
  });
```

    
