const max_row = 26;
const max_col = 9;

const func_regexp = /^[A-Z]\(([A-Z]|[1-9])\)$/;

let cur_row = 0;
let cur_col = 0;
let cur_val = "";

// si definisce una gerarchia di classi che rappresentano le celle del foglio di calcolo
class SpreadsheetCell {
	constructor() {
		if(this,constructor == SpreadsheetCell) {
			throw new Error("Can't instantiate abstract class");	
		}
	}
	evaluate() {
		throw new Error("Abstract method not implemented");	
	}
	print() {
		throw new Error("Abstract method not implemented");	
	}
	printFormula() {
		throw new Error("Abstract method not implemented");	
	}
}

// la cella vuota
class EmptyCell extends SpreadsheetCell {
	evaluate() {
		return 0; 
	}
	print() {
		return "";
	}
	print_formula() {
		return this.print();
	}
}

// una cella a contenuto numerico
class ValueCell extends SpreadsheetCell {
	value;
	constructor(value) {
		super();
		this.value = value;
	}
	evaluate() {
		return this.value;
	}
	print() {
		return this.value.toString();
	}
	print_formula() {
		return this.print();
	}
}

// una cella funzione
class FunctionCell extends SpreadsheetCell {
	range;
	sring;
	constructor(range, string) {
		super();
		this.range = range;
		this.string = string;
	}
	evaluate() {
		throw new Error("Abstract method not implemented");	
	}
	print() {
		return this.evaluate().toString();
	}
	print_formula() {
		return this.string;
	}
}

// diverse specializzazioni di functioncell
class SumFunction extends FunctionCell {
	constructor(range, string) {
		super(range, string);
	}
	evaluate() {
		let sum = 0;
		for(let cell of this.range) {
			let spreadsheet_cell = spreadsheet[cell.r][cell.c];
			sum += spreadsheet_cell.evaluate();
		}
		return sum;
	}
}

class ProductFunction extends FunctionCell {
	constructor(range, string) {
		super(range, string);
	}
	evaluate() {
		let prod = 1;
		for(let cell of this.range) {
			let spreadsheet_cell = spreadsheet[cell.r][cell.c];
			prod *= spreadsheet_cell.evaluate();
		}
		return prod;
	}
}

class MaxFunction extends FunctionCell {
	constructor(range, string) {
		super(range, string);
	}
	evaluate() {
		let max = -Infinity;
		for(let cell of this.range) {
			let spreadsheet_cell = spreadsheet[cell.r][cell.c];
			let cell_value = spreadsheet_cell.evaluate();
			if(cell_value > max) {
				max = cell_value;
			}
		}
		return max;
	}
}


class MinFunction extends FunctionCell {
	constructor(range, string) {
		super(range, string);
	}
	evaluate() {
		let min = Infinity;
		for(let cell of this.range) {
			let spreadsheet_cell = spreadsheet[cell.r][cell.c];
			let cell_value = spreadsheet_cell.evaluate();
			if(cell_value < min) {
				min = cell_value;
			}
		}
		return min;
	}
}

class AvgFunction extends FunctionCell {
	constructor(range, string) {
		super(range, string);
	}
	evaluate() {
		let sum = 0;
		let count = 0;
		for(let cell of this.range) {
			let spreadsheet_cell = spreadsheet[cell.r][cell.c];
			sum += spreadsheet_cell.evaluate();
			count++;
		}
		return sum / count;
	}
}

// fabbrica per functioncell
function getFunction(string, thisr, thisc) {
	let type_char = string[0];
	let range_char = string.substr(2, string.length - 1);
	
	let range_num = parseInt(range_char);
	let range_type;

	if(!isNaN(range_num)) {
		range_num--;
		range_type = "col";
		if(range_num < 0 || range_num >= get_cols()) {
			alert("La colonna indicata è inesistente");
			return;
		}
	} else {
		range_num = range_char.charCodeAt(0) - 65;
		range_type = "row";
		if(range_num < 0 || range_num >= get_rows()) {
			alert("La riga indicata è inesistente");
			return;
		}
	}

	let range = Array();

	if(range_type == "col") {
		for(let r = 0; r < get_rows(); r++) {
			let cell = { r: r, c: range_num};
			if(cell.r != thisr || cell.c != thisc) range.push(cell);
		}	
	} else {
		for(let c = 0; c < get_cols(); c++) {
			let cell = { r: range_num, c: c};
			if(cell.r != thisr || cell.c != thisc) range.push(cell);
		}	
	}

	switch(type_char) {
		case "S":
			return new SumFunction(range, string);
		case "P":
			return new ProductFunction(range, string);
		case "M":
			return new MaxFunction(range, string);
		case "L":
			return new MinFunction(range, string);
		case "A":
			return new AvgFunction(range, string);
		default:
			alert("La funzione indicata è inesistente");
	}
}

