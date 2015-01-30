/*
Dave's Super Inefficient Sudoku Solver App

Q: WHAT IS THIS?
A: I'm trying to learn more about Javascript and interacting with objects.
So I built this after a friend suggested it.

Q: DOES THE SCRIPT KNOW THE SOLUTION AHEAD OF TIME?
A: Nope! It generates the solution on the fly using two popular Sudoku strategies:
"Only choice rule" and the "single possibility rule." This is good enough
for solving beginner's level Sudoku puzzles, but will probably break down
for more complex puzzles. 

*/

var maxColumns = 9; // Maximum number of columns in our table
var rowLabels = ["a","b","c","d","e","f","g","h","i"]; // Use this so we don't have to iterate to find the next character.
var cellLabels = ["a1","a2","a3","b1","b2","b3","c1","c2","c3","a4","a5","a6","b4","b5","b6","c4","c5","c6","a7","a8","a9","b7","b8","b9","c7","c8","c9","d1","d2","d3","e1","e2","e3","f1","f2","f3","d4","d5","d6","e4","e5","e6","f4","f5","f6","d7","d8","d9","e7","e8","e9","f7","f8","f9","g1","g2","g3","h1","h2","h3","i1","i2","i3","g4","g5","g6","h4","h5","h6","i4","i5","i6","g7","g8","g9","h7","h8","h9","i7","i8","i9"];
var trackPossibleValues = {}; // Object to track all possible values that can be used in specific cell
var trackFilledCells = new Array(); // Use this keep track of which cells we filled up so we can "undo"

