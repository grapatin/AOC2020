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

    let inputArray: Array<Array<string>> = new Array();
    const regex: RegExp = /a/;

    let temp = rawInput.split('\n');

    temp.forEach(element => {
        inputArray.push(element.split(''));
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    let writeF = new WriteOutput();

    let _xdMap: Map<number, number>;
    let _2dMap: Map<number, Map<number, number>> = new Map;
    let mainMap: Map<number, Map<number, Map<number, number>>> = new Map;

    let minXCord = 100;
    let maxXCord = -100;
    let minYCord = 100;
    let maxYCord = -100;
    let minZCord = 0;
    let maxZCord = 0;
    input.forEach((_1Dim, yCord) => {
        _xdMap = new Map;
        _1Dim.forEach((energy, xCord) => {
            if (energy == '#') {
                _xdMap.set(xCord, 1);
                if (xCord > maxXCord) {
                    maxXCord = xCord
                }
                if (xCord < minXCord) {
                    minXCord = xCord
                }
            }
        })
        _2dMap.set(yCord, _xdMap);
        if (yCord > maxYCord) {
            maxYCord = yCord
        }
        if (yCord < minYCord) {
            minYCord = yCord
        }
    })

    mainMap.set(0, _2dMap);

    let cordArray: Array<Array<number>> = new Array(26);
    /*  
    --x,0,0 //X,y,z
    --x,0,1
    --x,0,-1
    --x,1,0
    --x,1,1
    --x,1,-1
    --x,-1,0
    x,-1,1
    x,-1,-1
  */
    configDeltaArray();

    let workMap: Map<number, Map<number, Map<number, number>>> = cpMap();

    let newMinZ = minZCord;
    let newMaxZ = maxZCord;

    let newMinY = minYCord;
    let newMaxY = maxYCord;

    let newMinX = minXCord;
    let newMaxX = maxXCord;

    let maxTurn = 6;
    for (let turn = 0; turn < maxTurn; turn++) {
        workMap = cpMap();
        printz0(turn);
        for (let zCord = (minZCord - 1); zCord < (maxZCord + 2); zCord++) {
            let foundAtZ = 0;
            for (let yCord = (minYCord - 1); yCord < (maxYCord + 2); yCord++) {
                for (let xCord = (minXCord - 1); xCord < (maxXCord + 2); xCord++) {
                    let count = 0;
                    for (let delta = 0; delta < 26; delta++) {
                        let deltaZ = zCord + cordArray[delta][0];
                        let deltaY = yCord + cordArray[delta][1];
                        let deltaX = xCord + cordArray[delta][2];
                        if (mainMap.has(deltaZ)) {
                            let tempYMap = mainMap.get(deltaZ);
                            if (tempYMap.has(deltaY)) {
                                let tempXMap = tempYMap.get(deltaY);
                                if (tempXMap.has(deltaX)) {
                                    let value = tempXMap.get(deltaX);
                                    if (value == 1) {
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                    let currentState = 0;
                    if (mainMap.has(zCord)) {
                        let tempYMap = mainMap.get(zCord);
                        if (tempYMap.has(yCord)) {
                            let tempXMap = tempYMap.get(yCord);
                            if (tempXMap.has(xCord)) {
                                currentState = tempXMap.get(xCord);
                            }
                        }
                    }
                    if (currentState == 0) {
                        if (count == 3) {
                            setState(zCord, yCord, xCord, 1, turn);
                        }
                    } else {
                        if ((count == 2) || (count == 3)) {
                            setState(zCord, yCord, xCord, 1, turn);
                        } else {
                            setState(zCord, yCord, xCord, 0, turn);
                        }
                    }
                }
            }
        }
        mainMap = workMap;
        minZCord = newMinZ;
        maxZCord = newMaxZ;
        minYCord = newMinY;
        maxYCord = newMaxY;
        minXCord = newMinX;
        maxXCord = newMaxX;
    }


    function printz0(turn) {
        let line: string = 'Turn: ' + turn + '\n';
        for (let z = minZCord; z < maxZCord + 1; z++) {
            line += 'levelZ=' + z + '\n';
            if (mainMap.has(z)) {
                for (let y = minYCord; y < maxYCord + 1; y++) {
                    let yMap = mainMap.get(z);
                    let xMap = new Map;
                    if (yMap.has(y)) {
                        xMap = yMap.get(y);
                    }
                    for (let x = minXCord; x < maxXCord + 1; x++) {
                        if (xMap.has(x)) {
                            line += xMap.get(x);
                        } else {
                            line += '0'
                        }
                    }
                    line += '\n';
                }
                //console.log('\n', line);
            }
        }
        writeF.writeLine(line);
    }

    function configDeltaArray() {
        cordArray[0] = [-1, 0, 0];
        cordArray[1] = [1, 0, 0];

        cordArray[2] = [0, 0, 1];
        cordArray[3] = [1, 0, 1];
        cordArray[4] = [-1, 0, 1];

        cordArray[5] = [0, 0, -1];
        cordArray[6] = [1, 0, -1];
        cordArray[7] = [-1, 0, -1];

        cordArray[8] = [0, 1, 0];
        cordArray[9] = [1, 1, 0];
        cordArray[10] = [-1, 1, 0];

        cordArray[11] = [0, 1, 1];
        cordArray[12] = [1, 1, 1];
        cordArray[13] = [-1, 1, 1];

        cordArray[14] = [0, 1, -1];
        cordArray[15] = [1, 1, -1];
        cordArray[16] = [-1, 1, -1];

        cordArray[17] = [0, -1, 0];
        cordArray[18] = [1, -1, 0];
        cordArray[19] = [-1, -1, 0];

        cordArray[20] = [0, -1, 1];
        cordArray[21] = [1, -1, 1];
        cordArray[22] = [-1, -1, 1];

        cordArray[23] = [0, -1, -1];
        cordArray[24] = [1, -1, -1];
        cordArray[25] = [-1, -1, -1];
    }

    function setState(zCord, yCord, xCord, state, turn) {
        //console.log('Turn', turn, 'set state=', state, 'at z,y,x', zCord, ',', yCord, ',', xCord)
        if (state == 1) {
            if (zCord < newMinZ) {
                newMinZ = zCord;
            }
            if (zCord > newMaxZ) {
                newMaxZ = zCord;
            }
            if (yCord < newMinY) {
                newMinY = yCord;
            }
            if (yCord > newMaxY) {
                newMaxY = yCord;
            }
            if (xCord < newMinX) {
                newMinX = xCord;
            }
            if (xCord > newMaxX) {
                newMaxX = xCord;
            }
            //console.log('Switch this cord to active', zCord, yCord, xCord)
        }
        if (workMap.has(zCord)) {
            let tempYMap = workMap.get(zCord);
            if (tempYMap.has(yCord)) {
                let tempXMap = tempYMap.get(yCord);
                tempXMap.set(xCord, state);
            } else {
                let tempXMap = new Map;
                tempXMap.set(xCord, state);
                tempYMap.set(yCord, tempXMap);
            }
        } else {
            let tempYMap = new Map;
            let tempXMap = new Map;
            tempXMap.set(xCord, state);
            tempYMap.set(yCord, tempXMap);
            workMap.set(zCord, tempYMap)
        }
    }

    function cpMap() {
        let tempZWorkMap = new Map;
        let tempYWorkMap = new Map;
        let tempXWorkMap = new Map;

        mainMap.forEach((yMap, keyZ) => {
            yMap.forEach((xMap, keyY) => {
                tempXWorkMap = new Map(xMap);
                tempYWorkMap.set(keyY, tempXWorkMap);
            })
            tempZWorkMap.set(keyZ, tempYWorkMap)
            tempYWorkMap = new Map;
        })

        return tempZWorkMap;
    }

    let finalCount = 0;
    mainMap.forEach(yMap => {
        yMap.forEach(xMap => {
            xMap.forEach(state => {
                if (state == 1) {
                    finalCount++;
                }
            })
        })
    })

    return finalCount;
}

function partB(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);
    let writeF = new WriteOutput();

    let _xdMap: Map<number, number>;
    let _2dMap: Map<number, Map<number, number>> = new Map;
    let _3dMap: Map<number, Map<number, Map<number, number>>> = new Map;
    let main4DMap: Map<number, Map<number, Map<number, Map<number, number>>>> = new Map;

    let minXCord = 100;
    let maxXCord = -100;
    let minYCord = 100;
    let maxYCord = -100;

    input.forEach((_1Dim, yCord) => {
        _xdMap = new Map;
        _1Dim.forEach((energy, xCord) => {
            if (energy == '#') {
                _xdMap.set(xCord, 1);
                if (xCord > maxXCord) {
                    maxXCord = xCord
                }
                if (xCord < minXCord) {
                    minXCord = xCord
                }
            }
        })
        _2dMap.set(yCord, _xdMap);
        if (yCord > maxYCord) {
            maxYCord = yCord
        }
        if (yCord < minYCord) {
            minYCord = yCord
        }
    })

    _3dMap.set(0, _2dMap);
    main4DMap.set(0, _3dMap);

    let cordArray: Array<Array<number>> = new Array;
    create4DDeltaArray();

    let workMap: Map<number, Map<number, Map<number, Map<number, number>>>>;

    let maxTurn = 6;
    for (let turn = 0; turn < maxTurn; turn++) {
        workMap = new Map; //start with an empy new map
        print(turn);
        for (let wCord = -6; wCord < 7; wCord++) {
            for (let zCord = -6; zCord < 7; zCord++) {
                for (let yCord = -20; yCord < 20; yCord++) {
                    for (let xCord = -20; xCord < 20; xCord++) {
                        let count = 0;
                        for (let delta = 0; delta < cordArray.length; delta++) {
                            let deltaW = wCord + cordArray[delta][3];
                            let deltaZ = zCord + cordArray[delta][0];
                            let deltaY = yCord + cordArray[delta][1];
                            let deltaX = xCord + cordArray[delta][2];
                            //Find number of activated power stages
                            if (getState(main4DMap, deltaW, deltaZ, deltaY, deltaX)) {
                                count++;
                            }
                        }
                        let currentState = getState(main4DMap, wCord, zCord, yCord, xCord);
                        if (currentState == 0) {
                            if (count == 3) {
                                setState(wCord, zCord, yCord, xCord, 1, turn);
                            }
                        } else {
                            if ((count == 2) || (count == 3)) {
                                setState(wCord, zCord, yCord, xCord, 1, turn);
                            } else {
                                setState(wCord, zCord, yCord, xCord, 0, turn);
                            }
                        }
                    }
                }
            }
        }
        main4DMap = workMap;
    }


    function print(turn) {
        let line: string = 'Turn: ' + turn + '\n';
        for (let z = -6; z < 7 + 1; z++) {
            line += 'levelZ=' + z + '\n';
            if (main4DMap.has(z)) {
                for (let y = -20; y < 20; y++) {
                    let yMap = main4DMap.get(z);
                    let xMap = new Map;
                    if (yMap.has(y)) {
                        xMap = yMap.get(y);
                    }
                    for (let x = -20; x < 20; x++) {
                        if (xMap.has(x)) {
                            line += xMap.get(x);
                        } else {
                            line += '0'
                        }
                    }
                    line += '\n';
                }
                //console.log('\n', line);
            }
        }
        writeF.writeLine(line);
    }

    function create4DDeltaArray() {
        for (let w = -1; w < 2; w++) {
            for (let z = -1; z < 2; z++) {
                for (let y = -1; y < 2; y++) {
                    for (let x = -1; x < 2; x++) {
                        if ((w == 0) && (z == 0) && (y == 0) && (x == 0)) {
                            //skip this one since it is origo
                        } else {
                            cordArray.push([x, y, z, w]);
                        }
                    }
                }
            }
        }
    }

    function setState(wCord, zCord, yCord, xCord, state, turn) {
        //console.log('Turn', turn, 'set state=', state, 'at z,y,x', zCord, ',', yCord, ',', xCord)

        if (state == 1) {
            if (workMap.has(wCord)) {
                let _3dMap = workMap.get(wCord);
                if (_3dMap.has(zCord)) {
                    let tempYMap = _3dMap.get(zCord);
                    if (tempYMap.has(yCord)) {
                        let tempXMap = tempYMap.get(yCord);
                        tempXMap.set(xCord, state);
                    } else {
                        let tempXMap = new Map;
                        tempXMap.set(xCord, state);
                        tempYMap.set(yCord, tempXMap);
                    }
                } else {
                    let tempYMap = new Map;
                    let tempXMap = new Map;
                    tempXMap.set(xCord, state);
                    tempYMap.set(yCord, tempXMap);
                    _3dMap.set(zCord, tempYMap);
                }
            } else {
                let tempYMap = new Map;
                let tempXMap = new Map;
                let _3dMap = new Map;
                tempXMap.set(xCord, state);
                tempYMap.set(yCord, tempXMap);
                _3dMap.set(zCord, tempYMap);
                workMap.set(wCord, _3dMap);
            }
        }
    }

    function getState(_4dMap, wCord, zCord, yCord, xCord): number {
        let value = 0;
        if (_4dMap.has(wCord)) {
            let tempZMap = _4dMap.get(wCord);
            if (tempZMap.has(zCord)) {
                let tempYMap = tempZMap.get(zCord);
                if (tempYMap.has(yCord)) {
                    let tempXMap = tempYMap.get(yCord);
                    if (tempXMap.has(xCord)) {
                        value = tempXMap.get(xCord);
                    }
                }
            }
        }
        return value;
    }

    function cpMap(_4dMap) {
        let tempWWorkMap = new Map;
        let tempZWorkMap = new Map;
        let tempYWorkMap = new Map;
        let tempXWorkMap

        _4dMap.forEach((_3dMap, keyW) => {
            _3dMap.forEach((_2dMap, keyZ) => {
                _2dMap.forEach((_1dMap, keyY) => {
                    tempXWorkMap = new Map(_1dMap);
                    tempYWorkMap.set(keyY, tempXWorkMap);
                });
                tempZWorkMap.set(keyZ, tempYWorkMap);
                tempYWorkMap = new Map;
            })
            tempWWorkMap.set(keyW, tempZWorkMap);
            tempZWorkMap = new Map
        });

        return tempWWorkMap;
    }

    let finalCount = 0;
    main4DMap.forEach(_3DMap => {
        _3DMap.forEach(yMap => {
            yMap.forEach(xMap => {
                xMap.forEach(state => {
                    if (state == 1) {
                        finalCount++;
                    }
                })
            })
        })
    })

    return finalCount;
}

function main() {
    TestsForPart1();
    let timeStart: number = Date.now();
    let resultPart1 = partA('PartA');
    let diff: number = Date.now() - timeStart
    console.log('Puzzle part 1 solution is', resultPart1, 'calculated in', diff, 'ms');

    TestsForPart2();
    timeStart = Date.now();
    let resultPart2 = partB('PartB');
    diff = Date.now() - timeStart;
    console.log('Puzzle part 2 solution is', resultPart2, 'calculated in', diff, 'ms');

    function TestsForPart2() {
        for (let i = 0; i < puzzle2_number_of_test; i++) {
            let timeStart: number = Date.now();
            let testCalc = partB('T2_' + i);
            let diff: number = Date.now() - timeStart
            if (testCalc == puzzle2_resultex[i]) {
                console.log('Puzzle part 2 example', i, 'passed in', diff, 'ms');
            } else {
                console.log('Puzzle part 2 example', i, 'failed got', testCalc, 'expected', puzzle2_resultex[i]);
            }
        }
    }

    function TestsForPart1() {
        for (let i = 0; i < puzzle1_number_of_test; i++) {
            let timeStart: number = Date.now();
            let testCalc = partA('T1_' + i);
            let diff: number = Date.now() - timeStart
            if (testCalc == puzzle1_resultex[i]) {
                console.log('Puzzle part 1 example', i, 'passed', diff, 'ms');
            } else {
                console.log('Puzzle part 1 example', i, 'failed got', testCalc, 'expected', puzzle1_resultex[i]);
            }
        }
    }
}
main();
