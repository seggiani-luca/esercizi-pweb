<?php
  $username = trim($_GET["username"]);
  $password = trim($_GET["password"]);

  $logged_in = false;

  // cerca se l'username esiste già e la password corrisponde
  $users = fopen("users.txt", "r");
  while($line = fgets($users)) {
    $userline = explode(" ", $line);
    $l_username = $userline[0];
    $l_password = $userline[1];
    if($l_username == $username && $l_password == $password) {
      $logged_in = true; 
    }
  }
  fclose($users);

  if($logged_in) {
    echo "Login dell'utente " . $username;
  } else {
    echo "Login fallito";
  }
?>