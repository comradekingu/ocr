import { Exception } from '../../exception';
export interface Transformer {
    transform<T>(input: T): T;
}

export class TransformerException extends Exception {}
