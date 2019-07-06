import { Component } from "merapi";

export default class Train extends Component {
    constructor() {
        super();
    }

    public async trainRoot(word: string): Promise<boolean> {
        return true;
    }

    public async checkAvailability(): Promise<boolean> {
        return false;
    }
}
