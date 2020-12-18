import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { off } from "process";
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

interface calcInterface {
    pos: number,
    result: number
}

function calc(pos: number, expression: string): calcInterface {
    let value1: number = -1;
    let value2: number = -1;
    let operator: string;
    for (let i = pos; i < expression.length; i++) {
        let char = expression[i]
        switch (char) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (value1 < 0) {
                    value1 = +char
                }
                else {
                    value2 = +char;
                    if (operator == '+') {
                        value1 = value1 + value2;
                    } else if (operator == '*') {
                        value1 = value1 * value2;
                    }
                }
                break;
            case '+':
            case '*':
                operator = char;
                break;
            case '(':
                let answer: calcInterface;
                answer = calc(i + 1, expression)
                i = answer.pos
                if (value1 < 0) {
                    value1 = answer.result
                } else {
                    value2 = answer.result;
                    if (operator == '+') {
                        value1 = value1 + value2;
                    } else if (operator == '*') {
                        value1 = value1 * value2;
                    } else {
                        console.log('Unexpected operator', operator)
                    }
                }
                break;
            case ')':
                return {
                    pos: i,
                    result: value1
                }
                break;
            case ' ':
                break;
            default:
                console.log('Unxexpect char', char);
                break;
        }
    }


    return {
        pos: 0,
        result: value1
    }

}

function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let sum = 0;
    input.forEach(row => {
        sum = sum + calc(0, row).result;
    })

    return sum;
}

function addPar(row: string): string {
    let i = 0;
    let newString: string = '';
    while (i < row.length) {
        let char = row[i];
        let charBefore = row[i - 2];
        let charAfter = row[i + 2];
        if (char == '+') {
            //find where to put (
            //if a numberor put it before ex 5 +  => (5 +
            if (!(charBefore == ')')) {
                newString = row.slice(0, i - 2);
                newString = newString + '(' + row.slice(i - 2);
                i++;
            } else {
                //if a ) place it before matching ( ex (5 * 6) +  -> ((5 * 6) +
                //find matching paranteses pos
                let pos = i - 1;
                let direction = -1;
                pos = findParam(pos, direction);
                i++;
            }
            row = newString;
            //find where to )
            //if a numberor put it after ex + 5 => + 5)
            if (!(charAfter == '(')) {
                newString = row.slice(0, i + 3) + ')' + row.slice(i + 3)
                i++;
            } else {
                //if a ( place it after matching ( ex + (5 * 6)   ->  + (5 * 6))
                let pos = i + 1;
                let direction = 1;
                pos = findParam(i, direction);
                i++;
            }
            row = newString;
        }
        i++
    }
    return row;

    function findParam(pos: number, direction: number) {
        let found = false;
        let paranFound = 0;
        if (direction < 0) {
            while (!found) {
                let currentChar = row[pos];
                switch (currentChar) {
                    case ')':
                        paranFound++;
                        break;
                    case '(':
                        paranFound--;
                        if (paranFound == 0) {
                            //correct paran found, insert (
                            newString = row.slice(0, pos) + '(' + row.slice(pos);
                            found = true;
                        }
                        break;
                }
                pos = pos + direction;
            }
        } else {
            while (!found) {
                let currentChar = row[pos];
                switch (currentChar) {
                    case '(':
                        paranFound++;
                        break;
                    case ')':
                        paranFound--;
                        if (paranFound == 0) {
                            //correct paran found, insert )
                            newString = row.slice(0, pos) + ')' + row.slice(pos);
                            found = true;
                        }
                        break;
                }
                pos = pos + direction;
            }
        }
        return pos;
    }
}

function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let sum = 0;
    //idea add () around + operator

    input.forEach((row, index) => {
        let newString = addPar(row);
        let d = calc(0, newString);
        //console.log('string:', index, newString, 'Value:', d.result);
        sum = sum + calc(0, newString).result;
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
