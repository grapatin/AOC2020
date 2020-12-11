import * as fs from 'fs';

export class WriteOutput {
    fileName = 'output.txt';
    constructor() {
        //Clear out the file
        fs.writeFileSync(this.fileName, '');
    }

    writeArrayOfArray(fullArray: Array<Array<string>>) {
        let fullstring: string = '\n'; //start with an empty line

        fullArray.forEach(row => {
            fullstring += row.join('') + '\n';
        });
        fs.appendFileSync(this.fileName, fullstring);
    }

    writeLine(line: string) {
        fs.appendFileSync(this.fileName, line + '\n');
    }
}
