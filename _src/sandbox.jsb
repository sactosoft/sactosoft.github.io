var codemirror = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.46.0/";

module.exports = function(@){
	<:head>
		<title ~text="Sandbox - Sactory" />
		<link rel="stylesheet" href=`${codemirror}codemirror.min.css` />
		<script src=`${codemirror}codemirror.min.js`></script>
		<script src=`${codemirror}mode/xml/xml.min.js`></script>
		<script src=`${codemirror}mode/htmlmixed/htmlmixed.min.js`></script>
		<script src=`${codemirror}mode/css/css.min.js`></script>
		<script src=`${codemirror}mode/javascript/javascript.min.js`></script>
		<script src="./dist/transpiler.min.js"></script>
		<script src="./dist/sactory.min.js"></script>
		<script src="./dist/sandbox.js"></script>
	</:head>
};
