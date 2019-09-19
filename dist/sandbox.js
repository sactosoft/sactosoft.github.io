/*! Transpiled from ./_src/dist/sandbox.sx using Sactory v0.142.2. Do not edit manually. */var ջթ=Sactory;var ջժ=ջթ.chain;var ջի={};Sactory.addWidget("message", function(message){var ջլ=ջթ.cfa(ջի, arguments, 1);
	return ջժ(ջլ, [ջժ.create, "span", []], [ջժ.body, ջլ => {
		ջթ.bind(ջլ, [message], [], (ջլ, ջխ) => {var [message]=ջխ.map(ջթ.value);
			const match = message.matchAll(/`[^`]*`/g);
			let curr, index = 0;
			while(!(curr = match.next()).done) {
				ջժ(ջլ, [ջժ.create, "f", [[ [5, "text", message.substring(index, index = curr.value.index)]]]], [ջժ.append] );
				ջժ(ջլ, [ջժ.create, "code", [[ [5, "text", curr.value[0].slice(1, -1)]]]], [ջժ.append] );
				index += curr.value[0].length;
			}
			ջժ(ջլ, [ջժ.update, [[ [5, "text", message.substr(index)]]]] );
		});
	}], [ջժ.append])
});

class Sandbox {

	constructor({readonly, embedded, name, mode, source}) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		this.es6 = this.checkES6();
		this.runtime = document.getElementById("sactory").src;
		this.lastId = ((ջթ.cofv(0))).localStorage("sandbox_id");
		this.currentId = ((ջթ.cofv(0))).localStorage("sandbox_curr_id");
		this.readonly = (ջթ.cofv(!!readonly));
		this.data = {
			name: (ջթ.cofv("")),
			description: (ջթ.cofv("")),
			mode: (ջթ.cofv("auto-code@logic")),
			head: (ջթ.cofv("")),
			source: (ջթ.cofv(""))
		};
		const hash = window.location.hash && decode(window.location.hash.substr(1));
		if(hash) {
			// data is from hash, do not save to local storage, disallow edit
			this.readonly.value = true;
			if(hash.name) this.data.name.value = hash.name;
			if(hash.mode) this.data.mode.value = hash.mode;
			if(hash.head) this.data.head.value = hash.head;
			if(hash.source) this.data.source.value = hash.source;
		} else if(!embedded) {
			this.reloadStorage();
			this.saveStorage();
		} else {
			if(name) this.data.name.value = name;
			if(mode) this.data.mode.value = mode;
			if(source) this.data.source.value = source;
		}
		this.data.editorSource = this.data.source.value;
		this.result = ջթ.coff(() => {
			try {
				return Transpiler.transpile({filename: this.data.name.value, mode: this.data.mode.value, es6: this.es6, sandboxed: true}, this.data.source.value);
			} catch(error) {
				console.error(error);
				return {error};
			}
		}).async().d(ջլ,  this.data.name,  this.data.mode,  this.data.source);
		// source
		this.srcdoc = ջթ.coff(() => `${this.data.head.value}<script src="${this.runtime}"></script><script>Sactory.ready(function(){${this.result.value.source && this.result.value.source.all}})</script>`).d(ջլ, this.data.head, this.result,  this.result);
		// settings
		this.settings = (ջթ.cofv(false));
		this.snippets = ջթ.coff(() => {
			if(this.settings.value) {
				let ret = [];
				for(let id=0; id<=this.lastId.value; id++) {
					const stored = window.localStorage.getItem("sandbox__" + id);
					if(stored) {
						ret.push(Object.assign(JSON.parse(stored), {id}));
					}
				}
				return ret.sort((a, b) => b.modified - a.modified);
			} else {
				// not showing settings, do not bother to calculate
				return [];
			}
		}).d(ջլ, this.settings);
	}

	checkES6() {
		try {
			eval("() => {}");
			return true;
		} catch(e) {
			return false;
		}
	}

	reloadStorageImpl(id) {
		const storage = window.localStorage.getItem("sandbox__" + id);
		if(storage) {
			const data = JSON.parse(storage);
			this.data.name.value = data.name;
			this.data.description.value = data.description;
			this.data.mode.value = data.mode;
			this.data.head.value = data.head;
			this.data.source.value = data.source;
		}
	}

	reloadStorage() {
		this.reloadStorageImpl(this.currentId.value);
	}

	saveStorage() {var ջլ=ջթ.cfa(ջի, arguments, 0);
		if(!this.saving) {
			const saver = ջթ.coff(() => JSON.stringify({
				name: this.data.name.value,
				description: this.data.description.value,
				mode: this.data.mode.value,
				head: this.data.head.value,
				source: this.data.source.value,
				modified: new Date().getTime()
			})).async().d(ջլ,  this.data.name,  this.data.description,  this.data.mode,  this.data.head,  this.data.source);
			saver.$$subscribe(ջլ, value => window.localStorage.setItem("sandbox__" + this.currentId.value, value));
			this.saving = true;
		}
	}

	plus() {
		// create new snippet
		this.currentId.value = ++this.lastId.value;
		if(this.readonly.value) {
			// remove read-only limitation and init storage
			this.readonly.value = false;
			this.saveStorage();
		} else {
			this.data.name.value = "";
			this.data.description.value = "";
			this.data.mode.value = "auto-code@logic";
			this.data.head.value = "";
			this.data.source.value = "";
		}
	}

	openImpl(type, data) {
		window.open(`${this.runtime.slice(0, -19)}${type}#${encode(data)}`);
	}

	open() {
		this.openImpl("sandbox", this.data);
	}

	fullscreen() {
		this.openImpl("fullscreen", {
			name: this.data.name.value,
			srcdoc: this.srcdoc.value
		});
	}

	load(id) {
		this.settings.value = false;
		this.readonly.value = false;
		this.reloadStorageImpl(this.currentId.value = id);
	}

	remove(name, id) {
		if(window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
			delete window.localStorage["sandbox__" + id];
			this.snippets._calc();
		}
	}

	save() {
		this.data.source.update(this.data.editorSource, 8934);
	}

	initCodeMirror(element, readOnly, mode) {
		const editor = CodeMirror.fromTextArea(element, {
			lineNumbers: true,
			indentWithTabs: true,
			tabSize: 4,
			smartIndent: false,
			lineWrapping: true,
			theme: "sactory",
			readOnly, mode
		});
		editor.setSize("100%", "100%");
		return editor;
	}

	initSourceEditor(element) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		const editor = this.initCodeMirror(element, this.readonly.value, "jsx");
		editor.on("change", () => this.data.editorSource = editor.getValue());
		this.data.source.$$subscribe(ջլ, value => editor.setValue(value), 8934);
		ջժ(ջլ, [ջժ.use, element.nextElementSibling], [ջժ.update, [[ [3, ջթ.attr((ջթ.config.shortcut.save), ":prevent"), (event, target) => {this.save()}]]]] );
		if(this.readonly.value) {
			//TODO remove readOnly option
			this.readonly.$$subscribe(ջլ, () => editor.setOption("readOnly", false));
		}
	}

	initResultEditor(element) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		const editor = this.initCodeMirror(element, true, "javascript");
		this.result.$$subscribe(ջլ, value => editor.setValue(value.source && value.source.contentOnly || ""));
	}
	
	render({orientation = "x", hide = [], embedded}) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		return ջժ(ջլ, [ջժ.create, "div", [[ [0, "data-orientation", orientation]]]], [ջժ.body, ջլ => {
			ջթ.forEachArray(hide , (value) => {
				ջժ(ջլ, [ջժ.update, [[ [5, "class", `hide-${value}`]]]] );
			});
			ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "top"], [5, "show", ջթ.bo(() => !this.settings.value, [this.settings])]]]], [ջժ.body, ջլ => {
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "actions"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "div", []], [ջժ.body, ջլ => {
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "left"]]]], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "input", [[ [0, "class", "input"], [0, "placeholder", "Name"], [1, "disabled", ջթ.bo(() => this.readonly.value, [this.readonly])]]]], [ջժ.bind, ["value", "::change", ջթ.bo(() => this.data.name.value, [this.data.name]), ջխ => {this.data.name.value=ջխ}]], [ջժ.append] );
						}], [ջժ.append]);
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "right"]]]], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "buttons"]]]], [ջժ.body, ջլ => {
								if(!embedded) {
									ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button default"], [3, "click", (event, target) => {this.settings.value=true}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-cog"]]]], [ջժ.append] );}], [ջժ.append]);
									ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button default"], [3, "click", (event, target) => {this.plus()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-plus"]]]], [ջժ.append] );}], [ջժ.append]);ջթ.bindIfElse(ջլ, [[() => (!this.readonly.value), [this.readonly]]], ջլ =>
									 {
										ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.open()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-share"]]]], [ջժ.append] );}], [ջժ.append]);
									});
										}
										ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.save()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-play"]]]], [ջժ.append] );}], [ջժ.append]);
								ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.fullscreen()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-expand"]]]], [ջժ.append] );}], [ջժ.append]);
								if(embedded) {
									ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button default"], [3, "click", (event, target) => {this.open()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-external-link-alt"]]]], [ջժ.append] );}], [ջժ.append]);
								}
									}], [ջժ.append]);
						}], [ջժ.append]);
					}], [ջժ.append]);
				}], [ջժ.append]);
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "editor"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "textarea", [[ [1, "value", this.data.editorSource], [3, "documentappend", (event, target) => {this.initSourceEditor(target)}]]]], [ջժ.append] );ջթ.bindIfElse(ջլ, [[() => (this.result.value.error), [this.result]]], ջլ =>
					 {
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "error"]]]], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "message", [[ [4, "", ջթ.bo(() => this.result.value.error.message.trim(), [this.result])]]]], [ջժ.append] );
						}], [ջժ.append]);
					});ջթ.bindIfElse(ջլ, [[() => (this.result.value.warnings && this.result.value.warnings.length), [this.result, this.result]]], ջլ =>
							 {
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "warning"]]]], [ջժ.body, ջլ => {
							ջթ.bindEach(ջլ, this.result, () => this.result.value.warnings.slice(0, 3) , (ջլ, {message, position: {line, column}}) => {
								ջժ(ջլ, [ջժ.create, "div", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Line ${line + 1}, Column ${column}: ${message}`]);}], [ջժ.append]);
							});ջթ.bindIfElse(ջլ, [[() => (this.result.value.warnings.length > 3), [this.result]]], ջլ =>
							 {
								ջժ(ջլ, [ջժ.create, "div", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, ջթ.bo(() => `${this.result.value.warnings.length - 3} more...`, [this.result])]);}], [ջժ.append]);
							});
								}], [ջժ.append]);
					});
						}], [ջժ.append]);
			}], [ջժ.append]);
			ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "top settings"], [5, "show", ջթ.bo(() => this.settings.value, [this.settings])]]]], [ջժ.body, ջլ => {
				ջժ(ջլ, [ջժ.create, "div", [[ [2, "height", "100%"], [2, "background", "white"], [2, "padding", "16px"], [2, "overflow-y", "auto"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "div", [[ [2, "float", "right"]]]], [ջժ.body, ջլ => {
						ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button danger"], [3, "click", (event, target) => {this.settings.value=false}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-times"]]]], [ջժ.append] );}], [ջժ.append]);
					}], [ջժ.append]);
					ջժ(ջլ, [ջժ.create, "h3", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Settings`]);}], [ջժ.append]);
					ջժ(ջլ, [ջժ.nop], [ջժ.body, ջլ => {var ջծ= /*whitelist="input"*/ /*whitelist="textarea"*/[[ [2, "width", "100%"], [1, "disabled", ջթ.bo(() => this.readonly.value, [this.readonly])]]];
						ջժ(ջլ, [ջժ.create, "h4", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Description`]);}], [ջժ.append]);
						ջժ(ջլ, [ջժ.create, "textarea", ջթ.inherit([[ [0, "class", "input"]]], ջծ)], [ջժ.bind, ["value", "::change", ջթ.bo(() => this.data.description.value, [this.data.description]), ջխ => {this.data.description.value=ջխ}]], [ջժ.append] );
						ջժ(ջլ, [ջժ.create, "h4", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Mode`]);}], [ջժ.append]);
						ջժ(ջլ, [ջժ.create, "input", ջթ.inherit([[ [0, "class", "input"], [0, "placeholder", "Mode"]]], ջծ)], [ջժ.bind, ["value", "::change", ջթ.bo(() => this.data.mode.value, [this.data.mode]), ջխ => {this.data.mode.value=ջխ}]], [ջժ.append] );
						ջժ(ջլ, [ջժ.create, "h4", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Header`]);}], [ջժ.append]);
						ջժ(ջլ, [ջժ.create, "textarea", ջթ.inherit([[ [0, "class", "input font-mono"], [0, "placeholder", "e.g. <script src=\"example.js\"></script>"], [0, "rows", 6]]], ջծ)], [ջժ.bind, ["value", "::change", ջթ.bo(() => this.data.head.value, [this.data.head]), ջխ => {this.data.head.value=ջխ}]], [ջժ.append] );
					}]);
					ջժ(ջլ, [ջժ.create, "h4", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Saved snippets`]);}], [ջժ.append]);
					ջժ(ջլ, [ջժ.create, "table", []], [ջժ.body, ջլ => {
						ջժ(ջլ, [ջժ.create, "tr", []], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "th", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Name`]);}], [ջժ.append]);
							ջժ(ջլ, [ջժ.create, "th", [[ [0, "width", 1]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Size`]);}], [ջժ.append]);
							ջժ(ջլ, [ջժ.create, "th", [[ [0, "width", 1]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Modified`]);}], [ջժ.append]);
							ջժ(ջլ, [ջժ.create, "th", [[ [0, "width", 1]]]], [ջժ.append] );
						}], [ջժ.append]);
						ջթ.bindEach(ջլ, this.snippets, () => this.snippets.value , (ջլ, {id, name, source, modified}) => {
							ջժ(ջլ, [ջժ.create, "tr", []], [ջժ.body, ջլ => {
								ջժ(ջլ, [ջժ.create, "td", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `${name}`]);}], [ջժ.append]);
								ջժ(ջլ, [ջժ.create, "td", []], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `${source.length}`]);}], [ջժ.append]);
								ջժ(ջլ, [ջժ.create, "td", [[ [0, "class", "nowrap"]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `${new Date(modified).toLocaleString()}`]);}], [ջժ.append]);
								ջժ(ջլ, [ջժ.create, "td", []], [ջժ.body, ջլ => {
									ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "buttons"]]]], [ջժ.body, ջլ => {
										ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.load(id)}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-play"]]]], [ջժ.append] );}], [ջժ.append]);
										ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button danger"], [3, "click", (event, target) => {this.remove(name, id)}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-trash"]]]], [ջժ.append] );}], [ջժ.append]);
									}], [ջժ.append]);
								}], [ջժ.append]);
							}], [ջժ.append]);
						});
					}], [ջժ.append]);
				}], [ջժ.append]);
			}], [ջժ.append]);
			ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "bottom"]]]], [ջժ.body, ջլ => {
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "frame"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "iframe", [[ [0, "srcdoc", ջթ.bo(() => this.srcdoc.value, [this.srcdoc])]]]], [ջժ.append] );
				}], [ջժ.append]);
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "source"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "textarea", [[ [1, "value", (this.result.value.source && this.result.value.source.contentOnly || "")], [3, "documentappend", (event, target) => {this.initResultEditor(target)}]]]], [ջժ.append] );
				}], [ջժ.append]);
			}], [ջժ.append]);
		}], [ջժ.append])
	}

	static style() {var ջլ=ջթ.cfa(ջի, arguments, 0);
		return ջժ(ջլ, [ջժ.create, "style", []], [ջժ.body, ջլ => {ջթ.cabs(ջլ, (ջխ, $) => {var ջկ=ջթ.root();
			ջկ.value(`position`, `absolute`);
			ջկ.value(`top, bottom, left, right`, `0`);

			var ջհ=ջթ.select(ջկ, `.top, .bottom`); 
				ջհ.value(`position`, `absolute`);
			

			var ջձ=ջթ.select(ջկ, `&[data-orientation='x']`); 
				var ջղ=ջթ.select(ջձ, `.top, .bottom`); 
					ջղ.value(`top, bottom`, `0`);
					ջղ.value(`width`, `50%`);
				
				var ջճ=ջթ.select(ջձ, `.top`); 
					ջճ.value(`left`, `0`);
					ջճ.value(`border-right`, `2px solid transparent`);
				
				var ջմ=ջթ.select(ջձ, `.bottom`); 
					ջմ.value(`right`, `0`);
					ջմ.value(`border-left`, `2px solid transparent`);
				
			

			var ջյ=ջթ.select(ջկ, `&[data-orientation='y']`); 
				var ջն=ջթ.select(ջյ, `.top, .bottom`); 
					ջն.value(`left, right`, `0`);
					ջն.value(`height`, `50%`);
				
				var ջշ=ջթ.select(ջյ, `.top`); 
					ջշ.value(`top`, `0`);
					ջշ.value(`border-bottom`, `2px solid transparent`);
				
				var ջո=ջթ.select(ջյ, `.bottom`); 
					ջո.value(`bottom`, `0`);
					ջո.value(`border-top`, `2px solid transparent`);
				
			

			var ջչ=ջթ.select(ջկ, `.top`); 
				var ջպ=ջթ.select(ջչ, `.actions, .editor`); 
					ջպ.value(`position`, `absolute`);
					ջպ.value(`left, right`, `0`);
				
				var ջջ=ջթ.select(ջչ, `.actions`); 
					ջջ.value(`top`, `0`);
					ջջ.value(`height`, `64px`);
					ջջ.value(`border-bottom`, `2px solid transparent`);
					var ջռ=ջթ.select(ջջ, `& > div`); 
						ջռ.value(`background`, `white`);
						ջռ.value(`height`, `100%`);
						ջռ.value(`padding`, `0 12px`);
						ջռ.value(`display`, `flex`);
						ջռ.value(`justify-content`, `space-between`);
						var ջս=ջթ.select(ջռ, `.left, .right`); 
							ջս.value(`display`, `flex`);
							ջս.value(`align-items`, `center`);
							var ջվ=ջթ.select(ջս, `& > * + *`); 
								ջվ.value(`margin-left`, `12px`);
							
						
					
				
				var ջտ=ջթ.select(ջչ, `.editor`); 
					ջտ.value(`top`, `64px`);
					ջտ.value(`bottom`, `0`);
					ջտ.value(`border-top`, `2px solid transparent`);
					var ջր=ջթ.select(ջտ, `.error, .warning`); 
						ջր.value(`position`, `absolute`);
						ջր.value(`bottom, left, right`, `0`);
						ջր.value(`padding`, `12px`);
						ջր.value(`color`, `white`);
						ջր.value(`font-family`, `Consolas, monospace`);
						ջր.value(`white-space`, `pre-wrap`);
						ջր.value(`z-index`, `4`);
						var ջց=ջթ.select(ջր, `code`); 
							ջց.value(`background`, `rgba(255, 255, 255, .125)`);
						
					
					var ջւ=ջթ.select(ջտ, `.error`); 
						ջւ.value(`background`, `#e74c3c`);
					
					var ջփ=ջթ.select(ջտ, `.warning`); 
						ջփ.value(`background`, `#ffcd02`);
						var ջք=ջթ.select(ջփ, `& > * + *`); 
							ջք.value(`margin-top`, `12px`);
						
					
				
				var ջօ=ջթ.select(ջչ, `&.settings`); 
					var ջֆ=ջթ.select(ջօ, `table`); 
						ջֆ.value(`width`, `100%`);
						ջֆ.value(`border-collapse`, `collapse`);
						var ջև=ջթ.select(ջֆ, `th, td`); 
							ջև.value(`padding`, `4px 8px`);
						
						var ռա=ջթ.select(ջֆ, `td`); 
							ռա.value(`border-top`, `1px solid #ddd`);
						
						var ռբ=ջթ.select(ջֆ, `tr th:first-child`); 
							ռբ.value(`text-align`, `left`);
						
						var ռգ=ջթ.select(ջֆ, `tr td:nth-child(2), tr td:nth-child(3)`); 
							ռգ.value(`text-align`, `center`);
						
					
				
			

			var ռդ=ջթ.select(ջկ, `.bottom`); 
				var ռե=ջթ.select(ռդ, `.frame, .source`); 
					ռե.value(`position`, `absolute`);
					ռե.value(`height`, `50%`);
					ռե.value(`left, right`, `0`);
				
				var ռզ=ջթ.select(ռդ, `.frame`); 
					ռզ.value(`width`, `100%`);
					ռզ.value(`top`, `0`);
					ռզ.value(`border-bottom`, `2px solid transparent`);
					var ռէ=ջթ.select(ռզ, `iframe`); 
						ռէ.value(`width, height`, `100%`);
						ռէ.value(`margin`, `0`);
						ռէ.value(`border`, `0`);
						ռէ.value(`background`, `white`);
					
				
				var ռը=ջթ.select(ռդ, `.source`); 
					ռը.value(`bottom`, `0`);
					ռը.value(`border-top`, `2px solid transparent`);
				
			

			var ռթ=ջթ.select(ջկ, `.CodeMirror`); 
				ռթ.value(`background`, `white !important`);
			

			var ռժ=ջթ.select(ջկ, `&.hide-result`); 
				var ռի=ջթ.select(ռժ, `.bottom`); 
					var ռլ=ջթ.select(ռի, `.frame`); 
						ռլ.value(`height`, `100%`);
						ռլ.value(`border-bottom-width`, `0`);
					
					var ռխ=ջթ.select(ռի, `.source`); 
						ռխ.value(`display`, `none`);
					
				
			ջժ(ջլ, [ջժ.text, `
		`]);return ջկ.content}, [], [])}], [ջժ.append]);
	}

};
