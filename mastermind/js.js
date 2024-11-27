var gameTable;
var statusText;
var startButton;

var colorSeq = [];
var userSeq = [];
var gameState = false;
var tryCount = 0;
var lastStates = [];
var timeleft = 0;

var timer;

// utilità

function indexToColor(index) {
	switch(index) {
		case 0: return "yellow";
		case 1: return "green";
		case 2: return "blue";
		case 3: return "red";
		case 4: return "purple";
	}
}

// logica di gioco

function init() {
	document.addEventListener("DOMContentLoaded", () => {
		gameTable = document.querySelector(".game-table");
		statusText = document.querySelector(".status-text");
		startButton = document.querySelector(".start-button");
		startButton.addEventListener("click", initGame);

		drawTable();	
	});
	
	document.addEventListener("keydown", handleKeypress);
}

function initGame() {
	colorSeq = [];
	for(let i = 0; i < 4; i++) {
		let rand = Math.floor(Math.random() * 5);
		colorSeq.push(rand);
	}

	userSeq = [];
	tryCount = 0;
	lastStates = [];
	timeleft = 60;

	startButton.setAttribute("disabled", "disabled");
	statusText.textContent = "";

	gameState = true;
	drawTable();
	
	statusText.textContent = "Tempo rimasto: 60 secondi";

	timer = setInterval(() => {
		timeleft--;
		statusText.textContent = "Tempo rimasto: " + timeleft + " secondi";
		if(timeleft <= 0) {
			gameOver();
		}
	}, 1000);
}

function nextGameStep() {
	tryCount++;

	let full_corrects = 0;
	let half_corrects = 0;

	let full_correct_indices = [];
	let needed_colors = [];

	for(let i = 0; i < 4; i++) {
		if(userSeq[i] == colorSeq[i]) {
			full_corrects++;
			full_correct_indices.push(i);
		}
	}

	if(full_corrects == 4) {
		gameState = false;

		statusText.textContent = "Hai vinto in " + tryCount
														 + (tryCount == 1 ? " tentativo" : " tentativi"); 
		startButton.removeAttribute("disabled");
		clearInterval(timer);
		return;
	}

	// controlla errori

	for(let i = 0; i < 4; i++) {
		if(!full_correct_indices.includes(i)) {
			needed_colors.push(colorSeq[i]);
		}
	}

	for(let i = 0; i < 4; i++) {
		if(!full_correct_indices.includes(i)) {
			let index = needed_colors.indexOf(userSeq[i]);
			if(index != -1) {
				half_corrects++;
				needed_colors.splice(index, 1);
			}
		}
	}

	lastStates.push([...userSeq, full_corrects, half_corrects]);
	userSeq = [];
}

function handleKeypress(event) {
	if(!gameState) return;

	let index = 0;
	switch(event.key) {
		case "y":
			// index = 0;
			break;
		case "g":
			index = 1;
			break;
		case "b":
			index = 2;
			break;
		case "r":
			index = 3;
			break;
		case "p":
			index = 4;
			break;
		default:
			return;
	}

	userSeq.push(index);

	if(userSeq.length == 4) nextGameStep();
	if(lastStates.length == 10) gameOver();

	drawTable();
}

function gameOver() {
	statusText.textContent = "Hai perso :(";
	gameState = false;
	startButton.removeAttribute("disabled");
	clearInterval(timer);
}

// grafica
function drawTable() {
	gameTable.innerHTML = "";
	
	for(let r = 0; r < 10; r++) {
		let row = gameTable.insertRow();
		
		if(r < lastStates.length) { // stato passato
			state = lastStates[r];

			for(let c = 0; c < 4; c++) {
				let color = indexToColor(state[c]);
				let cell = document.createElement("td");
				cell.setAttribute("style", "background-color: " + color);
				row.appendChild(cell);
			}

			for(let c = 4; c < 6; c++) {
				let score = state[c];
				let cell = document.createElement("td");
				cell.setAttribute("style", "background-color: " + (c == 4 ? "pink" : "lightgreen"));
				cell.textContent = score;
				row.appendChild(cell);
			}
		} else if(r == lastStates.length) { // stato presente			
			for(let c = 0; c < 4; c++) {
				let cell = document.createElement("td");
				
				let color = indexToColor(userSeq[c]);
				if(color != undefined) {
					cell.setAttribute("style", "background-color: " + color);
				}

				row.appendChild(cell);
			}

			for(let c = 4; c < 6; c++) {
				let cell = document.createElement("td");
				row.appendChild(cell);
			}
		} else { // stato futuro
			for(let c = 0; c < 6; c++) {
				let cell = document.createElement("td");
				row.appendChild(cell);
			}
		}
	}
}

init();
