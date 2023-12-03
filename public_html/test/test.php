<?php

if (($handle = fopen("graph/nodes.txt","r")) !== false) {
    echo "[";
    $row = 0; $columns = []; $row_data = [];
    while (($data = fgets($handle)) !== false) {
        echo "{"$data}";
    }
    fclose($handle);
    echo "]";
} else {
    // Failure
    echo("{error: 'file could not be opened'}");
}