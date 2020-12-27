if (!(process.argv[2] && process.argv[3])) {
	console.log(`command=> node seeder.js <bootcamp/course> -a/-d`);
	process.exit(0);
}

const fs = require('fs');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const ConnectDb = require('./src/connectdb');
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
// const speceficModel = process.argv[2].toProperCase();
const speceficModel = require(`./src/models/${process.argv[2].toProperCase()}`);

// console.log(dotenv);
(async () => {
	await ConnectDb();
	// console.log(process.argv[2], process.argv[3]);
	// console.log(typeof process.argv[2], typeof process.argv[3]);
	// Read Json files
	const buffer = fs.readFileSync(`./_data/${process.argv[2]}s.json`, { encoding: 'utf-8' });
	// console.log(buffer);
	objects = JSON.parse(buffer);
	// console.log(objects);

	async function createDocuments() {
		try {
			await speceficModel.create(objects);
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
			await speceficModel.deleteMany();
		} catch (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			process.exit(1);
		}

		console.log('\x1b[1m\x1b[7m\x1b[31m%s\x1b[0m', ' Documents deleted !! ');
		process.exit(0);
	}

	if (process.argv[3] === '-a') await createDocuments();
	else if (process.argv[3] === '-d') await deleteDocuments();
	// if (process.argv[2] == undefined) process.exit(0);
	else process.exit(0);
})();
