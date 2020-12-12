import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import * as mathjs from 'mathjs'
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
    const regex: RegExp = /a/;

    let temp = rawInput.split('\n');

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let posX = 0;
    let posY = 0;

    let currentDirectionX = 1;
    let currentDirectionY = 0;

    input.forEach(direction => {
        let char = direction[0];
        let distance: number = +direction.substr(1);
        switch (char) {
            case 'F':
                posX = posX + currentDirectionX * distance;
                posY = posY + currentDirectionY * distance;
                break;
            case 'N':
                posY = posY + distance;
                break;
            case 'S':
                posY = posY - distance;
                break;
            case 'E':
                posX = posX + distance;
                break;
            case 'W':
                posX = posX - distance;
                break;
            case 'R':
                switch (distance) {
                    case 0:
                        break;
                    case 90:
                        rotate90();
                        break;
                    case 180:
                        rotate180();
                        break;
                    case 270:
                        rotateM90();
                        break;
                }
                break;
            case 'L':
                switch (distance) {
                    case 0:
                        break;
                    case 90:
                        rotateM90();
                        break;
                    case 180:
                        rotate180();
                        break;
                    case 270:
                        rotate90();
                        break;
                }
                break;
        }

        function rotate90() {
            let a = mathjs.complex(currentDirectionX, currentDirectionY)     // Complex 2 + 3i
            a = mathjs.multiply(a, mathjs.complex(0, -1));
            currentDirectionX = mathjs.re(a);
            currentDirectionY = mathjs.im(a);
        }

        function rotateM90() {
            let a = mathjs.complex(currentDirectionX, currentDirectionY)     // Complex 2 + 3i
            a = mathjs.multiply(a, mathjs.complex(0, 1));
            currentDirectionX = mathjs.re(a);
            currentDirectionY = mathjs.im(a);
        }
        function rotate180() {
            currentDirectionY = currentDirectionY * -1;
            currentDirectionX = currentDirectionX * -1;
        }
    })

    return Math.abs(posX) + Math.abs(posY);
}

function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let posX = 0;
    let posY = 0;

    let wayPointX_delta = 10;
    let wayPointY_delta = 1;

    input.forEach(direction => {
        let char = direction[0];
        let distance: number = +direction.substr(1);
        switch (char) {
            case 'F':
                posX = posX + wayPointX_delta * distance;
                posY = posY + wayPointY_delta * distance;
                break;
            case 'N':
                wayPointY_delta = wayPointY_delta + distance;
                break;
            case 'S':
                wayPointY_delta = wayPointY_delta - distance;
                break;
            case 'E':
                wayPointX_delta = wayPointX_delta + distance;
                break;
            case 'W':
                wayPointX_delta = wayPointX_delta - distance;
                break;
            case 'R':
                switch (distance) {
                    case 0:
                        break;
                    case 90:
                        rotate90();
                        break;
                    case 180:
                        rotate180();
                        break;
                    case 270:
                        rotateM90();
                        break;
                }
                break;
            case 'L':
                switch (distance) {
                    case 0:
                        break;
                    case 90:
                        rotateM90();
                        break;
                    case 180:
                        rotate180();
                        break;
                    case 270:
                        rotate90();
                        break;
                }
                break;
        }

        function rotate90() {
            let a = mathjs.complex(wayPointX_delta, wayPointY_delta)     // Complex 2 + 3i
            a = mathjs.multiply(a, mathjs.complex(0, -1));
            wayPointX_delta = mathjs.re(a);
            wayPointY_delta = mathjs.im(a);
        }

        function rotateM90() {
            let a = mathjs.complex(wayPointX_delta, wayPointY_delta)     // Complex 2 + 3i
            a = mathjs.multiply(a, mathjs.complex(0, 1));
            wayPointX_delta = mathjs.re(a);
            wayPointY_delta = mathjs.im(a);
        }
        function rotate180() {
            wayPointY_delta = wayPointY_delta * -1;
            wayPointX_delta = wayPointX_delta * -1;
        }
    })

    return Math.abs(posX) + Math.abs(posY);
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
