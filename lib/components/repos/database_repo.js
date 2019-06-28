"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex = require("knex");
const merapi_1 = require("merapi");
const uuid_1 = require("uuid");
class DatabaseRepo extends merapi_1.Component {
    constructor(config) {
        super();
        this.knexClient = knex(config.default("database", {}));
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.knexClient.migrate.latest();
        });
    }
    create(entityName, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = object;
            if (!item.id) {
                item.id = uuid_1.v4();
            }
            yield this.knexClient(entityName).insert(item);
            return item;
        });
    }
    get(entityName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knexClient(entityName)
                .where("id", id)
                .first();
        });
    }
    gets(entityName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knexClient(entityName).where(query);
        });
    }
    update(entityName, id, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = object;
            if (!item.id) {
                item.id = id;
            }
            return yield this.knexClient(entityName)
                .where("id", "=", id)
                .update(object);
        });
    }
    remove(entityName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knexClient(entityName)
                    .where("id", "=", id)
                    .del();
            }
            catch (error) {
                return false;
            }
            return true;
        });
    }
    removeByFilter(entityName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knexClient(entityName)
                    .where(query)
                    .del();
            }
            catch (error) {
                return false;
            }
            return true;
        });
    }
    paginate(entityName, query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query || {};
            limit = limit || 10;
            page = page && page >= 1 ? page : 1;
            const offset = (page - 1) * limit;
            const total = yield this.count(entityName, query);
            const results = {
                data: yield this.knexClient(entityName)
                    .where(query)
                    .offset(offset)
                    .limit(limit),
                limit,
                page,
                total: total || 0,
            };
            return results;
        });
    }
    count(entityName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query || {};
            const result = yield this.knexClient(entityName)
                .where(query)
                .count("*");
            return result[0]["count(*)"];
        });
    }
}
exports.default = DatabaseRepo;
//# sourceMappingURL=database_repo.js.map