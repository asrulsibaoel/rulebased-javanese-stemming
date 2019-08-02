export interface IPrefix {
    id?: string;
    prefix: string;
    rules?: string;
}

export interface ISuffix {
    id?: string;
    suffix: string;
    rules?: string;
}

export interface IConfix {
    id?: string;
    prefix: string;
    suffix: string;
    rules?: string;
}

export interface IWord {
    id?: string;
    word: string;
}

export interface IPredict {
    predictRootWord(word: string): Promise<string>;
}
