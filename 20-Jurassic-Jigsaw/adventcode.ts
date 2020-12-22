import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { parse } from "path";
import { checkServerIdentity, TlsOptions } from "tls";
import { ENGINE_METHOD_CIPHERS } from "constants";
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

interface imageTile {
    xyCords: Array<Array<string>>
    _ID: number;
    sideChecksums: Map<number, number>;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<imageTile> = new Array();
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;


    rawInput = rawInput.split('#').join('1').split('.').join('0');
    let temp = rawInput.split('\n\n');

    temp.forEach(_imageTUnprocessed => {
        //First find ID
        let _image: imageTile;
        let tempId: number;
        let rows = _imageTUnprocessed.split('\n');
        let _t = rows[0].slice(5, -1);
        tempId = parseInt(_t);
        rows.shift();
        let xyCords: Array<Array<string>> = new Array;
        rows.forEach(_row => {
            let row: Array<string>;
            row = _row.split('');
            xyCords.push(row)
        })
        //calculate checksums
        let sideChecksums = new Map;
        let topString = xyCords[0].join('');
        let temp = xyCords[9].slice();
        let bottomString = temp.reverse().join('');
        let leftString = '', rigthString = '';
        for (let i = 0; i < 10; i++) {
            leftString += xyCords[9 - i][0];
            rigthString += xyCords[i][9];
        }
        sideChecksums.set(parseInt(topString, 2), 0);
        sideChecksums.set(parseInt(rigthString, 2), 1);
        sideChecksums.set(parseInt(bottomString, 2), 2);
        sideChecksums.set(parseInt(leftString, 2), 3);
        //Now reverse all strings
        topString = topString.split('').reverse().join('');
        rigthString = rigthString.split('').reverse().join('');
        bottomString = bottomString.split('').reverse().join('');
        leftString = leftString.split('').reverse().join('');
        sideChecksums.set(parseInt(topString, 2), 4);
        sideChecksums.set(parseInt(rigthString, 2), 5);
        sideChecksums.set(parseInt(bottomString, 2), 6);
        sideChecksums.set(parseInt(leftString, 2), 7);
        _image = {
            xyCords: xyCords,
            _ID: tempId,
            sideChecksums: sideChecksums
        }
        inputArray.push(_image);
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let imageTiles: Array<imageTile> = processInput(typeOfData);

    let checkSums = new Map;
    imageTiles.forEach(tile => {
        tile.sideChecksums.forEach((value, key) => {
            if (checkSums.has(key)) {
                let count = checkSums.get(key);
                checkSums.set(key, ++count);
            } else {
                checkSums.set(key, 1);
            }
        })
    })

    let sum = 1;
    imageTiles.forEach(tile => {
        let singleCheckSum = 0;
        tile.sideChecksums.forEach((value, key) => {
            let count = checkSums.get(key);
            if (count == 1) {
                singleCheckSum++;
            }
        })
        if (singleCheckSum > 2) {
            //console.log('Possible Q:', tile._ID);
            sum = sum * tile._ID;
        }
    })

    return sum;
}

class ImageTile {
    _image: Image;
    _xyCords: Array<Array<string>>
    _ID: number;
    _sideChecksums: Map<number, number>;
    _normalRotationChecksum: Map<number, number>;
    _flippedRotationChecksum: Map<number, number>;
    _rotation = 0;
    _flipped = false;
    _up: ImageTile;
    _right: ImageTile;
    _down: ImageTile;
    _left: ImageTile;
    _UPConst = 0;
    _RIGTHConst = 1;
    _DOWNConst = 2;
    _LEFTConst = 3;

    constructor(tile: imageTile, image: Image) {
        this._image = image;
        this._normalRotationChecksum = new Map;
        this._flippedRotationChecksum = new Map;
        this._xyCords = tile.xyCords;
        this._ID = tile._ID
        this._sideChecksums = tile.sideChecksums;
        this._sideChecksums.forEach((value, key) => {
            if (value < 4) {
                this._normalRotationChecksum.set(value, key);
            } else {
                this._flippedRotationChecksum.set(value - 4, key);
            }
        })
    }

    rotateOneTick() {
        this._UPConst++
        this._rotation++;
        if (this._UPConst > 3) {
            this._flipped = true;
            this._UPConst = 0;
        }
        this._RIGTHConst++
        if (this._RIGTHConst > 3) {
            this._RIGTHConst = 0;
        }
        this._DOWNConst++
        if (this._DOWNConst > 3) {
            this._DOWNConst = 0;
        }
        this._LEFTConst++
        if (this._LEFTConst > 3) {
            this._LEFTConst = 0;
        }
    }

    setNeighbours() {
        if (!this._flipped) {
            this._up = this._image.getImageFromCheckSum(this._normalRotationChecksum.get(this._UPConst), this._ID);
            this._right = this._image.getImageFromCheckSum(this._normalRotationChecksum.get(this._RIGTHConst), this._ID);
            this._down = this._image.getImageFromCheckSum(this._normalRotationChecksum.get(this._DOWNConst), this._ID);
            this._left = this._image.getImageFromCheckSum(this._normalRotationChecksum.get(this._LEFTConst), this._ID);
        } else {
            //this._up = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._UPConst), this._ID);
            this._up = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._DOWNConst), this._ID);
            this._right = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._RIGTHConst), this._ID);
            //this._down = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._DOWNConst), this._ID);
            this._down = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._UPConst), this._ID);
            this._left = this._image.getImageFromCheckSum(this._flippedRotationChecksum.get(this._LEFTConst), this._ID);
        }
    }

    matchTileAccordingToInput(oriententation: number, imageTile: ImageTile): boolean {
        this.setNeighbours();
        //We should rotate and flipp accordingly or return false if it is not possible
        let iGotTile: ImageTile;
        switch (oriententation) {
            case 0:
                iGotTile = this._up
                break;
            case 1:
                iGotTile = this._right
                break;
            case 2:
                iGotTile = this._down
                break;
            case 3:
                iGotTile = this._left
                break;
        }
        if (imageTile == iGotTile) {
            return true;
        }

        return false;
    }

    flipAccordingly() {
        let rotated = this._rotation;
        let xyArray = this._xyCords;


        let temp = new Array;
        if (this._flipped) {
            rotated -= 4;
            temp = flipp(xyArray);
            xyArray = temp;
        }
        //to rotate, first flipp and then transpose
        for (let i = 0; i < rotated; i++) {
            xyArray = flipp(xyArray);
            xyArray = transpose(xyArray);
        }

        this._xyCords = xyArray;
        //console.log('id:', this._ID, '\n', this._xyCords)

        function flipp(matrix) {
            let flippedArray = new Array;
            let length = matrix.length;
            for (let y = 0; y < length; y++) {
                flippedArray.push(xyArray[length - y - 1].slice());
            }
            return flippedArray;
        }

        function transpose(matrix) {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < i; j++) {
                    const temp = matrix[i][j];
                    matrix[i][j] = matrix[j][i];
                    matrix[j][i] = temp;
                }
            }
            return matrix
        }
    }
    removeBorder() {

    }
}

