var days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
var data;

function string_to_day(dayString) {
	switch(dayString) {
		case "Lun":
			return 0;
			break;
		case "Mar":
			return 1;
			break;
		case "Mer":
			return 2;
			break;
		case "Gio":
			return 3;
			break;
		case "Ven":
			return 4;
			break;
		case "Sab":
			return 5;
			break;
		case "Dom":
			return 6;
			break;
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
			const hourData = dayData[h];

			const hourCell = document.createElement("td");
			hourCell.addEventListener("click", function() {
				readData(d, h);
			});

			hourCell.classList.add("date-table-element");
			row.appendChild(hourCell);
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
		document.querySelector(".table-view").style.display = "block";
	}
}

function insertData() {
	let nameInput = document.querySelector(".name-input").value;	
	let surnameInput = document.querySelector(".surname-input").value;	
	let dayInput = document.querySelector(".day-input").value;	
	let hourInput = document.querySelector(".time-input").value;	

	// convalida
	
	let d = string_to_day(day);
	let h = hourInput;

	let visit = {
		name: nameInput,
		surname: surnameInput,
		day: dayInput,
		hour: hourInput
	};
	
	data[d][h].push(visit);
	drawDateTable();
}

function initData() {
	data = Array();
	for(day of days) {
		let dayData = Array();
		for(let h = 8; h <= 19; h++) {
			let hourData = Array();
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

