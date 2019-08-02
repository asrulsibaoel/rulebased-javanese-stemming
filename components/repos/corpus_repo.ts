import { IWord } from "interfaces/interface";
import { ICorpusRepo } from "interfaces/repos";
import { IConfigReader, ILogger } from "merapi";
import DatabaseRepo from "./database_repo";

export default class CorpusRepo
    extends DatabaseRepo<IWord>
    implements ICorpusRepo {

    constructor(protected config: IConfigReader, protected logger: ILogger) {
        super(config);
        this.entityName = "words";
    }

    public async find(where: object): Promise<IWord> {
        try {
            return await this.knexClient(this.entityName)
                .where(where).first();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    public async getAll(): Promise<IWord[]> {
        try {
            return await this.knexClient(this.entityName);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
