!function(a){
	if(typeof define == 'function' && define.amd) {
		define(a);
	} else {
		window.Sactory = a();
	}
}(function(){

var toString = function(){return Object.toString().replace(/Object/, 'Sactory').replace(/native/, 'sactory');};
Sactory.toString = toString.toString = toString;
function get(prop, value){ Object.defineProperty(Sactory, prop, {get: function(){ return value; }}); }
get('VERSION_MAJOR', 0);
get('VERSION_MINOR', 102);
get('VERSION_PATCH', 0);
get('VERSION', '0.102.0');

var Polyfill = {};
	
Polyfill.startsWith = String.prototype.startsWith || function(search, pos) {
	pos = !pos || pos < 0 ? 0 : +pos;
	return this.substring(pos, pos + search.length) === search;
};

Polyfill.endsWith = String.prototype.endsWith || function(search, this_len) {
	if(this_len === undefined || this_len > this.length) this_len = this.length;
	return this.substring(this_len - search.length, this_len) === search;
};

Polyfill.trimStart = String.prototype.trimStart || function(){
	return this.replace(/^[\s\uFEFF\xA0]+/g, "");
};

Polyfill.trimEnd = String.prototype.trimEnd || function(){
	return this.replace(/[\s\uFEFF\xA0]+$/g, "");
};

Polyfill.padStart = String.prototype.padStart || function(target, string){
	var ret = String(this);
	while(ret.length < target) ret = string + ret;
	return ret;
};

Polyfill.assign = Object.assign || function(target, source){
	for(var key in source) {
		target[key] = source[key];
	}
	return target;
};



var Const = {};

function def(key, value) {
	Object.defineProperty(Const, key, {
		value: value
	});
}

// attribute type for builder
def("BUILDER_TYPE_NONE", 0);
def("BUILDER_TYPE_PROP", 1);
def("BUILDER_TYPE_CONCAT", 2);
def("BUILDER_TYPE_ON", 3);
def("BUILDER_TYPE_WIDGET", 4);
def("BUILDER_TYPE_EXTEND_WIDGET", 5);

// update types for observable
def("OBSERVABLE_UPDATE_TYPE_ARRAY_PUSH", 1048571);
def("OBSERVABLE_UPDATE_TYPE_ARRAY_POP", 1048572);
def("OBSERVABLE_UPDATE_TYPE_ARRAY_UNSHIFT", 1048573);
def("OBSERVABLE_UPDATE_TYPE_ARRAY_SHIFT", 1048574);
def("OBSERVABLE_UPDATE_TYPE_ARRAY_SPLICE", 1048575);
def("OBSERVABLE_UPDATE_TYPE_FORM_RANGE_START", 1048576);
def("OBSERVABLE_UPDATE_TYPE_FORM_RANGE_LENGTH", 1048576);





var mac = typeof window == "object" && window.navigator.platform.indexOf("Mac") != -1;

var cmd = mac ? "meta" : "ctrl";

/**
 * @since 0.64.0
 */
Sactory.config = {
	prefix: "sa",
	shortcut: {
		cmd: cmd,
		save: "keydown:" + cmd + ":key-code.83",	// s
		copy: "keydown:" + cmd + ":key-code.67",	// c
		cut: "keydown:" + cmd + ":key-code.88",		// x
		paste: "keydown:" + cmd + ":key-code.86",	// v
		print: "keydown:" + cmd + ":key-code.80",	// p
		undo: "keydown:" + cmd + ":key-code.90",	// z
		redo: "keydown:" + cmd + ":key-code.89",	// y
		find: "keydown:" + cmd + ":key-code.70",	// f
		select: "keydown:" + cmd + ":key-code.65",	// a
	},
	event: {
		aliases: {
			"space": " ",
			"ctrl": "control",
			"column": ":",
			"dot": "."
		}
	}
};

Sactory.newPrefix = function(){
	return Sactory.config.prefix + Math.floor(Math.random() * 100000);
}









var animations = {};

Sactory.addAnimation = function(name, value){
	animations[name] = value;
};

Sactory.getAnimation = function(name){
	return animations.hasOwnProperty(name) ? animations[name] : null;
};

Sactory.createKeyframes = function(animation, options){
	var name = Sactory.newPrefix();
	var keyframes = [];
	if(typeof animation == "function") animation = animation(options);
	else {
		// cache keyframes functions for animations that are plain objects
		if(animation.className) return animation.className;
		else animation.className = name;
	}
	if(!options.easing) options.easing = animation.easing;
	if(!options.duration) options.duration = animation.duration;
	var style = document.createElement("style");
	if(animation.element) {
		style.textContent = "@keyframes " + name + "{" + animation.element.textContent + "}";
	} else {
		for(var i in animation) {
			if(i == "from" || i == "to") {
				var value = [];
				for(var key in animation[i]) {
					value.push({selector: key, value: animation[i][key] + ""});
				}
				keyframes.push({selector: i, value: value});
			}
		}
		style.textContent = Sactory.compileStyle([{selector: "@keyframes " + name, value: keyframes}]);
	}
	
	document.head.appendChild(style);
	return name;
};










/**
 * @class
 * @since 0.45.0
 */
function Bind(parent) {
	this.parent = parent;
	this.children = [];
	this.subscriptions = [];
	this.elements = [];
	this.rollbacks = [];
}

/**
 * @since 0.45.0
 */
Bind.prototype.fork = function(){
	var child = new Bind(this);
	this.children.push(child);
	return child;
}

/**
 * @since 0.45.0
 */
Bind.prototype.rollback = function(){
	if(this.subscriptions.length) {
		this.subscriptions.forEach(function(subscription){
			subscription.dispose();
		});
		this.subscriptions = [];
	}
	if(this.elements.length) {
		this.elements.forEach(function(element){
			if(element.__builderInstance && element.dispatchEvent) element.__builder.dispatchEvent("remove");
			if(element.parentNode) element.parentNode.removeChild(element);
		});
		this.elements = [];
	}
	if(this.rollbacks.length) {
		this.rollbacks.forEach(function(fun){
			fun();
		});
		this.rollbacks = [];
	}
	if(this.children.length) {
		this.children.forEach(function(child){
			child.rollback();
		});
		this.children = [];
	}
};

/**
 * @since 0.45.0
 */
Bind.prototype.subscribe = function(subscription){
	this.subscriptions.push(subscription);
};

/**
 * @since 0.45.0
 */
Bind.prototype.appendChild = function(element){
	this.elements.push(element);
};

/**
 * @since 0.64.0
 */
Bind.prototype.addRollback = function(fun){
	this.rollbacks.push(fun);
};

var factory = new Bind(null);

/**
 * @since 0.45.0
 */
Object.defineProperty(Sactory, "bindFactory", {
	get: function(){
		return factory;
	}
});

/**
 * @since 0.48.0
 */
Sactory.createAnchor = function(element, bind, anchor){
	var ret = document.createTextNode("");
	
	Object.defineProperty(ret, "nodeType", {
		value: Node.ANCHOR_NODE
	});
	if(anchor) element.insertBefore(ret, anchor);
	else element.appendChild(ret);
	if(bind) bind.appendChild(ret);
	return ret;
};

/**
 * @since 0.11.0
 */
Sactory.bind = function(context, element, bind, anchor, target, fun){
	var currentBind = (bind || Sactory.bindFactory).fork();
	var currentAnchor = null;
	var oldValue;
	var subscribe = !bind ? function(){} : function(subscriptions) {
		if(bind) bind.subscribe(subscriptions);
	};
	function record(value) {
		fun.call(context, element, currentBind, currentAnchor, oldValue = value);
	}
	function rollback() {
		currentBind.rollback();
	}
	if(element) {
		currentAnchor = Sactory.createAnchor(element, bind, anchor);
		
	}
	if(target.observe) target = target.observe;
	if(target.forEach) {
		target.forEach(function(ob){
			subscribe(ob.subscribe(function(){
				rollback();
				record();
			}));
		});
		record();
	} else if(Sactory.isObservable(target)) {
		subscribe(target.subscribe(function(value){
			rollback();
			record(value);
		}));
		record(target.value);
	} else {
		throw new Error("Cannot bind to the given value: not an observable or an array of observables.");
	}
};

/**
 * @since 0.102.0
 */
Sactory.bindIfElse = function(context, element, bind, anchor, conditions){
	var functions = Array.prototype.slice.call(arguments, 5);
	var currentBindDependencies = (bind || Sactory.bindFactory).fork();
	var currentBindContent = (bind || Sactory.bindFactory).fork();
	var currentAnchor;
	if(element) {
		currentAnchor = Sactory.createAnchor(element, bind, anchor);
	}
	// filter maybe observables
	conditions.forEach(function(condition){
		if(condition[2]) {
			Array.prototype.push.apply(condition[1], Sactory.filterObservables(condition[2]));
		}
	});
	var active = 0xFEE1DEAD;
	var results;
	function reload() {
		// reset results
		results = conditions.map(function(condition){
			return null;
		});
		// calculate new results and call body
		for(var i=0; i<results.length; i++) {
			var condition = conditions[i];
			if(!condition[0] || (results[i] = !!condition[0].call(context))) {
				active = i;
				functions[i].call(context, element, currentBindContent, currentAnchor);
				return;
			}
		}
		// no result found
		active = 0xFEE1DEAD;
	}
	function recalc() {
		currentBindContent.rollback();
		reload();
	}
	conditions.forEach(function(condition, i){
		if(condition[1]) {
			condition[1].forEach(function(dependency){
				currentBindDependencies.subscribe(dependency.subscribe(function(){
					if(i <= active) {
						// the change may affect what is being displayed
						var result = !!condition[0].call(context);
						if(result != results[i]) {
							// the condition has changes, need to recalc
							results[i] = result;
							recalc();
						}
					}
				}));
			});
		}
	});
	reload();
};

/**
 * @since 0.102.0
 */
Sactory.bindEach = function(context, element, bind, anchor, target, getter, fun){
	if(getter.call(context).forEach) {
		var currentBind = (bind || Sactory.bindFactory).fork();
		var firstAnchor, lastAnchor;
		if(element) {
			firstAnchor = Sactory.createAnchor(element, bind, anchor);
			lastAnchor = Sactory.createAnchor(element, bind, anchor);
			
		}
		var binds = [];
		function add(action, bind, anchor, value, index, array) {
			fun.call(context, element, bind, anchor, value, index, array);
			binds[action]({bind: bind, anchor: anchor});
		}
		function updateAll() {
			getter.call(context).forEach(function(value, index, array){
				add("push", currentBind.fork(), element ? Sactory.createAnchor(element, currentBind, lastAnchor) : null, value, index, array);
			});
		}
		currentBind.subscribe(target.subscribe(function(array, _, type, data){
			switch(type) {
				case Const.OBSERVABLE_UPDATE_TYPE_ARRAY_PUSH:
					Array.prototype.forEach.call(data, function(value, i){
						add("push", currentBind.fork(), element ? Sactory.createAnchor(element, currentBind, lastAnchor) : null, value, array.length - data.length + i, array);
					});
					break;
				case Const.OBSERVABLE_UPDATE_TYPE_ARRAY_POP:
					var popped = binds.pop();
					if(popped) {
						popped.bind.rollback();
						if(popped.anchor) popped.anchor.parentNode.removeChild(popped.anchor);
					}
					break;
				case Const.OBSERVABLE_UPDATE_TYPE_ARRAY_UNSHIFT:
					Array.prototype.forEach.call(data, function(value){
						add("unshift", currentBind.fork(), element ? Sactory.createAnchor(element, currentBind, firstAnchor.nextSibling) : null, value, 0, array);
					});
					break;
				case Const.OBSERVABLE_UPDATE_TYPE_ARRAY_SHIFT:
					var shifted = binds.shift();
					if(shifted) {
						shifted.bind.rollback();
						if(shifted.anchor) shifted.anchor.parentNode.removeChild(shifted.anchor);
					}
					break;
				case Const.OBSERVABLE_UPDATE_TYPE_ARRAY_SPLICE:
					// insert new elements then call splice on binds and rollback
					var index = data[0];
					var ptr = binds[index];
					var anchorTo = ptr && ptr.anchor && ptr.anchor.nextSibling;
					var args = [];
					Array.prototype.slice.call(data, 2).forEach(function(value){
						args.push({value: value});
					});
					Array.prototype.splice.apply(binds, Array.prototype.slice.call(data, 0, 2).concat(args)).forEach(function(removed){
						removed.bind.rollback();
						if(removed.anchor) removed.anchor.parentNode.removeChild(removed.anchor);
					});
					args.forEach(function(info, i){
						info.bind = currentBind.fork();
						info.anchor = anchorTo ? Sactory.createAnchor(element, currentBind, anchorTo) : null;
						fun.call(context, element, info.bind, info.anchor, info.value, i + index, array);
					});
					break;
				default:
					currentBind.rollback();
					binds = [];
					updateAll();
			}
		}));
		updateAll();
	} else {
		// use normal bind and Sactory.forEach
		Sactory.bind(context, element, bind, anchor, target, function(element, bind, anchor){
			Sactory.forEach(context, getter.call(context), function(){
				var args = [element, bind, anchor];
				Array.prototype.push.apply(args, arguments);
				fun.apply(context, args);
			});
		});
	}
};

/**
 * @since 0.102.0
 */
Sactory.bindEachMaybe = function(context, element, bind, anchor, target, getter, fun){
	if(Sactory.isObservable(target)) {
		Sactory.bindEach(context, element, bind, anchor, target, getter, fun);
	} else {
		Sactory.forEach(context, getter.call(context), function(){
			var args = [element, bind, anchor];
			Array.prototype.push.apply(args, arguments);
			fun.apply(context, args);
		});
	}
};

/**
 * @since 0.58.0
 */
Sactory.subscribe = function(bind, observable, callback, type){
	var subscription = Sactory.observe(observable, callback, type, true);
	if(bind) bind.subscribe(subscription);
	return subscription;
};











// generate class name for hidden elements
var hidden = Sactory.newPrefix();
var hiddenAdded = false;

/**
 * @class
 */
function Builder(element) {

	this.element = element;

	this.animations = {i: [], o: []};
	this.animationTimeout = false;
	this.animationStart = 0;

	Object.defineProperty(this, "runtimeId", {
		configurable: true,
		get: function(){
			var id = Math.round(Math.random() * 100000);
			Object.defineProperty(this, "runtimeId", {
				get: function(){
					return id;
				}
			});
			return id;
		}
	});

}

Builder.prototype.widgets = {};

Builder.prototype.widget = null;

/**
 * @since 0.42.0
 */
Builder.prototype.subscribe = function(bind, subscription){
	if(bind) bind.subscriptions.push(subscription);
};
	
Builder.prototype.attrImpl = function(name, value){
	this.element.setAttribute(name, value);
};
	
Builder.prototype.attr = function(name, value, bind){
	var attrImpl = this.attrImpl.bind(this);
	if(Sactory.isObservable(value)) {
		this.subscribe(bind, Sactory.observe(value, function(value){
			attrImpl(name, value);
		}));
	} else {
		attrImpl(name, value);
	}
};

Builder.prototype.propImpl = function(name, value){
	var o = this.element;
	if(name.charAt(0) == '@') {
		o = this.widgets;
		name = name.substr(1);
		if(name.charAt(0) == '.') name = name.substr(1);
	}
	var s = name.split('.');
	while(s.length > 1) {
		o = o[s.shift()];
	}
	o[s[0]] = value;
};
	
Builder.prototype.prop = function(name, value, bind, type){
	var propImpl = this.propImpl.bind(this);
	if(Sactory.isObservable(value)) {
		this.subscribe(bind, Sactory.observe(value, function(value){
			propImpl(name, value);
		}, type));
	} else {
		propImpl(name, value);
	}
};

/**
 * @since 0.63.0
 */
Builder.prototype.append = function(element, bind, anchor){
	if(anchor && anchor.parentNode === this.element) this.element.insertBefore(element, anchor);
	else this.element.appendChild(element);
	if(bind) bind.appendChild(element);
};

/**
 * @since 0.46.0
 */
Builder.prototype.visible = function(value, reversed, bind){
	if(!hiddenAdded) {
		hiddenAdded = true;
		var style = document.createElement("style");
		style.textContent = "." + hidden + "{display:none !important;}";
		
		document.head.appendChild(style);
	}
	var builder = this;
	var update = function(value){
		if(!!value ^ reversed) {
			builder.removeClass(hidden);
		} else {
			builder.addClass(hidden);
		}
	};
	if(Sactory.isObservable(value)) {
		this.subscribe(bind, Sactory.observe(value, function(newValue, oldValue){ update(newValue, oldValue); }));
		// add animations functionalities
		var updateImpl = update;
		update = function(newValue, oldValue){
			if(newValue != oldValue) {
				if(this.animationTimeout) {
					// stop current animation
					this.element.style.animation = "";
					clearTimeout(this.animationTimeout);
					this.animationTimeout = false;
				}
				var animations = this.animations[newValue ? "i" : "o"];
				if(animations.length) {
					if(newValue) {
						// when the animation is in the element must be displayed immediately
						updateImpl(true);
					}
					animations = animations.slice(0); // duplicate
					var i = 0;
					function run() {
						var animation = animations[i];
						var duration = animation.options.duration || 1;
						this.element.style.animation = animation.name + " " + duration + "s " + (animation.options.easing || "linear") + " forwards";
						this.element.style.animationDirection = newValue ? "reverse" : "normal";
						this.animationTimeout = setTimeout(function(){
							if(++i < animations.length) {
								run.call(this);
							} else {
								// the animations are over
								updateImpl(newValue);
								this.element.style.animation = "";
								this.animationTimeout = false;
							}
						}.bind(this), duration * 1000);
					}
					run.call(this);
				} else {
					updateImpl(newValue);
				}
			}
		}.bind(this);
	} else {
		update(value);
	}
};

/**
 * @since 0.79.0
 */
Builder.prototype.style = function(name, value, bind){
	var node = document.createElement("style");
	
	var className = Sactory.newPrefix();
	var wrap;
	var dot = name.indexOf('.');
	if(dot == -1) {
		wrap = function(value){
			return "." + className + name + "{" + value + "}";
		};
	} else {
		var prop = name.substr(dot + 1);
		name = name.substring(0, dot);
		wrap = function(value){
			return "." + className + name + "{" + prop + ":" + value + "}";
		};
	}
	if(Sactory.isObservable(value)) {
		this.subscribe(Sactory.observe(value, function(value){
			node.textContent = wrap(value);
		}));
	} else {
		node.textContent = wrap(value);
	}
	this.className(className, bind);
	document.head.appendChild(node);
	if(bind) bind.appendChild(node);
};
	
Builder.prototype.text = function(value, bind, anchor){
	var textNode;
	if(Sactory.isObservable(value)) {
		textNode = document.createTextNode("");
		this.subscribe(bind, Sactory.observe(value, function(value){
			textNode.textContent = value;
			textNode.observed = true;
		}));
	} else {
		textNode = document.createTextNode(value);
	}
	if(anchor && anchor.parentNode === this.element) this.element.insertBefore(textNode, anchor);
	else this.element.appendChild(textNode);
	if(bind) bind.appendChild(textNode);
};

/**
 * @since 0.63.0
 */
Builder.prototype.html = function(value, bind, anchor){
	var children, builder = this;
	var container = document.createElement("div");
	function parse(value, anchor) {
		container.innerHTML = value;
		children = Array.prototype.slice.call(container.childNodes, 0);
		children.forEach(function(child){
			builder.append(child, bind, anchor);
		});
	}
	if(Sactory.isObservable(value)) {
		// create an anchor to maintain the right order
		var innerAnchor = Sactory.createAnchor(this.element, bind, anchor);
		this.subscribe(bind, value.subscribe(function(value){
			// removing children from bind context should not be necessary,
			// as they can't have any sactory-created context
			children.forEach(function(child){
				builder.element.removeChild(child);
			});
			parse(value, innerAnchor);
		}));
		parse(value.value, innerAnchor);
	} else {
		parse(value, anchor);
	}
};

/**
 * @since 0.100.0
 */
Builder.prototype.className = function(className, bind){
	var builder = this;
	if(Sactory.isObservable(className)) {
		var value = className.value;
		this.subscribe(bind, className.subscribe(function(newValue){
			builder.removeClassName(value);
			builder.addClassName(value = newValue);
		}));
		this.addClassName(value);
		if(bind) {
			bind.addRollback(function(){
				builder.removeClassName(value);
			});
		}
	} else {
		this.addClassName(className);
		if(bind) {
			bind.addRollback(function(){
				builder.removeClassName(className);
			});
		}
	}
};

/**
 * @since 0.100.0
 */
Builder.prototype.classNameIf = function(className, condition, bind){
	var builder = this;
	if(Sactory.isObservable(condition)) {
		this.subscribe(bind, condition.subscribe(function(newValue, oldValue){
			if(newValue) {
				// add class
				builder.addClassName(className);
			} else {
				// remove class name
				builder.removeClassName(className);
			}
		}));
		if(condition.value) this.addClassName(className);
		if(bind) {
			bind.addRollback(function(){
				if(condition.value) builder.removeClassName(className);
			});
		}
	} else if(condition) {
		this.addClassName(className);
		if(bind) {
			bind.addRollback(function(){
				builder.removeClassName(className);
			});
		}
	}
};

/**
 * @since 0.22.0
 */
Builder.prototype.event = function(context, name, value, bind){
	var split = name.split(':');
	var event = split.shift();
	var listener = value || function(){};
	var options = {};
	var useCapture = false;
	split.reverse().forEach(function(mod){
		var prev = listener;
		switch(mod) {
			case "this":
				listener = function(event){
					return prev.call(context, event, this);
				};
				break;
			case "prevent":
				listener = function(event){
					event.preventDefault();
					return prev.call(this, event);
				};
				break;
			case "stop":
				listener = function(event){
					event.stopPropagation();
					return prev.call(this, event);
				};
				break;
			case "once":
				options.once = true;
				break;
			case "passive":
				options.passive = true;
				break;
			case "capture":
				useCapture = true;
				break;
			case "bubble":
				useCapture = false;
				break;
			case "trusted":
				listener = function(event){
					if(event.isTrusted) return prev.call(this, event);
				};
				break;
			case "!trusted":
				listener = function(event){
					if(!event.isTrusted) return prev.call(this, event);
				};
				break;
			case "self":
				listener = function(event){
					if(event.target === this) return prev.call(this, event);
				};
				break;
			case "!self":
				listener = function(event){
					if(event.target !== this) return prev.call(this, event);
				};
				break;
			case "alt":
			case "ctrl":
			case "meta":
			case "shift":
				listener = function(event){
					if(event[mod + "Key"]) return prev.call(this, event);
				};
				break;
			case "!alt":
			case "!ctrl":
			case "!meta":
			case "!shift":
				mod = mod.substr(1);
				listener = function(event){
					if(!event[mod + "Key"]) return prev.call(this, event);
				};
				break;
			default:
				var positive = mod.charAt(0) != '!';
				if(!positive) mod = mod.substr(1);
				var dot = mod.split('.');
				switch(dot[0]) {
					case "key":
						var keys = dot.slice(1).map(function(a){
							var ret = a.toLowerCase();
							if(Sactory.config.event.aliases.hasOwnProperty(ret)) ret = Sactory.config.event.aliases[ret];
							var separated = ret.split('-');
							if(separated.length == 2) {
								var range;
								if(separated[0].length == 1 && separated[1].length == 1) {
									range = [separated[0].toUpperCase().charCodeAt(0), separated[1].toUpperCase().charCodeAt(0)];
								} else if(separated[0].charAt(0) == 'f' && separated[1].charAt(0) == 'f') {
									range = [111 + parseInt(separated[0].substr(1)), 111 + parseInt(separated[1].substr(1))];
								}
								if(range) {
									return function(event){
										var code = event.keyCode || event.which;
										return code >= range[0] && code <= range[1];
									}
								}
							}
							if(ret != '-') ret = ret.replace(/-/g, "");
							return function(event){
								return event.key.toLowerCase() == ret;
							};
						});
						if(positive) {
							listener = function(event){
								for(var i in keys) {
									if(keys[i](event)) return prev.call(this, event);
								}
							};
						} else {
							listener = function(event){
								for(var i in keys) {
									if(keys[i](event)) return;
								}
								return prev.call(this, event);
							};
						}
						break;
					case "code":
						var keys = dot.slice(1).map(function(a){ return a.toLowerCase().replace(/-/g, ""); });
						if(positive) {
							listener = function(event){
								if(keys.indexOf(event.code.toLowerCase()) != -1) return prev.call(this, event);
							};
						} else {
							listener = function(event){
								if(keys.indexOf(event.code.toLowerCase()) == -1) return prev.call(this, event);
							};
						}
						break;
					case "keyCode":
					case "key-code":
						var keys = dot.slice(1).map(function(a){ return parseInt(a); });
						if(positive) {
							listener = function(event){
								if(keys.indexOf(event.keyCode || event.which) != -1) return prev.call(this, event);
							};
						} else {
							listener = function(event){
								if(keys.indexOf(event.keyCode || event.which) == -1) return prev.call(this, event);
							};
						}
						break;
					case "button":
						var buttons = dot.slice(1).map(function(a){
							switch(a) {
								case "main":
								case "left":
									return 0;
								case "auxiliary":
								case "wheel":
								case "middle":
									return 1;
								case "secondary":
								case "right":
									return 2;
								case "fourth":
								case "back":
									return 3;
								case "fifth":
								case "forward":
									return 4;
								default:
									return parseInt(a);
							}
						});
						if(positive) {
							listener = function(event){
								if(buttons.indexOf(event.button) != -1) return prev.call(this, event);
							};
						} else {
							listener = function(event){
								if(buttons.indexOf(event.button) == -1) return prev.call(this, event);
							};
						}
						break;
					case "location":
						var locations = dot.slice(1).map(function(a){
							switch(a) {
								case "standard": return 0;
								case "left": return 1;
								case "right": return 2;
								case "numpad": return 3;
								default: return parseInt(a);
							}
						});
						if(positive) {
							listener = function(event){
								if(locations.indexOf(event.location) != -1) return prev.call(this, event);
							};
						} else {
							listener = function(event){
								if(locations.indexOf(event.location) == -1) return prev.call(this, event);
							};
						}
						break;
					case "throttle":
						var delay = parseInt(dot[1]);
						if(delay >= 0) {
							var timeout = false;
							listener = function(event){
								if(!timeout) {
									prev.call(this, event);
									timeout = true;
									timeout = setTimeout(function(){
										timeout = false;
									}, delay);
								}
							};
						} else {
							throw new Error("Event delay must be higher or equals than 0.");
						}
						break;
					case "debounce":
						var delay = parseInt(dot[1]);
						if(delay >= 0) {
							var timeout;
							listener = function(event){
								if(timeout) clearTimeout(timeout);
								var el = this;
								timeout = setTimeout(function(){
									timeout = 0;
									prev.call(el, event);
								}, delay);
							};
						} else {
							throw new Error("Event delay must be higher or equals than 0.");
						}
						break;
					default:
						throw new Error("Unknown event modifier '" + mod + "'.");
				}
				break;
		}
	});
	if(event == "documentappend") {
		// special event
		event = "append";
		var prev = listener;
		var element = this.element;
		listener = function(event){
			if(element.ownerDocument.contains(element)) prev.call(element, event);
			else this.parentNode.__builder.eventImpl("append", listener, options, useCapture, bind);
		};
	}
	this.eventImpl(event, listener, options, useCapture, bind);
};

/**
 * @since 0.91.0
 */
Builder.prototype.eventImpl = function(event, listener, options, useCapture, bind){
	this.element.addEventListener(event, listener, options, useCapture);
	if(bind) {
		var element = this.element;
		bind.addRollback(function(){
			element.removeEventListener(event, listener, useCapture);
		});
	}
};

/**
 * @since 0.62.0
 */
Builder.prototype.addClassName = function(className){
	if(this.element.className.length && !Polyfill.endsWith.call(this.element.className, ' ')) className = ' ' + className;
	this.element.className += className;
};

/**
 * @since 0.62.0
 */
Builder.prototype.removeClassName = function(className){
	var index = this.element.className.indexOf(className);
	if(index != -1) {
		this.element.className = (this.element.className.substring(0, index) + this.element.className.substr(index + className.length)).replace(/\s{2,}/, " ");
	}
};

/**
 * @since 0.69.0
 */
Builder.prototype[Const.BUILDER_TYPE_NONE] = function(name, value, bind){
	this.attr(name, value, bind);
};

/**
 * @since 0.63.0
 */
Builder.prototype[Const.BUILDER_TYPE_PROP] = function(name, value, bind){
	switch(name) {
		case "visible": return this.visible(value, false, bind);
		case "hidden": return this.visible(value, true, bind);
		case "enabled":
			if(Sactory.isObservable(value)) {
				this.prop("disabled", Sactory.computedObservable(null, bind, [value], function(){ return !value.value; }), bind);
			} else {
				this.prop("disabled", !value, bind);
			}
			break;
		default:
			if(Polyfill.startsWith.call(name, "style:")) {
				this.style(name.substr(5), value, bind);
			} else {
				this.prop(name, value, bind);
			}
	}
};

/**
 * @since 0.96.0
 */
Builder.prototype[Const.BUILDER_TYPE_CONCAT] = function(name, value, bind, anchor){
	switch(name) {
		case "text": return this.text(value, bind, anchor);
		case "html": return this.html(value, bind, anchor);
		case "class": return this.className(value, bind);
		default:
			if(Polyfill.startsWith.call(name, "class:")) {
				this.classNameIf(name.substr(6), value, bind);
			} else {
				throw new Error("Unknown concat attribute '" + name + "'.");
			}
	}
};

/**
 * @since 0.69.0
 */
Builder.prototype[Const.BUILDER_TYPE_ON] = function(name, value, bind, anchor, context){
	this.event(context, name, Sactory.unobserve(value), bind);
};

/**
 * @since 0.46.0
 */
Builder.prototype.form = function(info, value, bind){
	if(!Sactory.isObservable(value)) throw new Error("Cannot two-way bind '" + this.element.tagName.toLowerCase() + "': the given value is not an observable.");
	var splitted = info.split("::");
	var events = splitted.slice(1);
	var updateType = Const.OBSERVABLE_UPDATE_TYPE_FORM_RANGE_START + Math.floor(Math.random() * Const.OBSERVABLE_UPDATE_TYPE_FORM_RANGE_LENGTH);
	var inputType = this.element.type;
	var get;
	var converters = [];
	// calculate property name and default converter
	if(inputType == "checkbox") {
		this.prop("checked", value, bind, updateType);
		get = function(callback){
			callback(this.checked);
		};
	} else if(inputType == "radio") {
		// make sure that the radio buttons that depend on the same observable have
		// the same name and are in the same radio group
		if(!this.element.name) {
			this.element.name = value.radioGroupName || (value.radioGroupName = Sactory.newPrefix());
		}
		// subscription that returns sets `checked` to true when the value of the
		// observable is equal to the attribute value of the element
		var element = this.element;
		this.subscribe(bind, Sactory.observe(value, function(value){
			element.checked = value == element.value;
		}, updateType));
		get = function(callback){
			// the event is called only when radio is selected
			callback(this.value);
		};
	} else if(this.element.multiple) {
		// a multiple select does not bind to a property, instead it updates the options,
		// setting the selected property, everytime the observable is updated
		var options = this.element.options;
		this.subscribe(bind, Sactory.observe(value, function(value){
			// options is a live collection, no need to get the value again from the element
			Array.prototype.forEach.call(options, function(option){
				option.selected = value.indexOf(option.value) != -1;
			});
		}, updateType));
		// the get function maps the values of the selected options (obtained from the
		// `selectedOptions` property or a polyfill)
		get = function(callback){
			callback(Array.prototype.map.call(selectedOptions(this), function(option){
				return option.value;
			}));
		};
	} else {
		this.prop("value", value, bind, updateType);
		get = function(callback){
			callback(this.value);
		};
	}
	// calculate the default event type if none was specified
	if(!events.length) {
		if(this.element.tagName.toUpperCase() == "SELECT") {
			events.push("change");
		} else {
			if(this.element.type == "checkbox" || this.element.type == "radio") {
				events.push("change");
			} else {
				events.push("input");
			}
		}
	}
	splitted[0].split(":").slice(1).forEach(function(mod){
		converters.push(function(){
			switch(mod) {
				case "number":
				case "num":
				case "float":
					return parseFloat;
				case "int":
				case "integer":
					return parseInt;
				case "date":
					switch(inputType) {
						case "date":
						case "month":
							return function(){
								var s = this.split('-');
								return new Date(s[0], s[1] - 1, s[2] || 1);
							};
						case "time":
							return function(){
								var s = this.split(':');
								var date = new Date();
								date.setHours(s[0]);
								date.setMinutes(s[1]);
								date.setSeconds(0);
								date.setMilliseconds(0);
								return date;
							};
						case "datetime-local":
						default:
							return function(){ return new Date(this); };
					}
				case "comma":
					return function(){
						return this.replace(/,/g, '.');
					};
				case "trim":
					return String.prototype.trim;
				case "trim-left":
				case "trim-start":
					return Polyfill.trimStart;
				case "trim-right":
				case "trim-end":
					return Polyfill.trimEnd;
				case "lower":
				case "lowercase":
					return String.prototype.toLowerCase;
				case "upper":
				case "uppercase":
					return String.prototype.toUpperCase;
				case "capital":
				case "capitalize":
					return function(){
						return this.charAt(0).toUpperCase() + this.substr(1);
					};
				default:
					throw new Error("Unknown value modifier '" + mod + "'.");
			}
		}());
	});
	if(value.computed && value.dependencies.length == 1 && value.dependencies[0].deep) {
		// it's the child of a deep observable
		var deep = value.dependencies[0];
		var path = deep.lastPath.slice(0, -1);
		var key = deep.lastPath[deep.lastPath.length - 1];
		converters.push(function(newValue){
			var obj = deep.value;
			path.forEach(function(p){
				obj = obj[p];
			});
			value.updateType = updateType;
			obj[key] = newValue;
		});
	} else {
		converters.push(function(newValue){
			value.updateType = updateType;
			value.value = newValue;
		});
	}
	for(var i=0; i<events.length; i++) {
		this.event(null, events[i], function(){
			get.call(this, function(newValue){
				converters.forEach(function(converter){
					newValue = converter.call(newValue, newValue);
				});
			});
		}, bind);
	}
};

Builder.prototype.addAnimation = function(type, name, options){
	if(typeof options == "number") options = {duration: options};
	var animation = Sactory.getAnimation(name);
	if(!animation) throw new Error("Animation '" + name + "' is not defined.");
	var res = {name: Sactory.createKeyframes(animation, options), options: options};
	if(type == "io") {
		this.animations.i.push(res);
		this.animations.o.push(res);
	} else if(type == "in") {
		this.animations.i.push(res);
	} else if(type == "out") {
		this.animations.o.push(res);
	}
};

// polyfill

if(Object.getOwnPropertyDescriptor(Element.prototype, "classList")) {

	Builder.prototype.addClass = function(className){
		this.element.classList.add(className);
	};

	Builder.prototype.removeClass = function(className){
		this.element.classList.remove(className);
	};

} else {

	Builder.prototype.addClass= function(className){
		if(!this.element.className.split(' ').indexOf(className) != -1) {
			this.element.className = (this.element.className + ' ' + className).trim();
		}
	};

	Builder.prototype.removeClass = function(className){
		this.element.className = this.element.className.split(' ').filter(function(a){
			return a != className;
		}).join(' ');
	};

}

if(typeof Event == "function") {

	Builder.prototype.dispatchEvent = function(name, bubbles, cancelable){
		var event = new Event(name, bubbles, cancelable);
		this.element.dispatchEvent(event);
		return event;
	};

} else {

	Builder.prototype.dispatchEvent = function(name, bubbles, cancelable){
		var event = document.createEvent("Event");
		event.initEvent(name, bubbles, cancelable);
		this.element.dispatchEvent(event);
		return event;
	};

}

var selectedOptions = typeof HTMLSelectElement == "function" && Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "selectedOptions") ? 
	function(select){
		return select.selectedOptions;
	} :
	function(select){
		return Array.prototype.filter.call(select.options, function(option){
			return option.selected;
		});
	};







Object.defineProperty(Node, "ANCHOR_NODE", {
	writable: false,
	enumerable: true,
	configurable: false,
	value: 99
});

/**
 * @since 0.60.0
 */
function Sactory(context, element, bind, anchor) {
	var context = {
		context: context,
		element: element,
		container: element,
		bind: bind,
		anchor: anchor
	};
	for(var i=4; i<arguments.length; i++) {
		var args = arguments[i];
		var fun = args[0];
		args[0] = context;
		fun.apply(null, args);
	}
	return context.element;
}

// constants

Sactory.NS_XHTML = "http://www.w3.org/1999/xhtml";
Sactory.NS_SVG = "http://www.w3.org/2000/svg";
Sactory.NS_MATHML = "http://www.w3.org/1998/mathml";
Sactory.NS_XUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
Sactory.NS_XBL = "http://www.mozilla.org/xbl";

// widgets

var widgets = {};

/**
 * Defines or replaces a widget.
 * @param {string} name - The case-sensitive name of the widget.
 * @param {class} widget - The widget class.
 * @since 0.73.0
 */
Sactory.defineWidget = function(name, widget){
	widgets[name] = widget;
};

/**
 * Removes a widget by its name.
 * @since 0.73.0
 */
Sactory.undefineWidget = function(name){
	delete widgets[name];
};

/**
 * Indicates whether a widget with the given name exists.
 * @since 0.89.0
 */
Sactory.hasWidget = function(name){
	return widgets.hasOwnProperty(name);
};

/**
 * Gets a list with the names of every registered widget.
 * @since 0.73.0
 */
Sactory.getWidgetsName = function(){
	return Object.keys(widgets);
};

/**
 * @class
 * @since 0.73.0
 */
Sactory.Widget = function(){};

Sactory.Widget.prototype.element = null;

/**
 * @since 0.73.0
 */
Sactory.Widget.prototype.render = function(args){
	throw new Error("Widget's 'render' prototype function not implemented.");
};

/**
 * @since 0.94.0
 */
Sactory.Widget.prototype.dispatchEvent = function(event){
	if(!this.element) throw new Error("Cannot dispatch event: the widget has not been rendered yet.");
	this.element.__builder.dispatchEvent(event);
};

/**
 * @class
 * @since 0.73.0
 */
function SlotRegistry(name) {
	this.name = name;
	this.slots = {};
}

/**
 * @since 0.73.0
 */
SlotRegistry.prototype.add = function(anchor, name, element){
	this.slots[name || "__container"] = {element: element, anchor: anchor};
	
};

// init global functions used at runtime

/**
 * @since 0.80.0
 */
Sactory.noop = function(){};

/**
 * @since 0.32.0
 */
Sactory.check = function(major, minor, patch){
	if(major != Sactory.VERSION_MAJOR || minor != Sactory.VERSION_MINOR) {
		throw new Error("Code transpiled using version " + major + "." + minor + "." + patch + " cannot be run in the current environment using version " + Sactory.VERSION + ".");
	}
};

/**
 * @since 0.69.0
 */
Sactory.attr = function(type, name, value, optional){
	return {
		type: type,
		name: name,
		value: arguments.length > 2 ? value : "",
		optional: !!optional
	};
};

/**
 * @since 0.60.0
 */
Sactory.update = function(context, options){
	
	var args = [];
	var widgetArgs = {};
	var widgetExt = {};

	if(options.args) {
		// filter out optional arguments
		options.args = options.args.filter(function(a){
			return !a.optional || a.value !== undefined;
		});
		options.args.forEach(function(arg){
			var ext = arg.type == Const.BUILDER_TYPE_EXTEND_WIDGET;
			if(ext || arg.type == Const.BUILDER_TYPE_WIDGET) {
				var obj;
				if(ext) {
					var col = arg.name.indexOf(':');
					if(col == -1) {
						widgetExt[arg.name] = arg.value;
						return;
					} else {
						var key = arg.name.substring(0, col);
						if(!widgetExt.hasOwnProperty(key)) obj = widgetExt[key] = {};
						else obj = widgetExt[key];
						arg.name = arg.name.substr(col + 1);
					}
				} else {
					if(arg.name.length) {
						obj = widgetArgs;
					} else {
						widgetArgs = arg.value;
						return;
					}
				}
				var splitted = arg.name.split('.');
				if(splitted.length > 1) {
					for(var i=0; i<splitted.length-1; i++) {
						var k = splitted[i];
						if(typeof obj[k] != "object") obj[k] = {};
						obj = obj[k];
					}
					obj[splitted[splitted.length - 1]] = arg.value;
				} else {
					obj[arg.name] = arg.value;
				}
			} else {
				args.push(arg);
			}
		});
	}

	if(options.spread) {
		options.spread.forEach(function(spread){
			for(var key in spread) {
				args.push({type: Const.BUILDER_TYPE_NONE, name: key, value: spread[key]});
			}
		});
	}
	
	if(!context.element) {
		var widget = widgets[options.tagName];
		if(widget && options.widget !== false) {
			context.slots = new SlotRegistry(options.tagName);
			if(widget.prototype && widget.prototype.render) {
				var instance = new widget(widgetArgs, options.namespace);
				context.element = instance.render(context.slots, null, context.bind, null);
				if(instance instanceof Sactory.Widget) instance.element = context.element;
				context.element.__builder.widget = context.element.__builder.widgets[options.tagName] = instance;
			} else {
				context.element = widget(context.slots, null, context.bind, null, widgetArgs, options.namespace);
			}
			if(context.slots.slots.__container) {
				context.container = context.slots.slots.__container.element;
				context.anchor = context.slots.slots.__container.anchor;
			} else {
				context.container = context.element;
			}
			
		} else {
			if(options.namespace) {
				context.element = context.container = document.createElementNS(options.namespace, options.tagName);
			} else {
				context.element = context.container = document.createElement(options.tagName);
			}
			
		}
	}

	args.sort(function(a, b){
		return a.type - b.type;
	});
	
	args.forEach(function(arg){
		context.element.__builder[arg.type](arg.name, arg.value, context.bind, context.anchor, context.context);
	});

	if(options.transitions) {
		options.transitions.forEach(function(transition){
			context.element.__builder.addAnimation(transition[0], transition[1], transition[2] || {});
		});
	}

	for(var widgetName in widgetExt) {
		if(!widgets.hasOwnProperty(widgetName)) throw new Error("Widget '" + widgetName + "' could not be found.");
		var widget = widgets[widgetName];
		if(widget.prototype && widget.prototype.render) {
			var instance = new widgets[widgetName](widgetExt[widgetName]);
			instance.render(new SlotRegistry(""), context.element, context.bind, null);
			context.element.__builder.widgets[widgetName] = instance;
		} else {
			widget(new SlotRegistry(""), context.element, context.bind, null, widgetExt[widgetName]);
		}
		
	}

	
	
};

/**
 * @since 0.60.0
 */
Sactory.create = function(context, tagName, options){
	options.tagName = tagName;
	context.element = context.container = null; // delete parents
	context.anchor = null; // invalidate the current anchor so the children will not use it
	Sactory.update(context, options);
};

/**
 * @since 0.80.0
 */
Sactory.createOrUpdate = function(context, condition, tagName, options){
	if(condition) {
		Sactory.update(context, options);
	} else {
		Sactory.create(context, tagName, options);
	}
};

/**
 * @since 0.71.0
 */
Sactory.clone = function(context, options){
	context.element = context.container = context.element.cloneNode(true);
	context.anchor = null; // invalidate the current anchor so the children will not use it
	Sactory.update(context, options);
};

/**
 * @since 0.73.0
 */
Sactory.updateSlot = function(context, options, slots, widget, slotName, fun){
	var componentSlot = (function(){
		if(slots) {
			for(var i=slots.length-1; i>=0; i--) {
				if(slots[i].name == widget) {
					for(var name in slots[i].slots) {
						if(name == slotName) return slots[i].slots[name];
					}
				}
			}
		}
	})();
	if(!componentSlot) throw new Error("Could not find slot '" + slotName + "' for widget '" + widget + "'.");
	if(componentSlot.element) {
		context.element = componentSlot.element;
		Sactory.update(context, options);
	}
	fun.call(context.context, componentSlot.anchor ? componentSlot.anchor.parentNode : context.element, componentSlot.anchor);
};

/**
 * @since 0.60.0
 */
Sactory.body = function(context, slots, fun){
	if(context.slots && Object.keys(context.slots.slots).length) {
		slots = (slots || []).concat(context.slots);
	}
	fun.call(context.context, context.container, context.anchor, slots);
};

/**
 * @since 0.82.0
 */
Sactory.forms = function(context){
	Array.prototype.slice.call(arguments, 1).forEach(function(value){
		context.element.__builder.form(value[0], value[1], context.bind);
	});
};

/**
 * @since 0.60.0
 */
Sactory.append = function(context, parent, anchor, afterappend, beforeremove){
	if(parent && parent.nodeType || typeof parent == "string" && (parent = document.querySelector(parent))) {
		if(anchor && anchor.parentNode === parent) parent.insertBefore(context.element, anchor);
		else parent.appendChild(context.element);
		if(afterappend) afterappend.call(context.element);
		if(context.element.__builder && context.element.dispatchEvent) context.element.__builder.dispatchEvent("append"); //TODO only fire when listened for
		if(beforeremove) context.element.__builder.event(context.context, "remove", beforeremove, context.bind);
		if(context.bind) context.bind.appendChild(context.element);
	}
};

/**
 * @since 0.32.0
 */
Sactory.unique = function(context, id, fun){
	var className = Sactory.config.prefix + id;
	if(!document.querySelector("." + className)) {
		var element = fun.call(context);
		element.__builder.addClass(className);
		return element;
	}
};

/**
 * @since 0.32.0
 */
Sactory.query = function(context, doc, parent, selector, all, fun){
	var nodes = false;
	if(all || (nodes = selector && typeof selector == "object" && typeof selector.length == "number")) {
		if(!nodes) {
			selector = doc.querySelectorAll(selector);
		}
		Array.prototype.forEach.call(selector, function(element){
			fun.call(context, element, parent);
		});
		return selector;
	} else {
		if(typeof selector == "string") {
			selector = doc.querySelector(selector);
		}
		if(selector) fun.call(context, selector, parent);
		return selector;
	}
};

/**
 * @since 0.94.0
 */
Sactory.clear = function(context){
	var child;
	var element = context.container || context.element;
	while(child = element.lastChild) {
		element.removeChild(child);
	}
};

/**
 * @since 0.90.0
 */
Sactory.mixin = function(element, bind, anchor, data){
	if(data instanceof Node) {
		Sactory.append({element: data, bind: bind}, element, anchor);
	} else {
		Sactory.html(element, bind, anchor, data);
	}
};

/**
 * @since 0.78.0
 */
Sactory.text = function(element, bind, anchor, text){
	if(element) element.__builder.text(text, bind, anchor);
};

/**
 * @since 0.78.0
 */
Sactory.html = function(element, bind, anchor, html){
	if(element) element.__builder.html(html, bind, anchor);
};

/**
 * @since 0.40.0
 */
Sactory.comment = function(element, bind, anchor, comment){
	var ret = document.createComment(comment);
	Sactory.append({element: ret, bind: bind}, element, anchor);
	return ret;
};

/**
 * @since 0.78.0
 */
Sactory.on = function(context, element, bind, name, value){
	if(arguments.length == 6) {
		arguments[3].__builder.event(context, arguments[4], arguments[5], bind);
	} else {
		element.__builder.event(context, name, value, bind);
	}
};

/**
 * @since 0.88.0
 */
Sactory.widget = function(element, name){
	if(name) {
		return element.__builder.widgets[name] || null;
	} else {
		return element.__builder.widget || null;
	}
};

var currentId;

/**
 * @since 0.70.0
 */
Sactory.nextId = function(){
	return currentId = Sactory.newPrefix();
};

/**
 * @since 0.70.0
 */
Sactory.prevId = function(){
	return currentId;
};

/**
 * @since 0.98.0
 */
Sactory.forEach = function(context, value, fun){
	if(value.forEach) {
		value.forEach(fun.bind(context));
	} else {
		// assuming it's an object
		var index = 0;
		for(var key in value) {
			fun.call(context, key, value[key], index++, value);
		}
	}
};

/**
 * @since 0.98.0
 */
Sactory.range = function(context, from, to, fun){
	if(from < to) {
		for(var i=from; i<to; i++) {
			fun.call(context, i);
		}
	} else {
		for(var i=to; i>from; i--) {
			fun.call(context, i);
		}
	}
};

/**
 * @since 0.93.0
 */
Sactory.ready = function(callback){
	if(document.readyState == "complete") {
		callback();
	} else {
		window.addEventListener("load", callback);
	}
};





function defineBuilder(Class) {
	Object.defineProperty(Class.prototype, "__builder", {
		get: function(){
			return this.__builderInstance || (this.__builderInstance = new Builder(this));
		}
	});
}

defineBuilder(Window);
defineBuilder(Document);
defineBuilder(Element);
defineBuilder(DocumentFragment);
if(typeof ShadowRoot == "function") defineBuilder(ShadowRoot);






/**
 * @class
 * @since 0.42.0
 */
function Observable(value) {
	this.internal = {
		value: this.replace(value),
		snaps: {},
		count: 0,
		subscriptions: {}
	};
	this.updateType = undefined;
	this.updateDate = undefined;
	
}

Observable.prototype.deep = false;

Observable.prototype.diff = true;

Observable.prototype.computed = false;

Observable.prototype.replace = function(value){
	if(value && typeof value == "object") {
		if(value.constructor === Array || value.constructor === ObservableArray) return new ObservableArray(this, value);
		else if(value.constructor === Date) return new ObservableDate(this, value);
		else if(value.constructor === ObservableDate) return new ObservableDate(this, value.date);
		else return value;
	} else {
		return value;
	}
};

/**
 * @since 0.42.0
 */
Observable.prototype.update = function(value){
	this.updateImpl(arguments.length ? this.replace(value) : this.internal.value, this.updateType, this.updateData);
	this.updateType = undefined;
	this.updateDate = undefined;
};

Observable.prototype.updateImpl = function(value, type, data){
	var oldValue = this.internal.value;
	this.internal.value = value;
	for(var i in this.internal.subscriptions) {
		var subscription = this.internal.subscriptions[i];
		if(!subscription.type || subscription.type !== type) subscription.callback(value, oldValue, type, data);
	}
};

/**
 * @since 0.49.0
 */
Observable.prototype.snap = function(id){
	this.internal.snaps[id] = this.internal.value;
};

/**
 * @since 0.49.0
 */
Observable.prototype.snapped = function(id){
	return id in this.internal.snaps ? this.internal.snaps[id] : this.internal.value;
};

/**
 * @since 0.42.0
 */
Observable.prototype.subscribe = function(callback, type){
	var id = this.internal.count++;
	var subs = this.internal.subscriptions;
	var subscription = this.internal.subscriptions[id] = {
		type: type,
		callback: callback
	};
	return {
		to: this,
		subscription: subscription,
		dispose: function(){
			delete subs[id];
		}
	};
};

Observable.prototype.valueOf = function(){
	return this.internal.value;
};

Observable.prototype.toJSON = function(){
	return this.internal.value && this.internal.value.toJSON ? this.internal.value.toJSON() : this.internal.value;
};

Observable.prototype.toString = function(){
	return this.internal.value + "";
};

/**
 * @since 0.42.0
 */
Object.defineProperty(Observable.prototype, "value", {
	configurable: true,
	get: function(){
		return this.internal.value;
	},
	set: function(value){
		if(value !== this.internal.value) {
			this.update(value);
		}
	}
});

/**
 * @class
 * @since 0.81.0
 */
function DeepObservable(value) {
	Observable.call(this, value);
}

DeepObservable.prototype = Object.create(Observable.prototype);

DeepObservable.prototype.deep = true;

DeepObservable.prototype.replace = function(value){
	return this.observeChildren(value, []);
};

DeepObservable.prototype.makeChild = function(value, path){
	if(value && typeof value == "object") {
		this.observeChildren(value, path);
	}
	return value;
};

DeepObservable.prototype.observeChildren = function(value, path){
	var $this = this;
	Object.keys(value).forEach(function(key){
		var currentPath = path.concat(key);
		var childValue = $this.makeChild(value[key], currentPath);
		Object.defineProperty(value, key, {
			enumerable: true,
			get: function(){
				$this.lastPath = currentPath;
				return childValue;
			},
			set: function(newValue){
				childValue = $this.makeChild(newValue, currentPath);
				$this.update();
			}
		});
	});
	return value;
};

/**
 * @since 0.66.0
 */
DeepObservable.prototype.merge = function(object){
	var update = this.update;
	this.update = function(){}; // disable update
	this.mergeImpl(this.internal.value, object);
	this.update = update; // enable update
	this.update();
};

DeepObservable.prototype.mergeImpl = function(value, object){
	for(var key in object) {
		if(typeof value[key] == "object" && typeof object[key] == "object") {
			this.mergeImpl(value[key], object[key]);
		} else {
			value[key] = object[key];
		}
	}
};

/**
 * @class
 * @since 0.97.0
 */
function AlwaysObservable(value) {
	Observable.call(this, value);
}

AlwaysObservable.prototype = Object.create(Observable.prototype);

AlwaysObservable.prototype.diff = false;

Object.defineProperty(AlwaysObservable.prototype, "value", {
	configurable: true,
	get: function(){
		return this.internal.value;
	},
	set: function(value){
		this.update(value);
	}
});

/**
 * @since 0.54.0
 */
function makeSavedObservable(T, defaultValue, storage) {

	var observable;

	if(typeof Promise == "function") {
		this.handleReturn = function(ret){
			if(ret instanceof Promise) {
				var $this = this;
				ret.then(function(value){
					// do not call this.updateImpl to avoid saving
					Observable.prototype.updateImpl.call($this, value);
				});
				return true;
			} else {
				return false;
			}
		};
	} else {
		this.handleReturn = function(){
			return false;
		};
	}

	if(storage.get) {
		var ret = storage.get(defaultValue);
		observable = new T(this.handleReturn(ret) ? defaultValue : ret);
	} else {
		observable = new T(defaultValue);
	}

	observable.storage = storage;

	observable.updateImpl = function(value, type){
		storage.set(value);
		Observable.prototype.updateImpl.call(this, value, type);
	};

	return observable;

}

/**
 * @class
 * @since 0.66.0
 */
function ObservableArray(observable, value) {
	Array.call(this);
	Array.prototype.push.apply(this, value);
	Object.defineProperty(this, "observable", {
		enumerable: false,
		value: observable
	});
	var length = this.length;
	Object.defineProperty(this, "length", {
		configurable: false,
		enumerable: false,
		writable: true,
		value: length
	});
}

ObservableArray.prototype = Object.create(Array.prototype);

[
	{name: "copyWithin"},
	{name: "fill"},
	{name: "pop", type: Const.OBSERVABLE_UPDATE_TYPE_ARRAY_POP},
	{name: "push", type: Const.OBSERVABLE_UPDATE_TYPE_ARRAY_PUSH},
	{name: "reverse"},
	{name: "shift", type: Const.OBSERVABLE_UPDATE_TYPE_ARRAY_SHIFT},
	{name: "sort"},
	{name: "splice", type: Const.OBSERVABLE_UPDATE_TYPE_ARRAY_SPLICE},
	{name: "unshift", type: Const.OBSERVABLE_UPDATE_TYPE_ARRAY_UNSHIFT}
].forEach(function(fun){
	if(Array.prototype[fun.name]) {
		Object.defineProperty(ObservableArray.prototype, fun.name, {
			enumerable: false,
			value: function(){
				var ret = Array.prototype[fun.name].apply(this, arguments);
				this.observable.updateType = fun.type;
				this.observable.updateData = arguments;
				this.observable.update();
				return ret;
			}
		});
	}
});

Object.defineProperty(ObservableArray.prototype, "toJSON", {
	value: function(){
		return Array.apply(null, this);
	}
});

/**
 * @class
 * @since 0.66.0
 */
function ObservableDate(observable, value) {
	Date.call(this);
	Object.defineProperty(this, "date", {
		enumerable: false,
		value: value
	});
	Object.defineProperty(this, "observable", {
		enumerable: false,
		value: observable
	});
}

ObservableDate.prototype = Object.create(Date.prototype);

Object.getOwnPropertyNames(Date.prototype).forEach(function(fun){
	if(Polyfill.startsWith.call(fun, "set")) {
		Object.defineProperty(ObservableDate.prototype, fun, {
			enumerable: false,
			value: function(){
				var ret = Date.prototype[fun].apply(this.date, arguments);
				this.observable.update();
				return ret;
			}
		});
	} else {
		Object.defineProperty(ObservableDate.prototype, fun, {
			enumerable: false,
			value: function(){
				return Date.prototype[fun].apply(this.date, arguments);
			}
		});
	}
});

/**
 * @class
 * @since 0.54.0
 */
function StorageObservableProvider(storage, key) {
	this.storage = storage;
	this.key = key;
}

StorageObservableProvider.prototype.get = function(defaultValue){
	var item = this.storage.getItem(this.key);
	return item === null ? defaultValue : JSON.parse(item);
};

StorageObservableProvider.prototype.set = function(value){
	this.storage.setItem(this.key, JSON.stringify(value));
};

/**
 * Indicates whether the given value is an instanceof {@link Observable}.
 * @since 0.40.0
 */
Sactory.isObservable = function(value){
	return value instanceof Observable;
};

/**
 * Subscribes to the observables and, optionally, calls the callback with the current value.
 * @returns The new subscription.
 * @since 0.40.0
 */
Sactory.observe = function(value, callback, type, subscribeOnly){
	var ret = value.subscribe(callback, type);
	if(!subscribeOnly) callback(value.value);
	return ret;
};

/**
 * If the given value is an observable, returns the unobserved value. If the value
 * is a computed observable also disposes the subscriptions.
 * @since 0.42.0
 */
Sactory.unobserve = function(value){
	if(Sactory.isObservable(value)) {
		if(value.computed) {
			value.subscriptions.forEach(function(subscription){
				subscription.dispose();
			});
		}
		return value.value;
	} else {
		return value;
	}
};

/**
 * If the given value is an observable returns the current value, otherwise
 * returns the given value.
 * @since 0.86.0
 */
Sactory.value = function(value){
	if(Sactory.isObservable(value)) {
		return value.value;
	} else {
		return value;
	}
};

/**
 * @since 0.81.0
 */
Sactory.observableImpl = function(T, value, storage, key){
	if(storage) {
		if(storage instanceof Storage) {
			return makeSavedObservable(T, value, new StorageObservableProvider(storage, key));
		} else if(typeof storage == "object") {
			return makeSavedObservable(T, value, storage);
		} else if(window.localStorage) {
			return makeSavedObservable(T, value, new StorageObservableProvider(window.localStorage, storage));
		} else {
			console.warn("window.localStorage is unavailable. '" + storage + "' will not be stored.");
		}
	}
	return new T(value);
};

/**
 * @since 0.41.0
 */
Sactory.observable = function(value, storage, key){
	return Sactory.observableImpl(Observable, value, storage, key);
};

/**
 * @since 0.81.0
 */
Sactory.observable.deep = function(value, storage, key){
	return Sactory.observableImpl(DeepObservable, value, storage, key);
};

/**
 * @since 0.81.0
 */
Sactory.observable.always = function(value, storage, key){
	return Sactory.observableImpl(AlwaysObservable, value, storage, key);
};

/**
 * @since 0.81.0
 */
Sactory.computedObservableImpl = function(T, context, bind, observables, fun, maybe){
	if(maybe) Array.prototype.push.apply(observables, Sactory.filterObservables(maybe));
	var ret = new T(fun.call(context));
	ret.computed = true;
	ret.dependencies = observables;
	ret.subscriptions = [];
	observables.forEach(function(observable){
		ret.subscriptions.push(observable.subscribe(function(){
			ret.value = fun.call(context);
		}));
	});
	if(bind) {
		ret.subscriptions.forEach(function(subscription){
			bind.subscribe(subscription);
		});
	}
	return ret;
};

/**
 * @since 0.48.0
 */
Sactory.computedObservable = function(context, bind, observables, fun, maybe){
	return Sactory.computedObservableImpl(Observable, context, bind, observables, fun, maybe);
};

/**
 * @since 0.81.0
 */
Sactory.computedObservable.deep = function(context, bind, observables, fun, maybe){
	return Sactory.computedObservableImpl(DeepObservable, context, bind, observables, fun, maybe);
};

/**
 * @since 0.97.0
 */
Sactory.computedObservable.deps = function(context, bind, observables, fun, maybe, deps){
	Array.prototype.push.apply(observables, deps instanceof Array ? deps : Array.prototype.slice.call(arguments, 5));
	return Sactory.computedObservableImpl(Observable, context, bind, observables, fun, maybe);
};

/**
 * @since 0.92.0
 */
Sactory.computedObservable.always = function(context, bind, observables, fun, maybe){
	return Sactory.computedObservableImpl(AlwaysObservable, context, bind, observables, fun, maybe);
};

/**
 * @since 0.86.0
 */
Sactory.maybeComputedObservable = function(context, bind, observables, fun, maybe){
	Array.prototype.push.apply(observables, Sactory.filterObservables(maybe));
	if(observables.length) {
		return Sactory.computedObservable(context, bind, observables, fun);
	} else {
		return fun.call(context);
	}
};

/**
 * @since 0.86.0
 */
Sactory.filterObservables = function(maybe){
	return maybe.filter(Sactory.isObservable);
};










function SelectorHolder() {
	this.content = [];
}

SelectorHolder.prototype.value = function(key, value){
	this.content.push({key: key, value: value});
};

SelectorHolder.prototype.stat = function(stat){
	this.content.push({key: stat});
};

/**
 * @since 0.99.0
 */
Sactory.root = function(){
	return new SelectorHolder();
};

/**
 * @since 0.99.0
 */
Sactory.select = function(parent, selector){
	var ret = new SelectorHolder();
	parent.content.push({selector: selector, value: ret.content});
	return ret;
};

/**
 * Converts a css unit to a number and update the `unit` object that stores
 * the unit type.
 * @param {Object} unit - Storage for the unit. The same expression should use the same storage.
 * @param {string|*} value - The value that, if of type string, is checked for unit conversion.
 * @returns The value stripped from the unit and converted to number, if a unit was found, or the unmodified value.
 * @throws {Error} If a unit has already been used in the same expression and it's different from the current one.
 * @since 0.37.0
 */
Sactory.unit = function(unit, value){
	if(typeof value == "string") {
		function check(u) {
			if(Polyfill.endsWith.call(value, u)) {
				if(unit.unit && unit.unit != u) throw new Error("Units '" + unit.unit + "' and '" + u + "' are not compatible. Use the calc() css function instead.");
				unit.unit = u;
				value = parseFloat(value.substring(0, value.length - u.length));
				return true;
			}
		}
		check("cm") || check("mm") || check("in") || check("px") || check("pt") || check("pc") ||
		check("rem") || check("em") || check("ex") || check("ch") || check("vw") || check("vh") || check("vmin") || check("vmax") || check("%") ||
		check("s");
	}
	return value;
};

/**
 * Computes the result of an expression that uses {@link unit}.
 * @param {Object} unit - Storage for the unit populated by {@link unit}.
 * @param {number|*} result - The result of the expression. If a number it is checked for unit concatenation and rounded to 3 decimal places.
 * @returns the number concatenated with the unit if present, the unmodified value otherwise.
 * @since 0.37.0
 */
Sactory.computeUnit = function(unit, result){
	if(typeof result == "number" && unit.unit) {
		return Math.round(result * 1000) / 1000 + unit.unit;
	} else {
		return result;
	}
};

Sactory.compileStyle = function(root) {
	var ret = "";
	function compile(array) {
		array.forEach(function(item){
			if(item.plain) {
				if(!item.value) {
					ret += item.selector + ';';
				} else {
					ret += item.selector + ":" + item.value + ";";
				}
			} else if(item.value.length) {
				ret += item.selector + "{";
				compile(item.value);
				ret += "}";
			}
		});
	}
	compile(root);
	return ret;
}

/**
 * Converts an object in SSB format to minified CSS.
 * @since 0.19.0
 */
Sactory.convertStyle = function(root){
	var ret = [];
	function compile(selectors, curr, obj) {
		obj.forEach(function(value){
			if(value.selector) {
				var selector = value.selector;
				if(selector.charAt(0) == '@') {
					var oret = ret;
					ret = [];
					if(selector.substr(1, 5) == "media" || selector.substr(1, 8) == "document") compile(selectors, Sactory.select(ret, selectors.join(',')), value.value);
					else compile([], ret, value.value);
					oret.push({selector: selector, value: ret});
					ret = oret;
				} else {
					var ns = [];
					if(selectors.length) {
						selector.split(',').map(function(s2){
							var prefix = s2.indexOf('&') != -1;
							selectors.forEach(function(s1){
								if(prefix) ns.push(s2.trim().replace(/&/g, s1));
								else ns.push(s1 + ' ' + s2.trim());
							});
						});
					} else {
						ns = selector.split(',').map(function(s){
							return s.trim();
						});
					}
					compile(ns, Sactory.select({content: ret}, ns.join(',')).content, value.value);
				}
			} else {
				if(value.key.charAt(0) == '@') {
					ret.push({plain: true, selector: value.key, value: value.value});
				} else {
					value.key.split(',').forEach(function(key){
						curr.push({plain: true, selector: key.trim(), value: value.value});
					});
				}
			}
		});
	}
	compile([], ret, root);
	return Sactory.compileStyle(ret);
};

/**
 * Compiles a SSB object and recompiles it each time an observable in
 * the given list changes. Also subscribes to the current bind context
 * if present.
 * @since 0.49.0
 */
Sactory.compileAndBindStyle = function(fun, element, bind, observables, maybe){
	function reload() {
		element.textContent = Sactory.convertStyle(fun());
	}
	Array.prototype.push.apply(observables, Sactory.filterObservables(maybe));
	observables.forEach(function(observable){
		var subscription = observable.subscribe(reload);
		if(bind) bind.subscribe(subscription);
	});
	reload();
};

/**
 * @since 0.94.0
 */
Sactory.quote = function(value){
	return JSON.stringify(value + "");
};

// css functions

Sactory.css = {};

function RGBColor(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = typeof a == "number" ? a : 1;
}

RGBColor.prototype.update = function(fun){
	this.r = fun(this.r, 'r');
	this.g = fun(this.g, 'g');
	this.b = fun(this.b, 'b');
};

RGBColor.prototype.toHSL = function(){

	var min = Math.min(this.r, this.g, this.b);
	var max = Math.max(this.r, this.g, this.b);

	var h, s, l = (max + min) / 2;

	if(max == min) {

		// achromatic
		h = s = 0;

	} else {

		var delta = max - min;

		// saturation
		s = l > .5 ? delta / (2 - max - min) : delta / (max + min);

		// hue
		if(delta == 0) {
			h = 0;
		} else if(max == this.r) {
			h = ((this.g - this.b) / delta) % 6;
		} else if(max == this.g) {
			h = (this.b - this.r) / delta + 2;
		} else {
			h = (this.r - this.g) / delta + 4;
		}
		h /= 6;

	}

	return new HSLColor(h, s, l, this.a);

};

function multiply(number) {
	return Math.round(number * 255);
}

RGBColor.prototype.toHexString = function(){
	return '#' + [this.r, this.g, this.b].map(multiply).map(function(a){ return Polyfill.padStart.call(a.toString(16), 2, '0'); }).join("");
};

RGBColor.prototype.toRGBString = function(){
	return "rgb(" + [this.r, this.g, this.b].map(multiply).join(", ") + ")";
};

RGBColor.prototype.toRGBAString = function(){
	return "rgba(" + [this.r, this.g, this.b].map(multiply).join(", ") + ", " + this.alpha + ")";
};

RGBColor.prototype.toString = function(){
	if(this.a == 1) return this.toHexString();
	else return this.toRGBAString();
};

RGBColor.fromHexString = function(color){
	if(color.length == 3) {
		function parse(num) {
			return parseInt(num, 16) / 15;
		}
		return new RGBColor(parse(color.charAt(0)), parse(color.charAt(1)), parse(color.charAt(2)));
	} else {
		function parse(num) {
			return parseInt(num, 16) / 255;
		}
		return new RGBColor(parse(color.substring(0, 2)), parse(color.substring(2, 4)), parse(color.substring(4, 6)));
	}
};

RGBColor.from = function(color){
	if(color instanceof RGBColor) return new RGBColor(color.r, color.g, color.b, color.a);
	else if(color.toRGB) return color.toRGB();
	else return RGBColor.from(parseColor(color));
};

/**
 * @class
 * @since 0.100.0
 */
function HSLColor(h, s, l, a) {
	this.h = h;
	this.s = s;
	this.l = l;
	this.a = typeof a == "number" ? a : 1;
}

HSLColor.prototype.toHSLString = function(){
	return "hsl(" + Math.round(this.h * 360) + ", " + Math.round(this.s * 100) + "%, " + Math.round(this.l * 100) + "%)";
};

HSLColor.prototype.toHSLAString = function(){
	return "hsla(" + Math.round(this.h * 360) + ", " + Math.round(this.s * 100) + "%, " + Math.round(this.l * 100) + "%, " + this.a + ")";
};

HSLColor.prototype.toString = function(){
	if(this.a == 1) return this.toHSLString();
	else return this.toHSLAString();
};

HSLColor.prototype.toRGB = function(){

	var c = (1 - Math.abs(2 * this.l - 1)) * this.s;
	var x = c * (1 - Math.abs((this.h * 6) % 2 - 1));
	var m = this.l - c / 2;

	var r, g, b;

	if(this.h < 1 / 6) {
		r = c;
		g = x;
		b = 0;
	} else if(this.h < 2 / 6) {
		r = x;
		g = c;
		b = 0;
	} else if(this.h < 3 / 6) {
		r = 0;
		g = c;
		b = x;
	} else if(this.h < 4 / 6) {
		r = 0;
		g = x;
		b = c;
	} else if(this.h < 5 / 6) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}

	return new RGBColor(r + m, g + m, b + m, this.a);

};

