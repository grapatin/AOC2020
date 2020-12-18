"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteOutput = void 0;
const fs = require("fs");
class WriteOutput {
    constructor() {
        this.fileName = 'output.txt';
        //Clear out the file
        fs.writeFileSync(this.fileName, '');
    }
    writeArrayOfArray(fullArray) {
        let fullstring = '\n'; //start with an empty line
        fullArray.forEach(row => {
            fullstring += row.join('') + '\n';
        });
        fs.appendFileSync(this.fileName, fullstring);
    }
    writeLine(line) {
        fs.appendFileSync(this.fileName, line + '\n');
    }
}
exports.WriteOutput = WriteOutput;
//# sourceMappingURL=WriteOutput.js.map