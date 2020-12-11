import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { WriteOutput } from "./WriteOutput";
import { assert } from "console";
import { Assembler } from "./Assembler";

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

export interface CodeBlock {
    command: string;
    value: number;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<string> = new Array();
    const regex: RegExp = /\w{3}|-?\d+/gm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let codeArray: Array<CodeBlock> = new Array;

    while (input.length > 0) {
        let codeBlock: CodeBlock = {
            command: input.shift(),
            value: +input.shift()
        };
        codeArray.push(codeBlock);
    }
    
    let cont = true;
    let instructionPointerMap = new Map;
    let ip = 0;
    let value = 0;
    let accum = 0;
    let count = 0;
    while (cont) {
        let codeBlock = codeArray[ip];
        if (!instructionPointerMap.has(ip)) {
            instructionPointerMap.set(ip, count);
            count += 1;
        } else {
            return accum;
        }
        switch (codeBlock.command) {
            case 'jmp':
                ip = ip + codeBlock.value
                break;
            case 'acc':
                accum += codeBlock.value
                ip++;
                break;
            case 'nop':
                ip++
                break;
            default:
                assert('Unexpected command', codeBlock.command);
                break;
        }
    }

    return 0;
}

export const numberOfRegs = 4;
function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);
    let codeLength = input.length / 2;

    //Change first instruction and cont until return != 0
    for (let i = 0; i < codeLength; i++) {
        let assemblerObj = new Assembler(input);
        if (assemblerObj.codeArray[i].command == 'jmp') {
            assemblerObj.codeArray[i].command = 'nop';

        } else if (assemblerObj.codeArray[i].command == 'nop') {
            assemblerObj.codeArray[i].command = 'jmp'
        }
        let accum = assemblerObj.calc();
        if (accum != 0) {
            assemblerObj.print();
            return accum
        }
    }


    return 0;
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
