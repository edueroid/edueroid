"use strict";

// Products Route import
const productRoutes = require('./api/routes/products');

// Orders Route import
const orderRoutes = require('./api/routes/orders');

// Logging service MORGAN
const morgan = require('morgan');

// Import the required modules
const express = require('express'),
	  exphbs = require('express-handlebars'),
	  app = express();

// The PORT where the server will be listening
const PORT = 3036;

// Initialize the Handlebars Engine with some options
var handlebars = exphbs.create({
	defaultLayout: 'main'
});

// Using MORGAN to log INFO about all requests
app.use(morgan('dev'));

// Link our Handlebars Engine to ExpressJS
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//
// The default route, this will be hit when we visit
// the slash (/) on the server.
// [TODO]: Move this routing into another file named: routes.js and then
// import it here
// 
app.get('/', function(request, responce) {
	responce.render('home');
});

// Finally start the server and listening
app.listen(PORT, function() {
	// Log into the console that the server has been started
	console.log("[INFO]: The server has been started and is listening.");
	console.log("[INFO]: At: http://localhost:" + PORT + ".");
})

// Request handling to root products
app.use('/products', productRoutes);

// Request handling to route orders
app.use('/orders', orderRoutes);

// 
// Handle ERRORS and not existing routes
//
app.use((req, res, next) => {
	const error = new Error('Not found!');
	error.status = 404;
	next(error);
});

// Custom Error message
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});



module.exports = app;