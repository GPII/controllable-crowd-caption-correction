<!DOCTYPE html>
<?php

	$roomid = $_GET['roomid'];
	$initials = $_GET['initials'];
	$pwd = $_GET['pwd'];
	
	
	$url = $_GET['url'];
	$event = $_GET['event'];
	$last = $_GET['last'];
	
	$debug = '0';
	$debug = $_GET['debug'];
	
	
?>

<html>
<head>
<title>Read StreamText.Net Captions V2</title>


	
<script type="text/javascript" >

	var TIMEOUT = 200;

	<?echo "//url=[$url]  event=[$event]  last=[$last]  debug=[$debug]";?>

	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	var myroomid = "<?php echo($roomid); ?>";
	

	var url = "http://www.streamtext.net/text-data.ashx";
	var event = "";
	var last = "0";
	
	<? if ($url != '') echo 'url = "' . $url . '";'?>
	
	<? if ($event != '') echo 'event = "' . $event . '";'?>
	
	<? if ($last != '') echo 'last = "' . $last . '";'?>

	var pollingTimerEvent;
	var stopStreamFlag = true;
	var inPollRequest = false;
	
	
	//for timing debugging
	var lastTime = 0;
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
function xmlhttpGet(strURL,parameterStr) {

	debug('xmlhttpGet:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var request = true;
	var xmlHttpReq = null;
	var responseStr = "";
	var response = "";


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
		debug('xmlhttpGet:: Cannot create XLMHTTP instance');
		return request;
	}

	//xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait
	var tstr =  strURL + parameterStr;
	xmlHttpReq.open("GET", tstr, true);	//don't wait
	//xmlHttpReq.open("GET", "http://www.streamtext.net/text-data.ashx?event=IHaveADream&last=-1", true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait

	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpGet:: aborting request; timeout reached');
		debug('xmlhttpGet:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	xmlHttpReq.onreadystatechange = function ()
		{
		//////////////
			//var returnStr = "";
			//debug("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
			debug('xmlhttpGet: onreadystatechange Function START');
			//debug('xmlhttpGet::xmlHttpReq callback function running');
			//debug('xmlhttpGet:: xmlHttpReq.value='+this.value);
			try {
				if (this.readyState === 1) {
					debug('xmlhttpGet::xmlHttpReq.readyState=:1');
				} 
				else if (this.readyState === 2) {
					debug('xmlhttpGet::xmlHttpReq.readyState=:2');
				}
				else if (this.readyState === 3) {
					debug('xmlhttpGet::xmlHttpReq.readyState=:3');
					//debug('xmlhttpGet::xmlHttpReq.responseText3=:'+this.responseText);
				}
				else if (this.readyState === 4) {
					debug('xmlhttpGet::xmlHttpReq.readyState=:4');
					//clearTimeout(requestTimer); //do not abort

					if (this.status == 200) {
						
						//debug('xmlhttpGet::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpGet::xmlHttpReq.responseText=:'+this.responseText);
						responseStr = this.responseText;
						response = eval('(' + responseStr + ')');
						
						var next;
						if ((next = response.lastPosition) != null) {
							pushNow(response);
							inPollRequest = false;
							last = next;
						}
						
					} else {
						debug('Error of some type - NOT status=200:  xmlhttpGet::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpGet::xmlHttpReq.statusText=:'+this.statusText);
						debug('xmlhttpGet::xmlHttpReq.responseText=:'+this.responseText);
						responseStr = "-1";
						inPollRequest = false;
					}

				} else {
					debug('not sure what up - ready not 1,2,3 or 4: xmlhttpGet::xmlHttpReq.readyState=:'+this.readyState);
					inPollRequest = false;
				}
				
			} //try
			catch (e) {
				debug('Caught Exception on readyState in xmlhttpGet');
				inPollRequest = false;
			}
			debug('onreadystatechange Function END');
			//debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
		}
		/////////////
		

	//debug('xmlhttpGet::xmlHttpReq.send=:'+ 'paramenters=' + xmlHttpReq.value);
	inPollRequest = true;
	xmlHttpReq.send();
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug ('xmlhttpGet:: END');
}


/*******************************************************/
/*******************************************************/
function xmlhttpPost(strURL,parameterStr) {

	debug('xmlhttpPost:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	//debug('xmlhttpPost:: Entered');

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
	//xmlHttpReq.open('POST', strURL, true);	//don't wait
	xmlHttpReq.open('POST', strURL, false);  //wait
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
	xmlHttpReq.onreadystatechange = function ()
		{
		//////////////
			//var returnStr = "";
			//debug("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
			debug('xmlhttpPost: onreadystatechange Function START');
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
						
						
					} else {
						debug('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
						debug('xmlhttpPost::xmlHttpReq.responseText=:'+this.responseText);
					}
					document.getElementById('message').innerHTML = this.responseText;
				} else {
					debug('not sure what up - ready not 1,2,3 or 4: xmlhttpPost::xmlHttpReq.readyState=:'+this.readyState);
				}
			} //try
			catch (e) {
				debug('Caught Exception on readyState in xmlhttpPost');
			}
			debug('onreadystatechange Function END');
			//debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
		}
		/////////////
		

	//debug('xmlhttpPost::xmlHttpReq.send=:'+ 'paramenters=' + xmlHttpReq.value);
	//var str1 = 'admincmd=caption&adminpwd=password123456&caption=' + parameterStr + '&roomid=' + myroomid;
	//xmlHttpReq.send('frase=' + parameterStr + '&roomid=' + myroomid );
	xmlHttpReq.send(parameterStr );
	//xmlHttpReq.send();
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug ('xmlhttpPost:: END');
}

