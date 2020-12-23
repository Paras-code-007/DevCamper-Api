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

	async function createDocuments() {
		try {
			await Bootcamp.create(objects);
		} catch (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			process.exit(1);
		}

		console.log('\x1b[1m\x1b[7m\x1b[32m%s\x1b[0m', ' Documents created !!');
		process.exit(0);
	}

	async function deleteDocuments() {
		try {
			await Bootcamp.deleteMany();
		} catch (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			process.exit(1);
		}

		console.log('\x1b[1m\x1b[7m\x1b[31m%s\x1b[0m', ' deleted !!');
		process.exit(0);
	}

	if (process.argv[2] === '-a') await createDocuments();
	else if (process.argv[2] === '-d') await deleteDocuments();
	// if (process.argv[2] == undefined) process.exit(0);
	else process.exit(0);
})();
