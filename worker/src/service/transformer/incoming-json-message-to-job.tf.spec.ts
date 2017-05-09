import { TransformerException } from './transformer';
import { IncomingJsonMessageToJobTf } from './incoming-json-message-to-job.tf';

describe('The incoming json message to job transformer', () => {
    let cut: IncomingJsonMessageToJobTf;

    beforeEach(() => {
        cut = new IncomingJsonMessageToJobTf();
    });

    it('should transform the incoming json message correctly', () => {
        const jsonMessage = '';

        const result = cut.transform(jsonMessage);

        expect(result).toBeDefined();
    });

    it('should throw an error for empty id', () => {
        const jsonMessage = '';

        expect(cut.transform(jsonMessage)).toThrow(new TransformerException('The following fields are not set: id'));
    });

});
