var Sactory = require("sactory");

module.exports = function(){
	var content, @ = Sactory.createDocument();
	<:html lang="en" #html :trimmed>
		<:head>
			<link rel="icon" type="image/png" href="/res/icon.png" />
			<style>
				body {
					margin: 0 auto;
					font-family: 'Segoe UI';
				}

				.nav {

					position: relative;
					width: 100%;
					height: 56px;
					background: #fafafa;
					box-shadow: 0 0 6px rgba(0, 0, 0, .4);

					.left, .right {
						display: inline-block;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
					}
					
					.left {
						left: 16px;
						svg {
							width, height: 32px;
							vertical-align: middle;
							transition: transform .5s ease-in-out;
							&:hover {
								transform: rotate(65deg);
							}
						}
						span {
							margin-left: 16px;
							vertical-align: middle;
							font-size: 24px;
						}
					}

					.right {
						right: 16px;
						a {
							text-decoration: none;
						}
						a + a {
							margin-left: 8px;
						}
					}

				}

				#logo-left, #logo-right {
					transition: fill 3s linear;
				}

				.content {
					position: relative;
				}
			</style>
			<script>
				window.addEventListener("load", function(){
					var left = document.getElementById("logo-left");
					var right = document.getElementById("logo-right");
					setInterval(function(){
						var color = Sactory.css.rgb();
						left.style.fill = color;
						right.style.fill = Sactory.css.darken(color, .2);
					}, 9000);
				});
			</script>
		</:head>
		<:body>
			<nav class="nav">
				<div class="left">
					<svg :namespace viewBox="0 0 1000 1000">
						<polygon id="logo-left" fill="#9400d3" points="500,0 109,188 13,611 283,950 717,950 987,611 891,188" />
						<polygon id="logo-right" fill="#7000a0" points="695.5,94 283,950 717,950 987,611 891,188" />
					</svg>
					<span>Sactory</span>
				</div>
				<div class="right">
					<a href="/tutorial/introduction-sactory">Tutorial</a>
					<a href="/sandbox">Sandbox</a>
				</div>
			</nav>
			<div class="content" :ref=content />
		</:body>
	</:html>
	return {document: @, content};
};
