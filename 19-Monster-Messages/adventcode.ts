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
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    let temp = rawInput.split('\n\n');


    temp.forEach(element => {
        element = element.split('"').join('');
        inputArray.push(element.split('\n'));
    })

    return inputArray;
}

function substition(rulesRows) {
    let processedRules: Array<string> = new Array;

    let rulesRowsArray = new Array;

    rulesRows.forEach(row => {
        let temp = row.split(' ');
        //Add () around each segment
        let index = temp[0].slice(0, -1);
        temp[0] = '(';
        temp.push(')');
        rulesRowsArray[index] = temp.slice();
    });

    let cont = true;
    while (cont) {
        cont = false
        for (let i = 0; i < rulesRowsArray.length; i++) {
            for (let k = 0; k < rulesRowsArray[i].length; k++) {
                let value = rulesRowsArray[i][k]
                if (!isNaN(value)) {
                    cont = true
                    //its a number lets substitute
                    let toInsert = rulesRowsArray[value];
                    let newArray = new Array;
                    newArray = rulesRowsArray[i].slice(0, k)
                    newArray = newArray.concat(toInsert);
                    newArray = newArray.concat(rulesRowsArray[i].slice(k + 1));
                    rulesRowsArray[i] = newArray
                }
            }
        }
    }

    rulesRowsArray.forEach((element, index) => {
        //drop first and last paratesis
        element.shift();
        element.pop();
        processedRules[index] = element.join('');
    });

    return processedRules
}

function createString(processedRules): Array<string> {
    let finalArray: Array<string> = new Array

    //untangle parantesis
    processedRules.forEach(row => {
        recuriseParaUnlock(row);
    });

    return finalArray


    interface recFunc {
        pos: number;
        stringArray: Array<string>
    }

    function recuriseParaUnlock(row: string): recFunc {
        let tempStrings: Array<string> = new Array;
        tempStrings[0] = '';
        let paracount = 0;
        for (let i = 0; i < row.length; i++) {
            let char = row[i];
            switch (char) {
                case '(':
                    let returnData = recuriseParaUnlock(row.slice(i));
                    i = returnData.pos;
                    let returnArray = returnData.stringArray;
                    let arrayOfStrings;
                    tempStrings.forEach(str => {
                        returnArray.forEach(returnStr => {
                            arrayOfStrings = str + returnStr;
                        })
                    });
                    tempStrings = arrayOfStrings;
                    break;
                case ')':
                    return { pos: i + 1, stringArray: tempStrings }
                    break;
                case '|':
                    break;
                default:
                    //its a char add it
                    tempStrings.forEach(str => {
                        str = str + char;
                    });
                    break;
            }
        }
    }
}


function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    let rulesArray = input[0];
    let receivedMessages = input[1];
    let count = 0;
    let processedRulesValidRegEx = substition(rulesArray);
    //let checkString = createString(processedRules);
    //check rules against receivedMessages
    receivedMessages.forEach(message => {
        let re = new RegExp(processedRulesValidRegEx[0])
        let result = message.match(re);
        if (result != null) {
            if (result[0].length == message.length) {
                count++
            }
        }

    })
    return count;
}

function partB(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    let rulesArray = input[0];
    let receivedMessages = input[1];
    let count = 0;
    let processedRulesValidRegEx = substition(rulesArray);
    //let checkString = createString(processedRules);
    //check rules against receivedMessages
    receivedMessages.forEach(message => {
        let re = new RegExp(processedRulesValidRegEx[0])
        let result = message.match(re);
        if (result != null) {
            if (result[0].length == message.length) {
                count++
            }
        }

    })
    return count;
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
