import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { unzip } from "zlib";
import { createDecipheriv } from "crypto";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

function inputData(typeOfData: string) {
    let returnData: string;
    //load data    
    if (typeOfData.startsWith('T1_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle1_ex[+num];
    }
    if (typeOfData.startsWith('T2_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle2_ex[+num];
    }
    switch (typeOfData) {
        case 'PartA':
        case 'PartB':
            let fileString = fs.readFileSync('./puzzleInput1.txt', 'utf8');
            returnData = fileString;
            //console.log('Puzzle input', returnData);
            break;
        default:
            break;
    }
    return returnData;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<Array<string>> = new Array();
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    let temp = rawInput.split('\n\n');

    temp.forEach(element => {
        let temp = new Array;
        temp = element.split('\n');
        temp.shift();
        inputArray.push(temp);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);

    let player1 = input[0];
    let player2 = input[1];

    let cont = true;
    while (cont) {
        let card1 = player1.shift();
        let card2 = player2.shift();

        if (+card1 > +card2) {
            player1.push(card1)
            player1.push(card2)
        } else {
            player2.push(card2);
            player2.push(card1);
        }
        if ((player1.length == 0) || (player2.length == 0)) {
            cont = false;
            let winner = player1;
            if (player1.length == 0) {
                winner = player2;
            }
            winner.reverse();
            let sum = 0;
            for (let i = 1; i < winner.length + 1; i++) {
                sum += i * +winner[i - 1];
            }

            return sum
        }
    }

    return 0;
}

class Game {
    player1Deck: Array<number>
    player2Deck: Array<number>
    masterDeck: MasterDeck;

    previousgamesstartingrounds: Map<string, number>

    constructor(deck1: Array<number>, deck2: Array<number>, masterDeck) {
        this.masterDeck = masterDeck;
        this.player1Deck = deck1.slice();
        this.player2Deck = deck2.slice();

        this.previousgamesstartingrounds = new Map;
    }

    playAGame(): boolean {
        let cont = true;
        let deck1 = this.player1Deck;
        let deck2 = this.player2Deck;
        while (cont) {
            if (!this.checkForPreviousGame(deck1, deck2)) {
                let card1 = deck1.shift();
                let card2 = deck2.shift();
                let lengthDeck1 = deck1.length;
                let lengthDeck2 = deck2.length;
                if ((card1 <= lengthDeck1) && (card2 <= lengthDeck2)) {
                    //create a recursive game
                    let newDeck1 = deck1.slice(0, card1);
                    let newDeck2 = deck2.slice(0, card2);
                    let newGame = new Game(newDeck1, newDeck2, this.masterDeck);
                    let did1Win = newGame.playAGame();
                    if (did1Win) {
                        //player1 did win
                        deck1.push(card1);
                        deck1.push(card2);
                    } else {
                        //player2 did win
                        deck2.push(card2);
                        deck2.push(card1);
                    }
                } else {
                    //play a normal round
                    if (card1 > card2) {
                        deck1.push(card1)
                        deck1.push(card2)
                    } else {
                        deck2.push(card2);
                        deck2.push(card1);
                    }
                    if ((deck1.length == 0) || (deck2.length == 0)) {
                        cont = false;
                        console.log('Game completed');
                        if (deck1.length == 0) {
                            //player2 won
                            return false;
                        } else {
                            //player1 won
                            return true;
                        }
                    }
                }
            } else {
                return true;
            }
        }
    }

    checkForPreviousGame(deck1, deck2): boolean {
        //caclulate checksum and se if it exists
        let tempDeck = ['-1', ...deck1, '-2', ...deck2]
        let checkString = tempDeck.join(',');
        if (this.previousgamesstartingrounds.has(checkString)) {
            return true
        } else {
            this.previousgamesstartingrounds.set(checkString, 1)
            return false;
        }
    }

}

class MasterDeck {
    player1Deck: Array<number>
    player2Deck: Array<number>

    constructor(player1, player2) {
        this.player1Deck = new Array;
        this.player2Deck = new Array;

        player1.forEach(card => {
            this.player1Deck.push(+card);
        });
        player2.forEach(card => {
            this.player2Deck.push(+card)
        });
    }

    play() {
        let game = new Game(this.player1Deck, this.player2Deck, this)
        let didPlayer1Win = game.playAGame();

        let winner = game.player2Deck;
        //Caclulate score!
        if (didPlayer1Win) {
            winner = game.player1Deck;
        }
        winner.reverse();
        let sum = 0;
        for (let i = 1; i < winner.length + 1; i++) {
            sum += i * winner[i - 1];
        }
        return sum;
    }


}

function partB(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    let masterDeck = new MasterDeck(input[0], input[1]);

    return masterDeck.play();
}

function main() {
    TestsForPart1();
    let timeStart: number = Date.now();
    let resultPart1 = partA('PartA');
    let diff: number = Date.now() - timeStart
    console.log('Puzzle part 1 solution is', resultPart1, 'calculated in', diff, 'ms');

    TestsForPart2();
    timeStart = Date.now();
    let resultPart2 = partB('PartB');
    diff = Date.now() - timeStart;
    console.log('Puzzle part 2 solution is', resultPart2, 'calculated in', diff, 'ms');

    function TestsForPart2() {
        for (let i = 0; i < puzzle2_number_of_test; i++) {
            let timeStart: number = Date.now();
            let testCalc = partB('T2_' + i);
            let diff: number = Date.now() - timeStart
            if (testCalc == puzzle2_resultex[i]) {
                console.log('Puzzle part 2 example', i, 'passed in', diff, 'ms');
            } else {
                console.log('Puzzle part 2 example', i, 'failed got', testCalc, 'expected', puzzle2_resultex[i]);
            }
        }
    }

    function TestsForPart1() {
        for (let i = 0; i < puzzle1_number_of_test; i++) {
            let timeStart: number = Date.now();
            let testCalc = partA('T1_' + i);
            let diff: number = Date.now() - timeStart
            if (testCalc == puzzle1_resultex[i]) {
                console.log('Puzzle part 1 example', i, 'passed', diff, 'ms');
            } else {
                console.log('Puzzle part 1 example', i, 'failed got', testCalc, 'expected', puzzle1_resultex[i]);
            }
        }
    }
}
main();
