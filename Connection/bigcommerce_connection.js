/**
 * bigcommerce_connection.js
 * -------------------------
 * Defines Bigcommerce Connection Level Functions
 * (ie CRUD operations)
 *
 * @author Rob Mullins 
 */


var common = require('../shared/common.js');

module.exports = {

	/** 
	 * Performs a HTTP GET to a given Bigcommerce endpoint.
	 * NOTE: The base Bigcommerce API host has been already set, and
	 *			 so only the endpoint should be passed WITH the leading '/'.
	 * @param endpoint|string 		- The Bigcommerce endpoint to access.
	 * @param	callback|mixed		  - The callback function to return the response body to.
	 */
	get: function(endpoint, callback) {
		var options = this.formatRequest('GET', endpoint);
		common.https.request(options, function(response) {
			var body = ''; //init empty string to hold response
  		
  		//Save incoming response body as it is received:
  		response.on('data', function (chunk) {
    		body += chunk;
    	});

  		//When response body has been fully received:
    	response.on('end', function () {  
    		var ret = {};
    		ret.statusCode = response.statusCode;
    		ret.headers = response.headers;
    		ret.body	  = body;  		
    		callback(ret); //Send response body to callback
  		});
  	}).end();
	},

	/** 
	 * Performs a HTTP POST to a given Bigcommerce endpoint.
	 * NOTE: The base Bigcommerce API host has been already set, and
	 *			 so only the endpoint should be passed WITH the leading '/'.
	 * @param endpoint|string 		- The Bigcommerce endpoint to access.
	 * @param data|string 				- The JSON data to send.
	 * @param	callback|mixed		  - The callback function to return the response body to.
	 */
	post: function(endpoint, data, callback) {
		var options = this.formatRequest('POST', endpoint);
		var request = common.https.request(options, function(response) {
			var body = ''; //init empty string to hold response
  		
  		//Save incoming response body as it is received:
  		response.on('data', function (chunk) {
    		body += chunk;
    	});

  		//When response body has been fully received:
    	response.on('end', function () {
    		var ret = {};
    		ret.statusCode = response.statusCode;
    		ret.headers = response.headers;
    		ret.body	  = body;  		
    		callback(ret); //Send response body to callback
  		});
  	});

  	//Write data to request:
  	request.write(data);
  	request.end();
	},

	/**
	 * Performs a HTTP PUT to a given Bigcommerce endpoint.
	 * NOTE: The base Bigcommerce API host has been already set, and
	 *			 so only the endpoint should be passed WITH the leading '/'.
	 * @param endpoint|string 		- The Bigcommerce endpoint to access.
	 * @param data|string 				- The JSON data to send.
	 * @param	callback|mixed		  - The callback function to return the response body to.
	 */
	put: function(endpoint, data, callback) {
		var options = this.formatRequest('PUT', endpoint);
		var request = common.https.request(options, function(response) {
			var body = ''; //init empty string to hold response
  		
  		//Save incoming response body as it is received:
  		response.on('data', function (chunk) {
    		body += chunk;
    	});

  		//When response body has been fully received:
    	response.on('end', function () {
    		var ret = {};
    		ret.statusCode = response.statusCode;
    		ret.headers = response.headers;
    		ret.body	  = body;  		
    		callback(ret); //Send response body to callback
  		});
  	});

  	//Write data to request:
  	request.write(data);
  	request.end();
	},

	/**
	 * Performs a HTTP DELETE to a given Bigcommerce endpoint.
	 * NOTE: The base Bigcommerce API host has been already set, and
	 *			 so only the endpoint should be passed WITH the leading '/'.
	 * @param endpoint|string 		- The Bigcommerce endpoint to access.
	 * @param	callback|mixed		  - The callback function to return the response body to.
	 */
	delete: function(endpoint, callback) {
		var options = this.formatRequest('DELETE', endpoint);
		common.https.request(options, function(response) {
			var body = ''; //init empty string to hold response
  		
  		//Save incoming response body as it is received:
  		response.on('data', function (chunk) {
    		body += chunk;
    	});

  		//When response body has been fully received:
    	response.on('end', function () {
    		var ret = {};
    		ret.statusCode = response.statusCode;
    		ret.headers = response.headers;
    		ret.body	  = body;  		
    		callback(ret); //Send response body to callback
  		});
  	}).end();
	},

	/**
	 * Formats the options for a given HTTP request.
	 * NOTE: The base Bigcommerce API host has been already set, and
	 *			 so only the endpoint should be passed WITH the leading '/'.
	 * @param method|string 	  - GET || POST || PUT || DELETE
	 * @param endpoint|string - The Bigcommerce API endpoint to access
	 */ 
	formatRequest: function(method, endpoint) {
		//Get the URL formatted Basic Auth Credentials:
		var auth = this.getBasicAuth();
		
		//Define request options below:
		var options = {
  		host: common.config.bc_host,
		  path: common.config.bc_path +endpoint,
			headers: {
				'Authorization': 'Basic ' +auth,
				'Accept'	   : 'application/json',
				'Content-Type' : 'application/json'
			},
			agent: new common.https.Agent({ 
				keepAlive: 		common.config.http_agent_keepAlive,
				keepAliveMsecs: common.config.http_agent_keepAliveMsecs,
				maxFreeSockets: common.config.http_agent_maxFreeSockets
			}),
			method: method
		};
		return options;
	},

	/**
	 * Gets and transforms the Bigcommerce API basic auth access
	 * credentials into proper url format AND Base64_Encodes the result.
	 * Example: base64("username:password")
	 * @return string - The base64/Bigcommerce formatted basic auth
	 */
	getBasicAuth: function() {
		var auth = common.config.bc_username +':' 
					+common.config.bc_password;
		auth = new Buffer(auth).toString('base64');
		return auth;
	}
}


