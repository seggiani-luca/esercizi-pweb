function calculateExitingConstraints(n) {
	let con = Array(n);
	for(let i = 0; i < n; i++) {
		con[i] = "";
		for(let j = 0; j < n; j++) {
			if(j != i) {
				con[i] += "x_{" + (i + 1) + " \\, " + (j + 1) + "} + ";
			}
		}
		con[i] = con[i].slice(0, -2);
		con[i] += "= 1"
	}
	return con;
}

function calculateIncomingConstraints(n) {
	let con = Array(n);
	for(let j = 0; j < n; j++) {
		con[j] = "";
		for(let i = 0; i < n; i++) {
			if(i != j) {
				con[j] += "x_{" + (i + 1) + " \\, " + (j + 1) + "} + ";
			}
		}
		con[j] = con[j].slice(0, -2);
		con[j] += "= 1"
	}
	return con;
}

function calculateSubsets(i, res, subset, set) {
	if(i == set.length) {
		res.push([...subset]);
		return;
	}
	subset.push(set[i]);
	calculateSubsets(i + 1, res, subset, set);
	subset.pop();
	calculateSubsets(i + 1, res, subset, set);
}

function calculateConnectionConstraints(n) {
	let con = Array();
	
	let set = Array(n);
	for(let i = 0; i < n; i++) {
		set[i] = i + 1;
	}

	let subset = Array();
	let res = Array();
	calculateSubsets(0, res, subset, set)

	for(sub of res) {
		let c = "";
	
		if(sub.length < 2 || sub.length > n - 1) continue;

		let outside = Array();
		for(let i = 0; i < n; i++) {
			if(!sub.includes(i + 1)) outside.push(i + 1);
		}
		
		for(num of sub) {
			for(out of outside) {
				c += "x_{" + num + " \\, " + out + "} + ";
			}	
		}

		c = c.slice(0, -2);
		c += "\\geq 1";
		con.push(c);
	}
	return con;
}

let n = prompt("Number of nodes?");;

let ex_con = calculateExitingConstraints(n);
let in_con = calculateIncomingConstraints(n);
let cn_con = calculateConnectionConstraints(n);

let con = [...ex_con, ...in_con, ...cn_con]

let tex = "\\begin{cases}\n";
for(c of con) {
	tex += "\t" + c + " \\\\\n";
}
tex += "\\end{cases}";

console.log(tex);
