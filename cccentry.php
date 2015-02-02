<!DOCTYPE html>
<?php

	$debug = $_GET['debug'];
	
?>

<html>
<head>
<title>Caption Sender</title>
	<? if ($debug == '1') { ?>
	<link rel="stylesheet" type="text/css" href="css/cccentry.css" />
	<? } else { ?> 
	<link rel="stylesheet" type="text/css" href="css/cccmobile.css" />
	<? } ?>




<script type="text/javascript" >

	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	
	var myroomid = "test2";
	var mypassword = "password1234567890";

//////////////////////////////////////////
	var stopSendingFlag = false;
	var STUCKTIMERCHECKDEFAULT = 10;
	var checkStuckCaption = STUCKTIMERCHECKDEFAULT;
	var SENDTIMEOUT = 200;
	var sendTimerEventVar;
	var inPostRequest = false;

//////////////////////////////////////////
	//polling for commands from server
	var CurrentPosition = 0;
	var stopPollingFlag = true;
	var immediatePollRequested = false;
	var pollingTimerEvent;
	var inPollRequest = false;

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
function xmlhttpPost(strURL,parameterStr) {

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
					document.getElementById('message').innerHTML = "Status: " + this.responseText;
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
	xmlHttpReq.send(parameterStr );
	debug ('xmlhttpPost:: END');
}

/*******************************************************/
/*******************************************************/
function xmlhttpPoll(strURL,parameterStr) {
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
					
					var tmpIndex;
					if ((tmpIndex = pollResponseStr.indexOf("~OK;last=")) != -1) {
						//command accepted.
						//~OK;last=  9
						var tmpIndex2 = pollResponseStr.indexOf('~',tmpIndex+9)
						CurrentPosition = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
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
	var tmpStr = parameterStr + '&room=' + myroomid;
	xmlHttpReq.send(tmpStr );
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug1 ('xmlhttpPoll:: END');
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


/*****************************************************/
/*****************************************************/
function init() {
	stopPollingFlag = true;
	stopSendingFlag = true;
	
	clearCodes();
	clearPoll();
	clearCaptions();

	document.getElementById('room').value = myroomid;
	document.getElementById('password').value = mypassword;
	sendTimerEventVar = setTimeout("dumpBuffer()",SENDTIMEOUT);
	document.getElementById('message').innerHTML= "Status: ";
}


/*****************************************************/
/*****************************************************/
function dumpBuffer() {
	debug("::dumpBuffer:: start");
	var i = 0;
	var diffIndex = 0;
	var newText = "";
	var str = "";
	var captionStr = "admincmd=caption&adminpwd=" + mypassword + "&room=" + myroomid ;

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
				displayCodes(str);
			
				//captionStr = "admincmd=caption&adminpwd=" + mypassword + "&room=" + myroomid ;
				xmlhttpPost("capreceiver",captionStr + "&caption=" + str);
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
					xmlhttpPost("capreceiver",captionStr + "&caption=" + str);
					checkStuckCaption = STUCKTIMERCHECKDEFAULT;
				}
			
			}

		} //else wait another timeout cycle to try to send
		
		sendTimerEventVar = setTimeout("dumpBuffer()",SENDTIMEOUT);
	}
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
	<? if ($debug == '1') { ?>
	
	document.getElementById('pollmsg').innerHTML = "";
	document.getElementById('pollmsg').value = "";

	if (stopPollingFlag == false) {
		document.getElementById('pollmsg').innerHTML = "polling";
		if (!inPollRequest) {
			xmlhttpPoll("capreceiver", "&last=" + CurrentPosition);
		}
		pollingTimerEvent = setTimeout('polling()',500);
	}
	<? } ?>
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
	<? if ($debug == '1') { ?>
	document.getElementById('pollmsg').innerHTML = "";
	document.getElementById('pollmsg').value = "";
	<? } ?>
}

//////////////////////////////////////////
//////////////////////////////////////////
function stopSending() {
	stopSendingFlag = true;
}
//////////////////////////////////////////
//////////////////////////////////////////
function startSending() {
	stopSendingFlag = false;
	dumpBuffer();
}


//////////////////////////////////////////
//////////////////////////////////////////
function adminCommand(cmd) {
	stopClear();
	myroomid = document.getElementById('room').value; 
	mypassword = document.getElementById('password').value;
	var str = "admincmd=" + cmd + "&adminpwd=" + mypassword + "&room=" + myroomid;
	if (!inPostRequest) {
		xmlhttpPost("capreceiver",str);
	}
}


//////////////////////////////////////////
function stopClear() {
	stopPolling();
	stopSending();

	clearPoll();
	clearCodes();
	clearCaptions();
}

