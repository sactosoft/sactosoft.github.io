function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}

module.exports = function(page, i, pages, @){
	<:html lang="en" #html :logic>
		<:head>
			<title>${capitalize(page.lessonName)} - ${capitalize(page.groupName)} - Sactory Tutorial</title>
			<link rel="icon" type="image/png" href="../res/icon.png" />
			<script src="../dist/sactory.min.js" :ref=@.ownerDocument.scriptElement />
			<style>
				body {
					margin: 0 auto;
				}

				.left, .right {
					position: absolute;
					width: 50%;
					height: 100vh;
				}

				.left {
					left: 0;
					background: #667;
					color: #eee;
					select {
						background: transparent;
						border: none;
					}
				}

				.right {
					right: 0;
					border: none;
				}
			</style>
		</:head>
		<:body>
			<div class="left">
				<div class="nav">
					if(i > 0) {
						<a href=pages[i - 1].href class="previous">Previous</a>
					}
					<label class="title">
						<select value=page.href +change={ window.location=this.value }>
							foreach(pages as page) {
								<option value=page.href>${page.group}.${page.lesson} ${capitalize(page.groupName)} / ${capitalize(page.lessonName)}</option>
							}
						</select>
					</label>
					if(i < pages.length - 1) {
						<a href=pages[i + 1].href class="next">Next</a>
					}
				</div>
				<div style="padding:8px">#{page.content}</div>
				<div style="padding:8px" #code>@html(page.content);</div>
			</div>
			<iframe class="right" src=`../sandbox.html#${page.example}`></iframe>
		</:body>
	</:html>
};
