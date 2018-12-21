"use strict";


// Products Route import
const productRoutes = require('./api/routes/products');

// Orders Route import
const orderRoutes = require('./api/routes/orders');

// Logging service MORGAN
const morgan = require('morgan');

// Body parser
const bodyParser = require('body-parser');

// Crypto Password
const crypto = require('crypto');

// UuId for User ID
const uuid = require('uuid');


// Import the required modules
const express = require('express'),
	  exphbs = require('express-handlebars'),
	  app = express();


// Accept JSON and URL encoded Parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

// PASSWORD Util
var getRandomString = function(length) {
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') // Convert to HEX 
		.slice(0,length); // return required number of Chars
};
var shar512 = function(password, salt){
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt,
		passwordHash: value
	};
};
function saltHashPassword(userPassword){
	var salt = getRandomString(16); // Random String with 16 Chars to SALT
	var passwordData = shar512(userPassword, salt);
	return passwordData;
}

function checkHashPassword(userPassword, salt){
	var passwordData = shar512(userPassword, salt);
	return passwordData;
}

// The PORT where the server will be listening
const PORT = 3036;

// Initialize the Handlebars Engine with some options
var handlebars = exphbs.create({
	defaultLayout: 'main'
});

//Connect to mySQL
const mysql = require('mysql');
const con = mysql.createConnection({
	host: 'localhost', // HOST IP goes here
	user: 'root',
	password: '',
	database: 'DemoNodeJS'
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
app.get('/', (req, res, next) => {
	res.render('home');
});

//POST for Register
app.post('/register/', (req, res, next) => {
	var post_data = req.body; // Get POST parser
	
	var uid = uuid.v4(); // Get UUID v4 like
	var plaint_password = post_data.password;
	var hash_data = saltHashPassword(plaint_password);
	var password = hash_data.passwordHash; // Get hash value
	var salt = hash_data.salt;

	var name = post_data.name;
	var email = post_data.email;

	con.query('SELECT * FROM user WHERE email = ?', [email], function(err, result, fields){
		con.on('error', function(err){
			console.log('[MySQL ERROR]', err);
		});
	
		if(result && result.length)
			res.json('User already exists!');
		else
		{
			con.query('INSERT INTO `User`(`unique_id`, `name`, `email`, `encrypted_password`, `salt`, `created_at`, `updated_at`)' +
			 'VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())', [uid, name, email, password, salt], function(err, result, fields) {
				con.on('error', function(err){
					console.log('[MySQL ERROR]', err);
					res.json('Register error: ', err);
				});
				res.json('Register Successsful!');
			});
		}
	});
});

// POST for Login
app.post('/login/', (req, res, next) => {
	var post_data = req.body;

	//Extract email and password from request
	var user_password = post_data.password;
	var email = post_data.email;

	con.query('SELECT * FROM user WHERE email = ?', [email], function(err, result, fields){
		con.on('error', function(err){
			console.log('[MySQL ERROR]', err);
		});
	
		if(result && result.length)
		{
			var salt = result[0].salt; // Get salt of result if ACC exists
			var encrypted_password = result[0].encrypted_password;
			// Hash password from Login requests with salt in DB
			var hashedPassword = checkHashPassword(user_password, salt).passwordHash;
			if(encrypted_password == hashedPassword)
				res.end(JSON.stringify(result[0])) // If PASS correct, return all INFO of USER
			else
				res.end(JSON.stringify('Wrong password'));
		}
		else
		{
			res.json('User does not exist!');
		}
	});
});

// //Test Password ENCRYPTION
// app.get('/password', (req, res, next) => { 
// 	console.log('Password : 123456');
// 	var encrypt = saltHashPassword('123456');
// 	console.log('Encrypt: ' + encrypt.passwordHash);
// 	console.log('Salt: ' + encrypt.salt);
// });

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