// I've input a number of pregenerated Sudoku puzzles in this object that we can randomly pick from
var puzzles = {
	// 40 filled cells. Generated from: 
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=955802029-v3-40-L1
	1: 	{a1: 9, a2: 2, a3: "", a4: 3, a5: "", a6: "", a7: "", a8: "", a9: "",
		b1: "", b2: "", b3: 7, b4: "", b5: "", b6: 9, b7: "", b8: 8, b9: "",
		c1: "", c2: "", c3: "", c4: "", c5: 4, c6: 7, c7: "", c8: 2, c9: 1,
		d1: "", d2: 1, d3: 4, d4: "", d5: "", d6: 5, d7: 3, d8: 9, d9: 6,
		e1: "", e2: 3, e3: 6, e4: "", e5: 2, e6: "", e7: 8, e8: 7, e9: "",
		f1: "", f2: "", f3: "", f4: "", f5: "", f6: 4, f7: 1, f8: 5, f9: "",
		g1: 1, g2: "", g3: "", g4: "", g5: 5, g6: 3, g7: 2, g8: "", g9: 8,
		h1: "", h2: 4, h3: 5, h4: 1, h5: 8, h6: 2, h7: 7, h8: "", h9: "",
		i1: 3, i2: "", i3: 2, i4: 7, i5: "", i6: "", i7: 4, i8: "", i9: 5},	

	// 39 filled cells. Generated from:
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=696840932-v3-39-L1
	2: {a1: 5, a2: "", a3: "", a4: 3, a5: "", a6: "", a7: 6, a8: 4, a9: "",
		b1: 6, b2: "", b3: 4, b4: "", b5: "", b6: 2, b7: "", b8: 7, b9: "",
		c1: 2, c2: 9, c3: 1, c4: "", c5: 6, c6: 7, c7: "", c8: "", c9: 5,
		d1: "", d2: 6, d3: 3, d4: "", d5: 5, d6: "", d7: 2, d8: 8, d9: 7,
		e1: 1, e2: "", e3: "", e4: 8, e5: 3, e6: "", e7: "", e8: "", e9: 4,
		f1: "", f2: "", f3: "", f4: "", f5: 2, f6: 6, f7: "", f8: 9, f9: 1,
		g1: 3, g2: "", g3: 9, g4: "", g5: 4, g6: 5, g7: 7, g8: "", g9: "",
		h1: "", h2: "", h3: 2, h4: "", h5: "", h6: "", h7: "", h8: "", h9: 6,
		i1: "", i2: "", i3: "", i4: 2, i5: 1, i6: "", i7: "", i8: 5, i9: 3},

	// 38 filled cells. Generated from:
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=690009192-v3-38-L1
	3: {a1: "", a2: 4, a3: "", a4: "", a5: "", a6: "", a7: 8, a8: 2, a9: 3,
		b1: 9, b2: 8, b3: 2, b4: "", b5: 1, b6: "", b7: 4, b8: 5, b9: "",
		c1: "", c2: "", c3: "", c4: 4, c5: 2, c6: "", c7: "", c8: 7, c9: "",
		d1: "", d2: "", d3: 9, d4: "", d5: 8, d6: 2, d7: 1, d8: "", d9: "",
		e1: "", e2: 5, e3: "", e4: "", e5: 6, e6: 7, e7: "", e8: "", e9: "",
		f1: 1, f2: "", f3: 6, f4: "", f5: "", f6: "", f7: 5, f8: 8, f9: "",
		g1: 6, g2: 2, g3: "", g4: 8, g5: "", g6: 1, g7: "", g8: 4, g9: "",
		h1: "", h2: "", h3: 7, h4: 2, h5: 9, h6: "", h7: 6, h8: 3, h9: "",
		i1: 3, i2: 9, i3: "", i4: "", i5: "", i6: 5, i7: "", i8: "", i9: 8},

	// 33 filled cells ("newspaper difficulty"). Generated from:
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=214030478-v3-33-L1
	4: {a1: 9, a2: 7, a3: "", a4: "", a5: "", a6: 4, a7: 8, a8: "", a9: "",
		b1: 1, b2: "", b3: "", b4: 6, b5: 9, b6: "", b7: "", b8: 3, b9: "",
		c1: "", c2: 2, c3: "", c4: "", c5: "", c6: "", c7: "", c8: 1, c9: "",
		d1: 8, d2: "", d3: 1, d4: "", d5: "", d6: "", d7: 7, d8: 5, d9: "",
		e1: 3, e2: 4, e3: 2, e4: "", e5: 5, e6: "", e7: "", e8: "", e9: "",
		f1: "", f2: "", f3: "", f4: "", f5: 8, f6: "", f7: 2, f8: "", f9: "",
		g1: "", g2: "", g3: "", g4: 8, g5: "", g6: 7, g7: 3, g8: "", g9: "",
		h1: "", h2: "", h3: 9, h4: "", h5: 2, h6: 1, h7: "", h8: "", h9: 8,
		i1: 6, i2: 8, i3: "", i4: "", i5: 3, i6: "", i7: 1, i8: 4, i9: 2},

	// 33 filled cells ("newspaper difficulty"). Generated from:
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=688089815-v3-33-L1
	5: {a1: "", a2: "", a3: "", a4: 6, a5: 4, a6: "", a7: 5, a8: "", a9: "",
		b1: "", b2: 2, b3: "", b4: "", b5: "", b6: 8, b7: "", b8: 4, b9: "",
		c1: 8, c2: "", c3: 5, c4: 3, c5: "", c6: 2, c7: "", c8: "", c9: 6,
		d1: "", d2: "", d3: "", d4: "", d5: 8, d6: 5, d7: "", d8: "", d9: 3,
		e1: "", e2: 1, e3: 7, e4: 2, e5: 3, e6: "", e7: "", e8: 9, e9: "",
		f1: "", f2: "", f3: "", f4: "", f5: "", f6: 1, f7: "", f8: "", f9: "",
		g1: "", g2: 7, g3: "", g4: "", g5: "", g6: "", g7: 2, g8: "", g9: 5,
		h1: 2, h2: 6, h3: 8, h4: 9, h5: "", h6: "", h7: "", h8: 1, h9: "",
		i1: "", i2: "", i3: 3, i4: 1, i5: "", i6: "", i7: 8, i8: 6, i9: 9},			

	// 26 filled cells ("hard difficulty"). Generated from:
	// http://kjell.haxx.se/sudoku/?action=Create%20a%20field&seed=233427099-v3-26-L1
	/* DOH! Unsolvable with this script at the moment! Clearly need to implement more advanced strategies. :)
	6: {a1: "", a2: "", a3: 8, a4: "", a5: 1, a6: 3, a7: "", a8: "", a9: "",
		b1: 6, b2: "", b3: 1, b4: 7, b5: "", b6: 4, b7: "", b8: "", b9: 8,
		c1: "", c2: 9, c3: 4, c4: "", c5: "", c6: "", c7: 7, c8: "", c9: "",
		d1: "", d2: 7, d3: 2, d4: 9, d5: "", d6: "", d7: "", d8: "", d9: "",
		e1: "", e2: "", e3: "", e4: "", e5: 6, e6: "", e7: "", e8: 3, e9: 4,
		f1: 1, f2: "", f3: "", f4: 8, f5: 3, f6: "", f7: 9, f8: "", f9: "",
		g1: "", g2: "", g3: 7, g4: "", g5: "", g6: "", g7: "", g8: "", g9: "",
		h1: 4, h2: "", h3: "", h4: "", h5: "", h6: 6, h7: "", h8: "", h9: "",
		i1: "", i2: "", i3: "", i4: 2, i5: "", i6: "", i7: 8, i8: "", i9: ""}, */
};

