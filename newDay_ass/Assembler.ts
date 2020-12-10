import * as fs from 'fs';
import { assert } from "console";
import { CodeBlock, numberOfRegs } from "./adventcode";

export class Assembler {
    codeArray: Array<CodeBlock> = new Array;
    ip = 0;
    accum = 0;
    regArray: Array<number> = new Array(numberOfRegs).fill(0);
    instructionHistory: Array<string> = new Array;

    constructor(input: Array<string>) {
        let copyInput = input.slice();
        while (copyInput.length > 0) {
            let codeBlock: CodeBlock = {
                command: copyInput.shift(),
                value: +copyInput.shift()
            };
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
            /*remove this check if not needed*/
            if (!instructionPointerMap.has(this.ip)) {
                instructionPointerMap.set(this.ip, this.accum);
            } else {
                return this.accum;
            }
            this.instructionHistory.push(this.ip + ':' + codeBlock.command + ' ' + codeBlock.value + ' Acc: ' + this.accum);
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
                case 'futureOP1':
                    this.ip++;
                    break;
                case 'futureOP2':
                    this.ip++;
                    break;
                default:
                    assert('Unexpected command', codeBlock.command);
                    break;
            }
        }
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