HSLColor.from = function(color){
	if(color instanceof HSLColor) return new HSLColor(color.h, color.s, color.l, color.a);
	else if(color.toHSL) return color.toHSL();
	else return HSLColor.from(parseColor(color));
};

/*
 * @since 0.100.0
 */
function parseColor(color) {
	if(color.charAt(0) == '#') {
		return RGBColor.fromHexString(color.substr(1));
	} else {
		var p = color.indexOf('(');
		if(p > 0) {
			var type = color.substring(0, p);
			var values = color.slice(p + 1, -1).split(',');
			var alpha = values.length > 3 ? +values[3] : undefined;
			switch(type) {
				case "rgb":
				case "rgba":
					return new RGBColor(values[0] / 255, values[1] / 255, values[2] / 255, alpha);
				case "hsl":
				case "hsla":
					return new HSLColor(values[0] / 360, values[1].slice(0, -1) / 100, values[2].slice(0, -1) / 100, alpha);
				default:
					throw new Error("Unknown color format '" + type + "'");
			}
		} else {
			//TODO try to convert color from text format
			return parseTextualColor(color);
		}
	}
}

var parseTextualColor = typeof colors == "object" ? function(color){
	if(colors.hasOwnProperty(color)) {
		return RGBColor.fromHexString(colors[color]);
	} else {
		return new RGBColor(0, 0, 0);
	}
} : function(color){
	// use window.getComputedStyle to convert the color to rgb
	var conv = document.createElement("div");
	conv.style.color = color;
	document.head.appendChild(conv);
	color = window.getComputedStyle(conv).color;
	document.head.removeChild(conv);
	return parseColor(color);
};