// Randomly select a Sudoku puzzle from our puzzles object when the page initially loads.
var whichPuzzle = Math.floor((Math.random() * 5) + 1);
var allCells = puzzles[whichPuzzle];

// Define which 3x3 subsquare a particular cell falls into.
// We'll need this when we validate all numbers in a particular subsquare 
// There are probably better ways to do this, but I'm being lazy.
var subSquares = {
	quad1: ["a1","a2","a3","b1","b2","b3","c1","c2","c3"],
	quad2: ["a4","a5","a6","b4","b5","b6","c4","c5","c6"],
	quad3: ["a7","a8","a9","b7","b8","b9","c7","c8","c9"],
	quad4: ["d1","d2","d3","e1","e2","e3","f1","f2","f3"],
	quad5: ["d4","d5","d6","e4","e5","e6","f4","f5","f6"],
	quad6: ["d7","d8","d9","e7","e8","e9","f7","f8","f9"],
	quad7: ["g1","g2","g3","h1","h2","h3","i1","i2","i3"],
	quad8: ["g4","g5","g6","h4","h5","h6","i4","i5","i6"],
	quad9: ["g7","g8","g9","h7","h8","h9","i7","i8","i9"]
}

// This sets up our initial board when we load the page.
function setupBoard(row) {
	var row = row;
	var cellValue = 0;
	for (i = 0; i < maxColumns; i++) {
		//console.log("ROW: " + row + (i+1));
		cellValue = allCells[row+(i+1)];
		document.getElementById(row + (i+1)).innerHTML = allCells[row+(i+1)];

		// Just highlighting what cells we initially started with.
		if (Number(cellValue) > 0) {
			document.getElementById(row + (i+1)).style.fontWeight = "bold";
			document.getElementById(row + (i+1)).style.backgroundColor = "#F2F2F2";
		}
	}
}

// Quick and dirty initial setup of the board! Each letter corresponds to a row
// Ideally, I'd just loop through this, but hey. Whatevs.
setupBoard("a");
setupBoard("b");
setupBoard("c");
setupBoard("d");
setupBoard("e");
setupBoard("f");
setupBoard("g");
setupBoard("h");
setupBoard("i");

// Discovered Javascript's fun way of referencing variables. Realized I need to clone my object.
// Sooooo.... stole this from here: http://heyjavascript.com/4-creative-ways-to-clone-objects/
// Recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}

// Let's clone our initial board setup object. 
// We'll use this to store our final values in each cell.
// This will help with referencing / updating our potential values later.
var filledNumbers = (cloneObject(allCells)); 

// Explode our object to try and find which 3x3 subsquare our cell is located in.
// We need to do this when we look at a cell and need to determine what numbers have been used within its subsquare
function findSquare(cell) { 
	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	// Get all the keys of the object
	var objectKeys = Object.keys(subSquares);

	var objectLength = Object.size(subSquares);
	//console.log(objectLength);
	for (var i = 0; i < objectLength; i++) {
		if (subSquares[objectKeys[i]].indexOf(cell) != -1) {
			//console.log ("FOUND GRID! " + objectKeys[i]);
			return(objectKeys[i]);
		}
	}
};

/*************************

NEW CELL VALIDATION STUFF!!!
This is all stuff I started working on 2015.01.28
after having an epiphany... in the bathroom.

**************************/


