var fs = require("fs");

var Sactory = require("sactory");
var Transpiler = require("sactory/src/transpiler");

// prepare dist
try {
	fs.mkdirSync("./_dist");
} catch(e) {}

// jsb pages
fs.readdirSync("./_src/").forEach(page => {
	if(page.endsWith(".jsb")) {
		fs.writeFileSync("./_dist/" + page.slice(0, -1), new Transpiler({filename: page, aliases: {content: {element: "content"}}}).transpile(fs.readFileSync("./_src/" + page, "utf8")).source.all);
	}
});

var template = require("./_dist/template");

// tutorial
var tutorial = "./_src/tutorial/";
var pages = [];
fs.readdirSync(tutorial).forEach(group => {
	var groupInfo = group.split('-');
	if(groupInfo.length == 2) {
		fs.readdirSync(tutorial + group).forEach(lesson => {
			var lessonInfo = lesson.split('-');
			var path = tutorial + group + "/" + lesson;
			var example = {
				content: {js: "", html: "", css: ""},
				mode: {js: "code", html: "html", css: "ssb"},
				show: {js: false, html: false, css: false}
			};
			["js", "html", "css"].forEach(type => {
				try {
					var file = path + "/example." + type + "b";
					fs.statSync(file);
					example.show[type] = true;
					example.content[type] = fs.readFileSync(file, "utf8");
				} catch(e) {}
			});
			pages.push({
				group: groupInfo[0],
				groupName: groupInfo[1],
				lesson: lessonInfo[0],
				lessonName: lessonInfo[1],
				path: path,
				href: groupInfo[1] + "-" + lessonInfo[1],
				example: Buffer.from(JSON.stringify({name: lessonInfo[1], content: example})).toString("base64"),
				content: fs.readFileSync(path + "/index.html", "utf8")
			});
		});
	}
});

// transpile tutorial's index
fs.writeFileSync("./_dist/tutorial.js", new Transpiler({filename: "tutorial"}).transpile(fs.readFileSync("./_src/tutorial/index.jsb", "utf8")).source.all);

var render = require("./_dist/tutorial");
pages.forEach((page, i) => {
	var document = Sactory.createDocument();
	render(page, i, pages, document);
	fs.writeFileSync("./tutorial/" + page.groupName + "-" + page.lessonName + ".html", document.render());
});

// sandbox (html)
var sandbox = template();
require("./_dist/sandbox")(sandbox.document);
fs.writeFileSync("./sandbox.html", sandbox.document.render());

// sandbox (js)
fs.writeFileSync("./_dist/sandbox.jsb",
	"@ready(function(){\n\n" +
	fs.readFileSync("./_src/sandbox/model.jsb", "utf8") +
	"<style :head>" + fs.readFileSync("./_src/sandbox/style.ssb", "utf8") + "</style>" +
	fs.readFileSync("./_src/sandbox/view.htmlb", "utf8") +
	"\n\n});");

// compile jsb files in /dist
fs.readdir("./_dist/", (error, scripts) => {
	scripts.forEach(script => {
		if(script.endsWith(".jsb")) {
			fs.writeFile("./dist/" + script.slice(0, -1), new Transpiler({filename: script}).transpile(fs.readFileSync("./_dist/" + script, "utf8")).source.all, _ => 0);
		}
	});
});

// copy dist
var dist = "./node_modules/sactory/dist/";
fs.readdir(dist, (error, files) => {
	files.forEach(file => fs.writeFile("./dist/" + file, fs.readFileSync(dist + file, "utf8"), _ => 0));
});