function random(T, alpha) {
	return new T(Math.random(), Math.random(), Math.random(), alpha ? Math.random() : undefined);
}

/**
 * Converts a color of any type to RGB, removing the alpha channel if present.
 * If no parameters are given, a random color is returned.
 * @since 0.38.0
 */
Sactory.css.rgb = function(color){
	if(arguments.length) {
		color = RGBColor.from(parseColor(color));
		color.a = 1;
		return color;
	} else {
		return random(RGBColor, false);
	}
};

/**
 * Converts a color of any type to RGBA, optionally updating the value of the alpha channel. 
 * If no parameters are given, a random color is returned.
 * @since 0.38.0
 */
Sactory.css.rgba = function(color, alpha){
	if(arguments.length) {
		color = RGBColor.from(color);
		if(arguments.length > 1) color.a = alpha;
		return color;
	} else {
		return random(RGBColor, true);
	}
};

/**
 * Converts a color of any type to HSL, removing the alpha channel if present.
 * If no parameters are given, a random color is returned.
 * @since 0.100.0
 */
Sactory.css.hsl = function(color){
	if(arguments.length) {
		color = HSLColor.from(color);
		color.a = 1;
		return color;
	} else {
		return random(HSLColor, false);
	}
};

/**
 * Converts a color of any type to HSLA, optionally updating the value of the alpha channel. 
 * If no parameters are given, a random color is returned.
 * @since 0.100.0
 */
