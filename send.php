<?php
    $frase = $_GET['roomid'];

  if ($frase=="")
    {
        $frase="rs9b804f98592a";
        
        echo("ROOM ID NOT FOUND using default rs9b804f98592a; Remember to use ?roomid=MYROOMID<br>");
    }


?>

<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style type="text/css">
            #TextArea1
            {
                height: 182px;
                width: 512px;
            }
        </style>
    </head>
    <body>
        <div>
            ROOM ID:<?php echo($frase); ?>
        <form action="posttofile.php" method="post">
            <textarea id="TextArea1" name="frase"></textarea><br />
            <input id="Submit1" type="submit" value="submit" />
            <input type='hidden' name='roomid' value='<?php echo($frase); ?>'>
            </form>
            </div>
    </body>
</html>
