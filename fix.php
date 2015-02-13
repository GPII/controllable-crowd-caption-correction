<?php

$debug = false;
$lockContents = "";

$reqDenyIndicator = '~!;1';
$reqAcceptedIndicator = "~OK;";

$overrideCommand = 'OverrideLock';
$unlockCommand = 'CancelLock';
$lockCommand = 'Lock';
$editCommand = 'Edit';

$commaCommand = 'Comma';
$periodCommand = 'Period';
$questionCommand = 'Question';
$capitalizeCommand = 'Capitalize';
$paragraphCommand = 'Paragraph';

$deleteAllCommand = 'DeleteAll';

$quickClickCommand = 'Quick';

$commandType = '';

$returnResp = false;

session_start();


if (!$debug) {
	if ($_SESSION['logged']!=255) return;
}

$lowerRange = $_REQUEST['start'];
$upperRange = $_REQUEST['end'];
$command = $_REQUEST['command'];
$encodedData = hexEncoder($_REQUEST['data']);
$roomid = $_REQUEST['roomid'];
$corrector = $_REQUEST['initials'] . "^";  // note caret appended

$fullCorrectionStr = $lowerRange .'~'.$upperRange.'~'.$command."~".$encodedData."~".$roomid."~".$corrector;
$requestInfo = $fullCorrectionStr;

if (($command == $commaCommand) || ($command == $periodCommand) || ($command == $questionCommand) || ($command == $capitalizeCommand) || ($command == $paragraphCommand) ) {
	$commandType = $quickClickCommand;
}

if ($debug) {
	echo("lowerRange = : " . $lowerRange . "\n");
	echo("upperRange = : " . $upperRange . "\n");
	echo("command = : " . $command . "\n");
	echo("encodedData = : " . $encodedData . "\n");
	echo("roomid = : " . $roomid . "\n");
	echo("corrector = : " . $corrector . "\n");
}


//$roomid = $_GET['roomid'];
//$corrector = $_GET['c'];
//$dateTag = '05_01_2013';

//$dateTag = date("m_d_Y");
$dateTag = 'd';
$sessionIdentifier = $dateTag."_".$roomid;
$workPath = "WEB-INF/caption_texts/".$sessionIdentifier;

$runLockFile = "_runlock.txt";
$correctionFile = "_fix.txt";
$lockedRangesFile = "_lock.txt";

//for debugging.  Log everything coming in
$handle = fopen("WEB-INF/caption_texts/corlog.txt", 'a') or die("corlog broke");
fwrite($handle,date(DATE_RFC822) . "  " . microtime()." ".implode(",", $_POST) . "\n");
fclose($handle);


//if ($debug) echo('fullCorrectionStr='.$fullCorrectionStr.'<br />');
//$myJobNumber = $_SESSION["enterJob"]++;
//while ($myJobNumber != $_SESSION["exitJob"]) {
	//wait my turn
	//delay;
//}
//$_SESSION["exitJob"]++;

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
/*
JUST PUT THE CREDENTIALS CHECK ON HOLD FOR NOW

// mysql code to check room passwrod
include('config.php');

$result = mysql_query("SELECT * FROM correctors where session='".$rawroomid."' and corrector_name='".$corrector."'");
$num_rows = mysql_num_rows($result);
if ($num_rows>0) {
	//echo("debug2; ");
	$row = mysql_fetch_array($result, MYSQL_NUM);
	// OK VE O STATUS DELE !
	$mystatus = $row[3];
	if ($mystatus==1) {
		echo("You have been disconnected!");
		return;
	}

	$myip=$row[4];
	if ($mystatus==1) {
		if ($myip==$_SERVER['REMOTE_ADDR']) {
			echo("You have been disconnected!");
			return;
		}
	}



// see if IP blacklisted
$myip==$_SERVER['REMOTE_ADDR']);
//the following should be ip not initials
$result = mysql_query("SELECT * FROM blacklist where session='".$rawroomid."' and blacklist_ip='".$myip."'");
$num_rows = mysql_num_rows($result);
if ($num_rows>0) {
	echo("You have been disconnected!");
	return;
}


// see if corrector allowed

$result = mysql_query("SELECT * FROM correctors where session='".$rawroomid."' and corrector_name='".$corrector."'");
$num_rows = mysql_num_rows($result);
if ($num_rows>0) {
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
		if ($row[3]==1) {
			echo("You have been disconnected!");
			return;
		}
	}
} else {
	//insert into database
	$cria = "INSERT INTO correctors (session,corrector_name,ip) VALUES('".$rawroomid."','".$corrector."','".$myip."')";
	mysql_query($cria, $conexao);
}
mysql_close($conexao); 
// mysql code to check room passwrod

*/
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
//NEED TO UPDATE!!!!!  If range lock for a given corrector is NOT in the file, then
// reject that correctors changes.
//ALSO, just to clean up, remove any other locks that might be in the lock file by that corrector
//

