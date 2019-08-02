import { JsonObject } from "merapi";

export type Id<T> = T & { id: string };

export interface IPaginated<T> {
    data: T[];
    total: number;
    limit: number;
    page: number;
}

export interface IRepo<T> {
    get(id: string): Promise<Id<T>>;
    gets(query: object): Promise<T[]>;
    create(object: T): Promise<Id<T>>;
    update(id: string, object: T): Promise<Id<T>>;
    remove(id: string): Promise<boolean>;
    removeByFilter(query: object): Promise<boolean>;
    paginate(query: object, page: number, limit: number): Promise<IPaginated<T>>;
    count(query: object): Promise<number>;
}

export interface ICorpusRepo {
    
}
