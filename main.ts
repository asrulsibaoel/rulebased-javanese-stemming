import { Component, IConfigReader, IInjector, ILogger, Json } from "merapi";

export default class Main extends Component {

    constructor(
        private config: IConfigReader,
        private injector: IInjector,
        ) {
        super();
    }

    public async start(argv: string[]) {
        // const commands = this.config.get<ICommandList>("commands");
    }
}
