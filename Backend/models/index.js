const sequelize = require('../config/database'); // Import database config
const { Sequelize } = require('sequelize');

const db = {}; // Create an object to store models
db.sequelize = sequelize; // Attach Sequelize instance
db.Sequelize = Sequelize;

module.exports = db;
