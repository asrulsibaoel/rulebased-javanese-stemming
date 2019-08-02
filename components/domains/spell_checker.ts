import CorpusRepo from "components/repos/corpus_repo";
import { Component, ILogger } from "merapi";

export default class SpellChecker extends Component {

    private results: string[] = [];
    private WORD_COUNTS: {[key: string]: number} = {};

    constructor(
        protected corpusRepo: CorpusRepo,
        protected logger: ILogger,
    ) {
        super();
    }

    // public async loadWords() {

    //     // const word =
    //     // return;
    // }

    /**
     * Returns the set of all strings 1 edit distance away from the input word.
     *   This consists of all strings that can be created by:
     *   - Adding any one character (from the alphabet) anywhere in the word.
     *   - Removing any one character from the word.
     *   - Transposing (switching) the order of any two adjacent characters in a word.
     *   - Substituting any character in the word with another character.
     * @param word string
     */
    public async editDistance(word: string): Promise<string[]> {
        const words = word.toLowerCase().split("");

        try {
            const corpuses = await this.corpusRepo.getAll();

            for (const wordList of corpuses) {
                this.WORD_COUNTS = Object.assign(this.WORD_COUNTS, { [wordList.word]: 1 });
            }

            this.addCharacter(words);
            this.removeCharacter(words);
            this.transposeCharacter(words);
            this.subtitudeCharacter(words);

            return this.results;
        } catch (error) { console.log(error); }

    }

    public async correct(word: string): Promise<string> {

        // if (word in WORD_COUNTS) {
        //     return word;
        // }

        try {
            let maxCount = 0;
            let correctWord = word;
            let editDistance1Words = await this.editDistance(word);
            let editDistance2Words: string[] = [];

            console.log("isine: ", editDistance1Words);
            for (const distanceWordOne of editDistance1Words) {
                editDistance2Words = editDistance2Words.concat(await this.editDistance(distanceWordOne));
            }

            for (const distanceWordOne of editDistance1Words) {
                // console.log(editDistance1Words[i])

                const checkWordOneAvailability = await this.corpusRepo.find({word: distanceWordOne});
                if (checkWordOneAvailability) {
                    // console.log(distanceWordOne, WORD_COUNTS[distanceWordOne]);
                    if (this.WORD_COUNTS[distanceWordOne] > maxCount) {
                        maxCount = this.WORD_COUNTS[distanceWordOne];
                        correctWord = distanceWordOne;
                    }
                }
            }
            let maxCount2 = 0;
            let correctWord2 = correctWord;

            for (const wordDistanceTwo of editDistance2Words) {
                if (wordDistanceTwo in this.WORD_COUNTS) {
                    console.log(wordDistanceTwo, this.WORD_COUNTS[wordDistanceTwo]);
                    if (this.WORD_COUNTS[wordDistanceTwo] > maxCount2) {
                        maxCount2 = this.WORD_COUNTS[wordDistanceTwo];
                        correctWord2 = wordDistanceTwo;
                    }
                }
            }

            if (word.length < 6) {
                if (maxCount2 > 100 * maxCount) {
                    return correctWord2;
                }
                return correctWord;
            } else {
                if (maxCount2 > 4 * maxCount) {
                    return correctWord2;
                }
                return correctWord;
            }
        } catch (error) {
            this.logger.error(error);
        }

    }

    /**
     * Adding any one character (from the alphabet) anywhere in the word.
     * @param word string
     */
    private addCharacter(word: string[], alphabet: string = "abcdefghijklmnopqrstuvwxyz"): void {

        for (let i = 0; i <= word.length; i++) {
            for (const character of alphabet) {
                const newWord = word.slice();
                newWord.splice(i, 0, character);
                this.results.push(newWord.join(""));
            }
            // for (let j = 0; j < alpabhet.length; j++) {
            //     const newWord = word.slice();
            //     newWord.splice(i, 0, alpabhet[j]);
            //     this.results.push(newWord.join(""));
            // }
        }
    }

    /**
     * Removing any one character from the word.
     * @param word string
     */
    private removeCharacter(word: string[]): void {
        if (word.length > 1) {
            for (let i = 0; i < word.length; i++) {
                const newWord = word.slice();
                newWord.splice(i, 1);
                this.results.push(newWord.join(""));
            }
        }
    }

    /**
     * Transposing (switching) the order of any two adjacent characters in a word.
     * @param word string
     */
    private transposeCharacter(word: string[]): void {
        if (word.length > 1) {
            for (let i = 0; i < word.length - 1; i++) {
                const newWord = word.slice();
                const r = newWord.splice(i, 1);
                newWord.splice(i + 1, 0, r[0]);
                this.results.push(newWord.join(""));
            }
        }
    }

    /**
     * Substituting any character in the word with another character.
     * @param word string
     * @param alphabet string = "abcdefghijklmnopqrstuvwxyz"
     */
    private subtitudeCharacter(word: string[], alphabet: string = "abcdefghijklmnopqrstuvwxyz"): void {
        for (let i = 0; i < word.length; i++) {
            for (const character of alphabet) {
                const newWord = word.slice();
                newWord[i] = character;
                this.results.push(newWord.join(""));
            }
        }
    }
}
