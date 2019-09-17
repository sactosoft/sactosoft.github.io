/*! Transpiled from ./_src/dist/sandbox.sx using Sactory v0.142.0. Do not edit manually. */var ջթ=Sactory;var ջժ=ջթ.chain;var ջի={};const SIZE = 128;
const CELL_SIZE = 2;

const colors = [
	["grey", "#718096", "#CBD5E0"],
	["red", "#E53E3E", "#FC8181"],
	["orange", "#DD6B20", "#F6AD55"],
	["yellow", "#D69E2E", "#F6E05E"],
	["green", "#38A169", "#68D391"],
	["teal", "#319795", "#4FD1C5"],
	["blue", "#3182CE", "#63B3ED"],
	["indigo", "#5A67D8", "#7F9CF5"],
	["purple", "#805AD5", "#B794F4"],
	["pink", "#D53F8C", "#F687B3"]
];

const rand = () => Math.floor(Math.random() * SIZE);

var rows = [];
for(let i=0; i<SIZE; i++) {
	let row = [];
	for(let j=0; j<SIZE; j++) {
		row.push(0);
	}
	rows.push(row);
}

var results = (ջթ.cofv([]));
var count = ջթ.coff(() => results.value.reduce((acc, {cells}) => acc + cells, 0)).d(ջի, results);

var players = [];

for(let i=0; i<colors.length; i++) {
	players.push({type: i, moves: [[rand(), rand()]]});
}

var canvas, context;

function draw(i, j, type) {
	context.fillStyle = type == 0 ? "#ffffee" : (type < 10 ? "#333333" : (type < 20 ? colors[type - 10][1] : colors[type - 20][2]));
	context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function tick() {
	players.forEach(player => {
		let {type, dead, moves} = player;
		if(!dead) {
			let [i, j] = moves[0];
			let [pi, pj] = moves[1] || []; // previous move, to avoid going back
			let di, dj;
			do {
				[di, dj] = (() => {
					switch(Math.floor(Math.random() * 4)) {
						case 0: return [i - 1, j];
						case 1: return [i + 1, j];
						case 2: return [i, j - 1];
						case 3: return [i, j + 1];
					}
				})();
			} while(di < 0 || di >= SIZE || dj < 0 || dj >= SIZE || (di === pi && dj === pj));
			moves.unshift([di, dj]);
			let cell = rows[di][dj];
			draw(i, j, rows[i][j] = type + 20);
			if(cell == 1 && Math.random() > .75) {
				// trap, player is dead
				player.dead = true;
				draw(di, dj, rows[di][dj] = 0);
			} else {
				if(cell == 1) {
					// zombie captured
					players.push({type, moves: [[di, dj]]});
				} else if(cell >= 10 && cell < 20) {
					// change team
					players.find(({moves: [[mi, mj]]}) => di == mi && dj == mj).type = type;
				}
				draw(di, dj, rows[di][dj] = type + 10);
			}
		}
	});
	var scores = {};
	rows.forEach(row => row.forEach(type => {
		if(type >= 10) {
			let t = type % 10;
			if(!scores[t]) scores[t] = {
				type: t,
				cells: 0,
				heads: 0
			};
			let ref = scores[t];
			ref.cells++;
			if(type < 20) ref.heads++;
		}
	}));
	results.value = Object.values(scores).sort((a, b) => b.cells - a.cells);
	if(results.value.length > 1) {
		setTimeout(tick, 1000 / 60);
	} else {
		gtimeout = 9999999999999999999999999999999;
	}
}

var gtimeout = Math.pow(2, 15);

function goodieImpl() {
	let i, j, cell;
	do {
		cell = rows[i = rand()][j = rand()];
	} while(cell != 0 && cell < 20);
	draw(i, j, rows[i][j] = 1);
}

function goodie() {
	goodieImpl();
	setTimeout(goodie, Math.max(500, gtimeout /= 2));
}

function start() {
	context = canvas.getContext("2d");
	context.fillStyle = "#eef";
	context.fillRect(0, 0, canvas.width, canvas.height);
	players.forEach(({type, moves: [[i, j]]}) => draw(i, j, (rows[i][j]).value = type + 20));
	for(let i=0; i<(SIZE*SIZE)/25; i++) {
		goodieImpl();
	}
	goodie();
	tick();
}

ջժ(ջի, [ջժ.create, "style", [[ /*head=true*/]]], [ջժ.body, ջի => {ջթ.cabs(ջի, (ջխ, $) => {var ջծ=ջթ.root();
	var ջկ=ջթ.select(ջծ, `[data-type='0']`);  ջկ.value(`fill`, `#333`);
	var ջհ=ջթ.select(ջծ, `[data-type='1']`);  ջհ.value(`fill`, `#333`);
	var ջձ=ջթ.select(ջծ, `[data-type='2']`);  ջձ.value(`fill`, `#eef`);
	ջթ.forEachArray(colors , ([, head, cell], i) => {
		var ջղ=ջթ.select(ջծ, `[data-type='1${i}']`);  ջղ.value(`fill, background`, `${head}`);
		var ջճ=ջթ.select(ջծ, `[data-type='2${i}']`);  ջճ.value(`fill, background`, `${cell}`);
	});

	var ջմ=ջթ.select(ջծ, `[data-type='1']`); 
		ջմ.value(`//border-radius`, `50%`);
		ջմ.value(`//transform`, `rotate(45deg) scale(${Math.sqrt(2)})`);
	
	
	var ջյ=ջթ.select(ջծ, `.scores`); 
		ջյ.value(`color`, `white`);
		ջյ.value(`font-family`, `Helvetica, monospace`);
		ջյ.value(`white-space`, `nowrap`);
		ջյ.value(`text-shadow`, `0 0 4px rgba(0, 0, 0, .5)`);
		var ջն=ջթ.select(ջյ, `div`); 
			ջն.value(`padding`, `2px 4px`);
		
	ջժ(ջի, [ջժ.text, `
`]);return ջծ.content}, [], [])}], [ջժ.appendTo, ջթ.head(ջի)]);

ջժ(ջի, [ջժ.use, ջթ.body(ջի)], [ջժ.body, ջի => {
	ջժ(ջի, [ջժ.create, "canvas", [[ /*ref=canvas*/, [3, "documentappend", start]],[[0, "", Array("width" , "height"), "",(SIZE * CELL_SIZE)]]]], [ջժ.ref, ջխ => canvas=ջխ], [ջժ.append] );
	ջժ(ջի, [ջժ.create, "div", [[ [0, "class", "scores"]]]], [ջժ.body, ջի => {
		ջթ.bindEach(ջի, results, () => results.value , (ջի, {type, cells, heads}) => {
			ջժ(ջի, [ջժ.create, "div", [[ [0, "data-type", (20 + type)], [2, "width", (cells / count.value * 100 + "%")]]]], [ջժ.body, ջի => {}], [ջժ.append]);
		});
	}], [ջժ.append]);
}]);