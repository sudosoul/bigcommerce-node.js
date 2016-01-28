/**
 ***********************************************************************************
 * Bigcommerce API Connection File for the Legacy API. 
 *
 * This file initialized with the following parameters:
 * 		path - string - The API path/URL.
 *    user - string - The API username.
 *    pass - string - The API password/token. 
 *    dataType - string - OPTIONAL: Use XML or JSON. Defaults on JSON. 
 *
 ***********************************************************************************
 * Example Usage:
 *    // Load this file:
 * 		var connection = require('./connection'); 
 *    
 *    // Define the API credentials, and instantiate this class:
 *    var credentials = {host: 'www.site.com', user: 'surerob', pass: 'abc123'};
 *    var api = new connection(credentials); 
 *
 *    // Get first 50 products and print their names:
 *    api.get('/products')
 *      .then(function(res) {
 *      	for (i=0; i<res.body.length; i++) { //res.body holds the BC response body
 *      	  console.log(res.body[i].name);    //Print each product name.
 *       	}
 *      });
 ***********************************************************************************
 *
 * @author Rob Mullins <rob@surerob.com>
 * @copyright Copyright 2016 - SureRob Solutions LLC
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 ***********************************************************************************
 */

// Load dependencies:
var Promise = require('promise');
var request = require('request');
var xml2js  = require('xml2js');			
var builder = new xml2js.Builder();


/**
 * Construct.
 * Initializes class with BC API credentials.
 * @param settings object - Contains the BC API credentials and dataType.
 * @throws Error if Credentials object not provided. 
 */
function Connection(settings) {
	// Return new instance if this called without 'new'.
  if (!(this instanceof Connection)) {
  	return new Connection(config);
  }

  // Default dataType to JSON if not set:
  if (typeof settings.dataType === 'undefined') {
  	settings.dataType = 'json';
  }

  // Ensure credentials object provided:
  if (!settings) {
  	throw new Error('Class must be initialized with credentials object. See README.');
  }
  // Initialize class with credentials:
  this.init(settings);
}

/**
 * Connection wrapper to the Bigcommerce Legacy API.
 * Performs standard CRUD operations, specifically:
 * GET, PUT, POST, DELETE.
 * @see Bigcommerce API documentation on how perform API calls. 
 * @see https://developer.bigcommerce.com/api/legacy/basic-auth
 *
 * @author Rob Mullins <rob@surerob.com>
 */
