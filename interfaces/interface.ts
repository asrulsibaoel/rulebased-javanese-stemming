export interface IPrefix {
    id?: string;
    prefix: string;
}

export interface ISuffix {
    id?: string;
    suffix: string[];
}

export interface IConfix {
    id?: string;
    prefix: string[];
    suffix: string[];
}

export interface IRule {
    getRule(): string;
    isRootWord(): boolean;
    getPrefix(): IPrefix[];
    getConfix(): IConfix[];
    getSuffix(): ISuffix[];
    eliminatePrefix(word: string): string;
    eliminateSuffix(word: string): string;
}
