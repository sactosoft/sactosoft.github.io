/*! Transpiled from ./_src/dist/sandbox.sx using Sactory v0.142.0. Do not edit manually. */var ջթ=Sactory;var ջժ=ջթ.chain;var ջի={};class Sandbox {

	constructor({root, filename = "", mode = "auto-code@logic", source, readonly = false, hash = true}) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		this.es6 = this.checkES6();
		this.readonly = readonly;
		if(hash && window.location.hash) {
			try {
				this.hash = JSON.parse(atob(window.location.hash.substr(1)));
			} catch(e) {}
		}
		this.root = root || this.hash && this.hash.dist || "./dist/";
		this.lastId = ((ջթ.cofv(0))).localStorage("sandbox_id");
		this.currentId = (ջթ.cofv()).localStorage("storage_curr_id");
		this.edit = {
			filename: (ջթ.cofv(true)),
			mode: (ջթ.cofv(true)),
			source: (ջթ.cofv(true))
		};
		this.data = {
			filename: (ջթ.cofv("")),
			mode: (ջթ.cofv("auto-code@logic")),
			source: (ջթ.cofv(""))
		};
		const hd = this.hash && this.hash.data;
		if(hd) {
			// data is from hash, do not save to local storage, disallow edit
			this.edit.filename.value = false;
			this.edit.mode.value = true;
			this.edit.source.value = false;
			this.data = {
				filename: (ջթ.cofv((hd.filename || ""))),
				mode: (ջթ.cofv((hd.filename || "auto-code@logic"))),
				source: (ջթ.cofv(hd.source
			))};
		} else if(source) {
			// data from embedded source, do not save to local storage but allow edit
			this.data = {
				filename: (ջթ.cofv(filename)),
				mode: (ջթ.cofv(mode)),
				source: (ջթ.cofv(source))
			};
		} else {
			// pure sandbox, load and save from/to storage
			this.reloadStorage();
			this.saveStorage();
		}
		this.data.editorSource = this.data.source.value;
		this.result = ջթ.coff(() => Transpiler.transpile({filename: this.data.filename.value, mode: this.data.mode.value, es6: this.es6, sandboxed: true}, this.data.source.value)).async().d(ջլ,  this.data.filename,  this.data.mode,  this.data.source);
	}

	checkES6() {
		try {
			eval("() => {}");
			return true;
		} catch(e) {
			return false;
		}
	}

	reloadStorage() {

	}

	saveStorage() {var ջլ=ջթ.cfa(ջի, arguments, 0);
		const saver = ջթ.coff(() => JSON.stringify({
			filename: this.data.filename.value,
			mode: this.data.mode.value,
			source: this.data.source.value
		})).async().d(ջլ,  this.data.filename,  this.data.mode,  this.data.source);
		saver.$$subscribe(ջլ, value => window.localStorage.setItem("storage__" + this.currentId, value));
	}

	save() {
		this.data.source.update(this.data.editorSource, 8934);
	}

	initCodeMirror(element, readOnly, mode) {
		const editor = CodeMirror.fromTextArea(element, {
			lineNumbers: true,
			indentWithTabs: true,
			smartIndent: false,
			lineWrapping: true,
			theme: "sactory",
			readOnly, mode
		});
		editor.setSize("100%", "100%");
		return editor;
	}

	initSourceEditor(element) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		const editor = this.initCodeMirror(element, this.readonly, "jsx");
		editor.on("change", () => this.data.editorSource = editor.getValue());
		this.data.source.$$subscribe(ջլ, value => editor.setValue(value), 8934);
		ջժ(ջլ, [ջժ.use, element.nextElementSibling], [ջժ.update, [[ [3, ջթ.attr((ջթ.config.shortcut.save), ":prevent"), (event, target) => {this.save()}]]]] )
	}

	initResultEditor(element) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		const editor = this.initCodeMirror(element, true, "javascript");
		this.result.$$subscribe(ջլ, value => editor.setValue(value.source.contentOnly));
	}

	editInSandbox() {
		const { filename, source } = this.data;
		window.open("./sandbox#" + btoa(JSON.stringify({data: {filename, source}})));
	}
	
	render({orientation = "x", hide = []}) {var ջլ=ջթ.cfa(ջի, arguments, 1);
		return ջժ(ջլ, [ջժ.create, "div", [[ [0, "data-orientation", orientation]]]], [ջժ.body, ջլ => {
			ջթ.forEachArray(hide , (value) => {
				ջժ(ջլ, [ջժ.update, [[ [5, "class", `hide-${value}`]]]] );
			});
			ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "top"]]]], [ջժ.body, ջլ => {
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "actions"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "div", []], [ջժ.body, ջլ => {
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "left"]]]], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "input", [[ [0, "class", "input"], [0, "placeholder", "File Name"], [1, "disabled", ջթ.bo(() => !this.edit.filename.value, [this.edit.filename])]]]], [ջժ.bind, ["text", "", ջթ.bo(() => this.data.filename.value, [this.data.filename]), ջխ => {this.data.filename.value=ջխ}]], [ջժ.append] );
						}], [ջժ.append]);
						ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "right"]]]], [ջժ.body, ջլ => {
							ջժ(ջլ, [ջժ.create, "input", [[ [0, "class", "input"], [0, "placeholder", "Mode"], [1, "disabled", ջթ.bo(() => !this.edit.mode.value, [this.edit.mode])]]]], [ջժ.bind, ["text", "::change", ջթ.bo(() => this.data.mode.value, [this.data.mode]), ջխ => {this.data.mode.value=ջխ}]], [ջժ.append] );
							ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button default"]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-cog"]]]], [ջժ.append] );}], [ջժ.append]);
							if(this.readonly) {
								ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.editInSandbox()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Edit in Sandbox`]);}], [ջժ.append]);
							} else {
								ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button default"]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.create, "i", [[ [0, "class", "fas fa-plus"]]]], [ջժ.append] );}], [ջժ.append]);
								ջժ(ջլ, [ջժ.create, "button", [[ [0, "class", "button primary"], [3, "click", (event, target) => {this.save()}]]]], [ջժ.body, ջլ => {ջժ(ջլ, [ջժ.text, `Run`]);}], [ջժ.append]);
							}
						}], [ջժ.append]);
					}], [ջժ.append]);
				}], [ջժ.append]);
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "editor"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "textarea", [[ [1, "value", this.data.editorSource], [3, "documentappend", (event, target) => {this.initSourceEditor(target)}]]]], [ջժ.append] );
				}], [ջժ.append]);
			}], [ջժ.append]);
			ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "bottom"]]]], [ջժ.body, ջլ => {
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "frame"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "iframe", [[ [0, "srcdoc", ջթ.bo(() => `<script src="${this.root}sactory.min.js"></script><script>window.onload=function(){${this.result.value.source.all}}</script>`, [this.result])]]]], [ջժ.append] );
				}], [ջժ.append]);
				ջժ(ջլ, [ջժ.create, "div", [[ [0, "class", "source"]]]], [ջժ.body, ջլ => {
					ջժ(ջլ, [ջժ.create, "textarea", [[ [1, "value", this.result.value.source.contentOnly], [3, "documentappend", (event, target) => {this.initResultEditor(target)}]]]], [ջժ.append] );
				}], [ջժ.append]);
			}], [ջժ.append]);
		}], [ջժ.append])
	}

	static style() {var ջլ=ջթ.cfa(ջի, arguments, 0);
		return ջժ(ջլ, [ջժ.create, "style", []], [ջժ.body, ջլ => {ջթ.cabs(ջլ, (ջխ, $) => {var ջծ=ջթ.root();
			ջծ.value(`position`, `absolute`);
			ջծ.value(`top, bottom, left, right`, `0`);

			var ջկ=ջթ.select(ջծ, `.top, .bottom`); 
				ջկ.value(`position`, `absolute`);
			

			var ջհ=ջթ.select(ջծ, `&[data-orientation='x']`); 
				var ջձ=ջթ.select(ջհ, `.top, .bottom`); 
					ջձ.value(`top, bottom`, `0`);
					ջձ.value(`width`, `50%`);
				
				var ջղ=ջթ.select(ջհ, `.top`); 
					ջղ.value(`left`, `0`);
					ջղ.value(`border-right`, `2px solid transparent`);
				
				var ջճ=ջթ.select(ջհ, `.bottom`); 
					ջճ.value(`right`, `0`);
					ջճ.value(`border-left`, `2px solid transparent`);
				
			

			var ջմ=ջթ.select(ջծ, `&[data-orientation='y']`); 
				var ջյ=ջթ.select(ջմ, `.top, .bottom`); 
					ջյ.value(`left, right`, `0`);
					ջյ.value(`height`, `50%`);
				
				var ջն=ջթ.select(ջմ, `.top`); 
					ջն.value(`top`, `0`);
					ջն.value(`border-bottom`, `2px solid transparent`);
				
				var ջշ=ջթ.select(ջմ, `.bottom`); 
					ջշ.value(`bottom`, `0`);
					ջշ.value(`border-top`, `2px solid transparent`);
				
			

			var ջո=ջթ.select(ջծ, `.top`); 
				var ջչ=ջթ.select(ջո, `.actions, .editor`); 
					ջչ.value(`position`, `absolute`);
					ջչ.value(`left, right`, `0`);
				
				var ջպ=ջթ.select(ջո, `.actions`); 
					ջպ.value(`top`, `0`);
					ջպ.value(`height`, `64px`);
					ջպ.value(`border-bottom`, `2px solid transparent`);
					var ջջ=ջթ.select(ջպ, `& > div`); 
						ջջ.value(`background`, `white`);
						ջջ.value(`height`, `100%`);
						ջջ.value(`padding`, `0 12px`);
						ջջ.value(`display`, `flex`);
						ջջ.value(`justify-content`, `space-between`);
						var ջռ=ջթ.select(ջջ, `.left, .right`); 
							ջռ.value(`display`, `flex`);
							ջռ.value(`align-items`, `center`);
							var ջս=ջթ.select(ջռ, `* + *`); 
								ջս.value(`margin-left`, `12px`);
							
						
					
				
				var ջվ=ջթ.select(ջո, `.editor`); 
					ջվ.value(`top`, `64px`);
					ջվ.value(`bottom`, `0`);
					ջվ.value(`border-top`, `2px solid transparent`);
				
			

			var ջտ=ջթ.select(ջծ, `.bottom`); 
				var ջր=ջթ.select(ջտ, `.frame, .source`); 
					ջր.value(`position`, `absolute`);
					ջր.value(`height`, `50%`);
					ջր.value(`left, right`, `0`);
				
				var ջց=ջթ.select(ջտ, `.frame`); 
					ջց.value(`width`, `100%`);
					ջց.value(`top`, `0`);
					ջց.value(`border-bottom`, `2px solid transparent`);
					var ջւ=ջթ.select(ջց, `iframe`); 
						ջւ.value(`width, height`, `100%`);
						ջւ.value(`margin`, `0`);
						ջւ.value(`border`, `0`);
						ջւ.value(`background`, `white`);
					
				
				var ջփ=ջթ.select(ջտ, `.source`); 
					ջփ.value(`bottom`, `0`);
					ջփ.value(`border-top`, `2px solid transparent`);
				
			

			var ջք=ջթ.select(ջծ, `.CodeMirror`); 
				ջք.value(`background`, `white !important`);
			

			var ջօ=ջթ.select(ջծ, `&.hide-result`); 
				var ջֆ=ջթ.select(ջօ, `.bottom`); 
					var ջև=ջթ.select(ջֆ, `.frame`); 
						ջև.value(`height`, `100%`);
						ջև.value(`border-bottom-width`, `0`);
					
					var ռա=ջթ.select(ջֆ, `.source`); 
						ռա.value(`display`, `none`);
					
				
			ջժ(ջլ, [ջժ.text, `
		`]);return ջծ.content}, [], [])}], [ջժ.append]);
	}

};
