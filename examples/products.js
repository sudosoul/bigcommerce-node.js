var connection = require('./connection');

var settings = {
  path: 'https://store-hn1pzz9o.mybigcommerce.com',
  user: 'surerob',
  pass: 'redacted',
  dataType: 'json'
};

var api = new connection(settings);


//GET Requests:
//** Get first 50 Products and print their names **//
api.get('/products')
  .then(function(res) {
    for (i=0; i<res.body.length; i++) {
      console.log(res.body[i].name);
    }
  }).catch(function(err){
    console.log(err);
  });

//** Power Of Promises, Nested Requests **//
api.get('/products?limit=1')                  //Request single product from BC API.
  .then(function(res) {
    var categories = res.body[0].categories;  //Parse the categories array from the response.
    categories.forEach(function(id) {         //ForEach ID in the categories array, 
      api.get('/categories/' +id)             //Make a new request for that individual category,
        .then(function(res) {
          console.log(res.body);              //And print the API response for that category data. 
        }).catch(function(err) {
          console.log(err);
        })
    });
  }).catch(function(err) {
    console.log(err);
  });


//** Update A Product **//
var update = {inventory_level: 100};
api.put('/products/1999', update)
  .then(function(res){
    console.log(res.body);
  }).catch(function(err) {
    console.log(err);
  });


//** Update Product, Using XML **//
//To send XML, you simply create a normal object. The connection file will convert the object to valid XML!
//Neat!

var update = {
   product: {
    inventory_level: 900
  }
};

api.put('/products/1999', update)
  .then(function(res){
    console.log(res.body);
  }).catch(function(err) {
    console.log(err);
  });
