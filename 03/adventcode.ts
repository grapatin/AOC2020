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
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    let temp = rawInput.split('\n');

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let noRows = input.length;
    let noChar = input[0].length;
    let multiply = Math.floor(noRows * 3 / noChar) + 1;

    for (let i = 0; i < noRows; i++) {
        input[i] = input[i].repeat(multiply);
    }

    //Move down 1 and 3 to the rigth
    let x = 0;
    let count = 0;
    for (let i = 0; i < noRows; i++) {
        if (input[i].charAt(x) == '#') {
            count++;
        }
        x = x + 3;
    }

    return count;
}

function partB(typeOfData: string): number {


    let input: Array<string> = processInput(typeOfData);
    let noRows = input.length;
    let noChar = input[0].length;
    let multiply = Math.floor(noRows * 7 / noChar) + 1;

    for (let i = 0; i < noRows; i++) {
        input[i] = input[i].repeat(multiply);
    }

    //Move down 1 and 3 to the rigth
    let x = 0;
    let count = 0;
    for (let i = 0; i < noRows; i++) {
        if (input[i].charAt(x) == '#') {
            count++;
        }
        x = x + 3;
    }

    //Move down 1 and 1 to the rigth
    x = 0;
    let count1 = 0
    for (let i = 0; i < noRows; i++) {
        if (input[i].charAt(x) == '#') {
            count1++;
        }
        x = x + 1;
    }

    //Move down 1 and 5 to the rigth
    x = 0;
    let count2 = 0;
    for (let i = 0; i < noRows; i++) {
        if (input[i].charAt(x) == '#') {
            count2++;
        }
        x = x + 5;
    }

    //Move down 1 and 7 to the rigth
    x = 0;
    let count3 = 0;
    for (let i = 0; i < noRows; i++) {
        if (input[i].charAt(x) == '#') {
            count3++;
        }
        x = x + 7;
    }

    //Move down 2 and 1 to the rigth
    x = 0;
    let count4 = 0;
    for (let i = 0; i < noRows; i = i + 2) {
        if (input[i].charAt(x) == '#') {
            count4++;
        }
        x = x + 1;
    }

    count = count * count1 * count2 * count3 * count4

    return count;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA'); //Answer is between 267592 and 270165
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB');
    console.log('Puzzle part 2 solution is', resultPart2);


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
