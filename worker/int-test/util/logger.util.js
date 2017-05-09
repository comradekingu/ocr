"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const worker_configuration_1 = require("../configuration/worker.configuration");
class LoggerUtil {
    static build() {
        !LoggerUtil.loggerInstance && LoggerUtil.createLoggerInstance();
        return LoggerUtil.loggerInstance;
    }
    static createLoggerInstance() {
        LoggerUtil.loggerInstance = new winston_1.Logger({
            exitOnError: false,
            level: LoggerUtil.getLogLevelConfiguration(),
            transports: [
                new (winston_1.transports.Console)({ timestamp: true, colorize: true }),
            ],
        });
    }
    static getLogLevelConfiguration() {
        return process.env.NODE_ENV === worker_configuration_1.Configuration.ENVIRONMENT_PRODUCTION ? LoggerUtil.WARN : LoggerUtil.DEBUG;
    }
}
LoggerUtil.WARN = 'warn';
LoggerUtil.DEBUG = 'debug';
exports.LoggerUtil = LoggerUtil;
