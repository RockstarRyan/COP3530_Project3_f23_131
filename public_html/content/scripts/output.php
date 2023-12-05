<?php

$filename = '../../../graph/output.csv';

clearstatcache();

if (file_exists($filename) === true) {
    $file = fopen($filename, "r");
    echo fread($file, filesize($filename));
    fclose($file);
    unlink($filename);
} else {
    echo '';
}