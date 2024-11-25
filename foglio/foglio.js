const max_row = 26;
const max_col = 9;

var spreadsheet;
// implementa una struttura di classi come dio comanda e lavora su quelle

function initialize() {
	document.querySelector(".spreadsheet-view").classList.add("hide");
	document.querySelector(".prompt-submit").addEventListener("click", promptSubmit);
}

function promptSubmit() {
	const row_input = document.querySelector(".row-input");
	const col_input = document.querySelector(".col-input");

	row_input.classList.remove("bad-input");
	col_input.classList.remove("bad-input");

	const rows = row_input.value;
	const cols = col_input.value;

	if(rows <= 0 || rows > max_row) {
		row_input.classList.add("bad-input");
		return;
	}

	if(cols <= 0 || cols > max_col) {
		col_input.classList.add("bad-input");
		return;
	}

	generateSpreadsheet(rows, cols);
	drawSpreadsheetTable();

	document.querySelector(".prompt-view").classList.add("hide");
	document.querySelector(".spreadsheet-view").classList.remove("hide");
}

function generateSpreadsheet() {
}

function drawSpreadsheetTable() {
	spreadsheet_table = document.querySelector(".spreadsheet");
	spreadsheet_table.innerHTML = "";
	
	const first_row = spreadsheet_table.insertRow();

	first_row.appendChild(document.createElement("td"));

	for(let c = 0; c < cols; c++) {
		let label = document.createElement("td");
		label.appendChild(document.createTextNode(c + 1));
		first_row.appendChild(label);
	}

	for(let r = 0; r < rows; r++) {
		const row = spreadsheet_table.insertRow();

		let label = document.createElement("td");
		label.appendChild(document.createTextNode(String.fromCharCode(r + 65)));
		row.appendChild(label);

		for(let c = 0; c < cols; c++) {
			let cell = document.createElement("td");
			let input = document.createElement("input");

			input.type = "text";
			input.addEventListener("blur", () => parseCell(r, c, input.value));
			
			// calcola valore cella

			row.appendChild(cell);
		}
	}
}

function parseCell(r, c, input) {
	// implementa
	drawSpreadsheetTable();
}

document.addEventListener("DOMContentLoaded", initialize);

