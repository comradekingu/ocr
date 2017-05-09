"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configuration {
}
Configuration.ENVIRONMENT_PRODUCTION = 'production';
Configuration.REDIS_CLIENT_OPTIONS = {
    prefix: 'ocr',
    retry_strategy: (options) => {
        if (options.error) {
            return options.error;
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
    },
};
exports.Configuration = Configuration;
