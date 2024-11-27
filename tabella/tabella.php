<!DOCTYPE html>
<html>
    <head>
        <title>Tabella Pitagorica</title>
        <link rel="stylesheet" href="styles.css"/>
    </head>
    <body>
        <h1>
            Tabella Pitagorica
        </h1>
        <?php
            $r = 10;
            $c = 10;

            echo("<table>");
            
            echo("<th>");
            echo("</th>");

            for($j = 1; $j <= $r; $j++) {
                echo("<th>");
                echo($j);
                echo("</th>");
            }
            
            for($i = 1; $i <= $r; $i++) {
                echo("<tr>");
                
                echo("<th>");
                echo($i);
                echo("</th>");

                for($j = 1; $j <= $c; $j++) {
                    echo("<td>");
                    echo($i * $j);
                    echo("</td>");
                }
                
                echo("</tr>");
            }
            echo("</table>");
        ?>
    </body>
</html>