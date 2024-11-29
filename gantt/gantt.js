// constants
const COLUMNS = 12;
const compReg = /^[0-9]+.[0-9]+$/;
const singReg = /^[0-9]+$/;

// elements
var identInput;
var descInput;
var startInput;
var endInput;
var ganttTable;
var descBox;

// globals
var ganttData = [];

function init() {
	// setup elements
	identInput = document.querySelector(".ident-input");
	descInput = document.querySelector(".desc-input");
	startInput = document.querySelector(".start-input");
	endInput = document.querySelector(".end-input");
	ganttTable = document.querySelector(".gantt-table");
	descBox = document.querySelector(".desc-box");

	// setup listeners
	document.querySelector(".insert-button").addEventListener("click", insert);
	document.querySelector(".close-button").addEventListener("click", hideActivityBox);
	
	draw();
}

function insert() {
	// get data
	let desc = descInput.value;
	let start = parseInt(startInput.value);
	let end = parseInt(endInput.value);

	// separate logic for identifier
	let ident = identInput.value;
	let splitIdent = ident.split(".");

	let highIndex;
	let lowIndex = -1;

	if(compReg.test(ident)) {
		highIndex = parseInt(splitIdent[0]) - 1;
		lowIndex = parseInt(splitIdent[1]) - 1;
	} else if(singReg.test(ident)) {
		highIndex = parseInt(splitIdent[0]) - 1;
	} else {
		alert("L'identificatore inserito è malformato");
		return;
	}

	// validate
	if(start > end) {
		alert("Inizio non può essere superiore di fine");
		return;
	}

	if(start <= 0) {
		alert("Inizio non può essere minore minore o uguale a 0");
		return;
	}

	if(end > COLUMNS) {
		alert("Fine non può essere maggiore di 12");
		return;
	}

	if(desc == "") {
		alert("La descrizione non può essere vuota");
		return;
	}

	// add activity
	if(lowIndex == -1) {
		insertActivity(highIndex, desc, start, end);
	} else {
		insertSubactivity(highIndex, lowIndex, desc, start, end);
	}

	draw();
}

function insertActivity(highIndex, desc, start, end) {
	if(ganttData[highIndex] != undefined) {
		alert("Un'attività con lo stesso identificatore esiste già");
		return;
	}

	ganttData[highIndex] = 
		{ 
			ident: highIndex + 1,
			desc: desc, 
			start: start, 
			end: end, 
			sub: [] 
		};	
}

function insertSubactivity(highIndex, lowIndex, desc, start, end) {
	if(ganttData[highIndex] == undefined) {
		alert("L'attività madre specificata non esiste");
		return;
	}

	if(ganttData[highIndex].sub[lowIndex] != undefined) {
		alert("Un'attività figlia con lo stesso identificatore esiste già");
		return;
	}

	// valida
	if(start < ganttData[highIndex].start || end > ganttData[highIndex].end) {
		alert("L'attività figlia dev'essere interamente contenuta nell'attività madre");
		return;
	} 

	ganttData[highIndex].sub[lowIndex] = 
		{ 
			ident: (highIndex + 1).toString() + "." + (lowIndex + 1).toString(),
			desc: desc,
			start: start,
			end: end
		};	
}

function displayActivityBox(highIndex) {
	descBox.setAttribute("style", "display: block;");

	let data = ganttData[highIndex];

	descBox.firstElementChild.textContent = 
		data.desc + ", " + data.start + "-" + data.end;
}

function displaySubactivityBox(highIndex, lowIndex) {
	descBox.setAttribute("style", "display: block;");

	let data = ganttData[highIndex].sub[lowIndex];
	let higherData = ganttData[highIndex];

	descBox.firstElementChild.textContent = 
		data.desc + " di " + higherData.desc + ", " + data.start + "-" + data.end;
}

function hideActivityBox(){
	descBox.setAttribute("style", "display: none;");
}

function draw() {
	// clear table
	ganttTable.innerHTML = "";

	// draw header
	let firstRow = ganttTable.insertRow();
	firstRow.appendChild(document.createElement("th"));
	for(let c = 1; c <= COLUMNS; c++) {
		let cell = document.createElement("th");
		cell.textContent = c;
		firstRow.appendChild(cell);
	}

	// draw rows
	for(let hi = 0; hi < ganttData.length; hi++) {
		let activ = ganttData[hi];
		if(activ == undefined) continue;

		// draw activity
		let activRow = ganttTable.insertRow();
		let activLabel = document.createElement("td");
		activLabel.setAttribute("class", "activity-label");
		activLabel.textContent = activ.ident;
		activRow.appendChild(activLabel);

		for(let c = 1; c <= COLUMNS; c++) {
			let cell = document.createElement("td");
			if(c >= activ.start && c <= activ.end) {
				cell.setAttribute("class", "activity-cell");
				
				cell.addEventListener("click", () => displayActivityBox(hi));
			}
			activRow.appendChild(cell);
		}

		// draw subactivites
		for(let lo = 0; lo < ganttData[hi].sub.length; lo++) {		
			let subActiv = ganttData[hi].sub[lo];
			if(subActiv == undefined) continue;

			// draw subactivity
			let subActivRow = ganttTable.insertRow();
			let subActivLabel = document.createElement("td");
			subActivLabel.setAttribute("class", "activity-label");
			subActivLabel.textContent = subActiv.ident;
			subActivRow.appendChild(subActivLabel);

			for(let c = 1; c <= COLUMNS; c++) {
				let cell = document.createElement("td");
				if(c >= subActiv.start && c <= subActiv.end) {
					cell.setAttribute("class", "activity-cell");

					cell.addEventListener("click", () => displaySubactivityBox(hi, lo));
				}
				subActivRow.appendChild(cell);
			}
		}

		//draw subactivities
	}
}

document.addEventListener("DOMContentLoaded", init);
