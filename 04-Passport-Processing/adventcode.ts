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

    let rawArray = rawInput.split('\n\n');
    let inputArray: Array<Array<string>> = new Array();
    const regex: RegExp = /[a-z]+:[#0-9a-z]+/gm;

    rawArray.forEach(element => {
        let tArray = new Array;
        let temp = element.match(regex);
        temp.forEach(el => {
            tArray.push(el);
        })
        inputArray.push(tArray);
    })


    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);

    let count = 0;
    input.forEach(passport => {
        let _byr = false;
        let _iyr = false;
        let _eyr = false;
        let _hgt = false;
        let _hcl = false;
        let _ecl = false;
        let _pid = false;
        let _cid = false;

        passport.forEach(element => {
            if (element.substr(0, 4) == 'byr:') {
                _byr = true;
            }
            if (element.substr(0, 4) == 'iyr:') {
                _iyr = true;
            }
            if (element.substr(0, 4) == 'eyr:') {
                _eyr = true;
            }
            if (element.substr(0, 4) == 'hgt:') {
                _hgt = true;
            }
            if (element.substr(0, 4) == 'hcl:') {
                _hcl = true;
            }
            if (element.substr(0, 4) == 'ecl:') {
                _ecl = true;
            }
            if (element.substr(0, 4) == 'pid:') {
                _pid = true;
            }
            if (element.substr(0, 4) == 'cid:') {
                _cid = true;
            }
        })
        if (_byr && _iyr && _eyr && _hgt && _hcl && _ecl && _pid) {
            count++;
        }

    })
    return count;
}

function partB(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    const reg_hgt = /hgt:((59|6[0-9]|7[0-6])in|(1[5-8][0-9]|19[0-3])cm)/;
    const reg_byr = /byr:(19[2-8][0-9]|199[0-9]|200[0-2])/;
    const reg_iyr = /iyr:(201[0-9]|2020)/;
    const reg_eyr = /eyr:(202[0-9]|2030)/;
    const reg_hcl = /hcl:#[0-9a-f]{6}$/;
    const reg_pid = /pid:[0-9]{9}$/;
    const reg_ecl = /ecl:(amb|blu|brn|gry|grn|hzl|oth)/;

    let count = 0;
    input.forEach(passport => {
        let _byr = false;
        let _iyr = false;
        let _eyr = false;
        let _hgt = false;
        let _hcl = false;
        let _ecl = false;
        let _pid = false;
        let _cid = false;

        passport.forEach(element => {
            element = element.trim();
            if (reg_byr.test(element)) {
                _byr = true;
            }
            if (reg_iyr.test(element)) {
                _iyr = true;
            }
            if (reg_eyr.test(element)) {
                _eyr = true;
            }
            if (reg_hgt.test(element)) {
                _hgt = true;
            }
            if (reg_hcl.test(element)) {
                _hcl = true;
            }
            if (reg_ecl.test(element)) {
                _ecl = true;
            }
            if (reg_pid.test(element)) {
                _pid = true;
            }
            if (element.substr(0, 4) == 'cid:') {
                _cid = true;
            }
        })
        if (_byr && _iyr && _eyr && _hgt && _hcl && _ecl && _pid) {
            count++;
        }
    })

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