class Image {
    _imageTileArray: Array<ImageTile>;
    _imageTileMap: Map<number, ImageTile>
    _AllChecksumsMap: Map<number, Array<number>>;
    _yxArray: Array<Array<ImageTile>>;
    _size;
    constructor(imageTileArray: Array<imageTile>) {
        this._imageTileArray = new Array;
        this._imageTileMap = new Map;
        this._AllChecksumsMap = new Map;
        imageTileArray.forEach(tile => {
            let imageTile = new ImageTile(tile, this)
            this._imageTileArray.push(imageTile)
            this._imageTileMap.set(tile._ID, imageTile);
        });
        this._size = Math.sqrt(imageTileArray.length);
        this._yxArray = new Array;
        for (let y = 0; y < this._size; y++) {
            let xArray = new Array(this._size).fill(null);
            this._yxArray.push(xArray)
        }
    }

    getImageFromCheckSum(checksum: number, butNotThisId: number) {
        let tileIDs = this._AllChecksumsMap.get(checksum);
        if (tileIDs.length > 1) {
            if (tileIDs[0] != butNotThisId) {
                return this._imageTileMap.get(tileIDs[0]);
            } else {
                return this._imageTileMap.get(tileIDs[1]);
            }
            return null;
        }
    }

    SetChecksums() {
        //For all tiles
        //set _allCheckSumMap correct
        this._imageTileArray.forEach(__imageTile => {
            __imageTile._sideChecksums.forEach((value, key) => {
                if (this._AllChecksumsMap.has(key)) {
                    let temp = this._AllChecksumsMap.get(key);
                    temp.push(__imageTile._ID);
                    this._AllChecksumsMap.set(key, temp);
                } else {
                    this._AllChecksumsMap.set(key, [__imageTile._ID]);
                }
            })
        })
    }

