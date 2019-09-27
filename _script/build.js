const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { ncp } = require("ncp");
const { transformSync } = require("@babel/core");

const sactory = "../../factory/";

const { version } = require(sactory + "version");
const { transpile } = require(sactory + "transpiler");

const mode = "auto-code@logic,trimmed";

const sections = [
	["introduction", ["about", "features"]]
];

const nop = () => {};

const commonjs = (filename, data) => transpile({env: "commonjs", filename, mode, es6: true, runtime: sactory + "index"}, data);

// prepare dist
try {
	fs.mkdirSync("./_dist");
} catch(e) {}

// prepare v
try {
	fs.mkdirSync("./v");
} catch(e) {}

// prepare v/${version}
try {
	fs.mkdirSync("./v/" + version);
} catch(e) {}

// create array with supported versions
const versions = fs.readdirSync("v");
if(versions.indexOf(version) == -1) {
	versions.push(version);
}
versions.sort((a, b) => {
	const m = [1000000, 1000, 1];
	const num = value => value.split(".")
		.map((str, i) => parseInt(str) * m[i])
		.reduce((acc, value) => acc + value, 0);
	return num(b) - num(a);
});

const writeImpl = (file, content) => mkdirp(file.substring(0, file.lastIndexOf("/")), () => fs.writeFile(file, content, nop));

const write = (file, content) => {
	writeImpl("./" + file, content);
	writeImpl("./v/" + version + "/" + file, content);
};

// compile widgets
const widgets = (folder, paths) => {
	fs.readdirSync(folder).forEach(filename => {
		const stat = fs.statSync(folder + "/" + filename);
		if(stat.isDirectory()) {
			widgets(folder + filename + "/", paths.concat(filename));
		} else {
			fs.writeFileSync("./_dist/" + paths.map(p => p + "_").join("") + filename.slice(0, -2) + "js", transpile({env: "commonjs", filename, mode, es6: true, runtime: sactory + "index"}, fs.readFileSync(folder + filename, "utf8")));
		}
	});
};
widgets("./_src/widget/", []);

// compile static pages
const render = require("../_dist/render");
const base = "./_src/static/";
const dist = "./_dist/";
const static = folder => {
	const root = (folder == base ? "." : folder.substr(base.length).split("/").map(() => "..").join("/")) + "/";
	fs.readdirSync(folder).forEach(fname => {
		const stat = fs.statSync(folder + "/" + fname);
		if(stat.isDirectory()) {
			static(folder + fname + "/");
		} else if(stat.isFile()) {
			const attrs = {
				version, root, sections,
				path: folder.substr(base.length) + fname.slice(0, -3)
			};
			const filename = "static_" + folder.substr(base.length).replace(/\//g, "_") + fname.slice(0, -3);
			fs.writeFileSync(dist + filename + ".js", commonjs(filename, fs.readFileSync(folder + fname, "utf8")));
			const Widget = require("../_dist/" + filename);
			write(folder.substr(base.length) + fname.slice(0, -3), render(Widget, attrs));
		}
	});
};
static(base);

// compile tour and guide
const Tour = require("../_dist/tour");
const Guide = require("../_dist/guide");
sections.forEach(([section, subs]) => {
	let contents = [];
	subs.forEach(sub => {
		const content = require(`../_dist/tour_${section}_${sub}`);
		contents.push({sub, content});
		write(`./tour/${section}/${sub}.html`, render(Tour, {root: "../../", version, sections, section, sub, content}));
	});
	write(`./guide/${section}.html`, render(Guide, {root: "../", version, sections, section, contents}));
});

// compile scripts
fs.readdirSync("./_src/dist").forEach(fname => {
	const filename = "./_src/dist/" + fname;
	let source = fs.readFileSync(filename, "utf8");
	if(fname.endsWith(".sx")) {
		// transpile using sactory
		source = transpile({filename, mode, es6: true}, source).source.all;
	}
	// transpile to es5
	source = transformSync(source, {
		presets: ["@babel/preset-env", ["babel-preset-minify", {
			builtIns: false,
			mangle: true
		}]],
		minified: true,
		comments: false
	}).code;
	// save
	write("dist/" + fname.slice(0, -2) + "js", source);
});

// copy files from sactory's dist folder
const sactoryDist = "../factory/dist/";
fs.readdirSync(sactoryDist).forEach(filename => {
	if(/^(sactory|transpiler)\.min\.js$/.test(filename)) {
		write("dist/" + filename, fs.readFileSync(sactoryDist + filename, "utf8"));
	}
});

// compile css
require("../../sactify/src/build")("./_src/style", "./css");

// copy resources
ncp("./_src/res", "./res");
ncp("./_src/res", `./v/${version}/res`);

// copy css folders
ncp("./css", `./v/${version}/css`);

// write global script for creating the version select
fs.writeFile("./dist/versions.js", `
window.addEventListener("load", function(){
	var select = document.querySelector(".header select");
	var value = select.value;
	select.textContent = "";
	[${versions.map(v => `"${v}"`).join(", ")}].forEach(function(version){
		var option = document.createElement("option");
		option.value = option.textContent = version;
		select.appendChild(option);
	});
	select.value = value;
	select.addEventListener("change", function(){
		var version = "/v/" + this.value;
		var path = window.location.href.substr(window.location.origin.length);
		var match = path.match(/^\\/v\\/\\d+\\.\\d+\\.\\d+\\//);
		if(match) {
			path = version + "/" + path.substr(match[0].length);
		} else {
			path = version + path;
		}
		window.location.href = path;
	});
});
`.replace(/[\n\r\t]/gm, ""), nop);
