import { IncomingJsonMessageToJobTf } from '../service/transformer/incoming-json-message-to-job.tf';
import { Transformer } from '../service/transformer/transformer';
import { LoggerUtil } from '../util/logger.util';
import { OcrProcessingService } from '../service/ocr-processing.service';
import { LoggerInstance } from 'winston';

/**
 * Initializes the ocr processing sub-system.
 *
 * You should take care to only call the build() method once. Otherwise, several worker
 * subsystems may conflict each other.
 */
export class OcrProcessingServiceFactory {

    /** Creates an instance of a OcrProcessingService for our worker. */
    public static build(): OcrProcessingService {
        const logger: LoggerInstance = LoggerUtil.build();
        const tranformer: Transformer = new IncomingJsonMessageToJobTf();
        return new OcrProcessingService(logger, tranformer);
    }
}
