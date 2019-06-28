
import { Id, IPaginated, IRepo } from "interfaces/repos";
import * as knex from "knex";
import { Component, IConfigReader } from "merapi";
import { v4 as uuid } from "uuid";

export default class DatabaseRepo<T> extends Component implements IRepo<T> {
    protected knexClient: knex;

    constructor(config: IConfigReader) {
        super();
        this.knexClient = knex(config.default("database", {}));
    }

    public async initialize() {
        // await this.knexClient.migrate.latest();
    }

    public async create(entityName: string, object: T): Promise<Id<T>> {
        const item = object as any;
        if (!item.id) {
            item.id = uuid();
        }

        await this.knexClient(entityName).insert(item);
        return item;
    }

    public async get(entityName: string, id: string): Promise<Id<T>> {
        return this.knexClient(entityName)
            .where("id", id)
            .first();
    }

    public async gets(entityName: string, query: Partial<T>): Promise<T[]> {
        return this.knexClient(entityName).where(query);
    }

    public async update(entityName: string, id: string, object: T): Promise<Id<T>> {
        const item = object as any;
        if (!item.id) {
            item.id = id;
        }

        return await this.knexClient(entityName)
            .where("id", "=", id)
            .update(object);
    }

    public async remove(entityName: string, id: string): Promise<boolean> {
        try {
            await this.knexClient(entityName)
                .where("id", "=", id)
                .del();
        } catch (error) {
            return false;
        }
        return true;
    }

    public async removeByFilter(
        entityName: string,
        query: Partial<T>,
    ): Promise<boolean> {
        try {
            await this.knexClient(entityName)
                .where(query)
                .del();
        } catch (error) {
            return false;
        }
        return true;
    }

    public async paginate(
        entityName: string,
        query: Partial<T>,
        page: number,
        limit: number,
    ): Promise<IPaginated<T>> {
        query = query || {};
        limit = limit || 10;
        page = page && page >= 1 ? page : 1;

        const offset = (page - 1) * limit;
        const total = await this.count(entityName, query);

        const results = {
            data: await this.knexClient(entityName)
                .where(query)
                .offset(offset)
                .limit(limit),
            limit,
            page,
            total: total || 0,
        };
        return results;
    }

    public async count(entityName: string, query: object) {
        query = query || {};
        const result = await this.knexClient(entityName)
            .where(query)
            .count("*");
        return result[0]["count(*)"];
    }
}