Sactory.css.hsla = function(color, alpha){
	if(arguments.length) {
		color = HSLColor.from(color);
		if(arguments.length > 1) color.a = alpha;
		return color;
	} else {
		return random(HSLColor, true);
	}
};

/**
 * @since 0.38.0
 */
Sactory.css.lighten = function(color, amount){
	color = HSLColor.from(color);
	color.l += (1 - color.l) * amount;
	return color;
};

/**
 * @since 0.38.0
 */
Sactory.css.darken = function(color, amount){
	color = HSLColor.from(color);
	color.l *= (1 - amount);
	return color;
};

/**
 * @since 0.100.0
 */
Sactory.css.saturate = function(color, amount){
	color = HSLColor.from(color);
	color.s += (1 - color.s) * amount;
	return color;
};

/**
 * @since 0.100.0
 */
Sactory.css.desaturate = function(color, amount){
	color = HSLColor.from(color);
	color.s *= (1 - amount);
	return color;
};

/**
 * @since 0.38.0
 */
Sactory.css.grayscale = Sactory.css.greyscale = function(color){
	color = RGBColor.from(color);
	color.r = color.g = color.b = color.r * .2989 + color.g * .587 + color.b * .114;
	return color;
};

/**
 * Inverts a color.
 * @since 0.38.0
 */
