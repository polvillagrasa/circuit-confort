<?php
require 'db.php';
session_destroy();
response_json(['success' => true]);
?>
