import { Component } from "merapi";

export default class Train extends Component {
    constructor() {
        super();
    }

    public async trainRoot(word: string): Promise<boolean> {
        return true;
    }

    public async checkAvailability(word: string): Promise<boolean> {
        return false;
    }
}