//////////////////////////////////////////
function createRoom() {
	if (!inPostRequest) {
		adminCommand("create");
		startSending();
	} else {
		document.getElementById('message').innerHTML= "Status: " + "Busy...try again";
	}
}
//////////////////////////////////////////
//////////////////////////////////////////
function openRoom() {
	if (!inPostRequest) {
		adminCommand("open");
		startSending();
	} else {
		document.getElementById('message').innerHTML= "Status: " +  "Busy...try again";
	}
}
//////////////////////////////////////////
//////////////////////////////////////////
function closeRoom() {
	if (!inPostRequest) {
		adminCommand("close");
	} else {
		document.getElementById('message').innerHTML= "Status: " +  "Busy...try again";
	}
}
//////////////////////////////////////////
//////////////////////////////////////////
function clearRoom() {
	if (!inPostRequest) {
		adminCommand("reset");
		startSending();
	} else {
		document.getElementById('message').innerHTML= "Status: " + "Busy...try again";
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
function clearCaptions() {
	var el = document.getElementById('captions');
	el.innerHTML = "";
	el.value = "";
	
 	oldText ="";
	oldTextLen = 0;
	curText = "";
	curTextLen = 0;
}

//////////////////////////////////////////
//////////////////////////////////////////
function clearCodes() {

<? if ($debug == '1') { ?>

	var el = document.getElementById('codes');
	el.innerHTML = "";
	el.value = "";
<? } ?>
}
//////////////////////////////////////////
//////////////////////////////////////////
function displayCodes(str) {

<? if ($debug == '1') { ?>
	var el = document.getElementById('codes');
	el.innerHTML += str  + "<br />";
	//el.value = "";
	el.scrollTop = el.scrollHeight;
<? } ?>
}

//////////////////////////////////////////
//////////////////////////////////////////
function clearPoll() {

<? if ($debug == '1') { ?>
	var el = document.getElementById('capcorcommands');
	el.innerHTML = "";
	el.value = "";
<? } ?>
}

//////////////////////////////////////////
//////////////////////////////////////////
function reinit() {
	if (!inPostRequest) {
		adminCommand("close");
		init();
	} else {
		document.getElementById('message').innerHTML= "Status: " + "Busy...try again";
	}
}

</script>

</head>

<body>
<div class="container">
<div class="heading">
<p><button  onclick="reinit()">Stop/Reset</button>&nbsp; </p>

<p>
Room: <INPUT TYPE="text" id="room" VALUE="" SIZE="10"><br/>
Admin Password: <INPUT TYPE="password" id="password" VALUE="" SIZE="5"><br/>
&nbsp;&nbsp;<button  onclick="createRoom();">Create/Join </button>
&nbsp;&nbsp;<button  onclick="openRoom();">Open/Join </button>
&nbsp;&nbsp;<button  onclick="closeRoom();">Close </button>
&nbsp;&nbsp;<button  onclick="clearRoom();">Clear Room</button>
</p>
</div>

<div class="notification"> <p id="message"> </p>
</div>

<div class="col1">
<p>Enter Captions
<? if ($debug == '1') { ?>
<button  onclick="stopSending()">Stop Sending</button>&nbsp;&nbsp;
<button  onclick="startSending()">Start Sending</button>&nbsp;&nbsp;
<? } ?>
</p>
<!-- 
<textarea cols=35 name="captions" id="captions" onfocus="moveCursor(this)" onclick="moveCursor(this)" rows=30>
<textarea cols=35 name="captions" id="captions"  rows=30>

-->
<textarea cols=35 name="captions" id="captions" onfocus="moveCursor(this)" onclick="moveCursor(this)" rows=30>
</textarea>
</div>

<? if ($debug == '1') { ?>
<div class="col2outer">

<div class="col1inner"><p>&nbsp;&nbsp;</p>&nbsp;<button  onclick="clearCodes();">Clear</button>
<p>Caption Codes Sent</p>
<div id="codes" style="width:90%;height:400px;overflow-y:scroll;" ></div>
</div>

<div class="col2inner"><p>&nbsp;<button  onclick="startPolling()">Start Polling</button> &nbsp;&nbsp;
<button  onclick="stopPolling()">Stop Polling</button>&nbsp;&nbsp;<span id="pollmsg"></span></p>
&nbsp;<button  onclick="clearPoll()">Clear</button>
<p>Server Commands Received</p>
<div id="capcorcommands" style="width:90%;height:400px;overflow-y:scroll;" ></div>
</div>

</div>  

<? } ?>

</div>




<script type="text/javascript" defer>
init();
</script>
</body>
</html>
