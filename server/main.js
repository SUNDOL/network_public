require("dotenv").config();
const fastify = require("fastify")();
const { sequelize, logSequelize } = require("./config/database");

fastify.register(require("fastify-cookie"));
fastify.register(require("@fastify/cors"), {
    origin: true,
    credentials: true
});

sequelize.sync()
    .then(() => {
        console.log("Main database synchronized.");
    })
    .catch((e) => {
        console.log("Error syncing main database: ", e);
    });

logSequelize.sync()
    .then(() => {
        console.log("Log database synchronized.");
    })
    .catch((e) => {
        console.log("Error syncing log database: ", e);
    });

fastify.get("/", async () => {
    return { status: "Server OK" };
});

async function start() {
    try {
        fastify.listen({ port: process.env.PORT || 5000 });
        console.log("Server OK");
    } catch (e) {
        console.log(e);
        process.exit(1);
    };
};

start();