var days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
var data;

function string_to_day(dayString) {
	switch(dayString) {
		case "Lun":
			return 0;
		case "Mar":
			return 1;
		case "Mer":
			return 2;
		case "Gio":
			return 3;
		case "Ven":
			return 4;
		case "Sab":
			return 5;
		case "Dom":
			return 6;
	}
}

function drawDateTable() {
	const dateTable = document.querySelector(".table-date");
	dateTable.innerHTML = "";

	const firstRow = dateTable.insertRow();
	firstRow.appendChild(document.createElement("td"));
	for(let h = 8; h <= 19; h++) {
		const hourLabel = document.createElement("td");
		hourLabel.appendChild(document.createTextNode(h));
		firstRow.appendChild(hourLabel);
	}

	for(let d = 0; d < days.length; d++) {
		const day = days[d];
		const dayData = data[d];

		const row = dateTable.insertRow();
		const dayLabel = document.createElement("td");
		dayLabel.appendChild(document.createTextNode(day));
		row.appendChild(dayLabel);

		for(let h = 8; h <= 19; h++) {
			const hourData = dayData[h - 8];

			const hourCell = document.createElement("td");
			hourCell.addEventListener("click", function() {
				readData(d, h - 8);
			});

			if(hourData.length == 0) {
				hourCell.classList.add("date-table-element");
			} else if (hourData.length == 3) {
				hourCell.classList.add("date-table-element-full");
			} else {
				hourCell.classList.add("date-table-element-nonempty");
			}

			row.appendChild(hourCell);
		}
	}
}

function drawViewTable(hourData) {
	viewTable = document.querySelector(".table-view");
	viewTable.innerHTML = "";
	
	const firstRow = viewTable.insertRow();
	let viewTableHeader = ["N.", "Nome", "Cognome"];
	for(col of viewTableHeader) {
		let colHeader = document.createElement("th");
		colHeader.appendChild(document.createTextNode(col));
		firstRow.appendChild(colHeader);
	}

	for(let i = 0; i < hourData.length; i++) {
		let visit = hourData[i];
		const row = viewTable.insertRow();
		let firstCell = document.createElement("td");
		firstCell.appendChild(document.createTextNode(i + 1));
		row.appendChild(firstCell);
		for(col of visit) {
			let cell = document.createElement("td");
			cell.appendChild(document.createTextNode(col));
			row.appendChild(cell);
		}
	}
}

function readData(d, h) {
	let thisData = data[d][h];
	console.log(thisData);
	if(thisData.length == 0) {
		document.querySelector(".empty-text").style.display = "block";
		document.querySelector(".table-view").style.display = "none";
	} else {
		document.querySelector(".empty-text").style.display = "none";
		document.querySelector(".table-view").style.display = "table";
		drawViewTable(thisData);
	}
}

function insertData() {
	let nameInput = document.querySelector(".name-input").value;	
	let surnameInput = document.querySelector(".surname-input").value;	
	let dayInput = document.querySelector(".day-input").value;	
	let hourInput = document.querySelector(".time-input").value;	

	// convalida
	
	let d = string_to_day(dayInput);
	let h = hourInput - 8;

	if(data[d][h].length == 3) {
		alert(dayInput + " ore " + hourInput + " è completamente occupato.");
		return;
	}

	let visit = [nameInput, surnameInput];
	
	data[d][h].push(visit);
	drawDateTable();
}

function initData() {
	data = [];
	for(day of days) {
		let dayData = [];
		for(let h = 8; h <= 19; h++) {
			let hourData = [];
			dayData.push(hourData);
		}
		data.push(dayData);
	}
}
	
document.addEventListener("DOMContentLoaded", function() {
	initData();
	drawDateTable();
	let submitButton = document.querySelector(".submit-button").addEventListener("click", insertData);
})

