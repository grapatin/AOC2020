import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { setupMaster } from "cluster";
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

    let inputArray: Array<number> = new Array();
    const regex: RegExp = /a/;

    let temp = rawInput.split('\n');

    temp.forEach(element => {
        inputArray.push(+element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);

    input.sort((a, b) => a - b);

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let previousJolts = 0;
    input.push(input[input.length - 1] + 3);
    input.forEach(element => {
        let diff = element - previousJolts;
        switch (diff) {
            case 3:
                count3++;
                break;
            case 2:
                count2++;
                break;
            case 1:
                count1++;
                break;
            default:
                console.log('Unexpected value', element);
                break;
        }
        previousJolts = element;
    })
    return count3 * count1;
}

function partB(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);

    input.sort((a, b) => a - b);

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let cont1Array: Array<number> = new Array;
    let cont1 = 0;
    let previousJolts = 0;
    input.push(input[input.length - 1] + 3);
    input.forEach(element => {
        let diff = element - previousJolts;
        switch (diff) {
            case 3:
                count3++;
                if (cont1 > 1) {
                    cont1Array.push(cont1 + 1);
                }
                cont1 = 0;
                break;
            case 2:
                count2++;
                break;
            case 1:
                count1++;
                cont1++;
                break;
            default:
                console.log('Unexpected value', element);
                break;
        }
        previousJolts = element;
    })

    let sum = 1;

    cont1Array.forEach(element => {
        switch (element) {
            case 3:
                sum = sum * 2;
                break;
            case 4:
                sum = sum * 4;
                break;
            case 5:
                sum = sum * 7
                break;
        }
    })

    return sum;
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
