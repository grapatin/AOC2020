import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import * as _ from 'lodash'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { throws } from "assert";
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
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    let temp = rawInput.split('\n');

    temp.forEach(row => {
        let temp = row.split('(');
        let ingredientsList: Array<string> = temp[0].trimEnd().split(' ');
        let allergens: Array<string> = temp[1].slice(9, -1).split(',').join('').split(' ');
        let _array = new Array;
        _array.push(ingredientsList);
        _array.push(allergens);
        inputArray.push(_array);
    })

    return inputArray;
}

class AllergenFinder {
    _allergenMap: Map<string, Array<string>>
    _ingredientsMap: Map<string, number>
    _identifiedAllergen: Array<Array<string>>;
    constructor(input) {
        this._allergenMap = new Map;
        this._ingredientsMap = new Map;
        this._identifiedAllergen = new Array;
        input.forEach(row => {
            let allergens: Array<string> = row[1];
            let ingredientsArray = row[0];
            allergens.forEach(allergen => {
                if (this._allergenMap.has(allergen)) {
                    let ingredients = this._allergenMap.get(allergen);
                    //only keep those that match
                    let intersection = _.intersection(ingredients, row[0]);
                    this._allergenMap.set(allergen, intersection)
                } else {
                    this._allergenMap.set(allergen, row[0])
                }
            })
            ingredientsArray.forEach(ingredient => {
                if (this._ingredientsMap.has(ingredient)) {
                    let temp = this._ingredientsMap.get(ingredient);
                    temp++;
                    this._ingredientsMap.set(ingredient, temp);
                } else {
                    this._ingredientsMap.set(ingredient, 1);
                }
            })
        });
    }

    reduce() {
        //find any identified allergen and remove thos from all list repeat until done.
        let _continue = true;
        while (_continue) {
            _continue = false;
            this._allergenMap.forEach((ingredients, allergen) => {
                if (ingredients.length == 1) {
                    _continue = true
                    //We have identified one allergen
                    let removeThisIngredient = ingredients[0]
                    //console.log('Allergen identified', allergen, 'contains', removeThisIngredient);
                    let tempArray = [allergen, removeThisIngredient]
                    this._identifiedAllergen.push(tempArray)
                    this._ingredientsMap.delete(ingredients[0])
                    this._ingredientsMap.delete(allergen);
                    //remove it
                    this._allergenMap.forEach(_ingredients => {
                        for (let i = 0; i < _ingredients.length; i++) {
                            if (_ingredients[i] == removeThisIngredient) {
                                //remove this array element
                                _ingredients.splice(i, 1);
                            }
                        }
                    })
                }
            })
        }
    }
    
    score() {
        let sum = 0
        this._ingredientsMap.forEach(count => {
            sum += count
        })
        return sum;
    }

    createDengerousIngredientList() {
        this._identifiedAllergen.sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1
            } else {
                return 1;
            }
        })

        let outputString = '';
        this._identifiedAllergen.forEach(ingredient => {
            outputString += ingredient[1] + ','
        })
        outputString = outputString.slice(0, -1);
        //        console.log('Typing', outputString)
        return outputString;
    }
}


function partA(typeOfData: string): number {
    let input: Array<Array<string>> = processInput(typeOfData);

    let allergenFinder = new AllergenFinder(input);
    allergenFinder.reduce();

    return allergenFinder.score();
}

function partB(typeOfData: string): string {
    let input: Array<Array<string>> = processInput(typeOfData);

    let allergenFinder = new AllergenFinder(input);
    allergenFinder.reduce();

    let returnString = allergenFinder.createDengerousIngredientList();

    return returnString;
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
