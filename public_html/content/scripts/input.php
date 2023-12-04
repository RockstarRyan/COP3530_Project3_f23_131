<?php

if (!isset($_GET['source']) || !isset($_GET['destination']) || !isset($_GET['measurement'])) {
    echo "Error: invalid parameters!";
    exit();
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

$files['index'] = new File('../../../graph/input.csv', $_GET['source'].','.$_GET['destination'].','.$_GET['measurement']);

clearstatcache();
$isError = false;

foreach ($files as $name=>$file) {
    $file->file = fopen($file->path, "w") or $isError = true;
    if (fwrite($file->file, $file->content) != false) {
        $file->status = 'success';
    } else {
        $file->status = 'fail';
        $isError = true;
    }
    fclose($file->file);
}

echo $files['index']->status;