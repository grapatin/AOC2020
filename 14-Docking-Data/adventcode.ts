import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { Assembler, Assembler2 } from "./assembler";
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
    mask: string;
    value: number;
    mem: number
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<CodeBlock> = new Array();

    let temp = rawInput.split('\n')

    temp.forEach(element => {
        if (element.startsWith('mask')) {
            const regex: RegExp = /(?<=mask = )[10X]+/;

            let ins: CodeBlock = {
                command: "mask",
                mask: element.match(regex)[0],
                mem: 0,
                value: 0,
            }
            inputArray.push(ins);
        } else {
            const regex: RegExp = /\d+/g;
            let found = element.match(regex);
            let ins: CodeBlock = {
                command: "mem",
                mask: '',
                mem: +found[0],
                value: +found[1],
            }
            inputArray.push(ins);
        }
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<CodeBlock> = processInput(typeOfData);

    let code = new Assembler(input);

    code.calc();

    return code.memDump();
}

function partB(typeOfData: string): number {
    let input: Array<CodeBlock> = processInput(typeOfData);

    let code = new Assembler2(input);

    code.calc();

    return code.memDump();
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
