<!DOCTYPE html>
<?php

	$debug = $_GET['debug'];
	
?>

<html>
<head>
	<title>CCC Room Manager V3</title>
	<link rel="stylesheet" type="text/css" href="css/cccentry.css" />


<script type="text/javascript" >

var debugIt = false;
if ("<?php echo($debug); ?>" === "1") debugIt = true;

var myroomid = "";
var mypassword = "";

//////////////////////////////////////////
var stopSendingFlag = true;   //---###//---### was false
var STUCKTIMERCHECKDEFAULT = 10;
var checkStuckCaption = STUCKTIMERCHECKDEFAULT;
var SENDTIMEOUT = 200;
var sendTimerEventVar;
var inPostRequest = false;
var enableTestingAllowed = false;
var busyMsg = "Status: Busy...try again";

//////////////////////////////////////////
//polling for commands from server
var CurrentPosition = -1;
var stopPollingFlag = true;
var immediatePollRequested = false;
var pollingTimerEvent;
var inPollRequest = false;
var meetingDocId = -1;

//////////////////////////////////////////
//caption entry
var oldText ="";
var oldTextLen = 0;
var curText = "";
var curTextLen = 0;

///////////////////////////////////////////
//for speech-to-text
var putArtificialDelimFlag = false;
var PUTDELIMTIMEOUT = 5000;
var putDelimCounter = new Date().getTime();


/*******************************************************/
/*******************************************************/
function debug(text) {
	if (debugIt) {
		if (window.console) {
			window.console.log(text);
		}
	}
}


/*******************************************************/
/*******************************************************/
function debug1(text) {

}


