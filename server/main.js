require("dotenv").config();
const pino = require("pino");
const fastify = require("fastify")();
const fastifyJwt = require("fastify-jwt");
const fastifyCookie = require("fastify-cookie");
const { sequelize, logSequelize } = require("./config/database");

const cLog = require("./models/logRecords/Log_C");
const sLog = require("./models/logRecords/Log_S");
const dLog = require("./models/logRecords/Log_D");

const logStream = {
    write: async (msg) => {
        try {
            const parsed = JSON.parse(msg);
            const logType = parsed.logType || "controller";
            const logData = {
                "@timestamp": parsed.time,
                "log.level": pino.levels.labels[parsed.level] || "info",
                message: parsed.msg,
                "user.email": parsed["user.email"] || null,
                "user.uuid": parsed["user.uuid"] || null,
                "http.request.method": parsed["http.request.method"] || null,
                "http.response.status_code": parsed["http.response.status_code"] | null,
                "url.path": parsed["url.path"] || null,
                "trace.id": parsed["trace.id"] || null
            };
            if (logType === "controller") {
                await cLog.create(logData);
            } else if (logType === "service") {
                await sLog.create(logData);
            } else if (logType === "database") {
                await dLog.create(logData);
            };
        } catch (e) {
            console.log(e);
        };
    }
};

const logger = pino({
    level: "info",
    prettyPrint: false,
    transport: {
        target: "pino/file",
        options: {
            destination: "logs/output.log"
        }
    }
}, logStream);

fastify.register(require("@fastify/cors"), {
    origin: true,
    credentials: true
});
fastify.register(fastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET,
    cookie: {
        cookieName: "sundol_rtk",
        signed: false
    }
});
fastify.register(fastifyCookie);
fastify.register(require("./user/controller/AuthController"), { prefix: "/auth" });
fastify.register(require("./user/controller/UserController"), { prefix: "/user" });

fastify.addHook("onResponse", async (req, res) => {
    logger.info({
        logType: req.logType || "controller",
        "user.email": req.user?.email || null,
        "user.uuid": req.user?.uuid || null,
        "http.response.status_code": res?.statusCode || null,
        "url.path": req.url,
        "trace.id": req.headers["x-trace-id"] || null
    }, `${req.method} ${req.url} - ${res.statusCode}`);
});

sequelize.sync({ force: true })
    .then(() => {
        console.log("Main database synchronized.");
    })
    .catch((e) => {
        console.log("Error syncing main database: ", e);
    });

logSequelize.sync({ force: true })
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