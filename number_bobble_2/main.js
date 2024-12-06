const SIZE = 5;
const TIMESTEP = 500;

var gameTable;
var startButton;
var statusText;

var timer;

const Direction = {
	left: 1,
	right: 0
}

var currentDigit = {
	digit: null,
	direction: null,
	index: null
};
var gameState = false;
var digitTable = [];
var points = 0;

function init() {
	gameTable = document.querySelector(".game-table");
	startButton = document.querySelector(".start-button");
	statusText = document.querySelector(".status-text");

	startButton.addEventListener("click", startGame);
	document.addEventListener("keydown", () => {
		if(!gameState) return;

		dropDigit();
		generateDigit();
		drawTable();
		
		clearInterval(timer);
		if(gameState) timer = setInterval(gameStep, TIMESTEP);
	});

	generateTable();
	drawTable();
}

function generateDigit() {
		currentDigit.digit = parseInt(Math.random() * 10);
		currentDigit.direction = Math.random() > 0.5 ? Direction.left : Direction.right;
		currentDigit.index = currentDigit.direction ? SIZE - 1 : 0;
	}
	
function generateTable() {
	digitTable = [];
	for(let c = 0; c < SIZE; c++) {
		digitTable.push(Array());
	}
}

function dropDigit() {
	if(currentDigit.index == -1) currentDigit.index = 0;
	if(currentDigit.index == SIZE) currentDigit.index = SIZE - 1;

	let column = digitTable[currentDigit.index];
	if(column[column.length - 1] == currentDigit.digit) {
		column.splice(column.length - 1, 1);
		points++;
	} else {
		column.push(currentDigit.digit)
	}

	if(digitTable[currentDigit.index].length == SIZE + 1) endGame();
}

function gameStep() {
	if(currentDigit.direction) {
		currentDigit.index--;
	} else {
		currentDigit.index++;
	}	

	drawTable();

	let newDigit = false;
	
	if(currentDigit.direction) {
		if(currentDigit.index == -1) {
			newDigit = true;
		}
	} else {
		if(currentDigit.index == SIZE) {
			newDigit = true;
		}
	}

	if(newDigit) {
		dropDigit();
		generateDigit();
		drawTable();
	}
}

function startGame() {	
	startButton.setAttribute("disabled", "disabled");
	gameState = true;
	
	generateDigit();
	generateTable();

	points = 0;
	statusText.textContent = "";

	drawTable();

	timer = setInterval(gameStep, TIMESTEP);
}

function endGame() {
	startButton.removeAttribute("disabled");
	gameState = false;
	clearInterval(timer);

	statusText.textContent = "Hai totalizzato " + points + " punti!";
}

function drawTable() {
	gameTable.innerHTML = "";

	let hRow = gameTable.insertRow();
	for(let c = 0; c < SIZE; c++) {
		let th = document.createElement("th");
		
		if(c == currentDigit.index) {
			th.textContent = currentDigit.digit;
		}

		hRow.appendChild(th);
	}

	for(let r = 0; r < SIZE; r++) {
		let row = gameTable.insertRow();
		for(let c = 0; c < SIZE; c++) {
			let td = document.createElement("td");
			let height = SIZE - 1 - r;

			if(height < digitTable[c].length) {
				td.textContent = digitTable[c][height];
			}

			row.appendChild(td);
		} 
	}
}

document.addEventListener("DOMContentLoaded", init);
