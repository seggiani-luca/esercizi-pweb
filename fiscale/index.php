<?php
  function isvowel($char) {
    return $char == "A" ||
           $char == "E" ||
           $char == "I" ||
           $char == "O" ||
           $char == "U";
  }

  function nametocode($name) {
    $namecode = "XXX";
    $namecount = 0;

    // prima scansione per consonanti
    for($i = 0; $i < strlen($name) && $namecount < 3; $i++) {
      if(!isvowel($name[$i])) {
        $namecode[$namecount] = $name[$i];
        $namecount++;
      }
    }

    // seconda scansione per vocali
    for($i = 0; $i < strlen($name) && $namecount < 3; $i++) {
      if(isvowel($name[$i])) {
        $namecode[$namecount] = $name[$i];
        $namecount++;
      }
    }

    return $namecode;
  }

  function getcode() {
    $name = strtoupper($_GET["name"]);
    $surname = strtoupper($_GET["surname"]);
    $date = $_GET["date"];

    if($name == "" || $surname == "" || $date == "")  {
      return "";
    }

    // calcola il codice come segue:
    // base CCC NNN AA M GG

    $namecode = nametocode($name);
    $surnamecode = nametocode($surname);

    $explodedate = explode("-", $date);

    $year = $explodedate[0];
    $year = substr($year, 2, 2);
    $month = $explodedate[1];
    $day = $explodedate[2];

    $monthcode = chr($month + 64);

    $code = $surnamecode . $namecode . $year . $monthcode . $day;
    return $code;
  }
?>

<html>
  <head>
    <title>Calcolatore codice fiscale</title>
    <link rel="stylesheet" href="styles.css"/>
    <meta charset="utf-8"/>
  </head>
  <body>
    <header>
      <h1>Calcolatore codice fiscale</h1>
    </header>
    <main>
      <form>
        <p>
          <label>Nome</label>
          <input type="text" name="name"/>
        </p>
        <p>
          <label>Cognome</label>
          <input type="text" name="surname"/>
        </p>
        <p>
          <label>Data di nascita</label>
          <input type="date" name="date"/>
        </p>
        <input type="submit" value="Calcola" action="generateCode.php"/>
      </form>
      <p>
        <?php
          if(key_exists("name", $_GET)    && 
             key_exists("surname", $_GET) && 
             key_exists("date", $_GET))   {
            $code = getcode();
            if($code != "") {
              echo "Il tuo codice fiscale è " . $code;
            } else {
              echo "Si prega di compilare tutti i campi del form";
            }
          }
        ?>
      </p>
    </main>
  </body>
</html>