Sactory.css.invert = function(color){
	color = RGBColor.from(color);
	color.update(function(v){
		return 1 - v;
	});
	return color;
};

/**
 * @since 0.100.0
 */
Sactory.css.pastel = function(color){
	if(arguments.length) {
		color = HSLColor.from(color);
		color.s = .9 + color.s * .1;
		color.l = .75 + color.l * .15;
		return color;
	} else {
		return new HSLColor(Math.random(), .9 + Math.random() * .1, .75 + Math.random() * .15);
	}
};

/**
 * @since 0.102.0
 */
Sactory.css.sepia = function(color){
	color = RGBColor.from(color);
	return new RGBColor(
		color.r * .393 + color.g * .769 + color.b * .189,
		color.r * .349 + color.g * .686 + color.b * .168,
		color.r * .272 + color.g * .534 + color.b * .131,
		color.a
	);
};

/**
 * @since 0.38.0
 */
Sactory.css.mix = function(){
	var length = arguments.length;
	var color = new RGBColor(0, 0, 0);
	Array.prototype.forEach.call(arguments, function(c){
		RGBColor.from(c).update(function(v, i){
			color[i] += v;
		});
	});
	color.update(function(v){
		return v / length;
	});
	return color;
};

/**
 * @since 0.100.0
 */
Sactory.css.contrast = function(color, light, dark){
	color = RGBColor.from(color);
	color.update(function(value){
		if(value <= .03928) {
			return value / 12.92;
		} else {
			return Math.pow((value + .055) / 1.055, 2.4);
		}
	});
	return color.r * .2126 + color.g * .7152 + color.b * .0722 > .179 ? (dark || "#000") : (light || "#fff");
};



return Sactory;

});