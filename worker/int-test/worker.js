"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_util_1 = require("./util/logger.util");
const redis_1 = require("redis");
const worker_configuration_1 = require("./configuration/worker.configuration");
class Worker {
    constructor() {
        this.logger = logger_util_1.LoggerUtil.build();
        this.redisClient = redis_1.createClient(worker_configuration_1.Configuration.REDIS_CLIENT_OPTIONS);
    }
    start() {
        this.logger.info(`Application: "INT_TEST" started.`);
        this.redisClient.on('error', (err) => {
            this.logger.error(`An error occured: ${err.message}`);
        });
        this.redisClient.on('connect', () => {
            this.redisClient.lpush('process', 'test', (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
}
exports.Worker = Worker;