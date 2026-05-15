<?php

$host = "localhost";
$db   = "circuit_comfort";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Error connexió");
}
?>