    findCorners(): Array<number> {
        let qTiles = new Array;
        this._imageTileArray.forEach(tile => {
            let singleCheckSum = 0;
            tile._sideChecksums.forEach((value, key) => {
                let count = this._AllChecksumsMap.get(key).length;
                if (count == 1) {
                    singleCheckSum++;
                }
            })
            if (singleCheckSum == 4) {
                //console.log('Possible Q:', tile._ID);
                qTiles.push(tile._ID);
            }
        })
        return qTiles;
    }

    //this will be the top left edge!
    fillOutTheArray(cornerID: number) {
        let currentImage = this._imageTileMap.get(cornerID);
        currentImage._flipped = true;
        let leftImage: ImageTile = null;
        let topImage: ImageTile = null;


        for (let y = 0; y < this._size; y++) {
            for (let x = 0; x < this._size; x++) {
                //always check against 2 other, left and top since they will alway be set                
                let done = false;
                //rotate this one correct
                while (!done) {
                    if ((currentImage.matchTileAccordingToInput(3, leftImage)) && (currentImage.matchTileAccordingToInput(0, topImage))) {
                        done = true;
                    } else {
                        currentImage.rotateOneTick();
                        currentImage.setNeighbours();
                    }
                }
                console.log('Tile ', currentImage._ID, 'is placed at yx', y, x, '# rotations:', currentImage._rotation, 'flipped:', currentImage._flipped);
                this._yxArray[y][x] = currentImage;
                if (x + 1 < this._size) {
                    leftImage = currentImage;
                    currentImage = currentImage._right;
                    if (y == 0) {
                        topImage = null;
                    } else {
                        topImage = this._yxArray[y - 1][x + 1]
                    }
                } else {
                    leftImage = null;
                    currentImage = this._yxArray[y][0]._down;
                    topImage = this._yxArray[y][0]
                }
            }
        }
    }

    flipAccordingly() {
        this._yxArray.forEach(xrow => {
            xrow.forEach(tile => {
                tile.flipAccordingly();
            })
        })
    }
    removeBorder() {
        this._yxArray.forEach(xrow => {
            xrow.forEach(tile => {
                tile.removeBorder();
            })
        })
    }
}

function partB(typeOfData: string): number {
    interface tileCheckSum {
        count: number,
        tilesIdArray: Array<number>
    }
    let imageTiles: Array<imageTile> = processInput(typeOfData);
    let image = new Image(imageTiles);
    let qTiles: Array<number> = new Array;

    image.SetChecksums();
    qTiles = image.findCorners();
    image.fillOutTheArray(qTiles[0]);
    //phuh all tiles are correctly places
    image.flipAccordingly();
    image.removeBorder();
    //remove border
    //try to find sea monster


    return 0;
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
