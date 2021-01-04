if (!process.argv[2]) {
	console.log('command=> node seedall.js -a/-d');
	process.exit(0);
}
const fs = require('fs');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const ConnectDb = require('./src/connectdb');
const Bootcamp = require('./src/models/Bootcamp');
const Course = require('./src/models/Course');
const User = require('./src/models/User');

// console.log(dotenv);
(async () => {
	await ConnectDb();
	// console.log(process.argv[2], process.argv[3]);
	// console.log(typeof process.argv[2], typeof process.argv[3]);
	// Read Json files
	const buffer1 = fs.readFileSync('./_data/bootcamps.json', { encoding: 'utf-8' });
	const buffer2 = fs.readFileSync('./_data/courses.json', { encoding: 'utf-8' });
	const buffer3 = fs.readFileSync('./_data/users.json', { encoding: 'utf-8' });
	// console.log(buffer);
	bootcampObjects = JSON.parse(buffer1);
	courseObjects = JSON.parse(buffer2);
	userObjects = JSON.parse(buffer3);
	// console.log(objects);

	async function createDocuments() {
		try {
			await Bootcamp.create(bootcampObjects);
			await Course.create(courseObjects);
			await User.create(userObjects);
		} catch (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			process.exit(1);
		}

		console.log('\x1b[1m\x1b[7m\x1b[32m%s\x1b[0m', ' Documents created !! ');
		process.exit(0);
	}

	async function deleteDocuments() {
		try {
			await Bootcamp.deleteMany();
			await Course.deleteMany();
			await User.deleteMany();
		} catch (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			process.exit(1);
		}

		console.log('\x1b[1m\x1b[7m\x1b[31m%s\x1b[0m', ' Documents deleted !! ');
		process.exit(0);
	}

	if (process.argv[2] === '-a') await createDocuments();
	else if (process.argv[2] === '-d') await deleteDocuments();
	// if (process.argv[2] == undefined) process.exit(0);
	else process.exit(0);
})();
