import { Component, IConfigReader, IInjector, ILogger, Json } from "merapi";

export default class Main extends Component {

    constructor(
        private config: IConfigReader,
        private injector: IInjector,
        private logger: ILogger,
        ) {
        super();
    }

    public async start(argv: string[]) {
        this.logger.info("Starting Javanese Stemmer...");
    }
}
