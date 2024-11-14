function num(i, j, r) {
	return i * r + j + 1;
}

function calcolaTabella(r, c) {	
	let arr = new Array(r);

	for(var i = 0; i < r; i++) {
		arr[i] = new  Array(c);
		for(j = 0; j < c; j++) {
			arr[i][j] = false;
		}
	}

	for(var n = 2; n < r * c / 2; n++) {
		for(var i = 0; i < r; i++) {
			for(j = 0; j < c; j++) {
				var thisnum = num(i, j, r);
				if(thisnum % n == 0 && thisnum != n) {
					arr[i][j] = true;
				}	
			}
		}
	}

	return arr;
}

function stampaTabella(arr, r, c) {
	document.write("<table>");
	
	for(var i = 0; i < r; i++) {
		document.write("<tr>");
		
		for(j = 0; j < c; j++) {
			if(arr[i][j]) {
				document.write("<td>");
			} else {
				document.write("<td class='highlight'>");
			}

			document.write(num(i, j, r));
			document.write("</td>");
		}
		
		document.write("</tr>");
	}

	document.write("</table>");
}

let r = prompt("Quante righe?");
let c = prompt("Quante colonne?");

let arr = calcolaTabella(r, c);
stampaTabella(arr, r, c);
