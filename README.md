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
# IMPORTANT NOTES - READ FIRST:
Since most users might skim through the usage examples, please read this part first so you can understand how the connection file works under the hood. 

1. All API requests return a promise. 
2. This promise returns an object, containing two parts:
  1. `res`  - This is the complete response data. It contains network debug information, headers, and other useful info. 
  2. `body` - This contains the full Bigcommerce responde body. For the most part, you will only be working with this. 
3. If using JSON, the connection file parses the JSON response into an object for you. 
4. If using JSON, the connection file parses the request object into a JSON string for you.
4. If using XML, the connection file returns the raw XML string back, and makes no assumption on how you will handle it, but definitly makes some assumptions on you as a programmer still using XML. 
5. If using XML, the connection file will convert request objects into XML for you, because it loves you and wants to make your life easier. 
5. Promises are ONLY FULFILLED if the API responds back with a 200 status code. 
6. Promises are REJECTED with anything other than a 200 status code. For this reason, all API calls should have a `catch` statement. 

# Usage 
Let's look at a few examples of how to work with this. 
These examples below all assume that the following has been placed into your app:
```javascript
var connection = require('./connection');
var settings = {
  path: 'https://store-123abc.mybigcommerce.com',
  user: 'surerob',
  pass: 'abc123-babyYouAndMe',
  dataType: 'json' || 'xml'
};
var store123 = new connection(settings);
```
#### Get Some Products ####
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

#### The Power of Promises - Nested Async Requests ####
```javascript
api.get('/products?limit=1') //Get a single product from the API
  .then(function(res) {
    var categories = res.body[0].categories; 
    categories.forEach(function(id) {  //Parse through each ID in the returned category ID. 
      api.get('/categories/' +id)     //Make new async request per category ID. 
        .then(function(res) {
          console.log(res.body); //Print the individual category API data. 
        }).catch(function(err) {
          console.log(err); //Print error, if any. 
        });
    });
  }).catch(function(err) {
    console.log(err):
  });
```
#### UPDATE A PRODUCT - JSON ####
```javascript
var update = {inventory_level: 100};  //Create the update object
api.put('/products/id', update)       //Updates are a PUT request
  .then(function(res){
    console.log(res.body);            //Print the response body to confirm update
  }).catch(function(err) {
    console.log(err);
  });
```
#### UPDATE A PRODUCT - XML ####
```javascript
// We will convert this into an XML string for you:
var update = {
  product: {
    inventory_level: 900
  }
};

api.put('/products/id', update)
  .then(function(res){
    console.log(res.body);
  }).catch(function(err) {
    console.log(err);
  });
```
#### CREATE A PRODUCT - JSON ####
(coming soon)

#### Create a product - XML ####
(coming soon)
