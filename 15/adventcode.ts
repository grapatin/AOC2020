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

    let inputArray: Array<number> = new Array();
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    let temp = rawInput.split(',')

    temp.forEach(element => {
        inputArray.push(+element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);
    let start = input.length;

    for (let i = start; i < 2020; i++) {
        let previousNumber = input[i - 1];
        let copy = input.slice(0, input.length - 1);
        if (copy.includes(previousNumber)) {
            copy = copy.reverse();
            let reverseIndex = copy.findIndex((element) => element == previousNumber);
            let correctIndex = copy.length - reverseIndex - 1
            input[i] = i - 1 - correctIndex
        } else {
            input[i] = 0;
        }

    }

    return input[2019]
}

function partB(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);
    let start = input.length;
    let previousNumber = input[input.length - 1]
    let numberMap = new Map;
    for (let i = 0; i < input.length; i++) {
        numberMap.set(input[i], i);
    }

    for (let i = start; i < 30000000; i++) {
        if (numberMap.has(previousNumber) {
            let lastIndex = numberMap.get(previousNumber);
            let newNumber = i - lastIndex;
            numberMap.set(newNumber, i);
            previousNumber = newNumber;
        } else {
            numberMap.set(0, i);
            previousNumber = 0;
        }
    }

    return previousNumber;
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
