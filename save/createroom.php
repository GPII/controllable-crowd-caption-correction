<?php



 $senha = $_POST['senha'];
 $roomid = $_POST['roomid'];
 $passadmin = $_POST['senha2'];
$senhacriptografada = md5($senha);
 $senhaadmincriptografada = md5($senha2);
 
 
// $horario = date("m_d_Y");
$horario = 'd';
 


$teste = $_POST['teste'];

if ($teste=="") $teste="0";




$nome1 = $horario."_".$roomid.".txt";
 $nome2 = $horario."_".$roomid."_fix.txt";
 $nome3 = $roomid."_password.txt";
 $nome4 = $roomid."_lock.txt";


/* 
 // new mysql code
include('config.php');
$result = mysql_query("SELECT * FROM admin where session='".$nome3."'");
$num_rows = mysql_num_rows($result);
if ($num_rows>0)
{
    echo("This room is already taken.");
    mysql_close($conexao); 
    return;
}
// se nao existe cria 
$cria = "INSERT INTO admin (session,corrector_pwd,admin_pwd,PreviousCaptions) VALUES('".$nome3."','".$senha."','".$senha2."','".$teste."')";
mysql_query($cria, $conexao);
mysql_close($conexao); 
 // new mysql code
 
*/

 if (file_exists("WEB-INF/caption_texts/".$nome3)) {
     
    echo("This room is already taken.");
    return;
 }

 
$myFile = "WEB-INF/caption_texts/".$nome1;
$fh = fopen($myFile, 'a') or die("can't open file"); 
fwrite($fh, "START:");fclose($fh);

$myFile = "WEB-INF/caption_texts/".$nome2;
$fh = fopen($myFile, 'a') or die("can't open file"); 
fwrite($fh, "START:");fclose($fh);

$myFile = "WEB-INF/caption_texts/".$nome3;
$fh = fopen($myFile, 'a') or die("can't open file"); 
fwrite($fh, $senhacriptografada);fclose($fh);

$myFile = "WEB-INF/caption_texts/".$nome4;
$fh = fopen($myFile, 'a') or die("can't open file"); 
fwrite($fh, '');fclose($fh);


 echo("Room created!<br>");
 
 echo("<a href=\"caption.php?roomid=".$roomid."\">View as participant</a><br>");
  echo("<a href=\"loginadm.php?roomid=".$roomid."&pwd=".$senha2."\">Enter admin</a><br>");
  echo("<a href=\"login.htm\">General Session Login page (Use this to log in as a corrector)</a><br>");
 echo("<a href=\"loginadm.htm\">General Admin Login page</a><br>");
 
?>
