import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();
let valuesToIgnore: Array<string> = new Array;

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

    let temp = rawInput.split('\n\n');

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}


function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let regExName = /[a-z ]+:/;
    let regExNumber = /[0-9]+/g;

    let validRanges: Array<Array<any>> = new Array;
    let validRows: Array<string> = input[0].split('\n');
    validRows.forEach(row => {
        let range: Array<any> = new Array;
        let name = row.match(regExName);
        let rangeNumbers = [...row.matchAll(regExNumber)];
        range.push(name[0]);
        for (let i = +rangeNumbers[0]; i < (+rangeNumbers[1] + 1); i++) {
            range.push(i)
        }
        for (let i = +rangeNumbers[2]; i < (+rangeNumbers[3] + 1); i++) {
            range.push(i)
        }
        validRanges.push(range);
    })

    let valuesToCheckAgainst: Array<string> = input[2].split('\n').join(',').split(',');

    let sum = 0;

    valuesToCheckAgainst.shift(); //remove name
    valuesToCheckAgainst.forEach(value => {
        let found = false;
        validRanges.forEach(range => {
            if (range.includes(+value)) {
                found = true
            }
        })
        if (found == false) {
            sum = sum + +value
            valuesToIgnore.push(value)
        }

    })

    return sum;
}
let first = true;
function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let regExName = /[a-z ]+:/;
    let regExNumber = /[0-9]+/g;

    let validRanges: Array<Array<any>> = new Array;
    let validRows: Array<string> = input[0].split('\n');
    validRows.forEach(row => {
        let range: Array<any> = new Array;
        let name = row.match(regExName);
        let rangeNumbers = [...row.matchAll(regExNumber)];
        range.push(name[0]);
        for (let i = +rangeNumbers[0]; i < (+rangeNumbers[1] + 1); i++) {
            range.push(i)
        }
        for (let i = +rangeNumbers[2]; i < (+rangeNumbers[3] + 1); i++) {
            range.push(i)
        }
        validRanges.push(range);
    })

    let nearbyTickets: Array<Array<string>> = new Array;
    let tickets: Array<string> = input[2].split('\n')
    tickets.shift(); //drop title

    tickets.forEach(ticket => {
        let tempA = ticket.split(',');
        //Remove if it contans one of the values to ignore
        if (true) {
            valuesToIgnore.forEach(value => {
                for (var i = 0; i < tempA.length; i++) {
                    if (tempA[i] === value) {
                        tempA.splice(i, 1);
                    }
                }
            })
        }
        nearbyTickets.push(tempA);
    })
    first = false;

    let length = 20
    let sovledFor = 0;
    let PuzzleMap = new Map;

    while (sovledFor < length - 1) {
        for (let ticketFieldCount = 0; ticketFieldCount < length; ticketFieldCount++) {
            let validFields: Array<boolean> = new Array(length).fill(true);
            nearbyTickets.forEach(ticket => {
                validRanges.forEach((range, index) => {
                    if ((range.includes(+ticket[ticketFieldCount])) && (!PuzzleMap.has(index))) {
                    } else {
                        validFields[index] = false;
                    }

                })
            })
            let countValidFields = 0;
            let foundFieldIndex;
            validFields.forEach((value, index) => {
                if (value == true) {
                    countValidFields++;
                    foundFieldIndex = index;
                }
            })
            if (countValidFields == 1) {
                console.log('FieldIndex', foundFieldIndex, 'is Ticket field', ticketFieldCount);
                PuzzleMap.set(foundFieldIndex, ticketFieldCount);
                sovledFor++;
            }
        }
    }
    return 0;
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
