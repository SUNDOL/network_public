const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DATABASE_STORAGE || path.join(__dirname, "./database.sqlite"),
    logging: false
});

const logSequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.LOG_DATABASE_STORAGE || path.join(__dirname, "./logs.sqlite"),
    logging: false
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.")
    })
    .catch((e) => {
        console.error("Unable to connect to the database", e);
    });

module.exports = { sequelize, logSequelize };