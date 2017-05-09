import { IJob, Job } from './poto/job';
import { LoggerInstance } from 'winston';
import * as Redis from 'ioredis';
import { Configuration } from './configuration/worker.configuration';
import { LoggerUtil } from './util/logger.util';
import { OcrProcessingService } from './service/ocr-processing.service';
import { OcrProcessingServiceFactory } from './factory/ocr-processing-service.factory';

/**
 * The worker class.
 *
 * @class Worker
 */
export class Worker {

    private logger: LoggerInstance;
    private ocrProcessingService: OcrProcessingService;
    private redisWorker: Redis.Redis;
    private i: number; // TODO: delete - only for testing purpose

    /**
     * The constructor.
     */
    constructor() {
        this.logger = LoggerUtil.build();
        this.ocrProcessingService = OcrProcessingServiceFactory.build();
        this.redisWorker = new Redis(Configuration.REDIS_CLIENT_OPTIONS);
        this.registerOnErrorEvent();
        this.registerOnCloseEvent();
        this.registerOnReconnectEvent();
        this.logger.info(`Application: "OCR worker" initialized.`);
        this.i = 0; // TODO: delete - only for testing purpose
    }

    /**
     * Starts the node worker loop.
     */
    public loop() {
        this.test(); // TODO: delete - only for testing purpose
        this.redisWorker.brpoplpush('incoming', 'working', 0).then((jobMessage: string) => {
            this.logger.debug(`Message recieved from Redis server: ${jobMessage}`);
            try {
                this.ocrProcessingService.process(jobMessage);
            } catch (e) {
                this.logger.error(`${e.message}: ${e.stack}`);
            }
            this.i++; // TODO: delete - only for testing purpose
            this.redisWorker.lrem('working', 1, jobMessage).then(this.loop());
        });
    }

    public test() { // TODO: delete - only for testing purpose
        if (this.i <= 5) {
            this.logger.debug('send');
            const redis = new Redis(Configuration.REDIS_CLIENT_OPTIONS);
            const job: Object = {id: 3, inputPath: '%input-path%', languages: ['deu', 'eng'], securityToken: 'gtrzheaf'};
            redis.lpush('incoming', JSON.stringify(job));
        }
    }

    private registerOnErrorEvent() {
        this.redisWorker.on('error', (e: Error) => {
            this.logger.error(`ERROR: ${e.message}.`);
        });
    }

    private registerOnCloseEvent() {
        this.redisWorker.on('close', () => {
            this.logger.warn(`Connection closed to redis server.`);
        });
    }

    private registerOnReconnectEvent() {
        this.redisWorker.on('reconnect', () => {
            this.logger.info(`Reconnecting to redis server.`);
        });
    }
}
