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
    const regex: RegExp = /h/;

    let temp = rawInput.split('\n');

    temp.forEach(element => {
        inputArray.push(+element);
    })

    return inputArray;
}

function partA(typeOfData: string, preAmble: number): number {
    let input: Array<number> = processInput(typeOfData);

    while (true) {
        let found = false;
        for (let i = 0; i < preAmble; i++) {
            for (let l = 1; l < preAmble; l++) {
                if ((input[i] + input[l]) == input[preAmble]) {
                    found = true;
                }
            }
        }
        if (found) {
            //Value ok proceed
            input.shift();
        } else {
            //value not approved, stop and return
            return input[preAmble];
        }
    }

    return 0;
}

function partB(typeOfData: string, preAmble: number): number {
    let input: Array<number> = processInput(typeOfData);
    let copyArray = input.slice();

    while (true) {
        let found = false;
        for (let i = 0; i < preAmble; i++) {
            for (let l = 1; l < preAmble; l++) {
                if ((input[i] + input[l]) == input[preAmble]) {
                    found = true;
                }
            }
        }
        if (found) {
            //Value ok proceed
            input.shift();
        } else {
            //This value does not match the XMAS protocoll
            const notXMASnumber = input[preAmble];

            //find continues sample of numbers that add upp to the number found
            //stop once larger than foundNumber, it is a hit if same sum
            let currentArray = copyArray.slice();
            while (true) {
                let sum = 0;
                let length = currentArray.length;
                for (let i = 0; i < length; i++) {
                    sum += currentArray[i];
                    if (sum > notXMASnumber) {
                        currentArray.shift();
                        break;
                    } else if (sum == notXMASnumber) {
                        //correct sum found!
                        let numbersInc = currentArray.slice(0, i + 1);
                        let smallest = Math.min(...numbersInc);
                        let largest = Math.max(...numbersInc);
                        return smallest + largest;
                    }
                }
            }
        }
    }

    return 0;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA', 25);
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB', 25);
    console.log('Puzzle part 2 solution is', resultPart2);


    function TestsForPart2() {
        for (let i = 0; i < puzzle2_number_of_test; i++) {
            let testCalc = partB('T2_' + i, 5);
            if (testCalc == puzzle2_resultex[i]) {
                console.log('Puzzle part 2 example', i, 'passed');
            } else {
                console.log('Puzzle part 2 example', i, 'failed got', testCalc, 'expected', puzzle2_resultex[i]);
            }
        }
    }

    function TestsForPart1() {
        for (let i = 0; i < puzzle1_number_of_test; i++) {
            let testCalc = partA('T1_' + i, 5);
            if (testCalc == puzzle1_resultex[i]) {
                console.log('Puzzle part 1 example', i, 'passed');
            } else {
                console.log('Puzzle part 1 example', i, 'failed got', testCalc, 'expected', puzzle1_resultex[i]);
            }
        }
    }
}
main();
