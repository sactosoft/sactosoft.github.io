/*! Transpiled from tutorial.js using Sactory v0.102.0. Do not edit manually. */!function(a){if(typeof define=='function'&&define.amd){define(['sactory'], a)}else if(typeof Sactory=='function'){a(Sactory)}else{a(require('sactory'))}}(function(բ, գ, ե, զ, ժ){/*! Transpiled from tutorial using Sactory v0.102.0. Do not edit manually. */!function(a){if(typeof define=='function'&&define.amd){define(['sactory'], a)}else if(typeof Sactory=='function'){a(Sactory)}else{a(require('sactory'))}}(function(բ, գ, ե, զ, ժ){function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}

module.exports = function(page, i, pages, գ){
	բ(this, document.documentElement, ե, զ, [բ.update, {args:[բ.attr(0, "lang", "en")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
		");բ(this, document.head, ե, զ, [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
			");բ(this, գ, ե, զ, [բ.create, "title", {}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, (capitalize(page.lessonName)) + " - " + (capitalize(page.groupName)) + " - Sactory Tutorial");}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
			");բ(this, գ, ե, զ, [բ.create, "style", {}], [բ.body, ժ, function(գ, զ, ժ){բ.compileAndBindStyle(function(){var եի=բ.root();
				var ել=բ.select(եի, "body"); 
					ել.value("margin", "0 auto");
				

				var եխ=բ.select(եի, ".left, .right"); 
					եխ.value("position", "absolute");
					եխ.value("width", "50%");
					եխ.value("height", "100vh");
				

				var եծ=բ.select(եի, ".left"); 
					եծ.value("left", "0");
					եծ.value("background", "#667");
					եծ.value("color", "#eee");
					var եկ=բ.select(եծ, "select"); 
						եկ.value("background", "transparent");
						եկ.value("border", "none");
					
				

				var եհ=բ.select(եի, ".right"); 
					եհ.value("right", "0");
					եհ.value("border", "none");
				
			return եի.content}, գ, ե, [], [])}], [բ.append, գ, զ, 0, 0]);բ.text(գ, ե, զ, "\n\
		");}]);բ.text(գ, ե, զ, "\n\
		");բ(this, document.body, ե, զ, [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
			");բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "class", "left")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
				");բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "class", "nav")]}], [բ.body, ժ, function(գ, զ, ժ){
					if(i > 0) {բ.text(գ, ե, զ, "\n\
						");բ(this, գ, ե, զ, [բ.create, "a", {args:[բ.attr(0, "href", pages[i - 1].href), բ.attr(0, "class", "previous")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "Previous");}], [բ.append, գ, զ]);
					}բ.text(գ, ե, զ, "\n\
					");բ(this, գ, ե, զ, [բ.create, "label", {args:[բ.attr(0, "class", "title")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "\n\
						");բ(this, գ, ե, զ, [բ.create, "select", {args:[բ.attr(0, "onchange", "window.location=this.value")]}], [բ.body, ժ, function(գ, զ, ժ){
							բ.forEach(this, pages , function(page) {բ.text(գ, ե, զ, "\n\
								");բ(this, գ, ե, զ, [բ.create, "option", {args:[բ.attr(0, "value", page.href)]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, (page.group) + "." + (page.lesson) + " " + (capitalize(page.groupName)) + " / " + (capitalize(page.lessonName)));}], [բ.append, գ, զ]);
							});բ.text(գ, ե, զ, "\n\
						");}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
					");}], [բ.append, գ, զ]);
					if(i < pages.length - 1) {բ.text(գ, ե, զ, "\n\
						");բ(this, գ, ե, զ, [բ.create, "a", {args:[բ.attr(0, "href", pages[i + 1].href), բ.attr(0, "class", "next")]}], [բ.body, ժ, function(գ, զ, ժ){բ.text(գ, ե, զ, "Next");}], [բ.append, գ, զ]);
					}բ.text(գ, ե, զ, "\n\
				");}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
				");բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "style", "padding:8px")]}], [բ.body, ժ, function(գ, զ, ժ){բ.mixin(գ, ե, զ, page.content);}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
				");բ(this, գ, ե, զ, [բ.create, "div", {args:[բ.attr(0, "style", "padding:8px")]}], [բ.body, ժ, function(գ, զ, ժ){բ.html(գ, ե, զ, (page.content));}], [բ.append, գ, զ, 0, 0]);բ.text(գ, ե, զ, "\n\
			");}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
			");բ(this, գ, ե, զ, [բ.create, "iframe", {args:[բ.attr(0, "class", "right"), բ.attr(0, "src", `../sandbox.html#${page.example}`)]}], [բ.body, ժ, function(գ, զ, ժ){}], [բ.append, գ, զ]);բ.text(գ, ե, զ, "\n\
		");}]);բ.text(գ, ե, զ, "\n\
	");}])
};
})})