$returnResp = false;
//signal that we are running and OWN the process by locking a file
$runlockHandle = fopen($workPath.$runLockFile, 'w');
if (!getFileLock($runlockHandle)) {
	//Hmmm...someone else must be running so signal back to caller and passback original request info
	echo ($reqDenyIndicator . $requestInfo);
	if ($debug) echo("can't get run lock\n");
//return indication that request denied
} else {
	//Okay, our turn so process quickly
	if ($debug)  echo("got run lock \n");

	//get contents of lock file into $lockContents
	readLockFile($workPath.$lockedRangesFile);
	//if a caption range Lock request, see if it overlaps any existing lock range
	if ($command == $lockCommand) {
		if ($debug)  echo("Lock range command ".$lowerRange. " " . $upperRange . "\n");
		if (lockCollide( $lowerRange, $upperRange) > 0) {
			//collision so deny request
			echo ($reqDenyIndicator . $requestInfo);
			if ($debug)  echo("Collision - Deny request\n");
		} else {
			//add to lock file
			if ($debug)  echo("Lock accepted - adding to range lock\n");
			$handle = fopen($workPath.$lockedRangesFile, 'a') or die("can't open file");
			fwrite($handle, $fullCorrectionStr."\n");
			fclose($handle);
			////signal everything ok so can put in the corrections file
			$returnResp = true;
		}
	} else if ($commandType == $quickClickCommand) {
		if ($debug)  echo('quick click command '.$lowerRange. ' ' . $upperRange ."\n");
		if (lockCollide( $lowerRange, $upperRange) > 0) {
			//collision so deny request
			echo ($reqDenyIndicator . $requestInfo);
			if ($debug)  echo("Collision\n");
		} else {
			//don't add to lock file;  just
			////signal everything ok so can put in the corrections file
			//echo($reqAcceptedIndicator.$fullCorrectionStr);
			$returnResp = true;
		}
	} else if (($command == $unlockCommand) || ($command == $editCommand) || ($command == $deleteAllCommand)) {
		//Unlock, edit and deleteAll must match range and initials. 
		if ($debug)  echo("unlock, deleteall or edit command.  Lower: ".$lowerRange. " Upper: " . $upperRange ."\n");
		if (lockExactMatch( $lowerRange, $upperRange, $corrector) != 1) {
			//not exact match
			echo ($reqDenyIndicator . $requestInfo);
			if ($debug)  echo("no exact match in lock file\n");
		} else {
			//remove all exact matches
			$lockContents = str_replace($lowerRange."~".$upperRange."~". $lockCommand ."~~".$roomid."~".$corrector."\n", "", $lockContents);
			$handle = fopen($workPath.$lockedRangesFile, 'w') or die("can't open file");
			//write new contents with matches removed
			fwrite($handle, $lockContents);
			fclose($handle);
			$returnResp = true;
		}
	} else if ($command == $overrideCommand) {
		//Override - remove any collisions from lock file and send as unlocks.  Also send original command
		if ($debug)  echo("override request\n"); 
		
		//this is more complex so handle all of it in a function
		// removes collisions from $lockContents buffer and builds string of unlock commands that need to me sent
		if (removeCollisions($lowerRange, $upperRange, $corrector) == 1) {
			//need to write new lock file
			if ($debug)  echo("deleting lock ranges file and rewriting\n");
			$handle = fopen($workPath.$lockedRangesFile, 'w') or die("can't open file");
			//write new contents with matches removed
			fwrite($handle, $lockContents);
			fclose($handle);
		}
		$returnResp = true;
	} else {  
		//don't know what this is
		if ($debug)  echo("Unknown command received.\n");
		$returnResp = false;
	}

	if ($returnResp) {
		//everything gets appended to corrections file
		if ($debug)  echo("writing to correction File\n");
		$handle = fopen($workPath.$correctionFile, 'a') or die("can't open file");
		fwrite($handle, $fullCorrectionStr . "\n");
		fclose($handle);
		//signal everything ok and passback original request info
		echo($reqAcceptedIndicator . $requestInfo);
	}
	
	//unlock our run lock
	flock($runlockHandle, LOCK_UN);
}

//clean up
fclose($runlockHandle);



return($returnResp);


//*****************************************
//*****************************************
function getFileLock ($tmHndl) {
	global $debug;
	$returnVal = false;
	$loopCnt = 50;
	while (!($returnVal=flock($tmHndl, LOCK_EX | LOCK_NB)) and $loopCnt-- ) {
		usleep(rand(5, 15)*1000);  //5-15 milliseconds
	}
	return ($returnVal);  //return indication that request denied
}

/*****************************************
//*****************************************
 /**
 * Returns 1 if the given range collides with any segment defined in the specified file, 0 otherwise.
 */
function readLockFile($filename) {
	global $debug;
	global $lockContents;
	$result = false;
	if($handle = fopen($filename, 'r')) {
		//get file contents
		$lockContents = fread($handle, filesize($filename));
		fclose($handle);
		$result = true;
	}
	if ($debug) echo ("Lock file contents: " . $lockContents . "\n");
	return $result;
}


