const fs = require('fs');
const ConnectDb = require('./src/connectdb');
const dotenv = require('dotenv').config({ path: './config/config.env' });

// console.log(dotenv);
(async () => {
	const Bootcamp = await require('./src/models/Bootcamp');
	await ConnectDb();

	// Read Json files
	const buffer = fs.readFileSync('./_data/bootcamps.json', {});
	// console.log(buffer);
	objects = JSON.parse(buffer);
	// console.log(objects);

	objects.forEach((object) => {
		(async () => await Bootcamp.create(object))();
	});
	console.log('made');
})();
