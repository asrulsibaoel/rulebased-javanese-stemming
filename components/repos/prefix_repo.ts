import { IPrefix } from "interfaces/interface";
import { IConfigReader, ILogger } from "merapi";
import DatabaseRepo from "./database_repo";

export default class PrefixRepo
    extends DatabaseRepo<IPrefix> {

    constructor(protected config: IConfigReader, protected logger: ILogger) {
        super(config);
        this.entityName = "prefixes";
    }

    public async find(where: object): Promise<IPrefix> {
        try {
            return await this.knexClient(this.entityName)
                .where(where).first();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async getAll(): Promise<IPrefix[]> {
        try {
            return await this.knexClient(this.entityName);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