//*****************************************
//*****************************************
 /**
 * Returns 1 if the given range collides with any segment defined in the specified file, 0 otherwise.
 */
function lockCollide($start, $end) {

	global $debug;
	global $lockContents;
	$line;
	$result = 0;
	$strArray = explode("\n",$lockContents);
	
	if ($debug)  echo("lockCollide(" . $start. ", " . $end . "\n");
	foreach ($strArray as $value) {
		if ($debug)  echo("Checking for collision with:" . $value . "\n");
		//start [0] ~ end [1] ~ command [2] ~ data [3] ~ roomid [4] ~ initials [5]
		if ($value != '') {
		if ($line = explode("~", $value)) { 
			//check if start is inside an existing range, or 
			//if end is inside an existing range, or
			//if an existing range lies inside our request
			if(($start >= $line[0] && $start <= $line[1]) || ($end >= $line[0] && $end <= $line[1]) || ($start < $line[0] && $end > $line[1])){
				if ($debug)  echo("Found a collision where start: " .$line[0]. "  end: ". $line[1]. "\n");
				$result = 1;
				break;
			}
		}
		}
	}
	if ($debug)  {if ($result == 0) echo("No match found\n");}
	return $result;
}

//*****************************************
//*****************************************
 /**
 * Returns 1 if the given range and initials match the range and initials found in the buffer, 0 otherwise.
 */
function lockExactMatch($start, $end, $initials) {

	global $debug;
	global $lockContents;
	$line;
	$result = 0;
	$strArray = explode("\n",$lockContents);
	
	if ($debug)  echo("lockExactMatch(" . $start. ", " . $end . ", " . $initials . "\n");
	foreach ($strArray as $value) {
		if ($debug)  echo("Checking for match with:" . $value . "\n");
		//start [0] ~ end [1] ~ command [2] ~ data [3] ~ roomid [4] ~ initials [5]

		if ($line = explode("~", $value)) { 
			if ($debug) print_r($line);
			if(($start == $line[0]) && ($end == $line[1]) && ($initials == $line[5])) {
				if ($debug)  echo("Found an exact match where start: " .$line[0]. "  end: ". $line[1]. "initials: " . $line[5] . "\n");
				$result = 1;
				break;
			}
		}
	}
	if ($debug)  {if ($result == 0) echo("No match found\n");}
	return $result;
}

//*****************************************
//*****************************************
function removeCollisions($start, $end, $initials) {

	global $debug;
	global $lockContents;
	global $fullCorrectionStr;
	global $unlockCommand;
	
	$tmpCommandString = "";
	$line;
	$result = 0;
	$value;
	
	if ($debug)  echo("removeCollisions(" . $start. ", " . $end . ", " . $initials . ")\n");
	$strArray = array_filter(explode("\n",$lockContents));  //removes blank lines from array
	
	foreach ($strArray as &$value) { //note using variable by reference rather than value here 
		if ($debug)  echo("Checking for collision with:" . $value . "\n");
		//start [0] ~ end [1] ~ command [2] ~ data [3] ~ roomid [4] ~ initials [5]

		if ($line = explode("~", $value)) { 
			//check if start is inside an existing range, or 
			//if end is inside an existing range, or
			//if an existing range lies inside our request
			if(($start >= $line[0] && $start <= $line[1]) || ($end >= $line[0] && $end <= $line[1]) || ($start < $line[0] && $end > $line[1])){
				if ($debug)  echo("Found a collision where start: " .$line[0]. "  end: ". $line[1]. "\n");
				$result = 1;
				
				//collision found.  Remove it and send an unlock command with this range and our initials
				$value = "";  //clear this one from lock file
				$tmpCommandString = $tmpCommandString . $line[0] . '~' . $line[1] . '~' . $unlockCommand . '~' . $line[3] . '~' . $line[4] . '~' . $initials . "\n";
				if ($debug) print_r("tmpCommandString: " . $tmpCommandString . "\n");
			}
		}
	}
	unset($value);
	if ($result == 1) {
		//new lock file needs to be written out, but first cleanup
		$lockContents = implode("\n", array_filter($strArray)) . "\n";
		//piece all unlock commands together
		$fullCorrectionStr = $tmpCommandString . $fullCorrectionStr;
	} 
	if ($debug) {
		print_r("fullCorrectionStr: " . $fullCorrectionStr . "\n");
		print_r("lockContents: " . $lockContents . "\n");
		echo ("Done with removeCollisions()\n");
	}
	return $result;
}


//*****************************************
//*****************************************
function hexEncoder($str) {
    $converted ='';
    for ($i=0; $i < strlen($str); $i++) {
		$iC = ord($str[$i]);
		//0-9    A-Z    a-z
		if ((( 48 <= $iC) && ($iC <= 57)) || ((65 <= $iC) && ($iC <= 90)) || ((97 <= $iC) && ($iC <= 122)) ) {
			 $converted .= $str[$i];
		} else {
			$converted .= '%'.dechex($iC);
		}
    }
    return $converted;
}
 

?>
