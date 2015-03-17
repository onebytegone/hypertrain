<?php

require 'src/require.php';

header('Content-Type: application/json');

$director = new Director();
echo $director->processRequest($_POST);
