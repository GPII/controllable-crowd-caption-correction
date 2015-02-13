<?php

	$debInline = "";

	//SANITIZE DATA INPUT BEFORE OFFICIAL RELEASE!!!!
function debugInline($text) {
	global $debInline;
	$debInline = $debInline.$text."<br />";
}
 
	$roomid = $_REQUEST ['room'];
	$initials = $_REQUEST['who'];
	$pwd = $_REQUEST['pwd'];
	$debug = '0';
	$debug = $_REQUEST['debug'];
	$IsMobile = 0;
	if ($_REQUEST['mobile']){
		//header('Location: caption_ajax.php?roomid='.$roomid.'&initials='.$initials.'&pwd='.$pwd.'&debug='.$debug);
		$IsMobile = 1;
	}
//	if ($pwd!="") {
//		if ($initials=="") {
//			echo "You must enter your initials!!";
//			return;
//		}

//	if (($pwd =='password1234567890') && ($initials == "")) {

	if (($pwd =='password1234567890') && (strlen($initials) != 2)) {
		echo "You must enter 2 chars for initials to be a corrector!";
		return;
	}

//	}
	$myFile = $roomid."_password.txt";
	$AuthPWD = md5($pwd);
//////////////////////////////////
	$CorrectorAuthenticated=false;
	if (($pwd =='password1234567890') && (strlen($initials) ==  2)) $CorrectorAuthenticated=true;
	


	session_start();
	//if(strcmp(md5($pwd),$AuthPWD)==0){


/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

	if ($CorrectorAuthenticated) {
		$_SESSION["logged"] = 255; 
		$_SESSION["enterJob"] = 0;
		$_SESSION["exitJob"] = 0;
		//if(crypt($pwd,$AuthPWD)) == $AuthPWD){ // If password matches, then print the editing scripting
		//if ($pwd=='wow'){
	}

?>

<!DOCTYPE html>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
-->
<!-- <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
-->
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
<head>
<META http-equiv="Content-Type" content="text/html; charset=utf-8" />
<META http-equiv="Content-Script-Type" content="text/javascript">

<title>Trace CCC v0.99_v3_1</title>
<!--
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Comet demo0.6.8</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
-->
	
	<style type="text/css" media="screen" id="baseStyles">
		/*remember to keep in sync with variables below in script section*/
		
