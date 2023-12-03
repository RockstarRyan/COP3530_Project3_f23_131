<?php
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
?>
<!DOCTYPE html>
<html lang="en"><head>
	<meta charset="UTF-8" />
	<meta name="author" content="Ryan Gross" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="icon" href="/projects/COP3530_Project3_f23_131/public_html/content/images/favicon." type="image/">
    <title id="page-title">Loading...</title>
	<script> var root_uri = "/projects/COP3530_Project3_f23_131/public_html/"; </script>
	<script type="text/javascript" src="/projects/COP3530_Project3_f23_131/public_html/app.js"></script>
	<script> InitializeApp("<?php echo $_SERVER["REQUEST_URI"]; ?>"); </script>
	<style>
		body {background-color:#fff; color:#222;}
		@media (prefers-color-scheme: dark) {body {background-color:#000; color:#ddd;}}
	</style>
</head><body>
	<h1>An error occurred. Please reload the page.</h1>
	<p>This is a known issue. Please reload the page, and the website should appear as normal – Ryan</p>
	<noscript>Please enable JavaScript to view the contents of this page</noscript>
</body></html>