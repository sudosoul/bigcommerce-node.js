# Bigcommerce Legacy API Wrapper for Node.js
Promise based connection file that allows developers to easily work with the Bigcommerce Legacy API in Node.js with support for XML and JSON. 

# Install
The following packages are required for this to work:
  1. request-promise-native
  2. xml2js

You can install them from the CLI like so:
```
# npm install request-promise-native
# npm install xml2js
```
# Setup
To use this program, you should include it in your main app file:
```javascript
const connection = require('./connection');
```

From there, you must initialize the class with the following settings:
```javascript
const settings = {
    path:     "The API PATH -- WITHOUT THE '/api/v2'"
    user:     "The API UserName"
    pass:     "The API Token" 
    dataType: "OPTIONAL: XML or JSON. Default is JSON"
}

const api = new connection(settings); //Instantiate class!
```

The connection class also allows you work with multiple stores, so you can instantiate as many instances as you wish, all with their own set of settings:
```javascript
const store1 = new connection(settings1);
const store2 = new connection(settings2);
```
# IMPORTANT NOTES - READ FIRST:
Since most users might skim through the usage examples, please read this part first so you can understand how the connection file works under the hood. 

1. All API requests return a promise. 
2. If using JSON, the connection file parses & returns the JSON response into an object for you. 
3. If using JSON, the connection file parses the request object into a JSON string for you.
4. If using XML,  the connection file returns the raw XML string back.
5. If using XML,  the connection file will convert request objects into XML for you.
6. Promises are ONLY FULFILLED if the API responds back with a 200 status code. 
7. Promises are REJECTED with anything other than a 200 status code. For this reason, all API calls should include a `catch` block. 

# Usage 
Let's look at a few examples of how to work with this. 
These examples below all assume that the following has been placed into your app:
```javascript
const connection = require('./connection');
const settings = {
  path: 'https://store-123abc.mybigcommerce.com',
  user: 'username',
  pass: 'password',
  dataType: 'json' || 'xml'
};
const api = new connection(settings);

```
#### Get Some Products ####
```javascript
api.get('/products')
  .then(body => {
    //do something with body here
  }).catch(err => {
    // do something with error here
  });
```

#### The Power of Promises - Nested Async Requests ####
```javascript
api.get('/products?limit=1') //Get a single product from the API
  .then(body => {
    const categories = body[0].categories; 
    categories.forEach(function(id) {        // Parse through each ID in the returned category ID. 
      api.get('/categories/' +id)            // Make new async request per category ID. 
        .then(body => console.log(res.body)) // Print the individual category API data. 
        .catch(err => console.log(err));     // Print error from 2nd GET, if any. 
  }).catch(err => console.log(err));         // Print error from 1st GET, if any. 
```

#### UPDATE A PRODUCT - JSON ####
```javascript
const update = {inventory_level: 100};  // Create the update object
api.put('/products/id', update)         // Updates are a PUT request
  .then(body => console.log(res.body))  // Print Body if PUT successful.
  .catch(err => console.log(err));      // Else print the error.
```

#### UPDATE A PRODUCT - XML ####
```javascript
// We will convert this into an XML string for you:
const update = {
  product: {
    inventory_level: 900
  }
};

api.put('/products/id', update)        //Updates are a PUT request
  .then(body => console.log(res.body)) // Print Body if PUT successful.
  .catch(err => console.log(err));     // Else print the error.
```
