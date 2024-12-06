const ROWS = 3;
const COLS = 5;
const takenChar = "X";
const freeChar = "O";

var dateInput;
var nameInput;
var surnameInput;

const nameReg = /^[A-Z][a-z]+$/;

var selectTable;

var reservations = new Map();
var defTable;

var reserveList;

var reservationCount = new Map();

function init() {
	dateInput = document.querySelector(".date-input");
	nameInput = document.querySelector(".name-input");
	surnameInput = document.querySelector(".surname-input");

	let selectButton = document.querySelector(".select-button");
	selectButton.addEventListener("click", beginSelection);

	selectTable = document.querySelector(".select-table");

	defTable = new Array();
	for(let r = 0; r < ROWS; r++) {
		let defTableRow = new Array();
		for(let c = 0; c < COLS; c++) {
			defTableRow.push({ taken: false });
		}
		defTable.push(defTableRow);
	}

	reserveList = document.querySelector(".reservation-list");
}

function beginSelection() {
	let date = dateInput.value;
	let name = nameInput.value;
	let surname = surnameInput.value;

	dateInput.removeAttribute("class", "invalid");
	nameInput.removeAttribute("class", "invalid");
	surnameInput.removeAttribute("class", "invalid");

	let invalid = false;

	if(date == "") {
		dateInput.setAttribute("class", "invalid");
		invalid = true;
	}
	if(!nameReg.test(name) || name == "") {
		nameInput.setAttribute("class", "invalid");
		invalid = true;
	}
	if(!nameReg.test(surname) || surname == "") {
		surnameInput.setAttribute("class", "invalid");
		invalid = true;
	}

	if(invalid) return;

	makeSelection(date, name, surname);
}

function makeSelection(date, name, surname) {
	if(!reservations.has(date)) {
		reservations.set(date, structuredClone(defTable));
	}

	drawTable(date, name, surname);
}

function drawTable(date, name, surname) {
	selectTable.innerHTML = "";

	let table = reservations.get(date);
	
	for(let r = 0; r < ROWS; r++) {
		let row = selectTable.insertRow();
		for(let c = 0; c < COLS; c++) {
			let cell = document.createElement("td");
			
			let taken = table[r][c].taken;

			cell.textContent = taken ? takenChar : freeChar;
			if(!taken) {
				cell.addEventListener("click", () => {
					finalizeSelection(date, name, surname, r, c);
				});
			}	

			row.appendChild(cell);
		}
	}
}

function finalizeSelection(date, name, surname, row, col) {
	if(reservationCount.has(name)) {
		reservationCount.set(name, reservationCount.get(name) + 1);	
	} else {
		reservationCount.set(name, 0); 
	}

	if(reservationCount.get(name) == 3) {
		alert("Ci sono già 3 prenotazioni a questo nome");
	} else {	
		reservations.get(date)[row][col] = {
			name: name,
			surname: surname,
			row: row,
			col: col,
			taken: true
		};
		drawList();
	}

	selectTable.innerHTML = "";
}

function drawList() {
	reserveList.innerHTML = "";

	for(const [date, table] of reservations) {
		const flatTable = table.flat();
		
		for(const reserve of flatTable) {
			if(!reserve.taken) continue;
			
			reserveList.innerHTML 
				+= date + " " 
				+ reserve.name + " " 
				+ reserve.surname
				+ ", ombrellone (" + reserve.row + ", " + reserve.col + ")<br/>";
		}
	}	
}

document.addEventListener("DOMContentLoaded", init);
