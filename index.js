var fs = require("fs");

var Transpiler = require("../factory/src/transpiler");

// tutorial
var tutorial = "./src/tutorial/";
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
fs.writeFileSync("./dist/tutorial.js", new Transpiler({filename: "tutorial"}).transpile(fs.readFileSync("./src/tutorial/index.jsb", "utf8")).source.all);

var Sactory = require("sactory");
var render = require("./dist/tutorial");
pages.forEach((page, i) => {
	var document = Sactory.createDocument();
	render(page, i, pages, document);
	fs.writeFileSync("./docs/tutorial/" + page.groupName + "-" + page.lessonName + ".html", document.render());
});

// sandbox
fs.writeFileSync("./dist/sandbox.jsb",
	"@ready(function(){\n\n" +
	fs.readFileSync("./src/sandbox/model.jsb", "utf8") +
	"<style :head>" + fs.readFileSync("./src/sandbox/style.ssb", "utf8") + "</style>" +
	fs.readFileSync("./src/sandbox/view.htmlb", "utf8") +
	"\n\n});");

// compile add files in /dist
fs.readdir("./dist/", (error, scripts) => {
	scripts.forEach(script => fs.writeFile("./docs/" + script.slice(0, -1), new Transpiler({filename: script}).transpile(fs.readFileSync("./dist/" + script, "utf8")).source.all, _ => 0));
});

// copy dist
var dist = "../factory/dist/";
fs.readdir(dist, (error, files) => {
	files.forEach(file => fs.writeFile("./docs/dist/" + file, fs.readFileSync(dist + file, "utf8"), _ => 0));
});
