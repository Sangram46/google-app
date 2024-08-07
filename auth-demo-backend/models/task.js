// const { DataTypes } = require('sequelize');

// const sequelize = require('../config/db.config');

// const Task = sequelize.define('Task', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     status: {
//         type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
//         allowNull: false
//     },
//     createdDate: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// }, {
//     timestamps: true,
//     tableName: 'tasks'
// });

// module.exports = Task;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
        allowNull: false,
    },
    createdDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: 'tasks', 
});

module.exports = Task;

