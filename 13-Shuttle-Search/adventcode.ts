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

    let inputArray: Array<string> = new Array();
    const regex: RegExp = /\d+|x/gm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<any> = processInput(typeOfData);

    let currentTime: number = +input.shift();

    input = input.filter(elem => !isNaN(+elem))
    let closetsTime = currentTime;
    let bestBuss = 0;
    let cont = true;
    input.forEach(element => {  // 939 
        let i = 1;
        while (cont) {
            if (currentTime <= element * i) {
                let diff = element * i - currentTime
                if (diff < closetsTime) {
                    closetsTime = diff;
                    bestBuss = element;
                }
                cont = false;
            }
            i++;
        }
        cont = true;
    })

    return closetsTime * bestBuss;
}

function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let currentTime: number = +input.shift();

    interface NN {
        nmbr: number,
        n: number,
    }

    let nnArray: Array<NN> = new Array
    input.forEach((element, index) => {
        if (!isNaN(+element)) {
            const nnE: NN = {
                nmbr: +element,
                n: index
            };
            nnArray.push(nnE);
        }
    })

    nnArray.sort((a, b) =>
        b.nmbr - a.nmbr)

    let cont = true;
    let largestValue = nnArray[0].nmbr;
    let largestOffset = nnArray[0].n;
    nnArray.shift();
    let x = 1;

    let i_found = 0;
    while (cont) {
        let value = x * largestValue;
        let cont2 = true;
        let i = 0
        while (cont2) {
            //check if correct number
            let checkValue = nnArray[i].nmbr
            let checkOffset = nnArray[i].n;
            let relativeOffset = checkOffset - largestOffset
            let calc = (value + relativeOffset) % checkValue
            if (calc != 0) {
                //Does not add up lets cont
                cont2 = false;
            }
            else {
                i++
                if ((cont2 == true) && (i == nnArray.length)) {
                    //were are done!
                    return value - largestOffset
                } else {
                    if (i_found < i) {
                        i_found = i;
                    }

                }
            }
        }
        let multiplier = 1
        for (let k = 0; k < i_found; k++) {
            multiplier = multiplier * nnArray[k].nmbr;
        }
        x = x + multiplier;
    }
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
