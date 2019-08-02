import CorpusRepo from "components/repos/corpus_repo";
import SuffixRepo from "components/repos/suffix_repo";
import { ISuffix } from "interfaces/interface";
import { Component, ILogger } from "merapi";

export default class RemoveSuffix extends Component {

    protected suffixes: ISuffix[];
    protected suffixKey: ISuffix;
    constructor(
        protected suffixRepo: SuffixRepo,
        protected corpusRepo: CorpusRepo,
        protected logger: ILogger,
    ) {
        super();
    }

    public async remove(word: string): Promise<string> {
        let removedWord: string = word;
        this.suffixes = await this.suffixRepo.getAll();

        const checkSuffix = await this.hasSuffix(word);
        try {
            if (checkSuffix) {
                const countSuffix = this.suffixKey.suffix.length;
                const rules = JSON.parse(this.suffixKey.rules);
                if (rules.hasOwnProperty("nasalization")) {
                    for (const nasalization of rules.nasalization) {
                        removedWord = word.substring(0, word.length - countSuffix); // remove prefix.
                        removedWord = removedWord + nasalization;

                        // check availability in DB
                        const availableWord = await this.corpusRepo.find({ word: removedWord});
                        if (availableWord) {
                            removedWord = availableWord.word;
                            return removedWord;
                        }

                        return word; // if not found, assumes that the word is already the root word.
                    }

                }
                removedWord = word.substring(0, word.length - countSuffix); // remove prefix.

                return removedWord;
            }
            return removedWord;
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Check the word has suffix
     * @param word string
     */
    public async hasSuffix(word: string): Promise<boolean> {
        let returnVal = false;
        try {
            returnVal = this.suffixes.some((arr) => {
                if (word.endsWith(arr.suffix)) {
                    this.suffixKey = arr;
                    return true;
                }
            });
        } catch (error) {
            this.logger.error(error);
        }
        return returnVal;
    }
}
