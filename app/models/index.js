import dbConfig from '../config/db.config';
import Sequelize from 'sequelize';

let { HOST, DB, USER, PASSWORD, dialect, pool } = dbConfig;
let { max, min, acquire, idle } = pool;

const sequelize = new Sequelize(DB, USER, PASSWORD, {
	host: HOST,
	dialect,
	operatorAliases: false,
	pool: {
		max,
		min,
		acquire,
		idle
	}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require('./tutorial.model')(sequelize, Sequelize);

export default db;