// Look at all possible values that are valid for this cell and build and array
// We're going to add these values to trackPossibleValues[]
function getValidCellValues(cell) {
	// Use our initial allCells object that sets up the board
	var tempFoundValues = new Array(); // Store all detected values from rows, columns, and subsquares
	var tempValidValues = new Array(); // Store all VALID numbers for specific cell
	//var tempCheckArray = new Array();
	var cellValue; // Temporarily store value detected inside a cell

	// Pass the cell (e.g., "a2"), value found (e.g., "1"), and an array to prevent duplicate data
	function checkArray(value,array) {
		// true = okay, add number to array!
		// false = nah, man. don't add it.
		if (typeof array == "undefined") {
			// If the initial array doesn't exist (e.g., no data), create it!
			var array = new Array();	
		}

		if (value == 0) {
			// Nothing detected in cell, let's not store this.
			return false;
		} else if (!isNaN(Number(value)) && array.indexOf(Number(value)) === -1) {
			return true;
		}
	}

	// Look at the temp array generated by checkArray.
	// Now pull together a list of VALID values for numbers NOT in that array.
	function getValidValues(array) {
		var tempValid = new Array();
		for (i = 1; i <= 9; i++) {
			if (array.indexOf(i) === -1) {
				// The number i is not found. Add it to our new array.
				tempValid.push(i);
			}
		}
		return tempValid;
	}

	// CHECK COLUMN: by looking at vertical column and looping over row values (e.g., "a,b,c,d...")
	var column = cell.split(""); // Split up our cell value (e.g. "a1"), so we can find which column we want to look at.
	column = column[1];
	for (i = 0; i <= 8 ; i++) {
		selectCell = rowLabels[i] + (column);
		//console.log("CELL " + selectCell);
		cellValue = filledNumbers[selectCell]; // Get whatever value is stored in this specific cell
		//console.log("CELL VALUE " + cellValue);
		if (checkArray(cellValue,tempFoundValues) == true) {
			tempFoundValues.push(cellValue);
		}
	}	

	// CHECK ROW: by looking at horizontal row and looping over column values (e.g., 1,2,3,4,5)
	// VALIDATE ROW
	var row = cell.split(""); // Split up our cell value (e.g., "a1") so we can get the row.
	row = row[0];
	for (var i = 1; i <= maxColumns; i++) {
		selectCell = row + i;
		cellValue = filledNumbers[selectCell]; // Get whatever value is stored in this specific cell
		if (checkArray(cellValue,tempFoundValues) == true) {
			tempFoundValues.push(cellValue);
		}
	}

	// CHECK SUBSQUARE: by looking at all cells located in this cell's subsquare
	var tempGrid = findSquare(cell); // Find which sub square this cell is in.
	var gridCells = subSquares[tempGrid]; // Get all cells in that subsquare.
	var gridCount = gridCells.length;

	for (i = 0; i < gridCount; i++) {
		selectCell = gridCells[i];
		cellValue = filledNumbers[selectCell];
		if (checkArray(cellValue,tempFoundValues) == true) {
			tempFoundValues.push(cellValue);
		}
	}	

	/// WRITE STUFF BELOW TO STORE IN OBJECT!
	// We only want to track and store values for squares that are EMPTY!
	if (filledNumbers[cell] > 0) {
		// Do nothing, since there is already a value stored here!
	} else {
		trackPossibleValues[cell] = getValidValues(tempFoundValues); // Store all possible values for this cell in our object.
	}

	///
	///
	//console.log("Valid #\'s for " + cell + ": " + getValidValues(tempFoundValues));
	return tempFoundValues; // Return the array

}

// Quickly fill in values for the simplest cells (that is, the cells with only 1 possible solution)
// This uses a special strategy in Sudoku called "The Only Choice Rule". Basically, it looks for where there's only ONE possible solution for a given cell. 
function quickFill(cell) {
	var maxCells = cellLabels.length;
	var tempArray = new Array(); // Temporarily store the valid values array
	var countSimpleSolutions; // Count up the number of simple solutions remaining.

	// Need a way to count if there are no more arrays containing single values.
	for (var i = 0; i < maxCells; i++) {
		cell = cellLabels[i];
		if (filledNumbers[cellLabels[i]] > 0) {
			// Do nothing...
		} else {
			if (tempArray.length == 1 && tempArray != "undefined") {
				countSimpleSolutions++; // Increase count of simple solutions
			}	
		}
	}

	// For cells with only one possible solution, automatically fill it in.
	for (var i = 0; i < maxCells; i++) {
		cell = cellLabels[i];
		if (filledNumbers[cellLabels[i]] > 0) {
			// Do nothing, since there is already a value in the cell.
		} else {
			tempArray = trackPossibleValues[cell];
			singlePossibility(cell); // Fill in any single possibility cell values.
			if (tempArray.length == 1) {
				countSimpleSolutions--; // Decrease count of simple solutions
				filledNumbers[cell] = tempArray[0];
				document.getElementById(cell).innerHTML = tempArray[0];
				document.getElementById(cell).style.fontSize = "100%";
			}
			printPossibles(cell); // Update possibilities			
		}
		
	}

	// Return true or false based on quickfill.
	// True means there are remaining quickfill solutions remaining.
	// False means there aren't any, so we'll just hazard a guess somewhere.
	if (countSimpleSolutions > 0) {
		return true;
	} else {
		countSimpleSolutions = 0;
		return false;
	}
}

