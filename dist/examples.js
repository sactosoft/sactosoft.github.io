/*! Transpiled from ./_src/dist/examples.sx using Sactory v0.142.1. Do not edit manually. */var լզ=Sactory;var լէ=լզ.chain;var լը={};window.addEventListener("load", () => {
	
	const container = document.querySelector(".sandbox");

	const view = example => {
		const request = new XMLHttpRequest();
		request.onload = () => {
			container.textContent = "";
			լէ(լը, [լէ.create, Sandbox,  /*parent=container*/[[ [4, "readonly", true], [4, "embedded", true], [4, "hide", ["result"]], [4, "filename", example.slice(0, -3)], [4, "source", request.response]]], "Sandbox"], [լէ.appendTo, container] )
		};
		request.open("GET", "./res/examples/" + example);
		request.send();
	};

	Array.prototype.forEach.call(document.querySelectorAll(".examples a"), element => {
		const location = element.getAttribute("href");
		լէ(լը, [լէ.use, element], [լէ.update, [[ [3, "click:prevent", (event, target) => {view(location)}]]]] )
	});

});
