<?php
  $username = trim($_GET["username"]);
  $password = trim($_GET["password"]);

  $user_exists = false;

  // cerca se l'username esiste già
  $users = fopen("users.txt", "r");
  while($line = fgets($users)) {
    $userline = explode(" ", $line);
    $l_username = $userline[0];
    if($l_username == $username) {
      $user_exists = true; 
    }
  }
  fclose($users);

  if($user_exists) {
    echo "L'username inseritò esiste già";
  } else {
    // scrivi la coppia username password su users
    $users = fopen("users.txt", "a");
    fwrite($users, "\n" . $username . " " . $password);
    fclose($users);

    echo "Utente " . $username . " registrato";
  }
?>