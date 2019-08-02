
import { Id, IPaginated, IRepo } from "interfaces/repos";
import * as knex from "knex";
import { Component, IConfigReader } from "merapi";
import { v4 as uuid } from "uuid";

export default class DatabaseRepo<T> extends Component implements IRepo<T> {
    protected knexClient: knex;
    protected entityName: string;

    constructor(config: IConfigReader) {
        super();
        this.knexClient = knex(config.default("database", {}));
    }

    public async initialize() {
        // await this.knexClient.migrate.latest();
    }

    public async create(object: T): Promise<Id<T>> {
        const item = object as any;
        if (!item.id) {
            item.id = uuid();
        }

        await this.knexClient(this.entityName).insert(item);
        return item;
    }

    public async get( id: string): Promise<Id<T>> {
        return this.knexClient(this.entityName)
            .where("id", id)
            .first();
    }

    public async gets( query?: Partial<T>): Promise<T[]> {
        return this.knexClient(this.entityName).where(query);
    }

    public async update( id: string, object: T): Promise<Id<T>> {
        const item = object as any;
        if (!item.id) {
            item.id = id;
        }

        return await this.knexClient(this.entityName)
            .where("id", id)
            .update(object);
    }

    public async remove( id: string): Promise<boolean> {
        try {
            await this.knexClient(this.entityName)
                .where("id", id)
                .del();
        } catch (error) {
            return false;
        }
        return true;
    }

    public async removeByFilter(
        query: Partial<T>,
    ): Promise<boolean> {
        try {
            await this.knexClient(this.entityName)
                .where(query)
                .del();
        } catch (error) {
            return false;
        }
        return true;
    }

    public async paginate(
        query: Partial<T>,
        page: number,
        limit: number,
    ): Promise<IPaginated<T>> {
        query = query || {};
        limit = limit || 10;
        page = page && page >= 1 ? page : 1;

        const offset = (page - 1) * limit;
        const total = await this.count(query);

        const results = {
            data: await this.knexClient(this.entityName)
                .where(query)
                .offset(offset)
                .limit(limit),
            limit,
            page,
            total: total || 0,
        };
        return results;
    }

    public async count(query: object) {
        query = query || {};
        const result = await this.knexClient(this.entityName)
            .where(query)
            .count("*");
        return result[0]["count(*)"];
    }
}
