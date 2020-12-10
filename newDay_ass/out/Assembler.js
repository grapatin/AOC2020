"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
const fs = require("fs");
const console_1 = require("console");
const adventcode_1 = require("./adventcode");
class Assembler {
    constructor(input) {
        this.codeArray = new Array;
        this.ip = 0;
        this.accum = 0;
        this.regArray = new Array(adventcode_1.numberOfRegs).fill(0);
        this.instructionHistory = new Array;
        let copyInput = input.slice();
        while (copyInput.length > 0) {
            let codeBlock = {
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
            }
            else {
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
                    console_1.assert('Unexpected command', codeBlock.command);
                    break;
            }
        }
    }
    print() {
        let fileName = 'output.txt';
        //Clear out the file
        fs.writeFileSync(fileName, '');
        let fullstring = '\n'; //start with an empty line
        this.instructionHistory.forEach(row => {
            fullstring += row + '\n';
        });
        fs.appendFileSync(fileName, fullstring);
    }
}
exports.Assembler = Assembler;
//# sourceMappingURL=Assembler.js.map