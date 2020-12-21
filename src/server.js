if (process.env.NODE_ENV != 'production') {
	//means it is development
	// load env vars
	const dotenv = require('dotenv').config({ path: './config/config.env' }); //takes .env file in root path by default if path not given
	console.log(dotenv);
	//.config loads the environment variable by parsing and convert to js object and return it

	//+OR
	/* const dotenv = require('dotenv');
	const obj = dotenv.config({
		path: './config/config.env',
	});
	console.log(obj); */
}

/*
const dotenv = require('dotenv').config({ path: './config/config.env' }); //takes .env file in root path by default if path not given
console.log(dotenv);
console.log(process.env.PORT, process.env.NODE_ENV, process.env.secret); //to check wehn snp start script is run and node_env=production is set because of start script then after dotenv.config()is done which environment variables is preffered
//? output=> 4444 production undefined
// means environment varibale of start scripts are prefferef over dotenv ones
*/

const express = require('express');
//load config vars
const PORT = process.env.PORT || 3000;
const ConnectDb = require('./connectdb');

// Route files
const bootcampsRoute = require('./routes/bootcamps').router;

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Connect to Database
ConnectDb();

const app = express();

// Middlewares Used
// const logger = require('./middlewares/logger');
// app.use(logger);
//+ app.use(require('./middlewares/logger'));  //using morgan instead

if (process.env.NODE_ENV === 'development') {
	app.use(require('morgan')('dev'));
}

//Body parser
app.use(express.json());

// console.log(process.NODE_ENV); //undefined

// Mount Routes
// app.use('/api/v1/bootcamps', require('./routes/bootcamps'));
app.use('/api/v1/bootcamps', bootcampsRoute);
app.use(errorHandler); //insted of using express error handler use our own made error handler

// testing **********************************************************

app.get('/testpath', function (req, res, next) {
	res.send(
		'the default header for such type of text responses is res.header(Content-Type, text/html with charset utf8)'
	);
});

app.get('/testpathhtml', function (req, res, next) {
	res.send('<h1>hello html</h1>');
});

app.get('/testpathjsondatatype', function (req, res, next) {
	// res.send({
	// 	name: 'this is json data type',
	// 	desc:
	// 		'express does this job of recognisinging data like html/text or json and parse json and convert it to string because only strings is allowed in response oh native http module',
	// });
	res.json({
		name: 'this is json data type',
		desc:
			'express does this job of recognisinging data like html/text or json and parse json and convert it to string because only strings is allowed in response oh native http module',
	});
});

app.get('/teststatus', function (req, res, next) {
	//send status as a response
	// res.sendStatus(400); //bad reuqest
	//like res.send but set status code and set body as desc of statuscode

	//send error with status
	// res.status(400).json({
	// 	success: false,
	// 	error: 'faulty request',
	// });

	//succesful response  //can or cannot use status cause express itself set status code 200 for succesful request
	res.status(200).json({
		success: true,
		data: {
			id: 1,
		},
	});
});

const server = app.listen(
	PORT,
	console.log(
		'\x1b[32m%s\x1b[0m',
		`server running in ${process.env.NODE_ENV} mode on port ${PORT}
http://localhost:${PORT}`
	)
);

// console.log(server);

// handles unahndle promise rejections in whole server: since mongodb and all these libraries are promised based therfore error related to any unhandled promise (promise whose catch is not there will be handled)
process.on('unhandledRejection', (err, promise) => {
	console.log('\x1b[31m%s\x1b[0m', err.name);
	console.log('\x1b[31m%s\x1b[0m', `Error: ${err.message}`);
	// console.log(err.message);
	// console.log(err.stack);

	// Close Server and Exit

	server.close((err) => {
		console.log(err); //undefined at closing of server on any unhandled rejection is coming becuse of this
		process.exit(1);
	});
});

//! Router.use() requires a middleware function but got a Object
//! express deprecated req.host: Use req.hostname instead src/middlewares/logger.js:2:54
