const ControllerLog = require("../models/logRecords/ControllerLog");
const ServiceLog = require("../models/logRecords/ServiceLog");
const DatabaseLog = require("../models/logRecords/DatabaseLog");

const controllerLog = async ({ level, message, req, res, userId = null }) => {
  try {
    await ControllerLog.create({
      "@timestamp": new Date().toISOString(),
      "log.level": level,
      message,
      "event.dataset": "network_api.controller." + (req?.routeOptions?.url || "unknown"),
      "service.name": "network_api",
      "process.pid": process.pid,
      "host.name": require("os").hostname(),
      "http.request.method": req?.method,
      "http.response.status_code": res?.statusCode,
      "url.path": req?.url,
      "user.id": userId?.toString() || null,
      "trace.id": req?.id || null
    });
  } catch (err) {
    console.error("Controller logging failed", err);
  }
};

const serviceLog = async ({ level, message, req, res, userId = null }) => {
  try {
    await ServiceLog.create({
      "@timestamp": new Date().toISOString(),
      "log.level": level,
      message,
      "event.dataset": "network_api.service." + (req?.routeOptions?.url || "unknown"),
      "service.name": "network_api",
      "process.pid": process.pid,
      "host.name": require("os").hostname(),
      "http.request.method": req?.method,
      "http.response.status_code": res?.statusCode,
      "url.path": req?.url,
      "user.id": userId?.toString() || null,
      "trace.id": req?.id || null
    });
  } catch (err) {
    console.error("Service logging failed", err);
  }
};

const databaseLog = async ({ level, message, req, res, userId = null }) => {
  try {
    await DatabaseLog.create({
      "@timestamp": new Date().toISOString(),
      "log.level": level,
      message,
      "event.dataset": "network_api.database." + (req?.routeOptions?.url || "unknown"),
      "service.name": "network_api",
      "process.pid": process.pid,
      "host.name": require("os").hostname(),
      "http.request.method": req?.method,
      "http.response.status_code": res?.statusCode,
      "url.path": req?.url,
      "user.id": userId?.toString() || null,
      "trace.id": req?.id || null
    });
  } catch (err) {
    console.error("Database logging failed", err);
  }
};

module.exports = { controllerLog, serviceLog, databaseLog };