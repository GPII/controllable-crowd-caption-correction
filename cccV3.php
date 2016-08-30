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

	if (($pwd == "password1234567890") && (strlen($initials) != 2)) {   //---### ***PasswordLocationTag***
		echo "You must enter two characters for initials to be a corrector!";
		return;
	}

//	}
	$myFile = $roomid."_password.txt";
	$AuthPWD = md5($pwd);
//////////////////////////////////
	$CorrectorAuthenticated=false;
	if (($pwd == "password1234567890") && (strlen($initials) == 2)) $CorrectorAuthenticated = true;   //---### ***PasswordLocationTag***
	


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
	
	<link rel="stylesheet" type="text/css" <?php echo "href=\"css/ccc.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" media="screen" id="userStyles" <?php echo "href=\"css/user.css?v=" . time() ?>" />
	

<script>
	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	var myroomid = "<?php echo($roomid); ?>";
	////// var authenticatedCorrector = <?php echo ($CorrectorAuthenticated); ?>;
	var authenticatedCorrector = <?php if ($CorrectorAuthenticated) { echo('true'); } else { echo('false'); } ?>;
	var userinfo = "<?php echo($pwd); ?>";
	var userInitials = "<?echo($initials)?>"; 
</script>

<script src="cccV3.js"></script>

<script>
	// This code put in to trap key events outside the <body> i.e. in the window but not in the body.
	// Particularly important to stop ESC from causing the broswer (IE) to stop loading the page thereby shutting 
	// down the comet iframe process.
 
	window.document.onkeydown = function (eventRef)
	{
		if ( !eventRef )
			eventRef = event;

		var keyStroke = (eventRef.keyCode) ? eventRef.keyCode : ((eventRef.charCode) ? eventRef.charCode : eventRef.which);

		if ( keyStroke == 27 )
			return false;
	}


</script>

</head>


<!-- BODY -->
<!-- <body onkeydown="setKeyDown(event);" onkeyup="setKeyUp(event);"  onblur="anyKeyDownFlag=0;" -->
<body onkeydown="setKeyDown(event);" onkeyup="setKeyUp(event);"

<? if ($IsMobile==0){ 
	//echo 'onload="document.getElementById(\'comet_iframe\').src=\'comet?id='.$roomid.'\'"';
	//echo 'onload="initVars(0); loadIframe(\'comet?id=' . $roomid . '\')"';
	echo 'onload="initVars(0); startPolling();"';
} else {
	echo 'onload="initVars(0); startPolling();"';
}?>
 >


<!--  Captions  -->
<div id="CaptionContent">
	
	<div id="Header">
		<input type="button" id="StartFromZero" value="Load from start" onclick="resetAndReloadClient(globalState.meetingDocId);">
		<div id="HeaderIcons">
			<button id="SettingsIcon" onclick="openSettingsDialog();"><img src="images/settings_gear.png"></button>
			<button id="QuickHelpIcon" onclick="openQuickHelpDialog();"><img src="images/info_i.png"></button>
		</div>
		<span id="MeetTitle"></span> <span id="MeetStats"></span>
	</div>
	<div id="TopLine"></div>
	
	<div id="CaptionWindow" class="caption">
		
		<?
		//---### Obsolete php code replaced with straight html code below. (DPK - modified Mar 2016)
		//---### Corrector/participant distinctions now handled in client side code via authenticatedCorrector and CorrectorModeOn
		//	if(strcmp(md5($pwd),$AuthPWD)==0){ // This is for correctors only
		//		echo '<form id="Form1CaptionContent" name="f1" onsubmit="return false;" onmousedown="setMouseDownSpanId(event);" onmouseup="setMouseUpSpanId(event);"><div id="DocContent"><p id="P0"></p></div></form>';
		//	}
		//	else{ // This is for participants only
		//		echo '<form id="Form1CaptionContent" name="f1" onsubmit="return false;"><div id="DocContent"></div></form>';
		//	}
		?>
		<form id="Form1CaptionContent" name="f1" onsubmit="return false;" onmousedown="setMouseDownSpanId(event);" onmouseup="setMouseUpSpanId(event);"><div id="DocContent"><p id="P0"></p></div></form>
		
	</div>
	
	<!-- Autoscroll Button -->
	<div id="ShowScroll" style="display:none;">
		<input type="button" id="ShowScrollBtn" value="Pause Auto-scroll" onclick="autoScrollBtnClicked();">
		<!--
		<button id="ShowScrollBtn" onclick="autoScrollBtnClicked();">Pause Auto-scroll</button>
		-->
		
	</div>
	
</div>


<div id="testtext" class="divtest"><span id="sizetext" class="caption"></span></div>


