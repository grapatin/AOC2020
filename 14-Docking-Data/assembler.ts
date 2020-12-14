import * as fs from 'fs';
import { assert, count } from "console";
import { CodeBlock } from "./adventcode";

export class Assembler {
    codeArray: Array<CodeBlock> = new Array;
    ip = 0;
    accum = 0;
    mask = '';
    memMap = new Map;
    instructionHistory: Array<string> = new Array;

    constructor(input: Array<CodeBlock>) {
        let copyInput = input.slice();
        while (copyInput.length > 0) {
            let codeBlock: CodeBlock = copyInput.shift();
            this.codeArray.push(codeBlock);
        }
    }

    calc() {
        let instructionPointerMap = new Map;
        while (true) {
            if (this.ip > this.codeArray.length - 1) {
                return this.accum;
            }
            let codeBlock = this.codeArray[this.ip];

            this.instructionHistory.push(this.ip + ':' + codeBlock.command + ' ' + codeBlock.value + ' MASK: ' + this.mask + 'MEM ' + codeBlock.mem);
            switch (codeBlock.command) {
                case 'jmp':
                    this.ip = this.ip + codeBlock.value;
                    break;
                case 'acc':
                    this.accum += codeBlock.value;
                    this.ip++;
                    break;
                case 'nop':
                    this.ip++;
                    break;
                case 'mask':
                    this.mask = codeBlock.mask;
                    this.ip++;
                    break;
                case 'mem':
                    let currentValue = 0
                    if (this.memMap.has(codeBlock.mem)) {
                        currentValue = this.memMap.get(codeBlock.mem)
                    }
                    let bMask0 = BigInt('0b' + this.mask.split('X').join('0'));
                    let bMask1 = BigInt('0b' + this.mask.split('X').join('1'));
                    let bCurrentValue = BigInt(codeBlock.value) | bMask0;
                    bCurrentValue = bCurrentValue & bMask1;
                    if (bCurrentValue < 0) {
                        console.log('Negative value detected', currentValue)
                    }
                    this.memMap.set(codeBlock.mem, Number(bCurrentValue));
                    this.ip++;
                    break;
                default:
                    assert('Unexpected command', codeBlock.command);
                    break;
            }
        }
    }

    memDump() {
        let sum = 0;
        this.memMap.forEach(value => {
            sum += value
        })
        return sum;
    }
    print() {
        let fileName = 'output.txt';
        //Clear out the file
        fs.writeFileSync(fileName, '');
        let fullstring: string = '\n'; //start with an empty line

        this.instructionHistory.forEach(row => {
            fullstring += row + '\n';
        });
        fs.appendFileSync(fileName, fullstring);
    }
}

export class Assembler2 {
    codeArray: Array<CodeBlock> = new Array;
    ip = 0;
    accum = 0;
    mask = '';
    memMap = new Map;
    instructionHistory: Array<string> = new Array;

    constructor(input: Array<CodeBlock>) {
        let copyInput = input.slice();
        while (copyInput.length > 0) {
            let codeBlock: CodeBlock = copyInput.shift();
            this.codeArray.push(codeBlock);
        }
    }

    calc() {
        let instructionPointerMap = new Map;
        while (true) {
            if (this.ip > this.codeArray.length - 1) {
                return this.accum;
            }
            let codeBlock = this.codeArray[this.ip];

            this.instructionHistory.push(this.ip + ':' + codeBlock.command + ' ' + codeBlock.value + ' MASK: ' + this.mask + 'MEM ' + codeBlock.mem);
            switch (codeBlock.command) {
                case 'jmp':
                    this.ip = this.ip + codeBlock.value;
                    break;
                case 'acc':
                    this.accum += codeBlock.value;
                    this.ip++;
                    break;
                case 'nop':
                    this.ip++;
                    break;
                case 'mask':
                    this.mask = codeBlock.mask;
                    let countX = this.mask.split('X').length - 1;
                    //console.log('Number of X:', countX);
                    this.ip++;
                    break;
                case 'mem':
                    let memArray: Array<string> = new Array;
                    let _mem: string = codeBlock.mem.toString(2).padStart(36, '0');
                    memArray.push(_mem);
                    for (let i = 0; i < this.mask.length; i++) {
                        if (this.mask[i] == 'X') {
                            let tempArray = memArray.slice();
                            tempArray.forEach((element, index) => {
                                let oneAlt = element.substr(0, i) + '1' + element.substr(i + 1);
                                memArray[index] = oneAlt;
                                memArray.push(element.substr(0, i) + '0' + element.substr(i + 1));
                            });
                        } else if (this.mask[i] == '1') {
                            memArray.forEach((element, index) => {
                                memArray[index] = element.substr(0, i) + '1' + element.substr(i + 1);
                            });
                        }
                    }
                    memArray.forEach(mem => {
                        this.memMap.set(mem, codeBlock.value);
                    })
                    this.ip++;
                    break;
                default:
                    assert('Unexpected command', codeBlock.command);
                    break;
            }
        }
    }

    memDump() {
        let sum = 0;
        this.memMap.forEach(value => {
            sum += value
        })
        return sum;
    }
    print() {
        let fileName = 'output.txt';
        //Clear out the file
        fs.writeFileSync(fileName, '');
        let fullstring: string = '\n'; //start with an empty line

        this.instructionHistory.forEach(row => {
            fullstring += row + '\n';
        });
        fs.appendFileSync(fileName, fullstring);
    }
}