// conterrà il foglio di calcolo vero e proprio come un array bidimensionale
var spreadsheet;

// helper per ottenere le dimensioni del foglio di calcolo 
function get_rows() {
	return spreadsheet.length;
}

function get_cols() {
	return spreadsheet[0].length;
}

// inizializza gli eventi e nasconde la tabella del foglio di calcolo 
function initialize() {
	document.querySelector(".spreadsheet-view").classList.add("hide");
	document.querySelector(".prompt-submit").addEventListener("click", promptSubmit);
	document.querySelector(".formula-input").addEventListener("blur", parseFormula);
}

// viene chiamata all'invio del prompt iniziale, convalida e se possibile inizializza la tabella del foglio di calcolo 
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

// genera la prima configurazione della variabile spreadsheet
function generateSpreadsheet(rows, cols) {
	spreadsheet = Array();
	for(let r = 0; r < rows; r++) {
		spreadsheet[r] = Array();
		for(let c = 0; c < cols; c++) {
			spreadsheet[r][c] = new EmptyCell();
		}
	}
}

// disegna la tabella del foglio di calcolo
function drawSpreadsheetTable() {
	let spreadsheet_table = document.querySelector(".spreadsheet");
	spreadsheet_table.innerHTML = "";
	
	const first_row = spreadsheet_table.insertRow();

	first_row.appendChild(document.createElement("td"));

	for(let c = 0; c < get_cols(); c++) {
		let label = document.createElement("td");
		label.appendChild(document.createTextNode(c + 1));
		first_row.appendChild(label);
	}

	for(let r = 0; r < get_rows(); r++) {
		const row = spreadsheet_table.insertRow();

		let label = document.createElement("td");
		label.appendChild(document.createTextNode(String.fromCharCode(r + 65)));
		row.appendChild(label);

		for(let c = 0; c < get_cols(); c++) {
			let cell = document.createElement("td");
			let input = document.createElement("input");

			// crea i campi di input
			input.type = "text";
			input.addEventListener("blur", () => parseCell(r, c, input.value));
			input.addEventListener("focus", () => selectCell(r, c));

			// impostali al loro valore nella variabile spreadsheet
			let cell_value = spreadsheet[r][c].print();
			input.value = cell_value;
			
			cell.appendChild(input);
			row.appendChild(cell);
		}
	}
}

// imposta la'editor di formule al click su una cella
function selectCell(r, c) {
	let formula_input = document.querySelector(".formula-input");
	formula_input.value = spreadsheet[r][c].print_formula();

	cur_row = r;
	cur_col = c;
	cur_val = spreadsheet[r][c].print();
}

// imposta una cella attraverso l'editor di formule
function parseFormula() {
	let formula_input = document.querySelector(".formula-input");
	parseCell(cur_row, cur_col, formula_input.value);
	formula_input.value = "";	
}

// legge l'input su una cella e lo usa per modificare la variabile corrispondente in spreadsheet
function parseCell(r, c, input) {
	// non fare nulla se non si è modificato la cella
	if(input == cur_val) {
		return;
	}

	let num = parseInt(input);
	if(!isNaN(num)) {
		// un valore numerico
		spreadsheet[r][c] = new ValueCell(num);
	} else if(input == "0") {
		// lo zero
		spreadsheet[r][c] = new ValueCell(0);
	} else if(func_regexp.test(input)) {
		// una funzione
		spreadsheet[r][c] = getFunction(input, r, c);
	} else if(!input) {
		// una cella vuota 
		spreadsheet[r][c] = new EmptyCell;
	}
	drawSpreadsheetTable();
}

// chiama initialize a dom caricato
document.addEventListener("DOMContentLoaded", initialize);

