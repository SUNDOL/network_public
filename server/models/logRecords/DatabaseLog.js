const { DataTypes } = require("sequelize");
const { logSequelize } = require("../config/database");

const DatabaseLog = logSequelize.define("DatabaseLog", {
    "@timestamp": {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    "log.level": {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    "event.dataset": {
        type: DataTypes.STRING,
    },
    "service.name": {
        type: DataTypes.STRING,
    },
    "process.pid": {
        type: DataTypes.INTEGER,
    },
    "host.name": {
        type: DataTypes.STRING,
    },
    "http.request.method": {
        type: DataTypes.STRING,
    },
    "http.response.status_code": {
        type: DataTypes.INTEGER,
    },
    "url.path": {
        type: DataTypes.STRING,
    },
    "user.id": {
        type: DataTypes.STRING,
    },
    "trace.id": {
        type: DataTypes.STRING,
    }
}, {
    tableName: "database_logs",
    timestamps: false
});

module.exports = DatabaseLog;