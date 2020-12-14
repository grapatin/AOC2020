import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
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


    let rows = rawInput.split('\n');

    rows.forEach(row => {
        let charArray: Array<string> = new Array();
        charArray = row.split('');
        inputArray.push(charArray);
    })

    return inputArray;
}

class waitingArea {
    waiting: Array<Array<string>>;
    tempWaiting: Array<Array<string>>;
    constructor(forest) {
        this.waiting = forest;
    }
    xSurround = [-1, -1, -1, 0, 1, 1, 1, 0]; //(left side first, top, rigth, down)
    ySurround = [1, 0, -1, -1, -1, 0, 1, 1]; //(left side first, top, rigth, down)
    grow() {
        //Create local copy of forest
        this.tempWaiting = this.waiting.map(function (row) {
            return row.slice();
        });

        //. = open
        //L = empty chair
        //# = lumberyard
        for (let y = 0; y < this.waiting.length; y++) {
            let row = this.waiting[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.waiting[y][x];
                let numberOfEmpty = 0;
                let numberOfOccupied = 0;

                this.xSurround.forEach((xDelta, index) => {
                    let yDelta = this.ySurround[index];
                    let xTemp = x + xDelta;
                    let yTemp = y + yDelta;
                    if ((xTemp > -1) && (yTemp > -1) && (xTemp < row.length) && (yTemp < this.waiting.length)) {
                        let checkChar = this.waiting[yTemp][xTemp];
                        switch (checkChar) {
                            case '.':
                                //open area
                                break;
                            case 'L':
                                numberOfEmpty++;
                                break;
                            case '#':
                                numberOfOccupied++;
                                break;
                            default:
                                console.log('Unexpected checkChar', checkChar);
                                break;
                        }
                    }
                });
                switch (char) {
                    case 'L':
                        if (numberOfOccupied == 0) {
                            this.tempWaiting[y][x] = '#';
                        }
                        break;
                    case '#':
                        if (numberOfOccupied > 3) {
                            this.tempWaiting[y][x] = 'L';
                        }
                        break;
                    case '.':
                        break;
                    default:
                        console.log('Unexpected char', char);
                        break;
                }
            }
        }
        this.waiting = this.tempWaiting;
        //An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.
    }

    printForest() {
        writeFile.writeArrayOfArray(this.waiting);
    }
    countScore(): number {
        let numberOfOccupied = 0;
        let numberOfOpen = 0;
        let numberOfLumber = 0;
        for (let y = 0; y < this.waiting.length; y++) {
            let row = this.waiting[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.waiting[y][x];
                switch (char) {
                    case '#':
                        numberOfOccupied++;
                        break;
                }
            }
        }
        return numberOfOccupied;
    }
}

class waitingAreaB {
    waiting: Array<Array<string>>;
    tempWaiting: Array<Array<string>>;
    constructor(forest) {
        this.waiting = forest;
    }
    xSurround = [-1, -1, -1, 0, 1, 1, 1, 0]; //(left side first, top, rigth, down)
    ySurround = [1, 0, -1, -1, -1, 0, 1, 1]; //(left side first, top, rigth, down)
    grow() {
        //Create local copy of forest
        this.tempWaiting = this.waiting.map(function (row) {
            return row.slice();
        });

        //. = open
        //L = empty chair
        //# = Occupied seat
        for (let y = 0; y < this.waiting.length; y++) {
            let row = this.waiting[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.waiting[y][x];
                let numberOfEmpty = 0;
                let numberOfOccupied = 0;

                this.xSurround.forEach((xDelta, index) => {
                    let yDelta = this.ySurround[index];
                    let xTemp = x + xDelta;
                    let yTemp = y + yDelta;
                    if ((xTemp > -1) && (yTemp > -1) && (xTemp < row.length) && (yTemp < this.waiting.length)) {
                        let checkChar = this.waiting[yTemp][xTemp];
                        switch (checkChar) {
                            case '.':
                                //open area
                                //We need to check until we reach outside or find a seat
                                //We are looking in a direction
                                for (let i = 1; i < 100000; i++) {
                                    let xTemp2 = x + xDelta * i;
                                    let yTemp2 = y + yDelta * i;
                                    if ((xTemp2 < 0) || (xTemp2 > row.length - 1)) {
                                        //abort
                                        i = 100000;
                                    } if (((yTemp2 < 0) || (yTemp2 > this.waiting.length - 1))) {
                                        //abort
                                        i = 100000;
                                    }
                                    else {
                                        let checkChar2 = this.waiting[yTemp2][xTemp2];
                                        switch (checkChar2) {
                                            case 'L':
                                                numberOfEmpty++;
                                                //abort
                                                i = 100000;
                                                break;
                                            case '#':
                                                numberOfOccupied++
                                                //abort
                                                i = 100000;
                                                break;
                                            case '.':
                                                //just continue
                                                break;
                                        }
                                    }

                                }
                                break;
                            case 'L':
                                numberOfEmpty++;
                                break;
                            case '#':
                                numberOfOccupied++;
                                break;
                            default:
                                console.log('Unexpected checkChar', checkChar);
                                break;
                            }
                    }

                });
                switch (char) {
                    case 'L':
                        if (numberOfOccupied == 0) {
                            this.tempWaiting[y][x] = '#';
                        }
                        break;
                    case '#':
                        if (numberOfOccupied > 4) {
                            this.tempWaiting[y][x] = 'L';
                        }
                        break;
                    case '.':
                        break;
                    default:
                        console.log('Unexpected char', char);
                        break;
                }
            }
        }
        this.waiting = this.tempWaiting;
        //An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.
    }

    printForest() {
        writeFile.writeArrayOfArray(this.waiting);
    }
    countScore(): number {
        let numberOfOccupied = 0;
        let numberOfOpen = 0;
        let numberOfLumber = 0;
        for (let y = 0; y < this.waiting.length; y++) {
            let row = this.waiting[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.waiting[y][x];
                switch (char) {
                    case '#':
                        numberOfOccupied++;
                        break;
                }
            }
        }
        return numberOfOccupied;
    }
}

function partA(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);
    const minutes = 100;
    let seatingArea = new waitingArea(input);
    seatingArea.printForest();

    for (let i = 0; i < minutes; i++) {
        seatingArea.grow();
        seatingArea.printForest();
    }

    return seatingArea.countScore();
}

function partB(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);
    const minutes = 100;
    let seatingArea = new waitingAreaB(input);
    seatingArea.printForest();

    for (let i = 0; i < minutes; i++) {
        seatingArea.grow();
        seatingArea.printForest();
    }

    return seatingArea.countScore();
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
            let testCalc = partB('T2_' + i);
            if (testCalc == puzzle2_resultex[i]) {
                console.log('Puzzle part 2 example', i, 'passed');
            } else {
                console.log('Puzzle part 2 example', i, 'failed got', testCalc, 'expected', puzzle2_resultex[i]);
            }
        }
    }

    function TestsForPart1() {
        for (let i = 0; i < puzzle1_number_of_test; i++) {
            let testCalc = partA('T1_' + i);
            if (testCalc == puzzle1_resultex[i]) {
                console.log('Puzzle part 1 example', i, 'passed');
            } else {
                console.log('Puzzle part 1 example', i, 'failed got', testCalc, 'expected', puzzle1_resultex[i]);
            }
        }
    }
}
main();
