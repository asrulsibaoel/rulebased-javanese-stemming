import CorpusRepo from "components/repos/corpus_repo";
import { IPredict } from "interfaces/interface";
import { Component } from "merapi";
import RemovePrefix from "./remove_prefix";
import RemoveSuffix from "./remove_suffix";
import SpellChecker from "./spell_checker";

export default class Predict extends Component implements IPredict {
    constructor(
        protected removePrefix: RemovePrefix,
        protected removeSuffix: RemoveSuffix,
        protected spellChecker: SpellChecker,
        protected corpusRepo: CorpusRepo,
    ) {
        super();
    }

    /**
     * To predict given word.
     * @param word string of unpredicted word
     */
    public async predictRootWord(word: string): Promise<string> {

        let predictedWord = word;
        let check = await this.isRootWord(predictedWord); // check the word availability
        // console.log(check);
        if (check) {  return predictedWord; } // if the word is already root word

        predictedWord = await this.removePrefix.remove(predictedWord); // remove suffix

        check = await this.isRootWord(predictedWord); // check the word availability
        if (check) {  return predictedWord; } // if the word is already root word

        predictedWord = await this.removeSuffix.remove(predictedWord); // remove prefix

        check = await this.isRootWord(predictedWord); // check the word availability
        if (check) {  return predictedWord; } // if the word is already root word

        // TODO: Predict with spell checker
        const correction = await this.spellChecker.correct(word);
        if (correction === word) {
            return word;
        } else if (typeof correction === "undefined") {
            return word;
        } else {
            return correction;
        }

    }

    /**
     * Check if the word is already root word.
     * @param word string
     */
    private async isRootWord(word: string): Promise<boolean> {

        const checkWord = await this.corpusRepo.find({word});
        console.log(checkWord);
        return (checkWord) ? true : false;
    }
}
