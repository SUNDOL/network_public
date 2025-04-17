require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const sequelize = require('./config/database');

fastify.register(require('fastify-cookie'));
fastify.register(require('@fastify/cors'), {
    origin: true,
    credentials: true
});

sequelize.sync()
    .then(() => {
        console.log("Database synchronized.");
    })
    .catch((e) => {
        console.log("Error syncing database: ", e);
    });

fastify.get("/", async () => {
    return { status: "Server OK" };
});

async function start() {
    try {
        await fastify.listen({ port: 5000 });
        fastify.log.info(`Server OK`);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    };
};

start();