/*! Transpiled from sandbox.jsb using Sactory v0.102.0. Do not edit manually. */!function(a){if(typeof define=='function'&&define.amd){define(['sactory'], a)}else if(typeof Sactory=='function'){a(Sactory)}else{a(require('sactory'))}}(function(բ, գ, ե, զ, ժ){բ.ready(function(){

var file, key, hash = null;

var version = բ.observable("?");

բ.subscribe(ե, version, function(value){
	document.title = "Sandbox - Sactory v" + value;
});

var tabs = {
	"output": "Output",
	"error": "Errors",
	"warn": "Warnings",
	"code": "Transpiled Code",
	"info": "Info"
};

var debugMode = բ.observable(true, "is_debug");
var alignment = բ.observable("y", "alignment");

var tab = բ.observable("output", "current_tab");

function switchTab(from, to) {
	if(tab.value == from) tab.value = to;
}

var inputs = {};
var outputs = {};

var prefix = "storage";

if(window.location.hash) {
	hash = JSON.parse(atob(window.location.hash.substr(1)));
	if(hash.prefix) prefix = hash.prefix;
} else {
	file = բ.observable("snippet", "current_snippet");
	key = բ.computedObservable(this, ե, [file], function(){return prefix + "." + file.value}, []);
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

var content = hash ? բ.observable.deep(hash.content) : բ.observable.deep(defaultContent, key.value);
var showCount = բ.computedObservable(this, ե, [content], function(){return content.value.show.js + content.value.show.html + content.value.show.css}, []);
var result = բ.computedObservable(this, ե, [debugMode, content], function(){return (function(){
	debugMode.value; // just to add it as a dependency
	var result = {source: "", before: "", after: "", info: {time: 0, tags: {}, features: []}, errors: [], warnings: []};
	var transpiler = new Transpiler({namespace: hash ? hash.name : file.value});
	function transpile(type, before, after) {
		before = before ? before + '<!COMMENT start>' : "";
		after = after ? '<!COMMENT end>' + after : "";
		try {
			var info = transpiler.transpile(before + content.value.content[type] + after);
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
	if(content.value.show.html) transpile("html", "<:body #" + content.value.mode.html + ">", "</:body>");
	if(content.value.show.css) transpile("css", "<style :head #" + content.value.mode.css + ">", "</style>");
	if(result.errors.length) switchTab("output", "error");
	else switchTab("error", "output");
	return result;
})()}, []);
if(!hash) {
	if(window.localStorage && window.localStorage.getItem(key.value)) {
		content.value = JSON.parse(window.localStorage.getItem(key.value));
	}
	բ.subscribe(ե, file, function(value){
		content.storage.key = key.value;
		var newContent = content.storage.get(defaultContent);
		content.storage.key = "";
		content.value = newContent;
		content.storage.key = key.value;
		for(var type in content.value.content) {
			if(inputs[type]) inputs[type].setValue(content.value.content[type]);
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
բ(this, գ, ե, զ, [բ.create, "style", {}], [բ.body, ժ, function(գ, զ, ժ){բ.compileAndBindStyle(function(){var եի=բ.root();var fontFamily = "Segoe UI";
var color = {
	red: {
		background: "#D32F2F",
		text: "#F44336"
	}
};
var ել=բ.select(եի, ".top"); 
	var եխ=բ.select(ել, ".filename"); 
		var եծ=բ.select(եխ, "span, input, select"); 
			եծ.value("font-family", (fontFamily));
			եծ.value("height", "26px");
			եծ.value("margin", "4px 0 4px 4px");
			եծ.value("padding", "0 8px");
		
	
	var եհ=բ.select(ել, ".input"); 
		եհ.value("height", "calc(100% - 34px)");
		var եձ=բ.select(եհ, ".editor .mode"); 
			եձ.value("position", "absolute");
			եձ.value("z-index", "999");
			եձ.value("top", "8px");
			եձ.value("right", "22px");
			եձ.value("padding", "2px 4px");
			եձ.value("font-size, line-height", "12px");
			եձ.value("background", "rgba(187, 187, 187, .3)");
			եձ.value("color", "#333");
			եձ.value("border-radius", "1000px");
			եձ.value("border", "none");
			եձ.value("opacity", ".5");
			եձ.value("transition", "opacity .1s linear");
			var եղ=բ.select(եձ, "&:hover"); 
				եղ.value("opacity", "1");
			
			var եճ=բ.select(եձ, "&:focus"); 
				եճ.value("outline", "none");
			
		
	

var եմ=բ.select(եի, ".bottom"); 
	var եյ=բ.select(եմ, "nav"); 
		var են=բ.select(եյ, ".item"); 
			են.value("position", "relative");
			են.value("cursor", "pointer");
			են.value("padding", "8px");
			var եշ=բ.select(են, "&:hover::after, &.active::after"); 
				եշ.value("content", "''");
				եշ.value("position", "absolute");
				եշ.value("bottom", "-2px");
				եշ.value("left, right", "0");
				եշ.value("height", "4px");
			
			var եո=բ.select(են, "&:not(.active):hover::after"); 
				եո.value("opacity", ".5");
				եո.value("background", "darkviolet");
			
			var եչ=բ.select(են, "&.active::after"); 
				եչ.value("background", "darkviolet");
			
			var եպ=բ.select(են, ".has-errors &.error, .has-warnings &.warn"); 
				var եջ=բ.select(եպ, "&::before"); 
					եջ.value("content", "'• '");
					եջ.value("color", (color.red.text));
					եջ.value("font-weight", "bold");
				
			
		
	
	var ես=բ.select(եմ, "section"); 
		ես.value("height", "calc(100% - 40px)");
	

var եվ=բ.select(եի, ".fullscreen"); 
	եվ.value("position", "fixed");
	եվ.value("top, bottom, left, right", "0");

var ետ=բ.select(եի, ".editor"); 
	ետ.value("display", "inline-block");
	ետ.value("position", "relative");
	ետ.value("width", "calc(100% / " + (showCount.value) + ")");
	ետ.value("height", "100%");

var եց=բ.select(եի, ".x"); 
	var եւ=բ.select(եց, ".top, .bottom"); 
		եւ.value("display", "inline-block");
		եւ.value("width", "50%");
		եւ.value("height", "100vh");
	

var եփ=բ.select(եի, ".y"); 
	var եք=բ.select(եփ, ".top, .bottom"); 
		եք.value("height", "50vh");
	

var եօ=բ.select(եի, ".text"); 
	եօ.value("padding", "8px");
	եօ.value("width, height", "100%");
	եօ.value("border", "none");
	եօ.value("font-family", "monospace");
	եօ.value("resize", "none");
	var եֆ=բ.select(եօ, "&:focus"); 
		եֆ.value("outline", "none");
	

var եև=բ.select(եի, ".color-red"); 
	եև.value("color", (color.red.text));


var զբ=բ.select(եի, ".CodeMirror"); 
	զբ.value("height", "100%");
	զբ.value("border-top, border-bottom", "1px solid silver");
	var զգ=բ.select(զբ, ".error::before, .warn::before"); 
		զգ.value("position", "absolute");
		զգ.value("font-size", ".8em");
	
	var զդ=բ.select(զբ, ".error::before"); 
		զդ.value("content", "'🛑'");
	
	var զե=բ.select(զբ, ".warn::before"); 
		զե.value("content", "'⚠️'");
	
return եի.content}, գ, ե, [showCount], [])}], [բ.append, document.head, զ, 0, 0]);բ.query(this, document, գ, ".content", false, function(գ, դ){բ(this, գ, ե, զ, [բ.update, {args:[բ.attr(2, "class", alignment), բ.attr(2, "class:has-errors", բ.computedObservable(this, ե, [result], function(){return result.value.errors.length}, [])), բ.attr(2, "class:has-warnings", բ.computedObservable(this, ե, [result], function(){return result.value.warnings.length}, []))]}], [բ.body, ժ, function(գ, զ, ժ){

	բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(0, "class", "top")]}], [բ.body, ժ, function(գ, զ, ժ){
		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(0, "class", "filename")]}], [բ.body, ժ, function(գ, զ, ժ){
			if(!hash) {
				բ(this, գ, ե, զ, [բ.create, "input", {}], [բ.forms, ["", file]], [բ.append, գ, զ]);
				if(window.localStorage) {
					բ(this, գ, ե, զ, [բ.create, "select", {}], [բ.body, ժ, function(գ, զ, ժ){
						բ.forEach(this, Object.keys(window.localStorage).sort() , function(key) {
							if(key.substr(0, 8) == prefix + ".") {
								var value = key.substr(8);
								բ(this, գ, ե, զ, [բ.create, "option", {args:[բ.attr(0, "value", value), բ.attr(1, "textContent", value)]}], [բ.append, գ, զ]);
							}
						});
					}], [բ.forms, ["", file]], [բ.append, գ, զ]);
				}
			}
			բ.bindEach(this, գ, ե, զ, content, function(){return content.value.show }, function(գ, ե, զ, type) {
				բ(this, գ, ե, զ, [բ.create, "label", {args:[բ.attr(0, "style", "margin-left:12px")]}], [բ.body, ժ, function(գ, զ, ժ){
					բ(this, գ, ե, զ, [բ.create, "input", {args:[բ.attr(0, "style", "vertical-align:middle"), բ.attr(0, "type", "checkbox")]}], [բ.forms, ["", բ.computedObservable(this, ե, [content], function(){return content.value.show[type]}, [])]], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
					" + (type.toUpperCase()) + "\n\
				");}], [բ.append, գ, զ]);
			});
			բ(this, գ, ե, զ, [բ.create, "label", {args:[բ.attr(0, "style", "margin-left:12px")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
				debug\n\
				");բ(this, գ, ե, զ, [բ.create, "input", {args:[բ.attr(0, "style", "vertical-align:middle"), բ.attr(0, "type", "checkbox")]}], [բ.forms, ["", debugMode]], [բ.append, գ, զ]);
			}], [բ.append, գ, զ]);
			բ(this, գ, ե, զ, [բ.create, "select", {args:[բ.attr(0, "style", "margin-left:12px")]}], [բ.body, ժ, function(գ, զ, ժ){
				բ(this, գ, ե, զ, [բ.create, "option", {args:[բ.attr(0, "value", "y")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "Vertical");}], [բ.append, գ, զ]);
				բ(this, գ, ե, զ, [բ.create, "option", {args:[բ.attr(0, "value", "x")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "Horizontal");}], [բ.append, գ, զ]);
			}], [բ.forms, ["", alignment]], [բ.append, գ, զ]);
			բ(this, գ, ե, զ, [բ.create, "a", {args:[բ.attr(0, "id", "github"), բ.attr(0, "href", "https://github.com/sactory/sactory"), բ.attr(0, "target", "_blank"), բ.attr(1, "hidden", true)]}], [բ.append, գ, զ]);
			բ(this, գ, ե, զ, [բ.create, "span", {args:[բ.attr(0, "style", "float:right;font-weight:bold;color:darkviolet;cursor:pointer"), բ.attr(1, "textContent", բ.computedObservable(this, ե, [version], function(){return ("Sactory v" + version.value)}, [])), բ.attr(3, "click", function(event){ this.previousElementSibling.click() })]}], [բ.append, գ, զ]);
		}], [բ.append, գ, զ]);
		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(0, "class", "input")]}], [բ.body, ժ, function(գ, զ, ժ){
			բ.forEach(this, ["js", "html", "css"] , function(type) {
				բ.bindIfElse(this, գ, ե, զ, [[function(){return (content.value.show[type])}, [content]]], function(գ, ե, զ) {
					բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "id", type), բ.attr(0, "class", "editor")]}], [բ.body, ժ, function(գ, զ, ժ){
						բ(this, գ, ե, զ, [բ.create, "textarea", {args:[բ.attr(1, "value", content.value.content[type])]}], [բ.body, ժ, function(գ, զ, ժ){
							բ.on(this, գ, ե, "documentappend", function(){
								inputs[type] = CodeMirror.fromTextArea(this, {
									lineNumbers: true,
									indentWithTabs: true,
									smartIndent: false,
									lineWrapping: true,
									mode: type == "js" ? "javascript" : (type == "html" ? "htmlmixed" : "css")
								});
								բ.query(this, գ, գ, this.nextElementSibling, false, function(գ, դ){բ(this, գ, ե, զ, [բ.update, {args:[բ.attr(3, (բ.config.shortcut.save)+":prevent", save)]}])})
							});
						}], [բ.append, գ, զ, 0, 0]);
						բ(this, գ, ե, զ, [բ.create, "select", {args:[բ.attr(0, "class", "mode")]}], [բ.body, ժ, function(գ, զ, ժ){
							բ.forEach(this, modes[type] , function(m) {
								բ(this, գ, ե, զ, [բ.create, "option", {args:[բ.attr(0, "value", m), բ.attr(1, "textContent", m)]}], [բ.append, գ, զ]);
							});
						}], [բ.forms, ["", բ.computedObservable(this, ե, [content], function(){return content.value.mode[type]}, [])]], [բ.append, գ, զ]);
					}], [բ.append, գ, զ]);
				});
			});
		}], [բ.append, գ, զ]);
	}], [բ.append, գ, զ]);

	բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(0, "class", "bottom")]}], [բ.body, ժ, function(գ, զ, ժ){

		բ(this, գ, ե, զ, [բ.create, "nav", {}], [բ.body, ժ, function(գ, զ, ժ){
			բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "style", "margin:8px 0 10px")]}], [բ.body, ժ, function(գ, զ, ժ){
				բ.forEach(this, Object.keys(tabs) , function(key) {
					բ(this, գ, ե, զ, [բ.create, "span", {args:[բ.attr(0, "class", "item"), բ.attr(2, "class", key), բ.attr(2, "class:active", բ.computedObservable(this, ե, [tab], function(){return (tab.value == key)}, [])), բ.attr(3, "click", function(event){ tab.value = key }), բ.attr(1, "textContent", tabs[key])]}], [բ.append, գ, զ]);
				});
			}], [բ.append, գ, զ]);
		}], [բ.append, գ, զ]);

		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(1, "visible", բ.computedObservable(this, ե, [tab], function(){return (tab.value == "output")}, []))]}], [բ.body, ժ, function(գ, զ, ժ){
			բ.bindIfElse(this, գ, ե, զ, [[function(){return (!result.value.error)}, [result]]], function(գ, ե, զ) {
				բ(this, գ, ե, զ, [բ.create, "iframe", {args:[բ.attr(0, "style", "width:100%;height:100%;border:none"), բ.attr(0, "src", "about:blank")]}], [բ.body, ժ, function(գ, զ, ժ){
					բ.on(this, գ, ե, "documentappend", function(){
						window.sandbox = this.contentWindow;
						բ.query(this, գ, գ, this.contentWindow.document.head, false, function(գ, դ){բ(this, գ, ե, զ, [բ.body, ժ, function(գ, զ, ժ){
							բ(this, գ, ե, զ, [բ.create, "meta", {args:[բ.attr(0, "charset", "UTF-8")]}], [բ.append, գ, զ]);
							բ(this, գ, ե, զ, [բ.create, "script", {args:[բ.attr(0, "src", բ.computedObservable(this, ե, [debugMode], function(){return ((hash && hash.dist || "./dist/") + "sactory" + (debugMode.value ? ".debug" : "") + ".js")}, []))]}], [բ.append, գ, զ, 0, 0]).onload = function(){
								բ(this, գ, ե, զ, [բ.create, "script", {args:[բ.attr(1, "textContent", բ.computedObservable(this, ե, [result], function(){return (result.value.before + result.value.source + result.value.after)}, []))]}], [բ.append, գ, զ, 0, 0]);
								// update the loaded version
								version.value = window.sandbox.Sactory.VERSION;
							};
						}])})
					});
				}], [բ.append, գ, զ, 0, 0]);
			});
		}], [բ.append, գ, զ]);

		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(1, "visible", բ.computedObservable(this, ե, [tab], function(){return (tab.value == "error")}, []))]}], [բ.body, ժ, function(գ, զ, ժ){
			բ(this, գ, ե, զ, [բ.create, "textarea", {args:[բ.attr(0, "class", "text color-red"), բ.attr(0, "readonly"), բ.attr(1, "value", բ.computedObservable(this, ե, [result], function(){return result.value.errors.join('\n')}, []))]}], [բ.append, գ, զ]);
		}], [բ.append, գ, զ]);

		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(1, "visible", բ.computedObservable(this, ե, [tab], function(){return (tab.value == "warn")}, []))]}], [բ.body, ժ, function(գ, զ, ժ){
			բ(this, գ, ե, զ, [բ.create, "textarea", {args:[բ.attr(0, "class", "text"), բ.attr(0, "readonly"), բ.attr(1, "value", բ.computedObservable(this, ե, [result], function(){return (result.value.warnings ? result.value.warnings.join('\n') : "")}, []))]}], [բ.append, գ, զ]);
		}], [բ.append, գ, զ]);

		բ.bindIfElse(this, գ, ե, զ, [[function(){return (tab.value == "code")}, [tab]]], function(գ, ե, զ) {
			բ(this, գ, ե, զ, [բ.create, "section", {}], [բ.body, ժ, function(գ, զ, ժ){
				բ.forEach(this, ["js", "html", "css"] , function(type) {
					բ.bindIfElse(this, գ, ե, զ, [[function(){return (content.value.show[type])}, [content]]], function(գ, ե, զ) {
						բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "id", ("output-" + type)), բ.attr(0, "class", "editor")]}], [բ.body, ժ, function(գ, զ, ժ){
							բ(this, գ, ե, զ, [բ.create, "textarea", {args:[բ.attr(1, "value", (result.value[type] || ""))]}], [բ.body, ժ, function(գ, զ, ժ){
								բ.on(this, գ, ե, "documentappend", function(){
									outputs[type] = CodeMirror.fromTextArea(this, {
										lineNumbers: true,
										lineWrapping: true,
										readOnly: true,
										mode: "javascript"
									});
								});
							}], [բ.append, գ, զ]);
						}], [բ.append, գ, զ, 0, 0]);
					});
				});
			}], [բ.append, գ, զ]);
		});

		բ(this, գ, ե, զ, [բ.create, "section", {args:[բ.attr(1, "visible", բ.computedObservable(this, ե, [tab], function(){return (tab.value == "info")}, []))]}], [բ.body, ժ, function(գ, զ, ժ){
			բ(this, գ, ե, զ, [բ.create, "textarea", {args:[բ.attr(0, "class", "text"), բ.attr(0, "readonly"), բ.attr(1, "value", բ.computedObservable(this, ե, [result], function(){return (result.value.errors.length ? "" : JSON.stringify(result.value.info, null, 4))}, []))]}], [բ.append, գ, զ]);
		}], [բ.append, գ, զ]);

	}], [բ.append, գ, զ]);

}])})


});})