import { IConfix } from "interfaces/interface";
import { IConfigReader, ILogger } from "merapi";
import DatabaseRepo from "./database_repo";

export default class ConfixRepo
    extends DatabaseRepo<IConfix> {

    constructor(protected config: IConfigReader, protected logger: ILogger) {
        super(config);
        this.entityName = "confixes";
    }

    public async find(where: object): Promise<IConfix> {
        try {
            return await this.knexClient(this.entityName)
                .where(where).first();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async getAllWord(): Promise<IConfix[]> {
        try {
            return await this.knexClient(this.entityName);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
