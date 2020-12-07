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
    const regex: RegExp = /a/;

    let temp = rawInput.split('\n');


    temp.forEach(element => {
        let innerA = element.split('bag')

        inputArray.push(innerA);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);

    //Add everything to a Map where containing color is key and those that have it are values
    let containingMap = new Map
    input.forEach(inputRow => {
        //Only add it if it has cointaing colors
        if (inputRow.length > 1) {
            for (let i = 1; i < inputRow.length; i++) {
                let currentCNumber: Array<string> = inputRow[i].match(/\d/); //Get the number
                let currentC: Array<string> = inputRow[i].match(/[ a-z]+$/);
                if (+currentCNumber > 0) {

                    let key = currentC[0].trim()
                    let value = inputRow[0].trim();
                    if (value == key) {
                        console.log('break');
                    }
                    if (containingMap.has(key)) {
                        let newValue: Array<string> = containingMap.get(key);
                        newValue.push(value);
                        containingMap.set(key, newValue)
                    } else {
                        let bagArray: Array<string> = new Array;
                        bagArray.push(value);
                        containingMap.set(key, bagArray);
                    }
                }
            }

        }
    })

    let cont = true;
    let findBag = 'shiny gold';
    let alreadyFoundBagsMap = new Map;

    return rBag(findBag) - 1;

    function rBag(findBag): number {
        let count = 1;

        if (containingMap.has(findBag)) {
            let bagArray = containingMap.get(findBag);
            bagArray.forEach(bag => {
                if (!alreadyFoundBagsMap.has(bag)) {
                    alreadyFoundBagsMap.set(bag, 1);
                    count += rBag(bag);
                }
            });
        }
        return count
    }
}

function partB(typeOfData: string): number {
    interface intBag {
        color: string
        count: number
    }
    let input: Array<Array<string>> = processInput(typeOfData);

    //Add everything to a Map where bag color is the key and containg bags are values
    let containingMap = new Map
    input.forEach(inputRow => {
        for (let i = 1; i < inputRow.length; i++) {
            let currentCNumber: Array<string> = inputRow[i].match(/\d/); //Get the number
            let currentC: Array<string> = inputRow[i].match(/[ a-z]+$/);
            if (+currentCNumber > 0) {
                let value = currentC[0].trim()
                let valueCount = +currentCNumber;
                let key = inputRow[0].trim();
                let newBag: intBag = {
                    color: value,
                    count: valueCount
                };
                if (containingMap.has(key)) {
                    let newValue: Array<intBag> = containingMap.get(key);
                    newValue.push(newBag);
                    containingMap.set(key, newValue)
                } else {
                    let bagArray: Array<intBag> = new Array;
                    bagArray.push(newBag);
                    containingMap.set(key, bagArray);
                }
            }
        }
    })

    let findBag = 'shiny gold';

    return rBag(findBag) - 1;

    function rBag(findBag): number {
        let count = 1;

        if (containingMap.has(findBag)) {
            let bagArray: Array<intBag> = containingMap.get(findBag);
            bagArray.forEach(bag => {
                count += rBag(bag.color) * bag.count;
            });
        }
        return count
    }
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
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
