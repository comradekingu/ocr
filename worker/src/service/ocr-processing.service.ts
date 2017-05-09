import { execSync } from 'child_process';
import { debug } from 'util';
import { IJob } from '../poto/job';
import { IncomingJsonMessageToJobTf } from './transformer/incoming-json-message-to-job.tf';
import { Exception } from '../exception';
import { ServiceException } from './service.exception';
import { Configuration } from '../configuration/worker.configuration';
import { LoggerInstance } from 'winston';

export class OcrProcessingService {

    constructor(private logger: LoggerInstance, private incomingJsonMessageToJobTf: IncomingJsonMessageToJobTf) { }

    public process(jobMessage: string) {
        try {
            this.logger.debug(`Starting Job: ${jobMessage}`);
            const job: IJob = this.incomingJsonMessageToJobTf.transform(jobMessage);
            this.logger.debug(`The sanitized and transformed job: ${job}`);
            // TODO: tesseract / ocrmypdf
            this.execTesseract();
        } catch (e) {
            this.handleException(e);
        }
    }

    public execTesseract() {
        const ex = execSync('tesseract -v', (error, stdout, stderr) => {
            if (error) {
                this.logger.debug(`exec error: ${error}`);
                return;
            }
            this.logger.debug(`stdout: ${stdout}`);
            this.logger.debug(`stderr: ${stderr}`);
            return;
        });
    }

    public execOcrMyPdf() {
        execSync('ocrmypdf --version');
    }

    private handleException(e: Exception) {
        // TODO: call api with error cause and set status
        throw e;
    }

}

class OcrProcessingServiceException extends ServiceException { }
