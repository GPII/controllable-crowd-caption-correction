
<?php

	$roomid = $_GET['roomid'];
	$initials = $_GET['initials'];
	$pwd = $_GET['pwd'];
	
	
	$url = $_GET['url'];
	$event = $_GET['event'];
	$last = $_GET['last'];
	
	$debug = '0';
	$debug = $_GET['debug'];
	
	
	$IsMobile = 0;
	if ($_GET['mobile']){
		//header('Location: caption_ajax.php?roomid='.$roomid.'&initials='.$initials.'&pwd='.$pwd.'&debug='.$debug);
		$IsMobile = 1;
	}
	if ($pwd!="") {
		if ($initials=="") {
			echo "You must enter your initials!!";
			return;
		}
  
		if (strlen($initials)!= 2) {
			echo "You must enter 2 chars for initials!!!!";
			return;
		}
	}
	
?>

<html>
<head>
<title>Read StreamText.Net Captions</title>


	
<script type="text/javascript" >

	<?echo "//url=[$url]  event=[$event]  last=[$last]  debug=[$debug]";?>

	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	var myroomid = "<?php echo($roomid); ?>";
	
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
	//debug('xmlhttpGet:: Entered');

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
		debug('xmlhttpGet:: Cannot create XLMHTTP instance');
		return request;
	}

	/*
	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
		debug('xmlhttpGet:: xmlHttpReq assigned value='+xmlHttpReq.value);
	} else {
		debug('xmlhttpGet:: xmlHttpReq already have value='+xmlHttpReq.value);
	}
*/
	//xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait
	xmlHttpReq.open("GET", strURL + parameterStr, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait

	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpGet:: aborting request; timeout reached');
		debug('xmlhttpGet:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	//xmlHttpReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	//xmlHttpReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	//xmlHttpReq.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
	//xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	xmlHttpReq.onreadystatechange = function ()
		{
		//////////////
			//var returnStr = "";
			//debug("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
			debug('onreadystatechange Function START');
			//debug('xmlhttpGet::xmlHttpReq callback function running');
			//debug('xmlhttpGet:: xmlHttpReq.value='+this.value);
			try {
				if (this.readyState === 1) {
					//debug('xmlhttpGet::xmlHttpReq.readyState=:1');
				} 
				else if (this.readyState === 2) {
					//debug('xmlhttpGet::xmlHttpReq.readyState=:2');
				}
				else if (this.readyState === 3) {
					//debug('xmlhttpGet::xmlHttpReq.readyState=:3');
					//debug('xmlhttpGet::xmlHttpReq.responseText3=:'+this.responseText);
				}
				else if (this.readyState === 4) {
					//debug('xmlhttpGet::xmlHttpReq.readyState=:4');
					//clearTimeout(requestTimer); //do not abort

					if (this.status == 200) {
						
						//debug('xmlhttpGet::xmlHttpReq.status=:'+this.status);
						//debug('xmlhttpGet::xmlHttpReq.responseText=:'+this.responseText);
						responseStr = this.responseText;
						response = eval('(' + responseStr + ')');
						
						var next;
						if ((next = response.lastPosition) != null) {
							last = next;
						}
						
					} else {
						debug('Error of some type - NOT status=200:  xmlhttpGet::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpGet::xmlHttpReq.statusText=:'+this.statusText);
						debug('xmlhttpGet::xmlHttpReq.responseText=:'+this.responseText);
						responseStr = "-1";
					}
				} else {
					debug('not sure what up - ready not 1,2,3 or 4: xmlhttpGet::xmlHttpReq.readyState=:'+this.readyState);
				}
			} //try
			catch (e) {
				debug('Caught Exception on readyState in xmlhttpGet');
			}
			debug('onreadystatechange Function END');
			//debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
		}
		/////////////
		

	//debug('xmlhttpGet::xmlHttpReq.send=:'+ 'paramenters=' + xmlHttpReq.value);
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


/*	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
		debug('xmlhttpPost:: xmlHttpReq assigned value='+xmlHttpReq.value);
	} else {
		debug('xmlhttpPost:: xmlHttpReq already have value='+xmlHttpReq.value);
	}
*/
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
	xmlHttpReq.onreadystatechange = function ()
		{
		//////////////
			//var returnStr = "";
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
						
						
					} else {
						debug('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
						debug('xmlhttpPost::xmlHttpReq.responseText=:'+this.responseText);
					}
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
	xmlHttpReq.send('frase=' + parameterStr + '&roomid=' + myroomid );
	//xmlHttpReq.send();
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug ('xmlhttpPost:: END');
}

//http://www.streamtext.net/player?event=IHaveADream
	var responseStr = "start";
	var response = "";
	

	var url = "http://www.streamtext.net/text-data.ashx";
	var event = "";
	var last = "-1";
	
	<? if ($url != '') echo 'url = "' . $url . '";'?>
	
	<? if ($event != '') echo 'event = "' . $event . '";'?>
	
	<? if ($last != '') echo 'last = "' . $last . '";'?>
	
	var t;
	var paraId = 1;

function start(form) {
	var len;
	var next;
	debug("::start:: begin");

	if (responseStr == "") {
		debug("Not ready yet");
	} else if (responseStr == "-1") {
		debug("Something wrong");
	} else {
		debug("responseStr: " + responseStr);
		debug("response: " + response);

		if ((response.i != null) && ((len = response.i.length) != null)) {
			for (var cnt = 0; cnt < len; cnt++) {
				var text = response.i[cnt].d;
				debug("d =: " + text);
				document.getElementById('d1').innerHTML = document.getElementById('d1').innerHTML + decodeURIComponent(text);
				xmlhttpPost("posttofile.php",text);
				
			}
			//if ((next = response.lastPosition) != null) {
			//	lastID = next;
			//}
		}
		xmlhttpGet(url, "?event=" + event + "&last=" + last);

		//xmlhttpGet("http://www.streamtext.net/text-data.ashx", "?event=IHaveADream" + "&last=" + lastID);
	}
	t = setTimeout('start()',1000);
	debug("::start:: done");
}

function stop(form) {
	clearTimeout(t);
	debug("should be stopped");
}

</script>

</head>

<body>
<!-- <body onclick="stop();">
-->
<FORM NAME="myform" ACTION="" METHOD="GET">
<p><INPUT TYPE="button" NAME="button" Value="START" onClick="start(this.form)"></p>
<p><INPUT TYPE="button" NAME="button" Value="STOP" onClick="stop(this.form)"></p>
</form>

<div id='d1'>
	<p id='p1'>Captions: </p>
</div>


<script type="text/javascript">

	//start();

</script>

</body>


</html>
