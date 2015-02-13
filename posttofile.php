<?php



$frase = $_POST['frase'];
$roomid = $_POST['roomid'];
//$frase = str_replace("<br>", "\n", $frase);

//$horario = date("m_d_Y");
$horario = "d";


$nome = $horario."_".$roomid.".txt";

//for debugging.  Log everything coming in
$handle = fopen("WEB-INF/caption_texts/caplog.txt", 'a') or die("caplog broke");
fwrite($handle,date(DATE_RFC822) . "  " . microtime()." ".implode(",", $_POST) . "\n");
fclose($handle);


$myFile = "WEB-INF/caption_texts/".$nome;
$fh = fopen($myFile, 'a') or die("can't open file"); 
//fwrite($fh, " ".$frase);
fwrite($fh, $frase);
fclose($fh);

//header('Location: send.php?roomid='.$roomid);


?>
