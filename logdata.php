<?php

//cccParam = cccCommand + adminPass + "&" + ROOM_PARAM + "=" + meetingRoom + "&caption=" + tmpTxt;

//sanitize and validate
if (isset($_POST['room'], $_POST['caption'], $_POST['raw'])) {
	$room = filter_input(INPUT_POST, 'room', FILTER_SANITIZE_STRING);
	$caption = filter_input(INPUT_POST, 'caption', FILTER_SANITIZE_STRING);
	$raw = filter_input(INPUT_POST, 'raw', FILTER_SANITIZE_STRING);
	if (($room === false) || ($caption === false) || ($raw === false)) {
		exit();
	}
}

//for debugging.  Log everything coming in
$handle = fopen("WEB-INF/caption_texts/" . $room . "_log.txt", 'a') or die("caplog broke");
fwrite($handle, date(DATE_RFC822) . "  " . microtime() . " [" . $room . "] [" . $raw . "] [" . $caption . "]~]\n");
//implode(",", $_POST) . "\n");
fclose($handle);

/*
$myFile = "WEB-INF/caption_texts/".$nome;
$fh = fopen($myFile, 'a') or die("can't open file"); 
//fwrite($fh, " ".$frase);
fwrite($fh, $frase);
fclose($fh);

//header('Location: send.php?roomid='.$roomid);

*/
?>
