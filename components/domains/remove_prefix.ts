import CorpusRepo from "components/repos/corpus_repo";
import PrefixRepo from "components/repos/prefix_repo";
import { IPrefix } from "interfaces/interface";
import { Component, ILogger } from "merapi";

export default class RemovePrefix extends Component {

    protected prefixes: IPrefix[];
    protected prefixKey: IPrefix;
    constructor(
        protected prefixRepo: PrefixRepo,
        protected corpusRepo: CorpusRepo,
        protected logger: ILogger,
        ) {
        super();
    }

    public async remove(word: string): Promise<string> {

        let removedWord: string = word;
        this.prefixes = await this.prefixRepo.getAll();

        const checkPrefix = await this.hasPrefix(word);
        console.log("prefix", this.prefixKey);
        try {
            if (checkPrefix) {
                const rules = JSON.parse(this.prefixKey.rules);
                if (rules.hasOwnProperty("nasalization")) {
                    for (const nasalization of rules.nasalization) {
                        removedWord = removedWord.replace(this.prefixKey.prefix, nasalization);

                        // check availability in DB
                        const availableWord = await this.corpusRepo.find({ word: removedWord});
                        if (availableWord) {
                            removedWord = availableWord.word;
                            return removedWord;
                        }

                        return word; // if not found, assumes that the word is already the root word.
                    }

                }
                removedWord = word.replace(this.prefixKey.prefix, ""); // remove prefix.

                return removedWord;
            }
            return removedWord;
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Check the word has prefix
     * @param word string
     */
    public async hasPrefix(word: string): Promise<boolean> {
        let returnVal = false;
        try {
            returnVal = this.prefixes.some((arr) => {
                if (word.startsWith(arr.prefix)) {
                    this.prefixKey = arr;
                    return true;
                }
            });
        } catch (error) {
            this.logger.error(error);
        }
        return returnVal;
    }
}