//////////////////////////////////////////
//////////////////////////////////////////

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






//http://www.streamtext.net/player?event=IHaveADream

//////////////////////////////////////////
//////////////////////////////////////////
function getStream(n) {
	if (debugIt) {
		var thisTime = new Date().getTime();
		var diff = thisTime - lastTime;
		lastTime = thisTime;
		debug("In getStream() via " + n + "[" + diff + "]");
	}
	if (stopStreamFlag == false) {
		if (!inPollRequest) {
			xmlhttpGet(url, "?event=" + event + "&last=" + last);
		}
		pollingTimerEvent = setTimeout('getStream(2)',TIMEOUT);
	}
	debug("Out getStream()");
}
	
//////////////////////////////////////////
//////////////////////////////////////////
function pushNow(response) {
	debug("In pushNow()");
	var len;
	var text = "";
	var tmpTxt = "";

	//clearTimeout(pollingTimerEvent);
	if ((response != null) && (response.i != null) && ((len = response.i.length) != null)) {
		if (len != 0) {
			for (var cnt = 0; cnt < len; cnt++) {
				tmpTxt = response.i[cnt].d;
				debug("d =: " + tmpTxt);
				document.getElementById('captions').value += decodeURIComponent(tmpTxt);
				
				//tmpTxt = decodeURIComponent(tmpTxt);
				//tmpTxt = hexEncoder(tmpTxt);

				text = 'admincmd=caption&adminpwd=password123456&caption=' + tmpTxt + '&roomid=' + myroomid;

				xmlhttpPost("capreceiver",text);

				document.getElementById('p1').innerHTML = "Last=[" + last + "]";
			}
		} 
	}
	debug("Out pushNow()");
	
}

//////////////////////////////////////////
//////////////////////////////////////////
function stopStream() {
	//clearTimeout(t);
	stopStreamFlag = 1;
	debug("should be stopped");
}

//////////////////////////////////////////
//////////////////////////////////////////
function startStream() {
	stopStreamFlag = 0;
	debug("Started");
	getStream();
}

//////////////////////////////////////////
//////////////////////////////////////////
function createRoom() {

	var text = 'admincmd=create&adminpwd=password123456&roomid=' + myroomid;

	xmlhttpPost("capreceiver",text);

}

//////////////////////////////////////////
//////////////////////////////////////////
function openRoom() {
	var text = 'admincmd=open&adminpwd=password123456&roomid=' + myroomid;
	xmlhttpPost("capreceiver",text);

}
//////////////////////////////////////////
//////////////////////////////////////////
function clearCaptions() {
	document.getElementById('captions').innerHTML = "";
	document.getElementById('captions').value = '';
}
//////////////////////////////////////////
//////////////////////////////////////////
function init() {
	document.getElementById('p0').innerHTML = "StreamText URL =[" + url + "] event=[" + event + "]  RoomID=[" + myroomid + "]";
	document.getElementById('p1').innerHTML = "Last=[" + last + "]";
}

</script>

</head>

<body>

<p><button  onclick="createRoom()">Create Room</button>&nbsp;&nbsp;<button  onclick="openRoom()">Open Room</button></p>
<p><button  onclick="startStream()">Start StreamText</button>&nbsp;&nbsp;<button  onclick="stopStream()">Stop StreamText</button></p>

<div class="notification"><p id="message"></p></div>

<div id='d1'>
	<p id='p0'>StreamText </p>
	<p id='p1'>Last = </p>
	
	&nbsp;<button  onclick="clearCaptions()">Clear</button>
	<p>Captions</p>
	<textarea cols=35 name="captions" id="captions" rows=30  ></textarea>
</div>


<script type="text/javascript" defer>
init();
</script>

</body>


</html>