/*******************************************************/
/*******************************************************/
function xmlhttpPost(strURL, parameterStr) {

	debug('xmlhttpPost:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	
	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var request = true;
	var xmlHttpReq = null;


	// Mozilla/Safari
	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			request = false;
		}
	}
	// IE
	else if (window.ActiveXObject) {
		try {
			xmlHttpReq = new ActiveXObject("MSXML2.XMLHTTP.3.0");
		}
		catch (e) {
			try {
				xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					request = false;
				}
			}
		}
	}
	if (!xmlHttpReq) {
		alert('Cannot create XLMHTTP instance');
		debug('xmlhttpPost:: Cannot create XLMHTTP instance');
		return request;
	}

	try {
	xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait
	//xmlHttpReq.open("GET", strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait
	} catch (e)  {
		debug("error: " + e);
		return;
	}
	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpPost:: aborting request; timeout reached');
		debug('xmlhttpPost:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	//xmlHttpReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	//xmlHttpReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	//xmlHttpReq.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
	//xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	xmlHttpReq.onreadystatechange = function () {
		//debug("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
		debug('onreadystatechange Function START');
		debug('xmlhttpPost::xmlHttpReq callback function running');
		debug('xmlhttpPost:: xmlHttpReq.value='+this.value);
		try {
			if (this.readyState === 1) {
				debug('xmlhttpPost::xmlHttpReq.readyState=:1');
			} 
			else if (this.readyState === 2) {
				debug('xmlhttpPost::xmlHttpReq.readyState=:2');
			}
			else if (this.readyState === 3) {
				debug('xmlhttpPost::xmlHttpReq.readyState=:3');
				debug('xmlhttpPost::xmlHttpReq.responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				debug('xmlhttpPost::xmlHttpReq.readyState=:4');
				///clearTimeout(requestTimer); //do not abort
				
				if (this.status == 200) {
					
					debug('xmlhttpPost::xmlHttpReq.status=:'+this.status);
					debug('xmlhttpPost::xmlHttpReq.responseText=:'+this.responseText);
					//pollNow();
					
				} else {
					debug('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
					debug('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
					debug('xmlhttpPost::xmlHttpReq.responseText=:'+this.responseText);
				}
				if (this.responseText != "") {
					var postResponse = JSON.parse(this.responseText);
					if ("adminrsp" in postResponse && "adminre" in postResponse) {
						document.getElementById('message').innerHTML = "Status: " + postResponse.adminrsp + " - " + postResponse.adminre;
						if (postResponse.adminrsp == "OK" && enableTestingAllowed == true) {
							enableTesting();
						}
					} else {
						document.getElementById('message').innerHTML = "Status: " + this.responseText;
						enableTestingAllowed == false;
					}
				}
				inPostRequest = false;
			} else {
				debug('not sure what up - ready not 1,2,3 or 4: xmlhttpPost::xmlHttpReq.readyState=:'+this.readyState);
				inPostRequest = false;
			}
		} //try
		catch (e) {
			debug('Caught Exception on readyState in xmlhttpPost');
			inPostRequest = false;
		}
		debug('onreadystatechange Function END');
		//debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
	}
	inPostRequest = true;
	xmlHttpReq.send(parameterStr);
	debug ('xmlhttpPost:: END');
}


/*******************************************************/
/*******************************************************/
function xmlhttpPoll(strURL, parameterStr) {
	//alert('ajax:' + parameterStr);
	debug1('xmlhttpPoll:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	debug1('xmlhttpPoll:: Entered');

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var request = false;
	var xmlHttpReq = null;
	//var self = this;

	// Mozilla/Safari
	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			request = false;
		}
	}
	// IE
	else if (window.ActiveXObject) {
		try {
			xmlHttpReq = new ActiveXObject("MSXML2.XMLHTTP.3.0");
		}
		catch (e) {
			try {
				xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					request = false;
				}
			}
		}
	}
	if (!xmlHttpReq) {
		alert('Cannot create XLMHTTP instance');
		debug1('xmlhttpPoll:: Cannot create XLMHTTP instance');
		return request;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
		debug1('xmlhttpPoll:: xmlHttpReq assigned value='+xmlHttpReq.value);
	} else {
		debug1('xmlhttpPoll:: xmlHttpReq already have value='+xmlHttpReq.value);
	}

	xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait

	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpPoll:: aborting request; timeout reached');
		debug('xmlhttpPoll:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	xmlHttpReq.onreadystatechange = function () {
		//////////////
		var pollResponseStr;
		var pollResponse = "";
		//var returnStr = "";
		debug1("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
		debug1('onreadystatechange Function START');
		debug1('xmlhttpPoll::xmlHttpReq callback function running');
		debug1('xmlhttpPoll:: xmlHttpReq.value='+this.value);
		try {
			if (this.readyState === 1) {
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:1');
			} 
			else if (this.readyState === 2) {
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:2');
			}
			else if (this.readyState === 3) {
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:3');
				debug1('xmlhttpPoll::xmlHttpReq.responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:4');
				//clearTimeout(requestTimer); //do not abort

				if (this.status == 200) {
					
					debug1('xmlhttpPoll::xmlHttpReq.status=:'+this.status);
					debug1('xmlhttpPoll::xmlHttpReq.responseText=:'+this.responseText);
					pollResponseStr = this.responseText;
					
					
					/* //---###//---###//---###//---###//---###//---###
					var tmpIndex;
					if ((tmpIndex = pollResponseStr.indexOf("~OK;last=")) != -1) {
						//command accepted.
						//~OK;last=  9
						var tmpIndex2 = pollResponseStr.indexOf('~',tmpIndex+9)
						CurrentPosition = pollResponseStr.substring(tmpIndex+9, tmpIndex2);
						pollResponse = pollResponseStr.substring(tmpIndex2+1);
						debug1("pollResponseStr: " + pollResponseStr);
						debug1("pollResponse: " + pollResponse);

						if (pollResponse != "") {
						
						<? if ($debug == '1') { ?>
							var el = document.getElementById('capcorcommands');
							el.innerHTML += pollResponse + "<br />";
							el.scrollTop = el.scrollHeight;
						<? } ?>
							pollResponse = "";
						}
					} else {
						//error of some type???
						debug1('Error of some type:  xmlhttpPoll::xmlHttpReq.status=:200, pollResponseStr =:'+pollResponseStr);
					}
					*/ //---###//---###//---###//---###//---###//---###
					var data = "";
					if (pollResponseStr.charAt(0) == "{") {
						pollResponse = JSON.parse(pollResponseStr);
					} else {
						var len = parseInt(pollResponseStr, 10);
						var len2 = pollResponseStr.indexOf("{");
						len = len2 + len;
						var tmp = pollResponseStr.slice(len2,len);
						pollResponse = JSON.parse(tmp);
						data = pollResponseStr.slice(len);
					}
					if ((typeof pollResponse["adminrsp"]) == "undefined") {
						if (meetingDocId != pollResponse["id"]) {
							// Initial poll or meeting room reset
							meetingDocId = pollResponse["id"];
						} else if (pollResponse["resp"] == "accept") {
							//if check against doc ID we sent
							if (CurrentPosition < pollResponse["ver"]) {
								if (data != "") {
									var el = document.getElementById('capcorcommands');
									el.value += data;
									el.scrollTop = el.scrollHeight;
								}
								CurrentPosition = pollResponse["ver"];
							}
						} else {
							//error of some type???
							debug1('Error of some type:  xmlhttpPoll::xmlHttpReq.status=:200, pollResponseStr =:' + pollResponseStr);
						}
					} else {
						// got some administrative response.  This is not good.  Skip processing.
						debug1('Admin error of some type:  xmlhttpPoll::xmlHttpReq.status=:200, pollResponseStr =:' + pollResponseStr);
					}
					//---###//---###//---###//---###//---###//---###
					
					
					
				} else {
					debug1('Error of some type - NOT status=200:  xmlhttpPoll::xmlHttpReq.status=:'+this.status);
					debug1('xmlhttpPoll::xmlHttpReq.statusText=:'+this.statusText);
				}
				inPollRequest = false;
				if (immediatePollRequested == true) {
					pollNow();
				}
			} else {
				debug1('not sure what up - ready not 1,2,3 or 4: xmlhttpPoll::xmlHttpReq.readyState=:'+this.readyState);
				inPollRequest = false;
			}
		} //try
		catch (e) {
			debug1('Caught Exception on readyState in xmlhttpPoll');
		}
		debug1('onreadystatechange Function END');
		debug1("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
	}
		/////////////
		

	inPollRequest = true;
	immediatePollRequested = false;
	
	
	/* //---###//---###//---###   ???
	var tmpStr = parameterStr + '&room=' + myroomid;
	xmlHttpReq.send(tmpStr );
	*/ //---###//---###//---###
	xmlHttpReq.send(parameterStr);
	
	
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug1 ('xmlhttpPoll:: END');
}


/*****************************************************/
/*****************************************************/
function dumpBuffer() {
	debug("::dumpBuffer:: start");
	var i = 0;
	var diffIndex = 0;
	var newText = "";
	var str = "";
	var captionStr = "admincmd=caption&adminpwd=" + mypassword + "&room=" + myroomid;
	
	document.getElementById("pauseSending").checked = (stopSendingFlag == true);   //---###
	
	if (stopSendingFlag == false) {
		
		if (!inPostRequest) {
			curText = document.getElementById('captions').value;
			if (curText == null) curText = "";
			
			curTextLen = curText.length;
			//find position of first difference
			for (diffIndex = 0; diffIndex < oldTextLen && diffIndex < curTextLen; diffIndex++) {
				if (oldText.charAt(diffIndex) != curText.charAt(diffIndex)) {
					break;
				}
			}
			//if there is a difference (will be less than the length of at least one)
			if ((diffIndex < oldTextLen) || (diffIndex < curTextLen)) {
			
				//there is a difference...update putDelimCounter
				//putDelimCounter = new Date().getTime();
				//putArtificialDelimFlag = false;
				
				//get number of backspaces to send
				for (i = oldTextLen - diffIndex; i > 0; i--) {
					newText += "\b";
				}
				
				//get string to send
				newText += curText.substring(diffIndex);
				str = hexEncoder(newText);
				//update
				oldText = curText;
				oldTextLen = curTextLen;
				
				//display codes
				var el = document.getElementById('codes');
				el.value += str + "\n";
				el.scrollTop = el.scrollHeight;
				
				//captionStr = "admincmd=caption&adminpwd=" + mypassword + "&room=" + myroomid ;
				xmlhttpPost("capreceiver", captionStr + "&caption=" + str);
				checkStuckCaption = STUCKTIMERCHECKDEFAULT;
			} else {
				//no difference...see if we reached timeout for putting in an artificial space
				//if (putArtificialDelimFlag == false) {
				//	var tempTime = new Date().getTime();
				//	if ((tempTime - putDelimCounter) > PUTDELIMTIMEOUT( {
				//		putArtificialDelimFlag = true;
				//		add to buffer
				//	}
				//}
				if (--checkStuckCaption <= 0) {
					//send whether we have anything or not to prod stuck caption
					//---###   why would this be needed ???   //---###   xmlhttpPost("capreceiver", captionStr + "&caption=" + str);
					checkStuckCaption = STUCKTIMERCHECKDEFAULT;
				}
			
			}
		
		} //else wait another timeout cycle to try to send
		
		sendTimerEventVar = setTimeout("dumpBuffer()", SENDTIMEOUT);
	}
}


/*****************************************************/
/*****************************************************/
function replacer(match, p1, p2, offset, theStr) {
	if ((p2 == null) || (p2 == "")) {
		//not a "non-word" so must be a word
		return match;
	} else {
		var tmp = p2.charCodeAt(0);
		if (tmp <= 15) {
			return ("%0" + tmp.toString(16));
		} else {
			return ("%" + tmp.toString(16));
		}
	}
}


/*****************************************************/
/*****************************************************/
function hexEncoder(str) {
	var tmpStr = "";
	if (str != "") {
		var re = /(\w)+|([\W])/g;
		tmpStr +=  str.replace( re, replacer);
	}
	return tmpStr;
}


/*****************************************************/
/*****************************************************/
function moveCursor(element) {
	element.selectionStart = element.selectionEnd = element.value.length;
}


/////////////////////////////////////////
//////////////////////////////////////////
function pollNow() {
	immediatePollRequested = true;
	clearTimeout(pollingTimerEvent);
	polling();
}


//////////////////////////////////////////
//////////////////////////////////////////
function polling() {
	document.getElementById("pausePolling").checked = (stopPollingFlag == true);
	if (stopPollingFlag == false) {
		if (!inPollRequest) {
			//---### xmlhttpPoll("capreceiver", "&last=" + CurrentPosition);
			xmlhttpPoll("capreceiver", "id=" + meetingDocId + "&room=" + myroomid + "&ver=" + CurrentPosition);   //---###
		}
		pollingTimerEvent = setTimeout('polling()', 500);
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function startPolling() {
	stopPollingFlag = false;
	polling();
}


//////////////////////////////////////////
//////////////////////////////////////////
function stopPolling() {
	stopPollingFlag = true;
	document.getElementById("pausePolling").checked = true;
}


//////////////////////////////////////////
//////////////////////////////////////////
function updatePolling() {
	if (document.getElementById("pausePolling").checked == true) {
		stopPolling();
	} else {
		startPolling();
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function loadAllCommands() {
	clearPoll();
	CurrentPosition = 0;
	startPolling();
}


//////////////////////////////////////////
//////////////////////////////////////////
function startSending() {
	stopSendingFlag = false;
	dumpBuffer();
}


//////////////////////////////////////////
//////////////////////////////////////////
function stopSending() {
	stopSendingFlag = true;
	document.getElementById("pauseSending").checked = true;   //---###
}


//////////////////////////////////////////
//////////////////////////////////////////
function updateSending() {
	if (document.getElementById("pauseSending").checked == true || myroomid == "" || mypassword == "") {
		stopSending();
	} else {
		startSending();
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function enableAdvancedTestMode() {
	document.getElementById("enableAdvancedTesting").checked = true;
	document.getElementById("resetTesting").style.display = "inline-block";
	document.getElementById("col2").style.display = "inline-block";
	document.getElementById("col3").style.display = "inline-block";
	stopPolling();
	clearCodes();
	clearPoll();
}


//////////////////////////////////////////
//////////////////////////////////////////
function disableAdvancedTestMode() {
	document.getElementById("enableAdvancedTesting").checked = false;
	document.getElementById("resetTesting").style.display = "none";
	document.getElementById("col2").style.display = "none";
	document.getElementById("col3").style.display = "none";
	stopPolling();
	clearCodes();
	clearPoll();
}


//////////////////////////////////////////
//////////////////////////////////////////
function enableTesting() {
	document.getElementById("testModeDiv").style.display = "block";
	document.getElementById("col1").style.display = "inline-block";
	if (document.getElementById("enableAdvancedTesting").checked == true) {
		document.getElementById("resetTesting").style.display = "inline-block";
		document.getElementById("col2").style.display = "inline-block";
		document.getElementById("col3").style.display = "inline-block";
	}
	enableTestingAllowed = false;
}


//////////////////////////////////////////
//////////////////////////////////////////
function disableTesting() {
	document.getElementById("testModeDiv").style.display = "none";
	document.getElementById("col1").style.display = "none";
	document.getElementById("col2").style.display = "none";
	document.getElementById("col3").style.display = "none";
	enableTestingAllowed = false;
}


//////////////////////////////////////////
//////////////////////////////////////////
function updateAdvancedTestMode() {
	if (document.getElementById("enableAdvancedTesting").checked == true) {
		enableAdvancedTestMode(); 
	} else {
		disableAdvancedTestMode(); 
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function resetTesting() {
	stopPolling();
	
	clearPoll();
	clearCodes();
	clearCaptions();
	
	startSending();
	
	////// CurrentPosition = -1;
}


//////////////////////////////////////////
//////////////////////////////////////////
function adminCommand(cmd) {
	stopClear();
	myroomid = document.getElementById('room').value; 
	mypassword = document.getElementById('password').value;
	var str = "admincmd=" + cmd + "&adminpwd=" + mypassword + "&room=" + myroomid;
	if (!inPostRequest) {
		xmlhttpPost("capreceiver", str);
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function stopClear() {
	stopPolling();
	stopSending();
	
	clearPoll();
	clearCodes();
	clearCaptions();
	
	CurrentPosition = -1;
	
	disableTesting();
}


//////////////////////////////////////////
//////////////////////////////////////////
function createRoom() {
	if (checkMissingParams() == true) return;
	
	if (!inPostRequest) {
		adminCommand("create");
		startSending();
		enableTestingAllowed = true;
	} else {
		document.getElementById('message').innerHTML = busyMsg;
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function openRoom() {
	if (checkMissingParams() == true) return;
	
	if (!inPostRequest) {
		adminCommand("open");
		startSending();
		enableTestingAllowed = true;
	} else {
		document.getElementById('message').innerHTML = busyMsg;
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function closeRoom() {
	if (checkMissingParams() == true) return;
	
	if (!inPostRequest) {
		adminCommand("close");
	} else {
		document.getElementById('message').innerHTML = busyMsg;
	}
}


//////////////////////////////////////////
//////////////////////////////////////////
function clearRoom() {
	if (checkMissingParams() == true) return;
	
	if (!inPostRequest) {
		adminCommand("reset");
		startSending();
		enableTestingAllowed = true;
	} else {
		document.getElementById('message').innerHTML = busyMsg;
	}
}


//---###//---###//---###//---###
function checkMissingParams() {
	var roomidBlank = ((document.getElementById('room').value).replace(/\s/g, "") == "");
	var passwordBlank = ((document.getElementById('password').value).replace(/\s/g, "") == "");
	document.getElementById("roomidHelp").style.display = (roomidBlank == true) ? "inline" : "none";
	document.getElementById("passwordHelp").style.display = (passwordBlank == true) ? "inline" : "none";
	return (roomidBlank == true || passwordBlank == true);
}


//////////////////////////////////////////
//////////////////////////////////////////
function clearCaptions() {
	document.getElementById('captions').value = "";
 	oldText = "";
	oldTextLen = 0;
	curText = "";
	curTextLen = 0;
}


//////////////////////////////////////////
//////////////////////////////////////////
function clearCodes() {
	document.getElementById('codes').value = "";
}


//////////////////////////////////////////
//////////////////////////////////////////
function clearPoll() {
	document.getElementById('capcorcommands').value = "";   //---###
}


/* //--###//--###//--###//--###//--###//--###//--###//--###//--###
//////////////////////////////////////////
//////////////////////////////////////////
function reinit() {
	if (!inPostRequest) {
		 adminCommand("close");
		 init();
	} else {
		document.getElementById('message').innerHTML = busyMsg;
	}
}
*/ //--###//--###//--###//--###//--###//--###//--###//--###//--###


/*****************************************************/
/*****************************************************/
function init() {
	stopClear();
	
	document.getElementById('room').value = myroomid;
	document.getElementById('password').value = mypassword;
	sendTimerEventVar = setTimeout("dumpBuffer()", SENDTIMEOUT);
	document.getElementById('message').innerHTML = "Status: Not connected.";
	
	disableAdvancedTestMode();
	
	if (!("resize" in document.getElementById("captions").style)) {
		document.getElementById("captions").style.height = "300px";
		document.getElementById("codes").style.height = "300px";
		document.getElementById("capcorcommands").style.height = "300px";
	}
}

</script>

</head>

<body>
	<div id="title">Manage & Test CCC Meeting Rooms</div>
	
	<div>Meeting Room: <input type="text" id="room" value="" size="20"><span id="roomidHelp">*** Missing Room ID</span></div>
	<div>Admin Password: <input type="password" id="password" value="" size="15"><span id="passwordHelp">*** Missing Password</span></div>
	
	<div id="roomBtns">
		<button onclick="createRoom();">Create/Join </button>
		<button onclick="openRoom();">Open/Join </button>
		<button onclick="closeRoom();">Close </button>
		<button onclick="clearRoom();">Clear Room</button>
	</div>
	<div id="message"></div>
	
	<div id="testModeDiv">
		<label class="testCheckbox"><input type="checkbox" id="enableAdvancedTesting" value="false" onchange="updateAdvancedTestMode();"><span>Show Additional Test Fields</span></label>
		<button id="resetTesting" onclick="resetTesting();" style="display:none;">Reset All Test Fields</button>
	</div>
	
	<div id="col1" class="colx">
		<div>Enter Test Captions to Send:</div>
		<div>
			<label class="testCheckbox"><input type="checkbox" id="pauseSending" value="true" onchange="updateSending();"><span>Sending Paused</span></label>
			<button class="resetBtn" onclick="clearCaptions();">Clear</button>
		</div>
		<textarea id="captions" onfocus="moveCursor(this)" onclick="moveCursor(this)"></textarea>
	</div>
	
	<div id="col2" class="colx" style="display:none;">
		<div>Caption Codes Sent:</div>
		<div><button class="resetBtn" onclick="clearCodes();">Clear</button></div>
		<textarea id="codes" readonly></textarea>
	</div>
	
	<div id="col3" class="colx" style="display:none;">
		<div>Polled Commands:<button id="loadAll" class="resetBtn" onclick="loadAllCommands();">Load All</button></div>
		<div>
			<label class="testCheckbox"><input type="checkbox" id="pausePolling" value="true" onchange="updatePolling();"><span>Polling Paused</span></label>
			<button class="resetBtn" onclick="clearPoll();">Clear</button>
		</div>
		<textarea id="capcorcommands" readonly></textarea>
	</div>
	
	<script type="text/javascript" defer>
		init();
	</script>
	
</body>

</html>
