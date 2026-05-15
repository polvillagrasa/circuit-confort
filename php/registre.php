<?php
include("config.php");

$nom = $_POST["nom"];
$email = $_POST["email"];
$password = $_POST["password"];

$sql = "INSERT INTO usuaris(nom,email,password)
VALUES('$nom','$email','$password')";

if($conn->query($sql)){
    header("Location: ../pages/login.html");
}else{
    echo "Error registre";
}
?>

