import { RedisOptions } from 'ioredis';

export class Configuration {

    public static readonly ENVIRONMENT_PRODUCTION = 'production';
    public static readonly REDIS_CLIENT_OPTIONS: RedisOptions = {
        db: process.env.REDIS_DB || 0,
        host: process.env.REDIS_HOST || '127.0.0.1',
        keyPrefix: 'ocr',
        port: process.env.REDIS_PORT || 6379,
        reconnectOnError: function (err) {
            if (err.message.slice(0, 'READONLY'.length) === 'READONLY') {
                return true;
            }
        },
        retryStrategy: function (times) {
            const delay = Math.min(times * 50, 2000); // two minutes
            return delay;
        },
    };
    public static readonly CALLBACK_API_ADDRESS = process.env.CALLBACK_API_ADDRESS;
    public static readonly INPUT_ROOT = '/home/node/data';
    public static readonly OUTPUT_PATH = '/home/node/output';
}
