CREATE DATABASE circuit_comfort;

USE circuit_comfort;

CREATE TABLE usuaris(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);
