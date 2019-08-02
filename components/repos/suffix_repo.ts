import { ISuffix } from "interfaces/interface";
import { IConfigReader, ILogger } from "merapi";
import DatabaseRepo from "./database_repo";

export default class SuffixRepo
    extends DatabaseRepo<ISuffix> {

    constructor(protected config: IConfigReader, protected logger: ILogger) {
        super(config);
        this.entityName = "suffixes";
    }

    public async find(where: object): Promise<ISuffix> {
        try {
            return await this.knexClient(this.entityName)
                .where(where);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async getAll(): Promise<ISuffix[]> {
        try {
            return await this.knexClient(this.entityName);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
