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
    const regex: RegExp = /[a-z]+:[#0-9a-z]+/gm;;

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
                let year = +element.substr(4);
                if ((year > 1919) && (year < 2003)) {
                    _byr = true;
                }
            }


            if (element.substr(0, 4) == 'iyr:') {
                let year = +element.substr(4);
                if ((year > 2009) && (year < 2021)) {
                    _iyr = true;
                }
            }
            if (element.substr(0, 4) == 'eyr:') {
                let year = +element.substr(4);
                if ((year > 2019) && (year < 2031)) {
                    _eyr = true;
                }
            }
            if (element.substr(0, 4) == 'hgt:') {
                if (element.includes('cm')) {
                    let height = +element.substr(4, 3);
                    if ((height >= 150) && (height <= 193)) {
                        _hgt = true;
                    }
                } else if (element.includes('in')) {
                    let height = +element.substr(4, 2);
                    if ((height >= 59) && (height <= 76)) {
                        _hgt = true;
                    }
                }
            }

            if (element.substr(0, 4) == 'hcl:') {
                let tempS = element.substr(5);
                if (tempS.length == 6) {
                    let hexCo = parseInt(element.substr(5), 16);
                    if (!Number.isNaN(hexCo)) {
                        _hcl = true;
                    }
                }
            }
            if (element.substr(0, 4) == 'ecl:') {
                let testString = 'amb blu brn gry grn hzl oth'
                let eyeC = element.substr(4);
                if (testString.includes(eyeC))
                    _ecl = true;
            }
            if (element.substr(0, 4) == 'pid:') {
                let __pid = element.substr(4);
                if (__pid.length == 9) {
                    let _nu = +__pid;
                    if (!Number.isNaN(_nu)) {
                        _pid = true;
                    }
                }
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
