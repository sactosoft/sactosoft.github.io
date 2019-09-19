const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { ncp } = require("ncp");

const sactory = "../../factory/";

const { version } = require(sactory + "version");
const { transpile } = require(sactory + "transpiler");

const mode = "auto-code@logic,trimmed";

const sections = [
	["introduction", ["about", "features"]]
];

const nop = () => {};

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
	const num = value => value.split(".").reverse()
		.map((str, i) => parseInt(str) + i * 1000)
		.reduce((acc, value) => acc + value, 0);
	return num(b) - num(a);
});

const writeImpl = (file, content) => mkdirp(file.substring(0, file.lastIndexOf("/")), () => fs.writeFile(file, content, nop));

const write = (file, content) => {
	writeImpl("./" + file, content);
	writeImpl("./v/" + version + "/" + file, content);
};

// compile widgets
fs.readdirSync("./_src/widget").forEach(filename => {
	fs.writeFileSync("./_dist/" + filename.slice(0, -2) + "js", transpile({env: "commonjs", filename, mode, es6: true, runtime: sactory + "index"}, fs.readFileSync("./_src/widget/" + filename, "utf8")));
});

// compile static pages
const base = "./_src/static/";
const dist = "./_dist/";
const static = (folder, parents) => {
	const get = fname => {
		const filename = folder.substr(base.length).replace(/\//g, "_") + fname;
		fs.writeFileSync(dist + filename + ".js", transpile({env: "commonjs", filename, mode, es6: true, runtime: sactory + "index"}, fs.readFileSync(folder + fname + ".sx", "utf8")));
		return require("../_dist/" + filename);
	};
	const root = (parents.map(() => "..").join("/") || ".") + "/";
	if(fs.existsSync(folder + "_template.sx")) {
		// add parent
		parents = parents.concat(get("_template"));
	}
	fs.readdirSync(folder).reverse().forEach(fname => {
		const stat = fs.statSync(folder + "/" + fname);
		if(stat.isDirectory()) {
			static(folder + fname + "/", parents);
		} else if(stat.isFile()) {
			let attrs = {
				version, root, sections,
				path: folder.substr(base.length) + fname.slice(0, -3)
			};
			if(fname.endsWith(".blank.sx")) {
				const widget = get(fname.slice(0, -3));
				write(folder.substr(base.length) + fname.slice(0, -8) + "html", new widget().render(attrs).render());
			} else if(fname != "_template.sx") {
				const widget = get(fname.slice(0, -3));
				write(folder.substr(base.length) + fname.slice(0, -2) + "html", new parents[0]({
					...attrs,
					children: parents.slice(1).concat(widget)
				}).render().render());
			}
		}
	});
};
static(base, []);

// compile scripts
fs.readdirSync("./_src/dist").forEach(fname => {
	const filename = "./_src/dist/" + fname;
	let source = fs.readFileSync(filename, "utf8");
	if(fname.endsWith(".sx")) {
		source = transpile({filename, mode, es6: true}, source).source.all;
	}
	//TODO use babel to transpile to es5
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

// copy files in css and res folders in current version
ncp("./css", `./v/${version}/css`);
ncp("./res", `./v/${version}/res`);

// write global script for creating the version select
fs.writeFile("./versions.js", `
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
		//TODO switch version
	});
});
`, nop);