Connection.prototype = {

	/**
	 * The legacy API version.
	 * @constant string
	 */
	apiVersion: '/api/v2',

	/**
	 * The full store's legacy API path.
	 * Set upon initialization. 
	 * @var string
	 */
	apiPath: null,

	/**
	 * The Base64 Header Authentication.
	 * Set upon initialization.
	 * @var string.
	 */
	apiAuth: null,

	/**
	 * The request/response dataType to set.
	 * Either XML or JSON. Default is JSON.
	 * @var string.
	 */
	dataType: null,

	/**
	 * Initializes class with BC API credentials and dateType.
	 * @param object settings - Contains BC API credentials and dataType.
	 * @throws Error if missing any of the three required API attributes:
	 *    path - string - The API path/URL.
   *    user - string - The API username.
   *    pass - string - The API password/token. 
   */
	init: function(settings) {
		// Ensure BC API Path Provided:
		if (!settings.path) {
			throw new Error('BC API Path not provided.');
		}
		// Ensure BC API Username Provided:
		if (!settings.user) {
			throw new Error('BC API Username not provided.');
		}
		// Ensure BC API Token Provided:
		if (!settings.pass) {
			throw new Error('BC API Token not provided.');
		}

		// Ensure proper dataType provided:
		if (settings.dataType.toLowerCase() !== 'json' && settings.dataType.toLowerCase() !== 'xml') {
			throw new Error('Valid options for dataType are either XML or JSON.');
		}

		// Format username and password into Base64:
		var auth = settings.user +':' +settings.pass;
		auth     = new Buffer(auth).toString('base64');

		// Set settings as class variables:
		this.apiPath = settings.path;
		this.apiAuth = auth;
		this.dataType = settings.dataType.toLowerCase();
	},

	/**
	 * Performs an HTTP GET request to the provided BC endpoint.
	 * The API path has already been set, so only the endpoint should be provided
	 * WITH the beginning forward slash (/). Example: endpoint = '/products'.
	 *
	 * @param endpoint string - The API resource endpoint to request. 
	 * @return Promise - Promise containing the API response. 
	 */
	get: function(endpoint) {
		var self = this;
		return new Promise(function(fulfill, reject) {
			// Set request options:
			var options = {
				url: self.apiPath +self.apiVersion +endpoint,
				headers: {
					'Authorization': 'Basic ' +self.apiAuth,
					'Accept'	     : 'application/' +self.dataType,
					'Content-Type' : 'application/' +self.dataType
				}
			};

			// Perform the request:
			request(options, function(err, res, body) {
				// Reject if request failed, or BC returns non 200 status:
				if (err || res.statusCode !== 200) {
					reject(err);
				} else {
					fulfill({res: res, body: self.dataType === 'json' ? JSON.parse(body) : body});
				}
			});
		});
	},


	/**
	 * Performs an HTTP PUT request to the provided BC endpoint.
	 * The API path has already been set, so only the endpoint should be provided
	 * WITH the beginning forward slash (/). Example: endpoint = '/products'.
	 *
	 * @param endpoint string - The API resource endpoint to request. 
	 * @param data object     - The request XML/JSON data object.
	 * @return Promise        - Promise containing the API response. 
	 */
	put: function(endpoint, data) {
		var self = this;
		return new Promise(function(fulfill, reject) {
			// Set request options:
			var options = {
				url: self.apiPath +self.apiVersion +endpoint,
				method: 'PUT',
				headers: {
					'Authorization': 'Basic ' +self.apiAuth,
					'Accept'	     : 'application/' +self.dataType,
					'Content-Type' : 'application/' +self.dataType
				},
				body: self.dataType === 'json' ? JSON.stringify(data) : builder.buildObject(data)
			};

			// Perform the request:
			request(options, function(err, res, body) {
				// Reject if request failed, or BC returns non 200 status:
				if (err || res.statusCode !== 200) {
					reject(err);
				} else {
					fulfill({res: res, body: self.dataType === 'json' ? JSON.parse(body) : body});
				}
			});
		});
	},

	/**
	 * Performs an HTTP POST request to the provided BC endpoint.
	 * The API path has already been set, so only the endpoint should be provided
	 * WITH the beginning forward slash (/). Example: endpoint = '/products'.
	 *
	 * @param endpoint string - The API resource endpoint to request. 
	 * @param data object     - The request XML/JSON data object.
	 * @return Promise        - Promise containing the API response. 
	 */
	post: function(endpoint, data) {
		var self = this;
		return new Promise(function(fulfill, reject) {
			// Set request options:
			var options = {
				url: self.apiPath +self.apiVersion +endpoint,
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' +self.apiAuth,
					'Accept'	     : 'application/' +self.dataType,
					'Content-Type' : 'application/' +self.dataType
				},
				body: self.dataType === 'json' ? JSON.stringify(data) : builder.buildObject(data)
			};

			// Perform the request:
			request(options, function(err, res, body) {
				// Reject if request failed, or BC returns non 200 status:
				if (err || res.statusCode !== 200) {
					reject(err);
				} else {
					fulfill({res: res, body: self.dataType === 'json' ? JSON.parse(body) : body});
				}
			});
		});
	},

	/**
	 * Performs an HTTP DELETE request to the provided BC endpoint.
	 * The API path has already been set, so only the endpoint should be provded
	 * WITH the beginning forward slash (/). Example: endpoint = '/products'.
	 *
	 * @param endpoint string - The API resource endpoint to request. 
	 * @return Promise        - Promise containing the API response. 
	 */
	delete: function(endpoint) {
		var self = this;
		return new Promise(function(fulfill, reject) {
			// Set request options:
			var options = {
				url: self.apiPath +self.apiVersion +endpoint,
				method: 'DELETE',
				headers: {
					'Authorization': 'Basic ' +self.apiAuth,
					'Accept'	     : 'application/' +self.dataType,
					'Content-Type' : 'application/' +self.dataType
				}
			};

			// Perform the request:
			request(options, function(err, res, body) {
				// Reject if request failed, or BC returns non 200 status:
				if (err || res.statusCode !== 200) {
					reject(err);
				} else {
					fulfill({res: res, body: self.dataType === 'json' ? JSON.parse(body) : body});
				}
			});
		});
	},
};

module.exports = Connection;



