var file, key, hash = null;

var version = **"?";

@subscribe(version, function(value){
	document.title = "Sandbox - Sactory v" + value;
});

var tabs = {
	"output": "Output",
	"error": "Errors",
	"warn": "Warnings",
	"code": "Transpiled Code",
	"info": "Info"
};

var debugMode = @watch(true, "is_debug");
var alignment = @watch("y", "alignment");

var tab = @watch("output", "current_tab");

function switchTab(from, to) {
	if(*tab == from) *tab = to;
}

var inputs = {};
var outputs = {};

var prefix = "storage";

if(window.location.hash) {
	hash = JSON.parse(atob(window.location.hash.substr(1)));
	if(hash.prefix) prefix = hash.prefix;
} else {
	file = @watch("snippet", "current_snippet");
	key = @watch(prefix + "." + *file);
}

var defaultContent = {
	content: {
		js: "var count = **0;\n",
		html: "<button +click={ *count++ }>\n\tClicked ${*count} times\n</button>\n\nif(*count > 0) {\n\t<button +click={ *count = 0 }>\n\t\tReset count\n\t</button>\n}\n",
		css: ""
	},
	show: {
		js: true,
		html: true,
		css: false
	},
	mode: {
		js: "code",
		html: "html :logic",
		css: "ssb"
	}
};

var modes = {
	js: ["code"],
	html: ["html", "html :logic", "html :trimmed", "html :logic :trimmed", "text", "text :logic"],
	css: ["css", "css :logic", "ssb"]
};

var content = hash ? @watch.deep(hash.content) : @watch.deep(defaultContent, *key);
var showCount = @watch(*content.show.js + *content.show.html + *content.show.css);
var result = @watch((function(){
	*debugMode; // just to add it as a dependency
	var result = {source: "", before: "", after: "", info: {time: 0, tags: {}, features: []}, errors: [], warnings: []};
	var transpiler = new Transpiler({namespace: hash ? hash.name : file.value});
	function transpile(type, before, after) {
		before = before ? before + '<!COMMENT start>' : "";
		after = after ? '<!COMMENT end>' + after : "";
		try {
			var info = transpiler.transpile(before + *content.content[type] + after);
			result.info.time += info.time;
			result.info.variables = info.variables;
			for(var tag in info.tags) {
				result.info.tags[tag] = (result.info.tags[tag] || 0) + info.tags[tag];
			}
			info.features.forEach(function(feature){
				if(result.info.features.indexOf(feature) == -1) result.info.features.push(feature);
			});
			Array.prototype.push.apply(result.warnings, info.warnings);
			var source = info.source.contentOnly;
			if(before) source = source.substr(source.indexOf("/*start*/") + 9);
			if(after) source = source.substring(0, source.lastIndexOf("/*end*/"));
			result[type] = source;
			result.before = info.source.before;
			result.source += info.source.contentOnly;
			result.after = info.source.after;
			if(outputs[type]) outputs[type].setValue(info.source.contentOnly);
		} catch(e) {
			console.error(e);
			result.errors.push(e);
		}
	}
	transpile("js");
	if(*content.show.html) transpile("html", "<:body #" + *content.mode.html + ">", "</:body>");
	if(*content.show.css) transpile("css", "<style :head #" + *content.mode.css + ">", "</style>");
	if(result.errors.length) switchTab("output", "error");
	else switchTab("error", "output");
	return result;
})());
if(!hash) {
	if(window.localStorage && window.localStorage.getItem(*key)) {
		*content = JSON.parse(window.localStorage.getItem(*key));
	}
	@subscribe(file, function(value){
		content.storage.key = *key;
		var newContent = content.storage.get(defaultContent);
		content.storage.key = "";
		*content = newContent;
		content.storage.key = *key;
		for(var type in *content.content) {
			if(inputs[type]) inputs[type].setValue(*content.content[type]);
		}
	});
}

function save() {
	content.merge({
		content: {
			js: inputs.js ? inputs.js.getValue() : "",
			html: inputs.html ? inputs.html.getValue() : "",
			css: inputs.css ? inputs.css.getValue() : ""
		}
	});
}
