import { JsonObject } from "merapi";

export type Id<T> = T & { id: string };

export interface IPaginated<T> {
    data: T[];
    total: number;
    limit: number;
    page: number;
}

export interface IRepo<T> {
    get(entityName: string, id: string): Promise<Id<T>>;
    gets(entityName: string, query: object): Promise<T[]>;
    create(entityName: string, object: T): Promise<Id<T>>;
    update(entityName: string, id: string, object: T): Promise<Id<T>>;
    remove(entityName: string, id: string): Promise<boolean>;
    removeByFilter(entityName: string, query: object): Promise<boolean>;
    paginate(entityName: string, query: object, page: number, limit: number): Promise<IPaginated<T>>;
    count(entityName: string, query: object): Promise<number>;
}

export interface IRedis {
    get(key: string): Promise<string>;
    set(key: string, data: string | JsonObject): Promise<string>;
    delete(key: string): Promise<string>;
    expire(key: string, ttl?: number): Promise<string>;
}

