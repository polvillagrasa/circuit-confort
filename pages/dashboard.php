<?php
session_start();

if(!isset($_SESSION["id"])){
    header("Location: login.html");
}
?>

<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard</title>
<link rel="stylesheet" href="../css/style.css">
</head>

<body>

<main class="mobile-frame">

<header class="top-brand">
    <div class="brand-icon">📍</div>
    <h1 class="brand-name">Circuit Comfort</h1>
</header>

<section class="hero">

<h2 class="hero-title" style="font-size:40px;">
BENVINGUT <br>
<?php echo $_SESSION["nom"]; ?>
</h2>

<p class="hero-subtitle">
Has iniciat sessió correctament.
Aquí anirà el mapa, alertes i rutes.
</p>

</section>

<section class="cta-area">

<a href="../php/logout.php">
<button class="cta-button">
TANCA SESSIÓ
</button>
</a>

</section>

</main>

</body>
</html>

