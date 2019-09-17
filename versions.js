
window.addEventListener("load", function(){
	var select = document.querySelector(".header select");
	var value = select.value;
	select.textContent = "";
	["0.142.1"].forEach(function(version){
		var option = document.createElement("option");
		option.value = option.textContent = version;
		select.appendChild(option);
	});
	select.value = value;
	select.addEventListener("change", function(){
		//TODO switch version
	});
});
