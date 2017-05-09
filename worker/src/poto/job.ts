export interface IJob {
    id: number;
    sourceDir: string;
    outputDir: string;
    languages: string[];
    securityToken: string;
}

export class Job implements IJob {
    private _id: number;
    private _sourceDir: string;
    private _outputDir: string;
    private _languages: string[];
    private _securityToken: string;

    public toString = () : string => {
        return `${JSON.stringify(this)}`;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get sourceDir(): string {
        return this._sourceDir;
    }

    public set sourceDir(value: string) {
        this._sourceDir = value;
    }

    public get outputDir(): string {
        return this._outputDir;
    }

    public set outputDir(value: string) {
        this._outputDir = value;
    }

    public get languages(): string[] {
        return this._languages;
    }

    public set languages(value: string[]) {
        this._languages = value;
    }

    public get securityToken(): string {
        return this._securityToken;
    }

    public set securityToken(value: string) {
        this._securityToken = value;
    }
}
