const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../database.sqlite",
    logging: false
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.")
    })
    .catch((e) => {
        console.error("Unable to connect to the database", e);
    });

module.exports = sequelize;