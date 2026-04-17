<?php
session_start();
include("config.php");

$email = $_POST["email"];
$password = $_POST["password"];

$sql = "SELECT * FROM usuaris WHERE email='$email' AND password='$password'";
$resultat = $conn->query($sql);

if($resultat->num_rows > 0){

    $usuari = $resultat->fetch_assoc();

    $_SESSION["id"] = $usuari["id"];
    $_SESSION["nom"] = $usuari["nom"];

    header("Location: ../pages/dashboard.php");

}else{

    echo "Usuari incorrecte";

}
?>