<? if ($CorrectorAuthenticated) { ?>
		/*show deleteall chars*/
		.corrected[cccdelall] {
			color: #FFFFFF;
			background-color: #DD0000;
			margin-right: .5em;
			
		}
		
		.caption {
		
<?} else { ?>
		.corrected[cccdelall] {
			/*don't show deleteall chars*/

			display: none;
		}
			
			/*treat quickclicks same as caption style */
		.caption , .corrected[cccquick] {
<? } ?>
			background-color: #FFFFFF;
			color: #000000;
			font-family: Arial;
			font-weight: normal;
			font-size: 18px;
			text-decoration: none;
		}
		
		
		.locked {
			background-color: #FFFF00;
			color: #000000;
			font-family: Arial;
			font-weight: normal;
			/*font-size: 18px;*/
		} 
		
<? if ($CorrectorAuthenticated) { ?>

	/*treat quickclicks same as corrected style */
		.corrected , .corrected[cccquick] {
<?} else { ?>
		.corrected {
<? } ?>
			background-color: #FFFFFF;
			color: #FF0000;
			font-family: Arial;
			font-weight: normal;
			text-decoration: underline;
			/*font-size: 18px;*/
		}
		
		iframeStyle {
			width: 1px;
			height: 1px;
			position: absolute;
			top: -1000px;
		}
		
		.iframeDiv {
			width: 1px;
			height: 1px;
			position: absolute;
			top: -1000px;
			display: none;
		}
		
		.divtest {
			position: absolute;
			top: -1200px;
			visibility: hidden;
			height: auto;
			width: auto;
		}
		
		.font1 {font-family:Arial}
		.font2 {font-family:Monospace}
		.font3 {font-family:Lucida Sans Unicode}
		.font4 {font-family:Times}

		.size1 {font-size:18px}
		.size2 {font-size:24px}
		.size3 {font-size:32px}
		.size4 {font-size:42px}
		.size5 {font-size:54px}

		/* hide "x" to clear inside <input elements in IE 10 */
		::-ms-clear {
		display: none;
		}
		

		
	</style>
	
<script>
	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	var myroomid = "<?php echo($roomid); ?>";
	var authenticatedCorrector = "<?php echo($CorrectorAuthenticated); ?>";
	var userinfo = "<?php echo($pwd); ?>";
	var userInitials = "<?echo($initials)?>"; 
</script>
	
<!--	<link rel="stylesheet" type="text/css" <?php echo "href=\"styles/normalize.css?v=" . time() ?>" />
-->
	<link rel="stylesheet" type="text/css" <?php echo "href=\"css/ccc.css?v=" . time() ?>" />
	<script src="js/forms.js"></script>
	<script src="cccV3.js"></script>

 <script>
 //this code put in to trap key events outside the <body> i.e. in the window but not in the body
 //Particularly important to stop ESC from causing the broswer (IE) to stop loading the page thereby shutting 
 //down the comet iframe process.
 
	window.document.onkeydown = function (eventRef)
	{
		if ( !eventRef )
			eventRef = event;

		var keyStroke = (eventRef.keyCode) ? eventRef.keyCode : ((eventRef.charCode) ? eventRef.charCode : eventRef.which);

		if ( keyStroke == 27 )
			return false;
	}


</script>

<script src="js/201a.js"></script>

</head>


<!--***********************************
***********   BODY ****************************
***************************************
-->
<!-- <body onkeydown="setKeyDown(event);" onkeyup="setKeyUp(event);"  onblur="anyKeyDownFlag=0;"  
-->
<body onkeydown="setKeyDown(event);" onkeyup="setKeyUp(event);"    
<? if ($IsMobile==0){ 
	//echo 'onload="document.getElementById(\'comet_iframe\').src=\'comet?id='.$roomid.'\'"';
	//echo 'onload="initVars(0); loadIframe(\'comet?id=' . $roomid . '\')"';
	echo 'onload="initVars(0); startPolling();"';
} else {
	echo 'onload="initVars(0); startPolling();"';
}?>
 >



<!--***  CAPTIONS    ***************
***********   Captions ****************************
***************************************
-->

<!-- <div id="capcontent" class="caption" style="margin-bottom: 3ex">
-->
<div id="capcontent" class="caption">
<button id="startfrom0" onclick="resetAndReloadClient(globalState.meetingDocId);" >Start from beginning</button>
<span id="meettitle"></span>&nbsp;&nbsp;&nbsp;&nbsp;<span id="meetstats"></span>
<div id="top-line"></div>
<div id="capwindow" class="capwindow">
<?
	if(strcmp(md5($pwd),$AuthPWD)==0){ // This is for correctors only
		echo '<form id="f1capcontent" name="f1" onsubmit="return false;" onmousedown="setMouseDownSpanId(event);" onmouseup="setMouseUpSpanId(event);"><div id="doccontent"><p id="P0"></p></div></form>';
	}
	else{ // This is for participants only
		echo '<form id="f1capcontent" name="f1" onsubmit="return false;"><div id="doccontent"></div></form>';
	}

?>
</div>
</div>



<!--***********************************
***********   Autoscroll Message ****************************
***************************************
-->

<div id="ShowScroll" style="display:none; position:fixed; right:20px; bottom:0px;">
<input type='button' name='CapsBelow' id='CapsBelowID' value='Auto-scroll OFF. Click to turn on autoscroll' onclick="scrollDown();">
</div>

<div id="testtext" class="divtest"><span id="sizetext" class="caption"></span></div>

<!--//////////////////////////////////////////////
//////////////////  settings icon  ///////////////////
/////////////////////////////////////////////////
-->

<div id="SettingsIcon" style="cursor:pointer; position:fixed; right:0px; top:0px;" onclick="loadCurrentSettings(255);document.getElementById('Settings').style.display='block';"><img src="images/settings.png"></div>


<!--//////////////////////////////////////////////
//////////////////  settings  ///////////////////
/////////////////////////////////////////////////
-->
<div id="Settings" style="position:fixed; box-shadow:1px 1px 10px #000; padding:3px; right:0px; top:0px; display:none; background-color:#CAFFFD; color:#000; width:500px; height:350px; font-size:18px;">

	<input type="radio" Checked name="CaptionSection" onclick="document.getElementById('CaptionsStyle').style.display='block';document.getElementById('SelectedCaptionsStyle').style.display='none';document.getElementById('CorrectedCaptionsStyle').style.display='none';">Captions
	<input type="radio" name="CaptionSection" onclick="document.getElementById('SelectedCaptionsStyle').style.display='block';document.getElementById('CaptionsStyle').style.display='none';document.getElementById('CorrectedCaptionsStyle').style.display='none';">Selected Text
	<input type="radio" name="CaptionSection" onclick="document.getElementById('CorrectedCaptionsStyle').style.display='block';document.getElementById('CaptionsStyle').style.display='none';document.getElementById('SelectedCaptionsStyle').style.display='none';">Corrected Text
	&nbsp;<input type="checkbox" Checked id="scrolling" >Auto-Scroll
	<hr>
	
	<div id="colorpicker201" class="colorpicker201"></div>
	
	<!--//////////////////////////////////////////////
//////////////////  caption settings  ///////////////////
/////////////////////////////////////////////////
-->

	<div id="CaptionsStyle" style="display:block;">
		Background Color: <div id="SetBGbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFFFF; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetBG','SetBGbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetBG" id="SetBG" value="#FFFFFF" onchange="document.getElementById('SetBGbutton').style.background=document.getElementById('SetBG').value;"><br><br>
		
		Font Color: <div id="SetFCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#000000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetFC','SetFCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetFC" id="SetFC" value="#000000" onchange="document.getElementById('SetFCbutton').style.background=document.getElementById('SetFC').value;"><br><br>
		Font Face: <select id="Fface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
		</select><br><br>
		<!--HighLight Color: <input onclick="showColorGrid2('SetHL','SetHL');" name="SetHL" id="SetHL" value="#FFFF00"><br>-->
		<!--Correction Color: <input onclick="showColorGrid2('SetCC','SetCC');" name="SetCC" id="SetCC" value=" #FF0000"><br>-->
		<input type="checkbox" id="CaptionsBold" value="Bold"> Bold <br><br>
		
		Font Size:  <select id="SetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';">  
		<input type=button value="Restore Default" onclick="initTempVars(1);"> <input type=button value="Stop Polling" onclick="stopPolling();">
	</div>

<!--//////////////////////////////////////////////
//////////////////  locked settings  ///////////////////
/////////////////////////////////////////////////
-->
	<div id="SelectedCaptionsStyle" style="display:none;">
		Background Color: <div id="SetHLbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFF00; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetHL','SetHLbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHL" id="SetHL" value="#FFFF00" onchange="document.getElementById('SetHLbutton').style.background=document.getElementById('SetHL').value;"><br><br>
		
		Font Color: <div id="SetHLFCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#000000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetHLFC','SetHLFCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHLFC" id="SetHLFC" value="#000000" onchange="document.getElementById('SetHLFCbutton').style.background=document.getElementById('SetHLFC').value;"><br><br>
		Font Face: <select id="SelectedFface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
						</select><br><br>
		<div id="colorpicker201" class="colorpicker201"></div>
		<input type="checkbox" id="HLCaptionsBold"> Bold <br><br>
		<!--Font Size: <select id="HLSetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>-->
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';"> <input type=button value="Restore Default" onclick="initTempVars(2);">
	</div>
	
	
<!--//////////////////////////////////////////////
//////////////////  corrected settings  ///////////////////
/////////////////////////////////////////////////
-->
	<div id="CorrectedCaptionsStyle" style="display:none;">
		Background Color: <div id="SetCCBGbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFFFF; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetCCBG','SetCCBGbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetCCBG" id="SetCCBG" value="#FFFFFF" onchange="document.getElementById('SetCCBGbutton').style.background=document.getElementById('SetCCBG').value;"><br><br>
		
		Font Color: <div id="SetCCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FF0000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetCC','SetCCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHLFC" id="SetCC" value="#FF0000" onchange="document.getElementById('SetCCbutton').style.background=document.getElementById('SetCC').value;"><br><br>
		Font Face: <select id="CorrectedFface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
						</select><br><br>
		<div id="colorpicker201" class="colorpicker201"></div>
		<input type="checkbox" id="CorrectedCaptionsBold"> Bold &nbsp; &nbsp; &nbsp; &nbsp; <input type="checkbox" id="CorrectedCaptionsUnderline"> Underline <br><br>
		<!--Font Size: <select id="CCSetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>-->
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';">  <input type=button value="Restore Default" onclick="initTempVars(3);">
	</div>
	
</div>


<div class="overlay" id="overlay1">
     <div>
		<p id="ov1text" class="ov1text"></p>
		<p id="ov1question"></p>
			<button id="ov1button1">Delete</button>&nbsp; &nbsp; &nbsp; <button id="ov1cancel">Cancel</button>
     </div>
</div>

<!--//////////////////////////////////////////////
//////////////////  iframe  ///////////////////
/////////////////////////////////////////////////
-->



<?

if ($IsMobile==0){
?>
<div id="iframeDiv" class="iframeDiv"></div>
	<!--<iframe id="comet_iframe" name="comet_iframe" src="" frameborder="1"
		style="frameborder=0;width:600px;height:150px;position:absolute;top:-1000px"></iframe>
		-->
<?}?> 
	<!--<iframe id="comet_iframe" name="comet_iframe" src="comet" width="900" height="400" frameborder="1"></iframe>-->
 
 
<script type="text/javascript" defer>
//init();
</script> 
 
</body>




</html>

