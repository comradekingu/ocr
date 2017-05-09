import { Configuration } from '../../configuration/worker.configuration';
import { IJob, Job } from '../../poto/job';
import { Transformer, TransformerException } from './transformer';

export class IncomingJsonMessageToJobTf implements Transformer {

// TODO: sanitize little bit more (check fields)
public transform(message: string): IJob {
        if (message.length > 1) {
            const job: IJob = new Job();
            const object: any = JSON.parse(message);
            const fieldsNotSet: Array<string> = new Array();
            (object.id).constructor === Number ? job.id = object.id : fieldsNotSet.push('id');
            object.inputPath.length > 0 ? job.sourceDir = Configuration.INPUT_ROOT + object.inputPath : fieldsNotSet.push('inputPath');
            job.outputDir = Configuration.OUTPUT_PATH;
            object.languages instanceof Array && object.languages.length > 0 ? job.languages = object.languages : fieldsNotSet.push('languages');
            object.securityToken.length > 0 ? job.securityToken = object.securityToken : fieldsNotSet.push('securityToken');
            if (fieldsNotSet.length > 0) {
                throw new TransformerException(`The following fields are not set: ${fieldsNotSet.join(',')}`);
            } else {
                return job;
            }
        } else {
            throw new TransformerException('The message had no content.');
        }
    }
}
