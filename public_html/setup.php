<?php

$forceOverwrite = false;
if ($_GET['overwrite'] == 'true') {$forceOverwrite = true;}

$faviconEnding = 'png';
if ($_GET['favicon'] != undefined) {$faviconEnding = $_GET['favicon'];}

// Perform setup

$root = substr($_SERVER["SCRIPT_NAME"], 0, strpos($_SERVER["SCRIPT_NAME"], "setup.php"));
$root_regex = $root;

for ($i = 0; $i < strlen($root_regex); $i++) {
	if (str_split($root_regex)[$i] == '.') {
		$root_regex = substr($root_regex,0,$i).'\\'.substr($root_regex,$i);
		$i++;
	}
}

class File {
	public $path;
	public $content;
	public $status = 'awaiting';
	public $file;

	function __construct($path,$content) {
		$this->path = $path;
		$this->content = $content;
	}
}

$files = array();

$files['htmain'] = new File('.htaccess',"<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase ".$root."
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^".$root_regex."app\.js$
RewriteRule . ".$root."index.php [L]
</IfModule>");

/*$files['htcontent'] = new File('content/.htaccess',"<IfModule mod_rewrite.c>
RewriteEngine Off
</IfModule>");*/

$files['index'] = new File('index.php','<?php
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
?>
<!DOCTYPE html>
<html lang="en"><head>
	<meta charset="UTF-8" />
	<meta name="author" content="Ryan Gross" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="icon" href="'.$root.'content/images/favicon.'.$faviconEnding.'" type="image/'.$faviconEnding.'">
    <title id="page-title">Loading...</title>
	<script> var root_uri = "'.$root.'"; </script>
	<script type="text/javascript" src="'.$root.'app.js"></script>
	<script> InitializeApp("<?php echo $_SERVER["REQUEST_URI"]; ?>"); </script>
	<style>
		body {background-color:#fff; color:#222;}
		@media (prefers-color-scheme: dark) {body {background-color:#000; color:#ddd;}}
	</style>
</head><body>
	<h1>An error occurred. Please reload the page.</h1>
	<p>This is a known issue. Please reload the page, and the website should appear as normal – Ryan</p>
	<noscript>Please enable JavaScript to view the contents of this page</noscript>
</body></html>');

clearstatcache();

$isError = false;

foreach ($files as $name=>$file) {
	if (file_get_contents($file->path) == $file->content && $forceOverwrite == false) {
		$file->status = 'exists';
	} else {
		$file->file = fopen($file->path, "w") or $isError = true;
		if (fwrite($file->file, $file->content) != false) {
			$file->status = 'success';
		} else {
			$file->status = 'fail';
			$isError = true;
		}
		fclose($file->file);
	}
}
?>

<!DOCTYPE html>
<html lang='en'><head>
	<meta charset="UTF-8" />
	<meta name="author" content="Ryan Gross" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JSPress Configuration</title>
	<style>
		body {background-color:#222; color:#fff8ed; font-family:'Avenir',-apple-system,'Arial',sans-serif;}
		p {font-size:18px; margin:8px 0;}
		a {color:#0af; text-decoration:none;}
		a:hover, a:focus {text-decoration:underline;}
		.success {color:#0a0;}
		.exists {color:#ae0;}
		.fail {color:#a00;}
	</style>
</head><body>
	<h1>JSPress Configuration Status</h1>
	<p><strong>Force Overwrite: </strong><?php echo $forceOverwrite; ?></p>
	<p><strong>Favicon Ending: </strong><?php echo $faviconEnding; ?></p>
	<ul><?php foreach ($files as $name=>$file) {
		echo "<li>File <code>/$file->path</code> – <span class='$file->status'>$file->status</span></li>";
	} ?></ul>
	<?php if ($isError == false) {
		echo "<p>Your site is now set up!</p><p><a href='$root'>Go to site</a></p>";
	} ?>
	<noscript>Please enable JavaScript to view the contents of this page</noscript>
</body></html>