// Single possibility rule
// A bit more complex. There's might be a cell in a 3x3 subsquare that has a number of possible values (e.g., 2,5,7,9), but 9 is the only value that can fit in this specific cell and no others in the subgrid. Therefore, it is the value.
function singlePossibility(cell) {
	var thisCellValue = trackPossibleValues[cell]; // Just for my own sake. Give the values in this cell it's own array.
	var allSubSquareValues = new Array(); // Store all possible values found in the subsquare here

	// Find which 3x3 subsquare this cell is located in.
	var quad = findSquare(cell);
	var myOtherCells = subSquares[quad];
	//console.log(quad);
	//console.log(myOtherCells);

	// Build an array containing all possible values found in this 3x3 subsquare
	for (var i = 0; i < myOtherCells.length; i++) {
		if (myOtherCells[i] != cell && typeof trackPossibleValues[myOtherCells[i]] != "undefined") {
			allSubSquareValues.push.apply(allSubSquareValues, trackPossibleValues[myOtherCells[i]]);
			//console.log("Values for " + myOtherCells[i] + ": " + trackPossibleValues[myOtherCells[i]]);
		}
	}

	//console.log("All possible values: " + allSubSquareValues);

	// Look up attaching multiple arrays:
	// http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array
	// Basically, we build a giant array based on everything found in subsquare
	// then use index of numbers based on thisCellValue to try and find something NOT in the square!

	for (var i = 0; i < thisCellValue.length; i++) {
		var value = thisCellValue[i];
		// We need to compare each of these values with all values found within our 3x3 subsquare.
		if (allSubSquareValues.indexOf(value) == -1) {
			//console.log("FOUND IT. THE MISSING VALUE IS " + value);
			filledNumbers[cell] = value;
			document.getElementById(cell).innerHTML = value;
			document.getElementById(cell).style.fontSize = "100%";			
		}

	}
}

// Quickly generate all possible values based on what's been filled in.
// This helps look for promising strategies that we can start with.
function getAllValid() {
	var maxCells = cellLabels.length;
	for (var i = 0; i < maxCells; i++) {
		if (filledNumbers[cellLabels[i]] > 0) {
			// Do nothing, since there is already a value in the cell.
		} else {
			//singlePossibility(cellLabels[i]); // Fill in any single possibility cell values.
			getValidCellValues(cellLabels[i]); // Update list of all possible values
			//console.log("VALID VALUES FOR "+ cellLabels[i] +": " + trackPossibleValues[cellLabels[i]]);
		}
	}
}

// Debugging function for my own purposes. Print all possible values inside each cell.
function printPossibles(cell) {
	if (filledNumbers[cell] > 0) {
		// Do nothing, since there is already a value in the cell.
	} else {
		document.getElementById(cell).innerHTML = trackPossibleValues[cell];
		document.getElementById(cell).style.fontSize = "35%";
	}
}

// Check that if cells are completed.
// If not, keep looping until the puzzle is SOLVED!
// May need to build in some error checking for unsolvable puzzles or things we get hung up on.
function completePuzzle() {
	/*
	var maxCells = cellLabels.length;
	for (var i = 0; i < maxCells; i++) {
		if (filledNumbers[cellLabels[i]] > 0) {
			// do nothing
		} else {
			getAllValid();
			quickFill();			
		}
	} */
	
	// Building a simple loop because I'm being lazy.
	// Hopefully this will be enough to fill out the entire puzzle.
	
	for (var i = 0; i < 15; i++) {
		getAllValid();
		quickFill();						
	}


}

/*****************************************
// CLICK THE BUTTONS ON THE INDEX PAGE!
// DO IT. DOOOOOO IT.
//
// Magic will happen. Hopefully.
*****************************************/

var currentCell = 0; // Keep track of where we're at so we can undo entries later

// Do whatever we need to do to find the next value(s)
function doNext() {
	getAllValid();
	/*
	if (quickFill() == false) {
		console.log("---------------");
		console.log("Current Cell: " + cellLabels[currentCell]);
		validateCell(cellLabels[currentCell]);
		currentCell++;
		getAllValid();		
	} */
	completePuzzle();
}

// Do a simple quick fill
document.getElementById("fillNext").onclick = function() {
	doNext();
}

document.addEventListener("keydown", keyDownTextField, false);

// Use this to detect keypresses (that way I don't have to keep clicking the damn mouse button)
function keyDownTextField(e) {
  var keyCode = e.keyCode;
  if(keyCode==74) { // J key
	doNext();
  } 
}
