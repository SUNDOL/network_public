const ControllerLog = require("../models/logRecords/Log_C");
const ServiceLog = require("../models/logRecords/Log_D");
const DatabaseLog = require("../models/logRecords/Log_S");
const os = require("os");

const createLog = async ({
  model,
  datasetPrefix,
  level,
  message,
  req,
  res,
  userEmail = null,
  userUuid = null,
}) => {
  try {
    await model.create({
      "@timestamp": new Date().toISOString(),
      "log.level": level,
      message,
      "event.dataset": `network_api.${datasetPrefix}.${req?.routeOptions?.url || "unknown"}`,
      "service.name": "network_api",
      "process.pid": process.pid,
      "host.name": os.hostname(),
      "http.request.method": req?.method,
      "http.response.status_code": res?.statusCode,
      "url.path": req?.url,
      "user.email": userEmail || null,
      "user.uuid": userUuid || null,
      "trace.id": req?.id || null
    });
  } catch (err) {
    console.error(`${datasetPrefix} logging failed`, err);
  }
};

const cLog = (params) =>
  createLog({ ...params, model: ControllerLog, datasetPrefix: "controller" });

const sLog = (params) =>
  createLog({ ...params, model: ServiceLog, datasetPrefix: "service" });

const dLog = (params) =>
  createLog({ ...params, model: DatabaseLog, datasetPrefix: "database" });

module.exports = { cLog, sLog, dLog };