<!-- Quick-Help Info -->
<div id="QuickHelp" style="display:none;">
	<div id="QuickHelpBackdrop">
		<button id="CloseQuickHelpIcon" class="closeDialogIcon" onclick="closeQuickHelpDialog();"><img src="images/close_x.png"></button>	
		
		<div id="QuickHelpTitle">Corrector Quick-Help</div>
		<div id="QuickHelpPrompt">hold down key, then click on word</div>
		
		<table id="QuickHelpTable1">
			<tr><td>none <em>(or&nbsp;ctrl)</em></td><td>-</td><td>select word(s) to edit</td></tr>
			<tr><td>comma or <strong>'C'</strong></td><td>-</td><td>append a comma</td></tr>
			<tr><td>period or <strong>'X'</strong></td><td>-</td><td>end a sentence</td></tr>
			<tr><td><strong>'?'</strong> or <strong>'Z'</strong></td><td>-</td><td>end a question</td></tr>
			<tr><td><strong>'L'</strong></td><td>-</td><td>remove punctuation</td></tr>
		</table>
		
		<table id="QuickHelpTable2">
			<tr><td><strong>'B'</strong></td><td>-</td><td>capitalize word</td></tr>
			<tr><td><strong>'G'</strong></td><td>-</td><td>un-capitalize word</td></tr>
			<tr><td><strong>'M'</strong></td><td>-</td><td>start new paragraph</td></tr>
			<tr><td><strong>'N'</strong></td><td>-</td><td>start new speaker</td></tr>
			<tr><td><strong>'R'</strong></td><td>-</td><td>restore / undo dialog</td></tr>
			<tr><td><strong>'O'</strong></td><td>-</td><td>override locked word</td></tr>
		</table>
		
	</div>
</div>
<!-- END of Quick-Help Info -->


<!-- Settings -->
<div id="Settings" style="display:none;">
	<div id="SettingsBackdrop">
	
		<div id="colorPickerScreen"></div>
		<div id="colorPicker">
			<div id="colorPickerBackdrop">
				<button id="closeColorPickerIcon" class="closeDialogIcon" onclick="closeColorPicker();"><img src="images/close_x.png"></button>	
				<div id="colorPickerTitle">Color Picker</div>
				<table id="colorPickerTable"></table>
			</div>
		</div>
		
		<button id="CloseSettingsIcon" class="closeDialogIcon" onclick="restorePrevUserSettings();"><img src="images/close_x.png"></button>
		<div id="SettingsTitle">Display Settings</div>
		
		<!-- Settings Body -->
		<div id="SettingsBody">
			
			<div>
				<label class="SettingsLine">Colors:
					<select id="ColorSet" onchange="showNewUserSettings();">
					</select>
				</label>
				<input id="EditColors" type="button" value="Edit" style="padding-top:0px; padding-bottom:0px;" onclick="loadIntoCustomColors();">  
			</div>
			
			<span id="CustomColorSettings" style="display:none;">
				<div>Caption Text:
					<button id="capTextColorButton" class="ColorButton" onclick="showColorPicker('capTextColor');">&nbsp;</button>
					<input id="capTextColor" class="ColorField" value="#000000" onchange="updateCustomColor('capTextColor');">
				</div>
				<div>Corrected Text:
					<button id="corTextColorButton" class="ColorButton" onclick="showColorPicker('corTextColor');">&nbsp;</button>
					<input id="corTextColor" class="ColorField" value="#000000" onchange="updateCustomColor('corTextColor');">
				</div>
				<div>Background:
					<button id="backgroundColorButton" class="ColorButton" onclick="showColorPicker('backgroundColor');">&nbsp;</button>
					<input id="backgroundColor" class="ColorField" value="#FFFFFF" onchange="updateCustomColor('backgroundColor');">
				</div>
				<div>Locked Highlight:
					<button id="LockedBgColorButton" class="ColorButton" onclick="showColorPicker('LockedBgColor');">&nbsp;</button>
					<input id="LockedBgColor" class="ColorField" value="#FFFFFF" onchange="updateCustomColor('LockedBgColor');">
				</div>
			</span>
			
			<div>
				<label class="SettingsLine">Font Face:
					 <select id="FontFace" onchange="showNewUserSettings();">
					</select>
				</label>
			</div>
			
			<div>
				<label class="SettingsLine">Font Size:
					<select id="FontSize" onchange="showNewUserSettings();">
					</select>
				</label>		
			</div>
			
			<div>
				<label class="SettingsLine">
					<input type="checkbox" id="CaptionsBold" value="Bold" onchange="showNewUserSettings();">Bold Text
				</label>
			</div>
			
			<div>
				<label class="SettingsLine">
					<input type="checkbox" id="CorrectedCaptionsUnderline" onchange="showNewUserSettings();">Underline Corrected Text				
				</label>
			</div>
			
			<div id="SettingsButtons" style="margin-top:0.5em;">
				<input type="button" value="Keep Changes" onclick="keepNewUserSettings();">
				<input type="button" value="Cancel" onclick="restorePrevUserSettings();">  
				<input type="button" value="Load Defaults" onclick="loadDefaultUserSettings();">
			</div>
			
		</div>
		<!-- END of Settings Body -->
		
		<div id="TestStats" style="display:none;">
			<span id="MeetTitle2"></span> <span id="MeetStats2"></span>
		</div>
		
		<div id="TestBlock" style="display:none;"><span>Test & Debug:</span>
			<label class="SettingsLine">
				<input type="checkbox" id="ReaderModeBtn" style="margin-left:10px;" onchange="showNewUserSettings();"><span>Reader Mode</span>
			</label>
			<label class="SettingsLine">
				<input type="checkbox" id="PausePollingBtn" style="margin-left:12px;" onchange="showNewUserSettings();"><span>Polling Paused</span>
			</label>
		</div>
		
	</div>
</div>
<!-- END of Settings -->


<div id="OverlayScreen" style="display:none;"></div>
<div id="Overlay1" style="display: none;">
     <div id="Overlay1Body">
		<p id="Overlay1Text1"></p>
		<p id="Overlay1Text2"></p>
		<button id="Overlay1ActionBtn">Delete</button>
		<button id="Overlay1CancelBtn">Cancel</button>
     </div>
</div>

<!--//////////////  iframe  /////////////////////-->

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

