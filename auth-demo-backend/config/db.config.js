const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('auth_demo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
