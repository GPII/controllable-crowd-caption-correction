
/*
// The following variables are declared and initialized in cccV3.php
	var debugIt;
	var myroomid;
	var authenticatedCorrector;
	var userinfo;
	var userInitials;


var userInfo {
	"room" : "",
	"initials" : "",
	"credentials" : ""
};
*/

var CorrectorModeOn = (authenticatedCorrector == true);

// var SHOW_AJAX_DATA_FLAG = true;   // for testing and debugging
var SHOW_AJAX_DATA_FLAG = false;

var ALLOW_TEST_AND_DEBUG_SETTINGS = true;


var colorSetsObj = {
	black_red_white: { picker_label: "Black & Red on White", cap_text: "#000000", background: "#FFFFFF", cor_text: "#E00000", locked_bg: "#F8E800" },
	black_blue_white: { picker_label: "Black & Blue on White", cap_text: "#000000", background: "#FFFFFF", cor_text: "#0060F0", locked_bg: "#F8E800" },
	slate_red_cream: { picker_label: "Slate & Red on Cream", cap_text: "#005060", background: "#F8F6F0", cor_text: "#C00000", locked_bg: "#60F0F0" },
	plum_blue_cream: { picker_label: "Plum & Blue on Cream", cap_text: "#800040", background: "#F8F6F0", cor_text: "#2040B0", locked_bg: "#F8E800" },
	white_gold_black: { picker_label: "White & Gold on Black", cap_text: "#FFFFFF", background: "#000000", cor_text: "#F0D000", locked_bg: "#00A000" },
	yellow_cyan_black: { picker_label: "Yellow & Cyan on Black", cap_text: "#FFFF00", background: "#000000", cor_text: "#40FFFF", locked_bg: "#C000C0" },
	cream_gold_slate: { picker_label: "Cream & Gold on Slate", cap_text: "#F8F0E0", background: "#003040", cor_text: "#F8C000", locked_bg: "#00A000" },
	cream_gold_plum: { picker_label: "Cream & Gold on Plum", cap_text: "#F8F0E0", background: "#500028", cor_text: "#F0D000", locked_bg: "#00A000" },
	rose_olive_grey: { picker_label: "Rose & Olive on Grey", cap_text: "#FFA0D0", background: "#555555", cor_text: "#AACC33", locked_bg: "#0000FF" },
	custom_colors: { picker_label: "Custom Colors", cap_text: "#000000", background: "#FFFFFF", cor_text: "#E00000", locked_bg: "#F8E800" }
};

var fontFamiliesObj = {
	arial: { picker_label: "Arial", font_stack: "Arial, Helvetica, 'Nimbus Sans L', 'Liberation Sans', sans-serif" },
	lucida_sans: { picker_label: "Lucida Sans", font_stack: "'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', 'Bitstream Vera Sans', 'DejaVu Sans', sans-serif" },
	verdana: { picker_label: "Verdana", font_stack: "Verdana, Geneva, 'DejaVu Sans', 'Bitstream Vera Sans', sans-serif" },
	comic_sans: { picker_label: "Comic Sans", font_stack: "'Comic Sans MS', 'Comic Sans', 'TSCu_Comic', cursive, sans-serif" },
	times_new_roman: { picker_label: "Times New Roman", font_stack: "'Times New Roman', 'Nimbus Roman No 9 L', 'Liberation Serif', serif" },
	courier_new: { picker_label: "Courier New", font_stack: "'Courier New', Courier, 'Nimbus Mono L', 'DejaVu Mono', monospace" },
	lucida_console: { picker_label: "Lucida Console", font_stack: "'Lucida Console', Monaco, 'DejaVu Sans Mono', 'Bitstream Sans Mono', monospace" }
}

var fontSizes = [ 11, 14, 18, 24, 32, 42, 54 ];   // in pixels


var defaultSettingsObj = { 
	color_set_key: "black_red_white",
	custom_colors: { picker_label: "Custom Colors", cap_text: "#000000", background: "#FFFFFF", cor_text: "#E00000", locked_bg: "#F8E800" },
	font_face_key: "arial",
	font_size: "18",
	bold_text: false,
	cor_text_underlined: true
};

var currentSettingsObj;
var prevSettingsObj;

var NODETYPE_TEXT = 3;
var NODETYPE_ELEMENT = 1;

//=========================================================//
// Commands
//=========================================================//
var ROOM_PARAM = "room";
var CORRECTOR_COMMAND_PARAM = "cmd";
var CORRECTOR_PWD_PARAM = "pwd";
var CORRECTOR_PARAM = "who";
var STARTRANGE_PARAM = "strt";
var ENDRANGE_PARAM = "end";
var DATA_PARAM = "data";
var DOCVERSION_PARAM = "ver";
var MEETINGDOCID_PARAM = "id";
var RESPONSE_STATUS_PARAM = "resp";
var RESPONSE_REASON_PARAM = "reas";
var ACCEPT_INDICATOR = "accept";
var DENY_INDICATOR = "deny";

var ADMIN_RESPONSE_STATUS_PARAM = "adminrsp";
var ADMIN_RESPONSE_REASON_PARAM = "adminre";
var ADMIN_RESPONSE_STATUS_OK = "OK";
var ADMIN_RESPONSE_STATUS_NOK = "NOK";

/*
commands used:
"CA";
"CL";
"CO";
"DE";
"ED";
"L";
"NE";
"OV";
"PA";
"PD";
"PE";
"QU";
"RE";
"SD";
"SP";
*/

var CAPTION_COMMAND = "C";
var CAPTION_RECALL_COMMAND = "CR";
var CAPTIONER_PARAGRAPH_COMMAND = "P";
var CAPTIONER_PARAGRAPH_RECALL_COMMAND = "PR";

var LOCK_COMMAND = "L";
var EDIT_COMMAND = "ED";
var CANCELLOCK_COMMAND = "CL";
var DELETEALL_COMMAND = "DE";
var COMMA_COMMAND = "CO";
var PERIOD_COMMAND = "PE";
var QUESTION_COMMAND = "QU";
var CAPITALIZE_COMMAND = "CA";
var LOWERCASE_COMMAND = "LC";
var REMOVEPUNCTUATION_COMMAND = "RP";
var PARAGRAPH_COMMAND = "PA";
var NEWSPEAKER_COMMAND = "NE";
var OVERRIDE_COMMAND = "OV";

var RESTORE_COMMAND = "RE";
var SPEAKEREDIT_COMMAND = "SP";
var PARADELETE_COMMAND = "PD";
var SPEAKERDELETE_COMMAND = "SD";


var ajaxResp = {
	"resp" : "",
	"ver" : 0,
	"cmd" : "",
	"strt" : 0,
	"end" : 0,
	"data" : ""
};


//=========================================================//
//quick-click keys plus housekeeping

var userInput = {
	"90": "key_Z",
	"88": "key_X",
	"67": "key_C",
	
	"76": "key_L",
	"71": "key_G",
	"66": "key_B",
	"78": "key_N",
	"77": "key_M",
	"188": "key_Comma",
	"190": "key_Period",
	"191": "key_ForwardSlash",
	"79": "key_O",
	
	"82": "key_R",
	"83": "key_S",

	"docver" : -1,
	"target": {},
	"clientX" : -1,
	"clientY" : -1,
	
	"key" : "",
	"mouseDownSpanId" : -1
};



//=========================================================//
//polling related variables
var READER_POLL_TIMEOUT = 500;
var CORRECTOR_POLL_TIMEOUT = 250;
var stopFlag = false;   //set to false when requesting polling to stop

var immediatePollRequested = false;   //flag indicating a request was made to poll immediately, rather than wait for timeout
var pollingTimerEvent;
var inPollRequest = false;


//=========================================================//
//scrolling related variables
var scrollingTimerEvent = null;
var prevScrollTop = 0;

var scrollingTurnedOn = true;   // automatic scrolling is enabled
var scrollingIsScrollUpPaused = false;   // automatic scrolling is paused because the user has scrolled up
var scrollingIsKeyPaused = false;   // automatic scrolling is paused because a key is down
var scrollingIsMousePaused = false;   // automatic scrolling is paused because the mouse button is down

	
//=========================================================//
//
var UNINITIALIZED_VALUE = -1;
var JOIN_AT_CURRENT_PLACE = -1;
var JOIN_FROM_BEGINNING = 0;

var globalState = {
	"contentNode" : null,
	"resetFlagSet" : false,
	"clientGeneratedParagraphCnt" : 0,
	"lockId" : 0,
	"meetingDocId" : JOIN_AT_CURRENT_PLACE,
	"documentVersion" : JOIN_AT_CURRENT_PLACE

};

var editState = {
	"editBoxId" : "captionEditBox",
	"hiddenTextSizerId" : "sizetext",
	"specialEdit" : "",
	"editType" : "",
	"editing" : false,
	"lowerEditRange" : -1,
	"upperEditRange" : -1,
	"originalSelectedText" : "",
	"lockRequestPending" : false,
	"documentVersion" : -1
};

//=========================================================//
// element attributes

//states:

var LOCKED_ATTRIBUTE = "ccclock";
var EDITING_ATTRIBUTE = "cccediting";   //put on spans that are under active edit (edit box showing).  Initials of editor doing the editing are put here
var EDITED_ATTRIBUTE = "cccedited";   //put on spans that have been edited (original text is in here)
var QUICKCLICK_ATTRIBUTE = "cccquick";   //put on spans modified by quick-clicks.  Type of quick-click (i.e. name of command) put in here
var DELETED_ATTRIBUTE = "cccdelall";   //put on spans where text was deleted completely.  ((??Initials of editor placed here

var EDITOR_ATTRIBUTE = "ccceditor";   //put on spans that have been edited (initials of editor(s) put here


var TOOLTIP_ATTRIBUTE = "title";


//var EDITGROUP_ATTRIBUTE = "cccegrp";   //put on spans whose text was removed as part of an edit group.  ID of head of edit group put here

//======= paragraph attributes
var SPECIALPARAFOLLOWS_ATTRIBUTE = "cccnextpara";   //put on paragraph before (i.e previous sibling to) new corrector-generated paragraph to get paragraph mark;
var CORRECTORPARA_ATTRIBUTE = "cccmypara";   //put on corrector-generated paragraph to mark it

var NEWSPEAKER_ATTR = "cccnewspeaker";   //put on paragraphs with newspeakers;
var SPEAKER_TEXT_FIELD_ATTR = "cccspeaker";   //put on paragraphs with newspeakers - holds the speaker text


var DELETED_PLACEHOLDER = "\u00a0";
var PARAGRAPH_PLACEHOLDER = "\u00b6";

var PARAGRAPH_MARK  = "\u00a0\u00b6\u00a0";   //---### was = "\u00b6"
var PARAGRAPH_PLUS_MARK = "\u00a0\u00b6+>>\u00a0";   //---### was = PARAGRAPH_MARK + "+spkr"

var SHOWSPEAKER_TEXT = "show";
var HIDE_TEXT = "hide";
var NEW_SPEAKER_TEXT = "Speaker";   //---### was = "Speaker: ";
var NEWSPEAKER_MARK = ">>";
//var NEW_PARAGRAPH_TEXT = "newparagraph";


//========================================================//
//========================================================//
function debug(text) {
	if (debugIt && window.console) {
		window.console.log(text);
	}
}


//========================================================//
//========================================================//
function debug1(text) {
	if (SHOW_AJAX_DATA_FLAG && window.console) {
		window.console.log(text);
	}
}


//========================================================//
//========================================================//
function errorOut(text) {
	if (window.console) {
		window.console.log(text);
	}
	//alert("Error:" + text);
}


//========================================================//
//========================================================//
function setKeyDown(event) {
	//http://unixpapa.com/js/testkey.html
	var returnVal = true;
	var keyCode;
	
	keyCode = (event.hasOwnProperty('which')) ? event.which : event.keyCode;
	
	//---### NOTE:  IE9 eats the keyUp event when escape is used to close the edit box.  If the escape key is used to pause scrolling,
	//---### this causes the "Pause Auto-scroll" button to remain hidden, and leave scrolling turned off (without any obvious way to turn it back on).
	//---### Trapping for (keyCode == 27 && noCurrentEdit()) also doesn't work because processInputChar() cancels the edit box *before* setKeyDown() is called.
	//---### Since using the escape key to pause scrolling isn't really needed (shift & control work better anyway),
	//---### the easiest way to avoid this problem is to *not* have the escape key pause scrolling.
	//---### DPK - Feb 2016
	
	// pause scrolling when the shift key or control key is pressed to facilitate viewing & editing
	if (keyCode == 16 || keyCode == 17) {
		scrollingIsKeyPaused = true;
	}
	
	// trap for F12 key to toggle visibility of "TestStats" & "TestBlock" sections of "Settings" dialog
	// (iff allowed and Settings dialog is visible)
	if (keyCode === 123 && document.getElementById("Settings").style.display == "block") {
		if (document.getElementById("TestStats").style.display != "block") {
			document.getElementById("TestStats").style.display = "block";
		} else if (ALLOW_TEST_AND_DEBUG_SETTINGS == true && document.getElementById("TestBlock").style.display != "block") {
			document.getElementById("TestBlock").style.display = "block";
		} else {
			document.getElementById("TestStats").style.display = "none";
			document.getElementById("TestBlock").style.display = "none";
		}
		preventDefaultBehavior(event);   // block normal browser debug-mode toggle if toggling visibility of "TestStats" & "TestBlock" sections of "Settings" dialog
		returnVal = false;
	}
	
	// ignore (other) keystrokes if not a corrector
	if (CorrectorModeOn) {
		debug('setKeyDown::event.keyCode:'+keyCode);
		
		// pause scrolling when quick-click keys are pressed to facilitate editing
		if (keyCode in userInput) {
			scrollingIsKeyPaused = true;
		}
		
		if (keyCode === 27) {
			if (waitingToConfirmEdit()) {
				cancelEdit();
			}
			preventDefaultBehavior(event);
			returnVal = false;
		} else {
			userInput.key = userInput[keyCode];
			//trap for hot-key in Mozilla
			//=== FUTURE check if running Mozilla browser.  For now, do on all ===//
			if ((keyCode === 191) && noCurrentEdit() ) {
				preventDefaultBehavior(event);
				returnVal = false;
			}
		}
	}
	debug('setKeyDown:: DONE');
	return returnVal;
}


//========================================================//
//========================================================//
function setKeyUp(event) {
	debug('setKeyUp:: START');
	
	var keyCode;
	
	// allow scrolling to resume again if was stopped while a key was pressed down
	scrollingIsKeyPaused = false;
	
	if (CorrectorModeOn) {
		keyCode = (event.hasOwnProperty('which')) ? event.which : event.keyCode;
		debug('setKeyUp::event.keyCode:'+keyCode);
		userInput.key = "";
	}
	
	debug('setKeyUp:: DONE');
}


//========================================================//
//========================================================//
function preventDefaultBehavior(e) {
	//prevent event handler from continuing on with default behavior
	//for browser.  e.g. escape key, enter key
	if (e.preventDefault) {
		e.preventDefault();
	}
	if (e.returnValue) {
		e.returnValue = false;
	}
}


var debugCnt = 0;
//========================================================//
//========================================================//
function setMouseDownSpanId(event) {
	var tmpElem;
	var result;
	debug('setMouseDownSpanId:: START');
	
	// pause scrolling when mouse button pressed to facilitate editing (and reading)
	scrollingIsMousePaused = true;
	
	if (CorrectorModeOn) {
		debug('setMouseDownSpanId:: mousedown?: event.target.id: '+event.target.id);

		debugCnt++;
		if (debugCnt > 10) {
			debugCnt = 1;
		}
		//may need to check if you clicked on a span that is empty but not hidden
		//...not sure if that is possible, but we don't want that to happen.
		//As of now, we are not deleting blank spans but we can't hide them either
		//since we only hide items being edited while the input box is visible.
		
		if (noCurrentEdit() && !editState.lockRequestPending) {
		//if (getEditNode() === null) {
			if  ((event.target.id !== "") && !isNaN(event.target.id)) {
				userInput.mouseDownSpanId = parseInt(event.target.id, 10);
			} else {
				userInput.mouseDownSpanId = -1;
			}
			//save target and mouse info for examination later....
			userInput.target = event.target;
			//userInput.offsetX = event.offsetX;
			//userInput.offsetY = event.offsetY;
			
			userInput.clientX = event.clientX;
			userInput.clientY = event.clientY;
			
			userInput.docver = globalState.documentVersion;  //use version of doc when mouse down was pressed
			
			/*************************
			//sometimes getting target.id of outer form (Form1CaptionContent) instead of what we really want....check into this.
			//verify whether we want "" or null
			if  ((event.target.id !== "") && !isNaN(event.target.id)) {
				//event.target.id is id of element that triggered the event
				userInput.mouseDownSpanId = parseInt(event.target.id, 10);
				//decide if should check for and save the key pressed (if any) when mouse down, or allow keys after mouse down to still work
				//userInput.activeKey = userInput.key;
				debug('setMouseDownSpanId:: userInput.mouseDownSpanId:'+userInput.mouseDownSpanId);
			} else {
				tmpElem = event.target;
				//look for an indication it is a paragraph with a newspeaker or corrector-added paragraph
				if ((tmpElem.nodeName === "P") && ((tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) || (tmpElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
					//okay pretty sure we got the paragraph so see we clicked on ::before  or ::after portion
					result = determineWhatWeClickedOn(event);
					if (result == "speaker") {
						doQuickSpeakerEdit(tmpElem.firstChild.id, tmpElem.getAttribute(NEWSPEAKER_ATTR), SPEAKEREDIT_COMMAND);
						//userInput.key = "";
					} else if (result == "paragraph") {
						doQuickParagraphEdit(tmpElem.lastChild.id, PARADELETE_COMMAND);
						//userInput.key = "";
					}
				} else {
					debug ('setMouseDownSpanId:: error on event.target.id: ' + event.target.id);
				}
			}
			****************************/
			
		} else {
			debug('setMouseDownSpanId:: Edit box found.  Ignoring mouse-down');
		}
	}
	debug('setMouseDownSpanId:: END');
}


//========================================================//
//========================================================//
function getElementPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}


/*
//========================================================//
//========================================================//
function getLastEditableSpan(elem) {
	//get last editable span of paragraph
	var last = null;
	
	if (elem != null) {
		last = elem.lastChild;
		while (last != null) {
			if (last.firstChild == null) {
				//part of edit group.  backup until get to main span
				last = last.previousSibling;
			} else {
				break;
			}
		}
	}
	return last;
}
*/


//========================================================//
//========================================================//
function determineWhatWeClickedOn(event) {
	var result = "";
	var lowId;
	var highId;

	var paraPos;

	var firstSpan;
	var firstSpanPos;
	var lastSpan;
	var lastSpanPos;
	var mousePos;
	var last;

	
	var elem = event.target;
	
	//LAST SIBLING SHOWING IS NOT NECESSARILY LAST SIBLING.  REMEMBER EDIT GROUPS!!!!!
	//FIX
	
	//
	// NOTE:  If there is not at least one span in the paragraph that is editable (i.e. text node not missing), then there won't be a paragraph mark to click on on the paragraph.
	// If the first span of the paragraph is not editable, then for sure the newspeaker won't be showing.
	// (it might not be showing for other reasons as well.) So, if we got here, the user clicked on something that can be associated with a span.
	// see if a special paragraph
	if ( (elem != null) && (elem.nodeName === "P") && ((elem.getAttribute(NEWSPEAKER_ATTR) != null) || (elem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
		//okay, it is special.  Find out where clicked
		paraPos = getElementPosition(elem);
		//get first span of paragraph
		firstSpan = elem.firstChild;
		//get last editable span of paragraph
		//lastSpan = getLastEditableSpan(elem);
		lastSpan = elem.lastChild;;
		
		//Could happen if corrector deletes spans
		if ((firstSpan != null) && (lastSpan != null)) {
			firstSpanPos = getElementPosition(firstSpan);
			lastSpanPos = getElementPosition(lastSpan);
			
			//mousePos = {x : paraPos.x + event.offsetX, y : paraPos.y + event.offsetY};
			mousePos = {x : event.clientX, y : event.clientY};
			
			/*until we narrow down width of new speaker or paragraph, we will use the more lenient one 
			if (((mousePos.x < firstSpanPos.x) && (mousePos.y >= firstSpanPos.y) && (mousePos.y <= firstSpanPos.y + firstSpan.offsetHeight))  || ((mousePos.x >= firstSpanPos.x) && (mousePos.y < firstSpanPos.y))) {
			*/
			if ( ((mousePos.x < firstSpanPos.x) && (mousePos.y >= firstSpanPos.y) && (mousePos.y <= firstSpanPos.y + firstSpan.offsetHeight))  || (mousePos.y < firstSpanPos.y) ) {
				//we clicked near paragraph begin indicating we probably clicked on new-speaker
				if (elem.getAttribute(NEWSPEAKER_ATTR) != null) {
					result = "speaker";
					lowId = firstSpan.getAttribute("id");
					highId = lowId;
					//lastSpan = getLastEditableSpan(elem.previousSibling);
					//if (lastSpan == null) {
					//	lowId = highId;
					//} else {
					//	lowId = lastSpan.getAttribute("id");
					//}
				}
			/*
			} else if (((mousePos.x > lastSpanPos.x + lastSpan.offsetWidth) && (mousePos.y >= lastSpanPos.y) && (mousePos.y <= lastSpanPos.y + lastSpan.offsetHeight))  || ((mousePos.x >= lastSpanPos.x) && (mousePos.y > lastSpanPos.y + lastSpan.offsetHeight))) {
			*/
			} else if (((mousePos.x > lastSpanPos.x + lastSpan.offsetWidth) && (mousePos.y >= lastSpanPos.y) && (mousePos.y <= lastSpanPos.y + lastSpan.offsetHeight))  || (mousePos.y > lastSpanPos.y + lastSpan.offsetHeight) ) {
				//we clicked near paragraph end;  //end mark always on same line as last displayed span
				if (event.target.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) {
					result = "paragraph";
					//high gets last span
					highId = lastSpan.getAttribute("id");
					
					last = lastSpan;
					while (last != null) {
						if (last.firstChild == null) {
							//part of edit group.  backup until get to main span
							last = last.previousSibling;
						} else {
							break;
						}
					}
					if (last != null) {
						lastSpan = last;
					} //else lastSpan stays the last span
					//low gets last edit group
					lowId = lastSpan.getAttribute("id");

					////move high id to next paragraph span if one there.
					//if ((elem = elem.nextSibling) != null) {
					//	if ((firstSpan = elem.firstChild) != null) {
					//		highId = firstSpan.getAttribute("id");
					//	}
					//}
				}
			}
		}
	}
	//if "speaker", 
	//		lowspan = id of first span of paragraph
	//		highspan = id of first span of paragraph
	
	//if "paragraph", 
	//		lowspan = id of last edit group of paragraph (may be a deleteall)
	//		highspan = last span of paragraph 
	
	
	return { "target" : result, "lowspan" : parseInt(lowId, 10), "highspan" : parseInt(highId, 10) };
}


//========================================================//
//========================================================//
function setMouseUpSpanId(event) {
	debug('setMouseUpSpanId:: START');
	var mouseUpSpanId;
	var end;
	var tempElem;
	var result;
	
	// allow scrolling to resume again if was stopped when mouse button was pressed down
	scrollingIsMousePaused = false;
	
	if (CorrectorModeOn) {
		//don't allow edit if have an edit underway, or we canceled edit but still waiting to send cancel
		if (noCurrentEdit() && !editState.lockRequestPending) {
		//if (getEditNode() == null) {
			//did we release on a span?
		 	if  ((event.target.id != "") && !isNaN(event.target.id)) {
				mouseUpSpanId = parseInt(event.target.id, 10);
			} else {
				mouseUpSpanId = -1;
			}
			
			//Now figure out what we clicked on....
			//if mouse down and mouse up on a span, process here
			if ((mouseUpSpanId >= 0) && (userInput.mouseDownSpanId >= 0)) {
				//clicked on spans on each end. 
					
				//orient mouse down/up
				if (mouseUpSpanId < userInput.mouseDownSpanId) {
					end = userInput.mouseDownSpanId;
					userInput.mouseDownSpanId = mouseUpSpanId;
					mouseUpSpanId = end;
				}
		/*
				if (userInput.key == "key_R") {
					// This is a restore command attempt which may cross paragraph boundaries
					doQuickClickRangeRestore(userInput.mouseDownSpanId, mouseUpSpanId, RESTORE_COMMAND);
					
				//no other command allowed across paragraphs that start and end on a span
				} else if (document.getElementById(userInput.mouseDownSpanId).parentNode === document.getElementById(mouseUpSpanId).parentNode) {
		*/

				if (document.getElementById(userInput.mouseDownSpanId).parentNode === document.getElementById(mouseUpSpanId).parentNode) {
					//quick-clicks or edit if both ends on same paragraph
					switch (userInput.key) {
						case "key_Z":
						case "key_ForwardSlash":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickExtended(mouseUpSpanId, QUESTION_COMMAND);
							}
							break;
						case "key_X":
						case "key_Period":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickExtended(mouseUpSpanId, PERIOD_COMMAND);
							}
							break;
						case "key_C":
						case "key_Comma":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, COMMA_COMMAND);
							}
							break;
						case "key_B":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, CAPITALIZE_COMMAND);
							}
							break;
						case "key_G":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, LOWERCASE_COMMAND);
							}
							break;
						case "key_L":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, REMOVEPUNCTUATION_COMMAND);
							}
							break;
						case "key_N":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								//if new speaker already there, ignore if clicked on first span
								tempElem = document.getElementById(mouseUpSpanId);
								if (tempElem.parentNode.firstChild == tempElem) {   //---### firstChild //---###
									//clicked on first span.  See if new speaker already there
									if (tempElem.parentNode.getAttribute(NEWSPEAKER_ATTR) == null) {
										//okay to proceed
										doQuickClickNewParaSpeaker(mouseUpSpanId, NEWSPEAKER_COMMAND);
									} // else skip, cuz already there
								} else {
									doQuickClickNewParaSpeaker(mouseUpSpanId, NEWSPEAKER_COMMAND);
								}
							}
							break;
						case "key_M":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								//proceed only if NOT clicked on first span of a paragraph
								tempElem = document.getElementById(mouseUpSpanId);
								if (tempElem.parentNode.firstChild != tempElem) {   //---### firstChild //---###
									doQuickClickNewParaSpeaker(mouseUpSpanId, PARAGRAPH_COMMAND);
								}
							}
							break;
						case "key_O":
							// This is an OVERRIDE.
							sendCommand(userInput.mouseDownSpanId, getEndOfEditGroup(mouseUpSpanId, false), OVERRIDE_COMMAND, userInput.docver, "");
							break;
						case "key_R":
							// This is an restore original caption. 
							doQuickClickRangeRestore(userInput.mouseDownSpanId, mouseUpSpanId, RESTORE_COMMAND);
							break;
						case undefined:
						case "":
						default:
							//enlarge range to include blank spans - for stale data problem
							end = getEndOfEditGroup(mouseUpSpanId, false);
							if (isAnyInRangeLocked(userInput.mouseDownSpanId, end) == false) {
								debug('setMouseUpSpanId:: call startEditing()');
								startEditing(userInput.mouseDownSpanId, end);
								debug('setMouseUpSpanId:: back from startEditing()');
							} else {
								debug('setMouseUpSpanId:: someone has lock already');
							}
					}
				} else {
					debug("setMouseUpSpanId:: can't edit across paragraphs");
				}
				
			// Appears a special might be involved.  Can only restore a special or edit a newspeaker.  Either way, we can only click on the single special element.  What is requested?
			} else if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) && (event.target === userInput.target)) {
				//it appears both ends are not spans and are the same target element.
				//Check further. Start on up-mouse event
				result = determineWhatWeClickedOn(event);
				if (result.target == "speaker") {
					//check if down was also on speaker
					result = determineWhatWeClickedOn(userInput);
					if (result.target == "speaker") {
						end = getEndOfEditGroup(result.highspan, false);
						if (isAnyInRangeLocked(result.lowspan, end) == false) {
							//and edit or restore?
							if (userInput.key == "key_R") {
								//restore
								doQuickSpeakerDelete(result.lowspan, end, SPEAKERDELETE_COMMAND);
							} else {
								//edit
								editSpeakerSpecial(result.lowspan, end);
							}
						}
					}
				} else if (result.target == "paragraph") {
					//check if down was also on paragraph
					result = determineWhatWeClickedOn(userInput);
					if ((result.target == "paragraph") && (userInput.key == "key_R")) {
						//restore paragraph
						//end = getEndOfEditGroup(result.highspan, false);
						//if (isAnyInRangeLocked(result.lowspan,end) == false) {
						//	doQuickParagraphDelete(result.lowspan,end, PARADELETE_COMMAND);
						//}
						//low = edit group , high = last span
						doQuickParagraphDelete(result.lowspan, result.highspan, PARADELETE_COMMAND);
					}
				}
				
			} else {
				//ignore everything else
			}
			
			
			
			/*
			
			} else if (userInput.key == "key_R") {
				//okay, going to try a restore.  Let's figure out what to use for range while we are figuring out if a special is involved on at least one end
				
				//initialize range values;
				info.high = -1;
				info.low = Number.MAX_VALUE;
				info.condlow = 0;
				info.condhigh = 0;
				
				//if span involved on mouse up, lock that value in
				if (mouseUpSpanId >= 0) {
					//mouse up on a span.  Save that info
					if (userInput.mouseUpSpanId < info.low) {
						info.low = mouseUpSpanId;
					}
					if (userInput.mouseUpSpanId > info.high) {
						info.high = mouseUpSpanId;
					}
				}
				//if span involved on mouse down, lock that value in
				if (userInput.mouseDownSpanId >= 0) {
					if (userInput.mouseDownSpanId < info.low) {
						info.low = userInput.mouseDownSpanId;
					}
					if (userInput.mouseDownSpanId > info.high) {
						info.high = userInput.mouseDownSpanId;
					}
				}
				//now figure out if special involved

				//do mouseup first
				tmpElem = event.target;
				result = determineWhatWeClickedOn(event);
				if (result.target =! "") {
					if (result.lowspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.lowspan < info.low) {
							info.low = result.lowspan;
						}
						if (result.lowspan > info.high) {
							info.high = result.lowspan;
						}
					}
					if (result.highspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.highspan < info.low) {
							info.low = result.highspan;
						}
						if (result.highspan > info.high) {
							info.high = result.highspan;
						}
					}
				//now mouse down
				result = determineWhatWeClickedOn(userInput);
				if (result.target =! "") {
					if (result.lowspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.lowspan < info.low) {
							info.low = result.lowspan;
						}
						if (result.lowspan > info.high) {
							info.high = result.lowspan;
						}
					}
					if (result.highspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.highspan < info.low) {
							info.low = result.highspan;
						}
						if (result.highspan > info.high) {
							info.high = result.highspan;
						}
					}

				}
							tmpElem = event.target;
				if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) &&  (userInput.key == "") && (tmpElem === userInput.target)) {
					//down and up on same target.  Check further, to make sure one of OUR specials
					if ((tmpElem.nodeName === "P") && ((tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) || (tmpElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
						//okay pretty sure we got the paragraph so see if we clicked on ::before  or ::after portion
						//check up mouse settings
						result = determineWhatWeClickedOn(event);
						if (result.target == "speaker") {
							//check if down was also on speaker
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "speaker") {
								//restore speaker
							
							}
						} else if (result == "paragraph") {
							//check if down was also on paragraph
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "paragraph") {
								//restore paragraph
							
							}
						}
					} 

			
			// Not a restore so only thing left is an edit.  Can't edit a range that includes a special and a span.  (both ends must be on special) Check if down and up on same special 
			} else {
				tmpElem = event.target;
				if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) &&  (userInput.key == "") && (tmpElem === userInput.target)) {
					//down and up on same target.  Check further, to make sure one of OUR specials
					if ((tmpElem.nodeName === "P") && (tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) ) {
						//okay pretty sure we got the paragraph so see if we clicked on ::before portion
						//check up mouse settings
						result = determineWhatWeClickedOn(event);
						if (result.target == "speaker") {
							//check if down was also on speaker
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "speaker") {
								//edit speaker
								specialEdit(result.span.getAttribute("id"),0);
							}
						}
					}
				}
			}
			
			*/
			
			
			
			userInput.mouseDownSpanId = -1;
			//Don't wait for keyup to come (it will not come, in some situations) if onblur not setup or other cases
			userInput.key = "";
			
		} //getEditNode
	} //authenticated user
	debug('setMouseUpSpanId:: END');
}


//========================================================//
//========================================================//
function doQuickClickBasic(start,command) {
	debug('doQuickClickBasic:: START');
	debug('doQuickClickBasic::start=:'+start+'  :command=:'+command);

	var end;
	
	//don't allow quick clicks on deleteall spans
	if (!spanIsMarkedTextDeleted(document.getElementById(start))) {
		end = getEndOfEditGroup(start, false);

		//make sure none of the range is locked
		if (isAnyInRangeLocked(start,end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, "");
		}
	}
	debug('doQuickClickBasic:: END');
}


//========================================================//
//========================================================//
function doQuickClickNewParaSpeaker(clickedId, command) {

	//need to find where last span is to apply punctuation - not necessarily to deal with stale issue
	//so we want to lock it if we can, along with span group clicked on
	//start = previous edit group (stop if deleteall found) or span clicked on
	//end = end of edit group clicked on
	//special = span clicked on
	var aSpan;
	var end = clickedId;
	var start = clickedId;
	
	if (((aSpan = document.getElementById(clickedId)) != null) && (!spanIsMarkedTextDeleted(aSpan))) {
		//don't allow quick clicks on deleteall spans (no reason to allow and can cause further complications)
		end = getEndOfEditGroup(clickedId, false);
		
		//get span before to put punctuation on
		while (true) {
			if ((aSpan = aSpan.previousSibling) == null) {
				//at beginning of paragraph
				break;
			} else if (spanIsMarkedTextDeleted(aSpan)) {
				//stop 
				break;
			} else if (aSpan.firstChild != null) {
				//found an existing text node - assume not empty so done
				start = aSpan.id;
				break;
			} else {
				//no text node so keep going
			}
		}
		//start either holds span clicked on or previous edit group (not deleteall)
		
		//make sure none of the range is locked
		if (isAnyInRangeLocked(start, end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, hexEncoder("" + clickedId));
		}
	}
}


//========================================================//
//========================================================//
function doQuickClickExtended(start, command) {
	debug('doQuickClickExtended:: START');
	debug('doQuickClickExtended::start=:'+start+'  :command=:'+command);

	var capFlag = "";
	//need to find where next span is to capitalize - not necessarily to deal with stale issue
	var end;
	var aSpan;
	
	//don't allow quick clicks on deleteall spans
	if (!spanIsMarkedTextDeleted(document.getElementById(start))) {
		//not okay to pass around a deleteall span for capitalization
		end = getEndOfEditGroup(start, false);

		//We will check if a capitalization span exists and pass that range along with the flag so comet backend knows what to do.
		//If no capitalization span exists (e.g. word clicked is at end of a paragraph), the range only includes the range of the edit group
		
		aSpan = document.getElementById(end);
		if ((aSpan != null) && ((aSpan = aSpan.nextSibling) != null) && spanHasUndeletedText(aSpan)) {
			//signal to backend to capitalize span in data portion
			capFlag = aSpan.id;
			//move end to end of edit group of this element
			end = getEndOfEditGroup(capFlag, false);
		}

		//make sure none of the range is locked
		if (isAnyInRangeLocked(start, end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, hexEncoder("" + capFlag));
		}
	}
	debug('doQuickClickExtended:: END');
}


//========================================================//
//========================================================//
/*
function doQuickSpeakerEdit(id, text, command) {
	var result;
	debug('doQuickSpeakerEdit:: START');

	result = prompt("Edit Speaker", text);

	if (result != null) {
		editState.documentVersion = userInput.docver;
		//sendCommand(id, id, command, editState.documentVersion, id + "~" + result);
		sendCommand(id, id, command, editState.documentVersion, result);
	}
	debug('doQuickSpeakerEdit:: END');
}
*/


//========================================================//
//========================================================//
function doQuickSpeakerDelete(start, end, command) {
	//debug('doQuickSpeakerDelete:: START');
	
	doDialog(start, end, command, "", "", "Delete speaker text?", "Delete");
	
	//debug('doQuickSpeakerDelete:: END');
}


//========================================================//
//========================================================//
function doQuickParagraphDelete(start, end, command) {
	var nsFlag = "";
	var aSpan;
	var tmpElem;
	var questionText;
	var aPara;
	
	//start = edit group, end = last span
	//assume para delete only, to start with
	questionText = "Delete paragraph break?";
	
	//see if there is a span in the next paragraph
	if (((aSpan = document.getElementById(end)) != null) && ((aPara = aSpan.parentNode.nextSibling) != null) && ((aSpan = aPara.firstChild) != null)) {   //---### firstChild //---###
		//found a span.  Put its ID in data so we can remove attributes on late joiners
		nsFlag = aSpan.id;
		//move end to end of edit group of this element
		end = getEndOfEditGroup(nsFlag, false);
		//see if attribute there
		if (aPara.getAttribute(NEWSPEAKER_ATTR) != null) {
			questionText = "Delete paragraph break and \"Speaker\" text?";
		}	
	}
	if (isAnyInRangeLocked(start, end) == false) {
		doDialog(start, end, command, nsFlag, "", questionText, "Delete");
	}
}


//========================================================//
//========================================================//
function doQuickClickRangeRestore(start, end, command) {
	var data;
	var displayText;

	end = getEndOfEditGroup(end, false);

	//make sure none of the range is locked
	if (isAnyInRangeLocked(start, end) == false) {
		data = getCurrentAndOriginal(start, end);
		//if span text to restore
		if (data.restoreText != "") {
			////// displayText = "ORIGINAL: " + data.restoreText + "<br><br>CURRENT: " + data.currentText + "<br><br>";
			////// doDialog(start, end, command, "", displayText, "Restore Original?", "Restore");
			doDialog(start, end, command, "", "ORIGINAL: " + data.restoreText, "CURRENT: " + data.currentText, "Restore Original");
		}
	}
}


//========================================================//
//========================================================//
//---### function doDialog(start, end, command, data, text, question, button) {
function doDialog(start, end, command, data, text1, test2, button) {
	editState.editing = true;
	editState.lockRequestPending = true;
	editState.documentVersion = userInput.docver;
	//setInputEventHandlers(tmpElem);
	editState.lowerEditRange = start;
	editState.upperEditRange = end;
	editState.editType = command;
	//tmpElem.focus();
	//tmpElem.select();
	
	document.getElementById("Overlay1Text1").textContent = text1;
	document.getElementById("Overlay1Text1").style.display = (text1 == "") ? "none": "block";
	
	document.getElementById("Overlay1Text2").textContent = test2;
	document.getElementById("Overlay1Text2").style.display = (test2 == "") ? "none": "block";
	
	document.getElementById("Overlay1ActionBtn").textContent = button;
	document.getElementById("Overlay1ActionBtn").onclick = function () {
		if (!editState.lockRequestPending) {
			//removeDialog1();
			//clear further events
			//clearInputEventHandlers(tmpNode);
			
			//indicate we are done editing
			editState.editing = false;
			
			//send command
			sendCommand(editState.lowerEditRange, editState.upperEditRange, command, editState.documentVersion,  hexEncoder("" + data));
		}
	};
	document.getElementById("Overlay1CancelBtn").onclick= function () {
		cancelEdit();
	};
	
	//send lock request
	sendCommand(editState.lowerEditRange, editState.upperEditRange, LOCK_COMMAND, editState.documentVersion, "");

	//display dialog
	document.getElementById("OverlayScreen").style.display = "block";
	document.getElementById("Overlay1").style.display = "block";
	document.getElementById("Overlay1CancelBtn").focus();
	updateDialogPosition();
}


function updateDialogPosition() {
	if (document.getElementById("Overlay1").style.display == "block") {
		document.getElementById("Overlay1").style.marginTop = Math.round(Math.max(0, (document.getElementById("OverlayScreen").offsetHeight - document.getElementById("Overlay1").offsetHeight) / 3)) + "px";
	}
}


//========================================================//
//========================================================//
function getCurrentAndOriginal(start, end){
	var text = {"restoreText": "", "currentText": ""};
	var correctArray = [];
	var origArray = [];
	var i;
	var textStart = -1;
	var textEnd = -1;
	var orig;
	var curText;
	var aSpan;
	var sib;
	var tmpText;
	
	for (i = start; i <= end; i++) {
		//orig = "";
		curText = "";
		if ((aSpan = document.getElementById(i)) != null) {
			try {
				sib = aSpan.firstChild;
				while (sib != null) {
					if (sib.nodeType == NODETYPE_TEXT) {
						tmpText = sib.textContent;
						// handle special cases
						if (spanIsMarkedTextDeleted(aSpan) && (tmpText == DELETED_PLACEHOLDER)) {
							tmpText = "";
						}
						curText += tmpText;
					}
					sib = sib.nextSibling;
				}
			} catch (e) {
				errorOut('Error trying to get .textContent: '+ e.message);
			}
			//get text.  If none, nothing to restore
			if ((orig = getOriginalSpanText(aSpan)) != null) {
				if (textStart == -1) {
					textStart = i - start;
				}
				textEnd = i - start;
			} else {
				orig = curText;
			}
			origArray[i-start] = orig;
			correctArray[i-start] = curText;
		}
	}
	if (textStart != -1) {
		for (i = textStart; i <= textEnd; i++) {
			text.restoreText += origArray[i];
			text.currentText += correctArray[i];
		}
	} 
	
	return text;
}		


/*
//========================================================//
//========================================================//
function paraToRestore(start, end) {

get parent of start
get last child of parent
if last child id is < end
	do
	get next sibling of parent
	if parent is editorcreated 
		mark;
		break; done
	else get last child of parent
	while last child id is < end
return marked?

	var aSpan;
	var aPar;
	var result = false;

	aPar = document.getElementById(start).parentNode;
	aSpan = aPar.lastChild;
	if (aSpan.id < end) {
		do {
			aPar = aPar.nextSibling;
			if (aPar.getAttribute("mypara") != null) {
				result = true;
				break;
			} else {
				aSpan = aPar.lastChild;
			}
		} while (aSpan.id < end);
	}
	return result;
}
*/


//========================================================//
//========================================================//
//To help detect stale edits, extend edit ranges to include trailing spans that have been 
//collapsed into edit groups.  (i.e. no child of nodetype=text)
function getEndOfEditGroup(id, extendPastTextDeleted) {
	var returnVal = id;
	var aSpan;
	
	//extend range by including subsequent spans which have null text elements
	//=== added: which have null text elements OR blank non-null text elements
	//=== CHANGED: which only have null text elements
	if ((aSpan = document.getElementById(id)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null){
				//at end (end of paragraph). This is okay
				break;
			} else if (spanIsMarkedTextDeleted(aSpan)) {
				//decide how to handle this special case based on flag passed in.
				if (extendPastTextDeleted) {
					//update and keep going
					returnVal = aSpan.id;
				} else {
					//stop at textdeleted. we're done
					break;
				}
			} else if (aSpan.nodeName.toUpperCase() != "SPAN") {
				//need to check for input element - or rather not SPAN element, cuz backend uses this routine too
				//we're done
				break;
			} else if (aSpan.firstChild != null) {
				//found an existing text node - assume not empty so done
				break;
			} else {
				//no text node so save id and keep going
				returnVal = aSpan.id;
			}
		}
	}
	return returnVal;
}


//========================================================//
//========================================================//
function startEditing(start, end) {
	debug('startEditing START::lowerEditRange=:'+start+'  :upperEditRange=:'+end);
	
	var buildTextLayer = "";
	var tmpElem;
	var i, j;
	var noProblem = true;
	var sib;
	var tmpText;
	
	editState.lowerEditRange = start;
	editState.upperEditRange = end;
	
	for (i = start; i <= end; i++) {
		//collect text from spans.  Hide along the way as will be part of edit group
		if ((tmpElem = document.getElementById(i)) != null) {
			
			if (!spanIsMarkedEditing(tmpElem)) {
				try {
					sib = tmpElem.firstChild;
					//NOTE:  USING NODETYPE CUZ AT ONE TIME CONSIDERING PUTTING IN <BR> ELEM IN FOR PARAGRAPHS
					while (sib != null) {
						if (sib.nodeType == NODETYPE_TEXT) {
							tmpText = sib.textContent;
							//handle special cases
							if (spanIsMarkedTextDeleted(tmpElem) && (tmpText == DELETED_PLACEHOLDER)) {
								tmpText = "";
							}
							buildTextLayer += tmpText;
						} else if (sib.nodeType == NODETYPE_ELEMENT) {
							//assume <br>
							buildTextLayer += PARAGRAPH_PLACEHOLDER; //need some other special character
						}
						sib = sib.nextSibling;
					}
				} catch (e) {
					errorOut('Error trying to get .textContent: '+ e.message);
				}
				//indicate it is in our edit group 
				setSpanEditingFlag(tmpElem,userInitials);
				setSpanEditingStyle(tmpElem);
				
			} else {
				//it is already being edited by us - not sure how we could get to this point but it is not right
				errorOut("startEditing::span id i=:" + i + " ERROR Span appears to be in an edit right now");
				noProblem = false;
				break;
			}
		} else {
			noProblem = false;
			//span missing along the range
			errorOut("startEditing::span id i=:" + i + " ERROR span missing");
		}
	}
	debug('startEditing::buildTextLayer=:'+buildTextLayer);
	
	if (noProblem) {
		// Set the variable to what is in the textbox. 
		// This is to do a comparison when Enter is pressed to see if the text has actually changed
		editState.originalSelectedText = buildTextLayer;
		
		editState.editType = "";	//just a normal edit
		editState.editing = true;
		editState.lockRequestPending = true;
		editState.documentVersion = userInput.docver;
		
		// reuse old node if still laying around.  Shouldn't be.
		if ((tmpElem = document.getElementById(editState.editBoxId)) == null) {
			tmpElem = document.createElement("input");
			tmpElem.setAttribute("id",editState.editBoxId); 
		} else {
			debug ("**********************Old edit node found");
		}
		tmpElem.type = "text";
		tmpElem.className = "caption";
		tmpElem.setAttribute("editor", userInitials);
		tmpElem.setAttribute("style", "width: 200px");
		setInputEventHandlers(tmpElem);
		
		tmpElem.defaultValue = buildTextLayer;
		tmpElem.value = buildTextLayer;
		
		//put the edit box just before (previousSibling of) the lower span
		document.getElementById(start).parentNode.insertBefore(tmpElem, document.getElementById(start));
		tmpElem.focus();
		tmpElem.select();
		resizeEditBox(tmpElem);
		
		//send lock request
		sendCommand(start, end, LOCK_COMMAND, editState.documentVersion, "");
	} else {
		//undo all the editing marks .. start though i-1  (i.e. j<i)
		for (j = start; j < i; j++) {
			//unhideElement(document.getElementById(j));
			if ((tmpElem = document.getElementById(j)) != null) {
				unsetSpanEditingFlag(tmpElem);
				unsetSpanEditingStyle(tmpElem);
			}
		}
	}
	debug('startEditing:: END');
	return noProblem;
}


//========================================================//
//========================================================//
function editSpeakerSpecial(start, end) {
	debug('specialEdit START::lowerEditRange=:'+start+'  :upperEditRange=:'+end);
	
	var tmpElem;
	var parentElem;
	
	// Set the variable to what is in the textbox. 
	// This is to do a comparison when Enter is pressed to see if the text has actually changed
	
	editState.editing = true;
	editState.lockRequestPending = true;
	editState.documentVersion = userInput.docver;
	
	
	/* //---###//---###//---###//---###//---###//---###//---###
	tmpElem = document.createElement("input");
	tmpElem.setAttribute("id", editState.editBoxId);
	*/ //---###//---###//---###//---###//---###//---###//---###
	
	// reuse old node if still laying around.  Shouldn't be.
	if ((tmpElem = document.getElementById(editState.editBoxId)) == null) {
		tmpElem = document.createElement("input");
		tmpElem.setAttribute("id",editState.editBoxId); 
	} else {
		debug ("**********************Old edit node found");
	}
	//---###//---###//---###//---###//---###//---###//---###
	
	
	tmpElem.type = "text";
	tmpElem.className = "caption";
	tmpElem.setAttribute("editor", userInitials);
	tmpElem.setAttribute("style", "width: 200px");
	setInputEventHandlers(tmpElem);
	
	/*
	if (start == 0) {
		editState.lowerEditRange = end;
		editState.upperEditRange = end;
		parentElem = document.getElementById(end).parentNode;
		editState.originalSelectedText = parentElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		
		//hide current text
		parentElem.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,HIDE_TEXT);
		//put the edit box just after last span
		parentElem.appendChild(tmpElem);
		editState.editType = PARADELETE_COMMAND;
		
	} else {
	*/
		editState.lowerEditRange = start;
		editState.upperEditRange = end;
		parentElem = document.getElementById(start).parentNode;
		editState.originalSelectedText = parentElem.getAttribute(SPEAKER_TEXT_FIELD_ATTR);
		
		tmpElem.defaultValue = editState.originalSelectedText;
		tmpElem.value = editState.originalSelectedText;
		
		//hide current text
		parentElem.setAttribute(NEWSPEAKER_ATTR, HIDE_TEXT);
		//put the edit box just before (previousSibling of) the lower span
		parentElem.insertBefore(tmpElem, document.getElementById(start));
		editState.editType = SPEAKEREDIT_COMMAND;
/*	}
*/
	
	
	tmpElem.focus();
	tmpElem.select();
	resizeEditBox(tmpElem);
	
	//send lock request
	sendCommand(editState.lowerEditRange, editState.upperEditRange, LOCK_COMMAND, editState.documentVersion, "");
	
	debug('specialEdit:: END');
	return 
}


//========================================================//
//========================================================//
function removeDialog1() {
	//clearInputEventHandlers();
	document.getElementById("Overlay1ActionBtn").onclick= null;
	document.getElementById("Overlay1CancelBtn").onclick = null;

	//remove the dialog box and restore
	document.getElementById("Overlay1Text1").textContent = "";
	document.getElementById("Overlay1Text2").textContent = "";
	document.getElementById("Overlay1ActionBtn").textContent = "";
	
	document.getElementById("Overlay1").style.display = "none";
	document.getElementById("OverlayScreen").style.display = "none";
}


//========================================================//
//========================================================//
function cancelEditBlur() {
	debug('cancelEditBlur::Start');
	cancelEdit();
	debug('cancelEditBlur::Done ');
}


//========================================================//
//========================================================//
//remove edit node- this is only place in the code where we can remove the edit node.  (i.e must call cancelEdit() if you need to remove it)
//set edit status to false to indicate we are done editing
//if we have a lock on the spans, cancel the lock
//if we are still waiting for the lock response, let ajax response send cancel lock (if necessary) based on edit flag status
function cancelEdit() {
	
	debug('cancelEdit::Start:editing=:'+editState.editing);
	
	//careful.  removing the tag may trigger the onBlur handler..
	
	var aSpan;
	var tmpStart, tmpEnd;
	var parentElem;
	
	if ((tmpStart = getEditNode()) != null) {
		//clear this so no additional cancels come in
		clearInputEventHandlers(tmpStart); 
		
		//if special edit do this
		if (editState.editType == SPEAKEREDIT_COMMAND) {
			//remove the input element
			parentElem = tmpStart.parentNode;
			parentElem.removeChild(tmpStart);
			//unhide newspeaker
			parentElem.setAttribute(NEWSPEAKER_ATTR, SHOWSPEAKER_TEXT);
			
			if (editState.editing) {
				//clear the "we are editing" flag
				editState.editing = false;
				if (!editState.lockRequestPending) {
					//send the cancel
					sendCommand(editState.lowerEditRange, editState.upperEditRange, CANCELLOCK_COMMAND, editState.documentVersion, "");
				} //else handle in the ajax response function
			} 
		} else if (editState.editType == "") {
			
			//get 1st span in edit range
			aSpan = tmpStart.nextSibling;
			
			//remove the input element
			tmpStart.parentNode.removeChild(tmpStart);
			
			//get the first element of edit group
			if (aSpan != null) {
				tmpStart = aSpan.id;
				tmpEnd = tmpStart;
				
				//"unset" editing while keeping track of end of range so can use later
				while (aSpan != null) {
					if (spanIsMarkedEditing(aSpan)) {
						unsetSpanEditingFlag(aSpan);
						unsetSpanEditingStyle(aSpan);
						tmpEnd = aSpan.id;
						aSpan = aSpan.nextSibling;
					} else {
						//we reached end of editing range
						break;
					}
				}
				if (editState.editing) {
					//clear the "we are editing" flag
					editState.editing = false;
					if (!editState.lockRequestPending) {
						//send the cancel
						sendCommand(tmpStart, tmpEnd, CANCELLOCK_COMMAND, editState.documentVersion, "");
					} //else handle in the ajax response function
				} else {
					//no longer editing - which means we sent the 
					//edit already and backend is cancelling the edit.  No need to cancel lock at this point.
					debug("canceEdit:: Already sent edit so no unlock command to send.");
				}
			} else {
				//clear the "we are editing" flag (if editing)
				editState.editing = false;
			}
		}
	} else if ((editState.editType == RESTORE_COMMAND) || (editState.editType == SPEAKERDELETE_COMMAND) || (editState.editType == PARADELETE_COMMAND) ) {
		//remove the dialog box and restore
		removeDialog1();
		
		if (editState.editing) {
			//clear the "we are editing" flag
			editState.editing = false;
			if (!editState.lockRequestPending) {
				//send the cancel
				sendCommand(editState.lowerEditRange, editState.upperEditRange, CANCELLOCK_COMMAND, editState.documentVersion, "");
			} //else handle in the ajax response function
		} 
	} else {
		debug("cancelEdit:: NO EDIT in progress.");
	}
	debug("cancelEdit::done");
}


//========================================================//
//========================================================//
//http://unixpapa.com/js/testkey.html
//document.onkeyup=resizeEditBox;  //find a better place for this.  Also note difference between keypress and key down/up and pick appropriate one

function processInputChar(me, event) {

	debug('processInputChar:: START with me:'+me);
	
	var returnVal = true;
	var tmpNode;
	var newText;
	var key = '';
	
	//watch out of difference between onkeypress and onkeydown as well as keycode vs charcode for non-char keys
	//for keypress, event.which exists, but is 0 for escape in some browsers, so need to get keyCode.
	key = (event.hasOwnProperty('which')) ? event.which : event.keyCode;
	
	// check for escape out of editing
	if (key == 27) {
		debug('processInputChar::key = 27 ESC ::START');
		cancelEdit();
		
		//need to block the default behavior of the ESC key which kills the loading of pages - i.e. kills comet
		preventDefaultBehavior(event);
		
		debug('processInputChar::key = 27 ESC ::DONE');
		returnVal = false;
		
	} else if (key == 13) {
		//enter key
		debug("processInputChar::key = 13 ENTER key ::START");
		//make sure re-entry into this portion is blocked after 1st pass until comet 
		//server gets around to applying the edit and thereby removing the event handler calls
		//
		/*
		if ((tmpNode = getEditNode()) != null) {
			//we still have the edit box
			
			//wait for lock request response before allowing edit
			if (!editState.lockRequestPending) {
			*/
			
		//wait for lock request response before allowing edit
		if (!editState.lockRequestPending) {
		
			if ((tmpNode = getEditNode()) != null) {
				//we still have the edit box
			
				//strip off leading and trialing spaces
				newText = tmpNode.value;
				newText = newText.replace(/^\s+|\s+$/g,'');

				// If text was unchanged then treat just like a cancel edit
				if (newText == editState.originalSelectedText.replace(/^\s+|\s+$/g,'')) {
					//both are the same
					cancelEdit();
					
				} else {
					//send edit, but first....

					//clear further events
					clearInputEventHandlers(tmpNode);
					//indicate we are done editing
					editState.editing = false;
					
					if (editState.editType == SPEAKEREDIT_COMMAND) {
						newText = hexEncoder(newText);
						sendCommand(editState.lowerEditRange, editState.upperEditRange, SPEAKEREDIT_COMMAND, editState.documentVersion, newText);

					// If the text was completely deleted, then send the DELETEALL_COMMAND code
					} else if (newText == "") {
						sendCommand(editState.lowerEditRange, editState.upperEditRange, DELETEALL_COMMAND, editState.documentVersion, "");
					} else {
						newText = hexEncoder(newText);
						sendCommand(editState.lowerEditRange, editState.upperEditRange, EDIT_COMMAND, editState.documentVersion, newText);
					}
					
					//block default behavior in browser (submits form?)
					preventDefaultBehavior(event);

					debug("processInputChar::key = 13 ENTER key ::DONE");
				}
			} else if (waitingToConfirmEdit()) {
				//we still have the dialog box
				//send command, but first....

				//clear further events
				//clearInputEventHandlers(tmpNode);
				//indicate we are done editing
				editState.editing = false;
				sendCommand(editState.lowerEditRange, editState.upperEditRange, editState.editType, editState.documentVersion, "");

				//block default behavior in browser (submits form?)
				preventDefaultBehavior(event);
				debug("processInputChar::key = 13 ENTER key ::DONE");
			} else {
				debug("processInputChar::key = 13 Edit/dialog box no longer exists");
				//debug("processInputChar::key = 13 Still waiting for lockRequst...");
			}
		} else {
			debug("processInputChar::key = 13 Still waiting for lockRequst...");
			//debug("processInputChar::key = 13 Edit box no longer exists");
		}
		debug("processInputChar::key = 13 ENTER key ::END");
		
	} else {
		//not a special key
		if (!waitingToConfirmEdit() ) {
			resizeEditBox(me);
		}
	}

	debug('processInputChar::: done');
	return returnVal;
	
}


//========================================================//
//========================================================//
function resizeEditBox(me) {
	var elem = document.getElementById(editState.hiddenTextSizerId);
	elem.textContent = (me.value).replace(/\s\s/g, " .") + "Wm";
	me.style.width = elem.offsetWidth + "px";
}


//========================================================//
//========================================================//
function setInputEventHandlers(tmpNode) {
	tmpNode.setAttribute("onkeydown","processInputChar(this,event)");
	tmpNode.setAttribute("onkeyup","resizeEditBox(this)");
	tmpNode.setAttribute("onBlur","cancelEditBlur()"); 
	tmpNode.setAttribute("onFocus","processInputChar(this,event)"); 
	tmpNode.setAttribute("onChange","processInputChar(this,event)"); 
}


//========================================================//
//========================================================//
function clearInputEventHandlers(tmpNode) {
	tmpNode.removeAttribute("onkeydown");
	tmpNode.removeAttribute("onkeyUp"); 
	tmpNode.removeAttribute("onBlur"); 
	tmpNode.removeAttribute("onFocus"); 
	tmpNode.removeAttribute("onChange"); 
}


//========================================================//
//========================================================//
function sendCommand(lower, upper, command, ver, data) {

	var x1 = CORRECTOR_COMMAND_PARAM + "=" + command + "&" + STARTRANGE_PARAM + "=" + lower + "&" + ENDRANGE_PARAM + "=" +  upper + "&" + DOCVERSION_PARAM + "=" + ver + "&" + DATA_PARAM + "=" + data;

	xmlhttpPost("capreceiver", x1);
}


//========================================================//
//========================================================//
function clearEditState() {
	editState.editing = false;
	editState.lowerEditRange = -1;
	editState.upperEditRange = -1,
	editState.originalSelectedText = "",
	editState.lockRequestPending = false,
	editState.documentVersion = -1
}


//========================================================//
//========================================================//
function resetAndReloadClient(docId) {
	var aSpan;
	var tmpSpan;
	var contentNode = document.getElementById("DocContent");
	
	if ((aSpan = getEditNode()) != null) {
		//clear this so no additional cancels come in
		clearInputEventHandlers(aSpan);
	}
	
	if (waitingToConfirmEdit()) {
		removeDialog1();
	}
	
	clearEditState();
	
	//decide whether to allow start from existing place or start from beginning.
	//
	//if current meetingDocId is not yet set, set it to the new meetingDocId and set docVersion to -1.
	//else, if current meetingDocId is already set and equal to an earlier version, update it to the new version and set docVersion to 0;
	//Will need to set/return these values on the server side when checking permissions for each user, but for now,
	// do it here.
	
	if (globalState.meetingDocId == UNINITIALIZED_VALUE) {
		globalState.documentVersion = JOIN_AT_CURRENT_PLACE;
	} else {
		globalState.documentVersion = JOIN_FROM_BEGINNING;
	}
	document.getElementById("MeetStats").textContent = "DocVer: " + globalState.documentVersion;
	globalState.meetingDocId = docId;
	globalState.resetFlagSet = true;
	globalState.lockId = 0;
	
	contentNode = document.getElementById("Form1CaptionContent");
	//unload the doc from the DOM
	contentNode.removeChild(document.getElementById("DocContent"));
	//start with new one
	aSpan = document.createElement("div");
	aSpan.setAttribute("id","DocContent");
	tmpSpan = document.createElement("p");
	tmpSpan.setAttribute("id","P0");
	aSpan.appendChild(tmpSpan);
	contentNode.appendChild(aSpan);

}


//========================================================//
//========================================================//
function xmlhttpPost(strURL, parameterStr) {

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var xmlHttpReq = null;

	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			return false;
		}
	}
	if (!xmlHttpReq) {
		errorOut('xmlhttpPost:: Cannot create XLMHTTP instance');
		return false;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
	} 

	try {
		xmlHttpReq.open('POST', strURL, true);	//don't wait
		//xmlHttpReq.open('POST', strURL, false);  //wait
	} catch (e)  {
		errorOut("error: " + e);
		return false;
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
	xmlHttpReq.onreadystatechange = function () {
		var responseStr = "";
		var response = "";
		var len;
		var len2;
		var tmp;
		var data;
 
		
		try {
			var clearInPostRequestFlag = true;
			if (this.readyState === 1) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=1');
			} 
			else if (this.readyState === 2) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=2');
			}
			else if (this.readyState === 3) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=3: responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				//clearTimeout(requestTimer); //do not abort

				//if client page reset while we were waiting for response, just skip everything
				if (!globalState.resetFlagSet) { 
					if (this.status == 200) {
						
						responseStr = this.responseText;
						if (responseStr.charAt(0) == "{") {
							ajaxResp = JSON.parse(responseStr);
						} else {
							len = parseInt(responseStr, 10);
							len2 = responseStr.indexOf("{");
							len = len2 + len;
							tmp = responseStr.slice(len2,len);
							ajaxResp = JSON.parse(tmp);
							data = responseStr.slice(len);
							/////////////CurrentPosition = responseStr.substring(tmpIndex+9,tmpIndex2);
						}
						
						if ((typeof ajaxResp[ADMIN_RESPONSE_STATUS_PARAM]) != "undefined") {
							tmp = ajaxResp[ADMIN_RESPONSE_STATUS_PARAM];
							//got some administrative response.  This is not good.  Skip processing
						} else {
						
							//if this was a response to the lock request and was accepted, and we are still editing, we are done here.
							//But if we are no longer editing, we must have cancelled the edit (ESC) - so we now have to send the undo command.  (undo-sending was delayed pending the response)
							//BTW we are not allowing a correction send until lock request response received
							
							//if it was a lock request and it was denied, and we are still editing, we cancel the edit.  No undo need be sent.
							//If we have already cancelled the edit, we do nothing.  No undo was sent
							
							if (ajaxResp[RESPONSE_STATUS_PARAM] == ACCEPT_INDICATOR) {
								//command accepted.  check special case handling i.e. for Lock
								if (ajaxResp[CORRECTOR_COMMAND_PARAM] == LOCK_COMMAND) {
									//get new edit doc version
									editState.documentVersion = ajaxResp[DOCVERSION_PARAM];
									//if we are no longer editing, we must have cancelled, so better unlock
									if (!editState.editing) {
										//need to send the undo command
										sendCommand(ajaxResp[STARTRANGE_PARAM], ajaxResp[ENDRANGE_PARAM], CANCELLOCK_COMMAND, editState.documentVersion, "");
										//watch the global flag setting
										clearInPostRequestFlag = false;
									} else {
										debug1('Got OK for lock and still editing.  We are good to go.');
									}
									editState.lockRequestPending = false;
								} else {
									// was a response to something else
									debug1('Got OK response for : ' + ajaxResp[CORRECTOR_COMMAND_PARAM]);
								}
							} else if (ajaxResp[RESPONSE_STATUS_PARAM] == DENY_INDICATOR) {
								// request denied.  Find out what the request was
								// if lock, remove the editbox
								if (ajaxResp[CORRECTOR_COMMAND_PARAM] == LOCK_COMMAND) {
									if (editState.editing) {
										//cancel the edit but don't need to send unlock cuz lock not accepted in the first place
										cancelEdit();
										editState.lockRequestPending = false;
										//don't need to send out cancel if previous lock request denied so put this after cancelEdit.
									} else {
										//not editing so that stuff taken care of.  No cancel needed or previously sent
										editState.lockRequestPending = false;
									}
								} else {
									///////////debug1('Other request denied: ' + str);
									debug1('Other request denied : ' + ajaxResp[CORRECTOR_COMMAND_PARAM]);
									//figure out what to do on request denied for other types of requests
									
								}
							} else {
								//don't know what code came back???
								errorOut('Error of some type:  xmlhttpPost::xmlHttpReq.status=:200, return str =:'+responseStr);
							}

							//ask for immediate polling to update backend
							pollNow();
						}
					} else {
						errorOut('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
						errorOut('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
					}
				}
				if (clearInPostRequestFlag) {
					inPostRequestFlag = false;
				}
			} else {
				errorOut('not sure what up - ready not 1,2,3 or 4: xmlhttpPost::xmlHttpReq.readyState=:'+this.readyState);
				if (clearInPostRequestFlag) {
					inPostRequestFlag = false;
				}
			}
		} //try
		catch (e) {
			errorOut('Caught Exception on readyState in xmlhttpPost');
			inPostRequestFlag = false;
		}
	}
	/////////////
	inPostRequestFlag = true;
	//clear reset flag so we can tell if system reset while waiting for ajax response
	globalState.resetFlagSet = false;
	xmlHttpReq.send(parameterStr + '&' + CORRECTOR_PWD_PARAM + '=' + userinfo + '&' + CORRECTOR_PARAM + '=' + userInitials + '&' + ROOM_PARAM + '=' + myroomid + '&' + MEETINGDOCID_PARAM + '=' + globalState.meetingDocId);
	debug1 ('xmlhttpPost:: END');
}


//========================================================//
//========================================================//
function xmlhttpPoll(strURL, parameterStr) {
	//alert('ajax:' + parameterStr);
	parameterStr += '&' + CORRECTOR_PARAM + '=' + userInitials + '&' + ROOM_PARAM + '=' + myroomid + '&' + MEETINGDOCID_PARAM + '=' + globalState.meetingDocId;
	//strURL += "?" + parameterStr;
	
	var tempText = "RoomID: " + myroomid;
	document.getElementById("MeetTitle").textContent = tempText;
	document.getElementById("MeetTitle2").textContent = tempText;
	tempText = "DocVer: " + globalState.documentVersion;
	document.getElementById("MeetStats").textContent = tempText
	document.getElementById("MeetStats2").textContent = tempText
	
	debug1('xmlhttpPoll:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	debug1('xmlhttpPoll:: Entered');

	var MAXIMUM_WAITING_TIME = 15000; // milliseconds
	var request = false;
	var xmlHttpReq = null;
	//var self = this;

	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			request = false;
		}
	}
	if (!xmlHttpReq) {
		errorOut('xmlhttpPoll:: Cannot create XLMHTTP instance');
		return request;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
	}

	//xmlHttpReq.open('GET', strURL, true);	//don't wait
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
		//debug1("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
		//debug1('onreadystatechange Function START');
		//debug1('xmlhttpPoll::xmlHttpReq callback function running');
		//debug1('xmlhttpPoll:: xmlHttpReq.value='+this.value);
		try {
			if (this.readyState === 1) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:1');
			} 
			else if (this.readyState === 2) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:2');
			}
			else if (this.readyState === 3) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:3');
				//debug1('xmlhttpPoll::xmlHttpReq.responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				debug1("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:4 POLL RESPONSE BEGIN');
				//clearTimeout(requestTimer); //do not abort

				//if client page reset while we were waiting for response, just skip everything
				if (!globalState.resetFlagSet) { 

					if (this.status == 200) {
						
						debug1('xmlhttpPoll::xmlHttpReq.status=:'+this.status);
						debug1('xmlhttpPoll::xmlHttpReq.responseText=:'+this.responseText);
						pollResponseStr = this.responseText;
						if (pollResponseStr.charAt(0) == "{") {
							pollResponse = JSON.parse(pollResponseStr);
						} else {
							var len = parseInt(pollResponseStr, 10);
							var len2 = pollResponseStr.indexOf("{");
							len = len2 + len;
							var tmp = pollResponseStr.slice(len2,len);
							pollResponse = JSON.parse(tmp);
							var data = pollResponseStr.slice(len);
							/////////////CurrentPosition = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
						}
						
						//debug1("pollResponseStr: " + pollResponseStr);
						debug1("pollResponse: ");
						debug1(pollResponse);
						
						if ((typeof pollResponse[ADMIN_RESPONSE_STATUS_PARAM]) != "undefined") {
							tmp = pollResponse[ADMIN_RESPONSE_STATUS_PARAM];
							//got some administrative response.  This is not good.  Skip processing
						} else {
							if (globalState.meetingDocId != pollResponse[MEETINGDOCID_PARAM]) {
								//oh-oh. Meeting reset
								resetAndReloadClient( pollResponse[MEETINGDOCID_PARAM] );
							} else if (pollResponse[RESPONSE_STATUS_PARAM] == ACCEPT_INDICATOR) {
							///////////var tmpIndex;
							///////////if ((tmpIndex = pollResponseStr.indexOf("~OK;last=")) != -1) {
							//command accepted.
								/////////////~OK;last=  9
								///////////var tmpIndex2 = pollResponseStr.indexOf('~',tmpIndex+9)
								/////////////CurrentPosition = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
								///////////globalState.documentVersion = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
								///////////pollResponse = pollResponseStr.substring(tmpIndex2+1);
								///////////debug1("pollResponseStr: " + pollResponseStr);
								///////////debug1("pollResponse: " + pollResponse);
								///////////if ((pollResponse != null) && (pollResponse != "")) {
								///////////	client_update(pollResponse);
								///////////	pollResponse = "";
								///////////}
								
								//if check against doc ID we sent
								if (globalState.documentVersion < pollResponse[DOCVERSION_PARAM]) {
									if (data != "") {
										debug1('client_update call');
										client_update(pollResponseStr.slice(len));
										debug1('client_update return');
									}
									globalState.documentVersion = pollResponse[DOCVERSION_PARAM];
									document.getElementById("MeetStats").textContent = "DocVer: " + globalState.documentVersion;
								}
							} else {
								//error of some type???
								errorOut('Error of some type:  xmlhttpPoll::xmlHttpReq.status=:200, pollResponseStr =:'+pollResponseStr);
							}
						}
					} else {
						errorOut('Error of some type - NOT status=200:  xmlhttpPoll::xmlHttpReq.status=:'+this.status);
						errorOut('xmlhttpPoll::xmlHttpReq.statusText=:'+this.statusText);
					}
				}
				inPollRequest = false;
				if (immediatePollRequested == true) {
					debug1('immediatePollRequested in xmlhttpPoll');
					pollNow();
				}
				debug1('POLL RESPONSE END');
				debug1("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
			} else {
				errorOut('not sure what up - ready not 1,2,3 or 4: xmlhttpPoll::xmlHttpReq.readyState=:'+this.readyState);
				inPollRequest = false;
			}
		} //try
		catch (e) {
			errorOut('Caught Exception on readyState in xmlhttpPoll');
			inPollRequest = false;
		}
		//debug1('POLL RESPONSE END');
		//debug1("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
	}
		/////////////
		
	//var myroomid = "<?php echo($roomid); ?>";

	inPollRequest = true;
	immediatePollRequested = false;
	globalState.resetFlagSet = false;
	xmlHttpReq.send(parameterStr);
	//xmlHttpReq.send();
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug1 ('xmlhttpPoll:: END');
}

// end of editing scripting password authentication 
////////////////////////
////////////////////////
////////////////////////



/* old code for when using comet method 

function loadIframe(srcPath) {
	//var i = document.getElementById("comet_iframe");
	var i = document.createElement("iframe");
	i.id = "comet_iframe";
	i.name = "comet_iframe";
	i.className = "iframeStyle";
	//i.scrolling = "auto";
	//i.frameborder = "0";
	document.getElementById("iframeDiv").appendChild(i);
	//document.body.appendChild(i);
	i.src = srcPath;
}

function cleanUpIframe(idOfRunningScript) {

	var KEEP_ELEMENTS = 6;
	var i, j;
	var iframe = document.getElementById("comet_iframe");
	var iframewindow= iframe.contentWindow? iframe.contentWindow : iframe.contentDocument;
	
	var keepNode = iframewindow.document.getElementById("js");
	var nodeList = keepNode.parentNode.childNodes;

	var arr = Array.prototype.slice.call(nodeList);
	
	for (i = arr.indexOf(keepNode) + 1, j = arr.indexOf(iframewindow.document.getElementById(idOfRunningScript)) - KEEP_ELEMENTS; i < j; j--) {
		keepNode.parentNode.removeChild(nodeList.item(i));
	}
}

var readingPreviousCaptions = false;

var heartbeatTimer;
var lastCheckIn = 0;
var lastCleanup = 0;

function processPreviousCaptions(fId, tmpCount, tmpStr) {
	var tmpIDNum = globalSpanIDCounter;
	readingPreviousCaptions = true;
	comet_update(fId, tmpCount, tmpStr);
	if (globalSpanIDCounter != tmpIDNum + parseInt(tmpCount, 10)) {
		//there is an error here.
		//alert("Server [" + tmpCount + "] and Client [" + (globalSpanIDCounter - tmpIDNum) + "] disagree on word counts!");
	}
	readingPreviousCaptions = false;
}

function  startHeartbeat() {
	heartbeatTimer = setTimeout(function() {
		alert("Comet connection lost. Last check-in at: [" + lastCheckIn + "].  Refresh browser to reconnect");
		//tell it was aborted
		}, 1000 * 30);
}

function hbCheck(id, lTime) {
	//heartbeat checking
	if (lastCheckIn == 0) {
		lastCheckIn = lTime+1;  //+1 just to make sure lastCheckIn not 0 anymore
	} else {
		//stop timer
		clearInterval(heartbeatTimer);
		
		//clean up iFrame periodically
		if ((lTime - lastCleanup) > (1000*60)) {
			cleanUpIframe(id);
			lastCleanup = lTime;
		}
		lastCheckIn = lTime;
	}
	//start timer
	startHeartbeat();
}
*/


/*
	var fragElem = document.createDocumentFragment();
	
	function getFragElementById(elemID) {
	var nodeList = null;
	var elem = null;
	
	if (nodeList = fragElem.childNodes) {
		for (var i = nodeList.length; i--;) {
			if (nodeList[i].id == elemID) {
				elem = nodeList[i];
				break;
			}
		}
	}
	return elem;
}
*/



//========================================================//
//========================================================//
function client_update(dataStr) {
	
	debug("client_update::dataStr before decode : ["+dataStr + "]");
	
//	var startTime = new Date().getTime();
//	debug("Start = " + startTime);
//	var diff;
//	var endTime;
	
	//captionContentNode = document.getElementById("Form1CaptionContent");
	//captionContentNode = document.getElementById("DocContent");
	
	var command = "";
	var aSpan;
	var tmpSpan;
	
	var curPara;
	var tempPara;
	
	var tmpTxt = "";
	var localTmpTxt;
	
	var startRange = 0;
	var endRange = 0;
	var correction = "";
	var correctorInitials = "";
	
	var commandFields;
	var dataFields;
	var tmpCommand = "";
	var tmpChar;
	
	//get array of commands
	var capcorArray = dataStr.split("\n");
	var capcorArrayLength = capcorArray.length;
	
	for (var i = 0; i < capcorArrayLength; i++) {
		//strip off leading and trailing spaces  (white spaces?)
		tmpCommand = capcorArray[i];
		tmpCommand = tmpCommand.replace(/^\s+|\s+$/g,'');
		if (tmpCommand == "") {
			//move on to next
			continue;
		}
		
		//break up fields of the command
		commandFields = tmpCommand.split("~");
		
		//make sure all the pieces are there
		if (commandFields.length < 2) {
			debug("Received an invalid correction request from server. <2 fields");
			continue;
		}
		
		command = commandFields[0]; 
		
		//======================//
		if (command == CAPTION_COMMAND) {
			try {
				if (commandFields.length != 3) {
					throw ("Received an invalid correction request from server. <3 fields");
				} else {
					//pass id and encoded caption;
					captionAdd(commandFields[1], commandFields[2]);
				}
			} catch (e) {
				errorOut("Error in CAPTION_COMMAND. ID=[" + commandFields[1] + "]  caption=[" + commandFields[2] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTION_RECALL_COMMAND) {
			try {
				captionRecall(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTION_RECALL_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTIONER_PARAGRAPH_COMMAND) {
			try {
				paragraphAdd(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTIONER_PARAGRAPH_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTIONER_PARAGRAPH_RECALL_COMMAND) {
			try {
				paragraphRecall(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTIONER_PARAGRAPH_RECALL_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		
		} else {
			
			//make sure all the pieces are there
			if (commandFields.length < 5) {
				debug("Received an invalid correction request from server. <5 fields");
				return;
			}
			//let's break it down to make it easier
			startRange = parseInt(commandFields[1], 10);  //start
			endRange = parseInt(commandFields[2], 10);     //end
			correction = commandFields[3];
			if ((correction != null) & (correction != "") ) {
				correction = decodeURIComponent(correction);
			} else {
				correction = "";
			}
			debug("client_update::command [" + command + "] dataStr after decode : "+correction);
			
			correctorInitials = commandFields[4];   //initials
			
			// WONT WORK FOR PARAGRAPH DELETE...FIX  update: did fix i think
			// need to check if we are editing and a correction comes in that affects the editing process
			// will kick us out of edit if it overlaps our edit, unless it is our lock command
			checkForEditInterference(command, startRange, endRange, correctorInitials);
			
			
			// now apply the correction
			
			///////////////////////////////////////////////////////////////////////////////
			if (command==LOCK_COMMAND) {
				try {
					// it is a lock request - no stale edit check here, just apply
					//update global unique lock id
					globalState.lockId++;
					lockUpdate(startRange, endRange, correctorInitials,globalState.lockId);
				} catch (e) {
					errorOut("Error in LOCK_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			///////////////////////////////////////////////////////////////////////////////
			} else if (command == EDIT_COMMAND) {
				try {
					//It is a correction - also handles unlocks and tooltips and restore
					applyEditToRange(startRange, endRange, correction.replace(/^\s+|\s+$/g,'') + " ", correctorInitials);
					//ifRestoredToOriginalTextResetSpanRange(startRange, endRange);
				} catch (e) {
					errorOut("Error in EDIT_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]  correction=[" + correction + "]\n" + e);
				}
				
			///////////////////////////////////////////////////////////////////////////////
			} else if ((command==CANCELLOCK_COMMAND) || (command==OVERRIDE_COMMAND)) {
				try {
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in CANCELLOCK_COMMAND / OVERRIDE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			///////////////////////////////////////////////////////////////////////////////
			} else if (command==RESTORE_COMMAND) {
				try {
					restoreRange(startRange,endRange);
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in RESTORE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==DELETEALL_COMMAND) {
				try {
//					//before applying new edit... check if stale range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
//						//not stale.  Apply
						//handles unlocks, restore, tooltips
						applyEditToRange(startRange, endRange, "", correctorInitials);
//					} else {
//						//was stale - do not apply.  Simply remove locks
//						//and set all background of the span objects back to their previous state.
//						unlockRange(startRange,endRange);
//					}
				} catch (e) {
					errorOut("Error in DELETEALL_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==COMMA_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					
//					//check if edit is stale before applying
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					
					// add comma unless a comma already exists
					if (((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
						tmpTxt = aSpan.textContent;
						//should never have an empty span
						if (tmpTxt.length <= 1) {
							//this shouldn't happen normally but deal with it
							//if char is a space or a comma, make it right
							if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == ',')) {
								aSpan.textContent = ", ";
							} else {
								aSpan.textContent = tmpTxt + ", ";
							}
							//set flags, editor and style to indicate this was a quickclick
							setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
							//checkIfRestoredToOriginal(startRange,endRange);
						} else {
							localTmpTxt = tmpTxt;
							//replace ?!. with the comma
							localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,", ");
							if (localTmpTxt.charAt(localTmpTxt.length-2) != ',') {
								//append
								localTmpTxt = localTmpTxt.replace(/\s*$/,", ");
							}
							//now see if there was a change
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in COMMA_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==PERIOD_COMMAND) || (command==QUESTION_COMMAND)) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
					
					//
					//check if edit is stale before applying
//					//Find out if we are applying a capitalization or not.  This will affect stale check
//					if (((correction == "cap") && (checkForPossibleStaleEditWithEndNotEmpty(startRange,endRange) == 1)) 
//							|| ((correction == "") && (checkForPossibleStaleEdit(startRange, endRange) == 1)) ) {
//						//edit is not stale so good to apply
						
						//if PERIOD_COMMAND, and text ends in question mark, change it to period and capitalize next word
						//if QUESTION_COMMAND and ends in a period, change to question mark and capitalize next word
						
						//startRange is span id of span clicked on
						//endRange is span id of last span in edit group of either the span clicked on or span to be capitalized
						//correction holds span id of span to be capitalized
						
					if (((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt.length <= 1) {
							//this shouldn't happen but deal with it
							//if char is a space or a period, make it right.  Replace a question mark with a period or vice-versa
							if (command==PERIOD_COMMAND) {
								localTmpTxt = ". ";
							} else {
								localTmpTxt = "? ";
							}
							if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.') || (tmpTxt.charAt(0) == '?')) {
								aSpan.textContent = localTmpTxt;
							} else {
								aSpan.textContent = tmpTxt + localTmpTxt;
							}
							//set flags, editor and style to indicate this was a quickclick
							setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
							//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
							
						} else {
							localTmpTxt = tmpTxt;
							if (command==PERIOD_COMMAND) {
								//replace ?!, with the period
								localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,". ");
								if (localTmpTxt.charAt(localTmpTxt.length-2) != '.') {
									//append the period 
									localTmpTxt = localTmpTxt.replace(/\s*$/,". ");
								}
							} else { //if (command==QUESTION_COMMAND) {
								//replace .!,  with a question mark
								localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,"? ");
								if (localTmpTxt.charAt(localTmpTxt.length-2) != '?') {
									//append the question mark 
									localTmpTxt = localTmpTxt.replace(/\s*$/,"? ");
								}
							}
							//now see if there was a change
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
							}
						}
					}
					
					//now see if we need to capitalize a word
					if (correction != "") {
						correction = parseInt(correction, 10);
						if (((aSpan = document.getElementById(correction)) != null) && spanHasUndeletedText(aSpan)) {
							tmpTxt = aSpan.textContent;
							if (tmpTxt != "") {
								localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = localTmpTxt;
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
									//checkIfRestoredToOriginal(correction,endRange);
								}
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in PERIOD_COMMAND / QUESTION_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==CAPITALIZE_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt != "") {
							localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in CAPITALIZE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==LOWERCASE_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt != "") {
							localTmpTxt = tmpTxt.charAt(0).toLowerCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in LOWERCASE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==REMOVEPUNCTUATION_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range)
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
						tmpTxt = aSpan.textContent;
						localTmpTxt = tmpTxt.replace(/[\?\.,\!;:]\s$/," ");
						if (localTmpTxt != tmpTxt) {
							//content changed
							//see if we have removed all text
							if (localTmpTxt.replace(/\s+$/,"") == "") {
								//nothing left, treat as a deleteall
								applyEditToRange(startRange, endRange, "", correctorInitials);
							} else {
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in REMOVEPUNCTUATION_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARADELETE_COMMAND) {
				//startRange holds id of last edit group before paragraph break
				//endRange holds either end of startRange edit group(last span of paragraph), or end of first edit group after para break
				//correction = 1st span of after para break
				
				//if correction == "" then make sure newspeaker attribute cleared
				//use endRange to get parent paragraph.  
				//else use correction to get parent previousSibling 
				//don't delete paragraph if no previous siblings
				//handle attributes
				try {
					if (correction == "") {
						//There isn't a span in the paragraph to be deleted so there shouldn't be a new speaker
						//or anything else after, but we'll make sure.  Also, no spans to move.  Let's see what WE have
						if ((aSpan = document.getElementById(endRange)) != null) {
							//Okay, we have at least the last span of the paragraph in front of the break
							curPara = aSpan.parentNode;
							if ((tempPara = curPara.nextSibling) != null) {
								//There is a paragraph after; just no spans
								//never delete captioner paragraph, so double check
								if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
									//delete tempPara
									curPara.parentNode.removeChild(tempPara);
									//clear attributes on curPara if one
									curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
								} //else don't delete; Should have never been able to get here
							} else {
								//there is no next paragraph so no paragraph to delete.  fix attributes
								curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
							}
						} else {
							//we don't have a span from the previous paragraph; no span in paragraph to delete.
							//How do we know where we are?  Only way this happens is if we are in paragraph P0
							//so nothing really to do, but to be sure we are clean, we remove attributes, if any
							tempPara = document.getElementById("DocContent").firstChild;
							tempPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
							tempPara.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
							tempPara.removeAttribute(NEWSPEAKER_ATTR);
						}
					} else {
						//There is a span in paragraph to be deleted.  Let's see what WE have
						correction = parseInt(correction, 10);
						if ((aSpan = document.getElementById(endRange)) != null) {
							//we have a span in the paragraph to be deleted.  get paragraph
							tempPara = aSpan.parentNode;
							//we have the paragraph.  
							//Let's get the previous paragraph to move spans to
							if ((curPara = tempPara.previousSibling) != null) {
								//okay, we have both paragraphs.
								//never delete captioner paragraph, so double check
								if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
									//okay, we can delete it. 
									//Start moving from tempPara to curPara
									aSpan = tempPara.firstChild;   //---### firstChild //---###
									while (aSpan != null) {
										//get ptr to next sib before we lose it
										tmpSpan = aSpan.nextSibling;
										//move the aSpan one
										curPara.appendChild(aSpan);
										//update aSpan to next sib
										aSpan = tmpSpan;
									}
									//delete tempPara
									curPara.parentNode.removeChild(tempPara);
									//find out what follows
									//okay, do we have a special again?
									tempPara = curPara.nextSibling;
									if ((tempPara != null) && (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null)) {
										if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, PARAGRAPH_PLUS_MARK);
										} else {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, PARAGRAPH_MARK);
										}
									} else {
										//remove attribute (if any)
										curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
									}
								} //else don't delete; Should have never been able to get here
							} else {
								//we don't have the previous paragraph to move things to so not much to do but clear attributes
								//that normally would have been deleted when we deleted the paragraph
								tempPara.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
								tempPara.removeAttribute(NEWSPEAKER_ATTR);
							}
						} else {
							//we don't have a span in range sent, so don't do anything cuz nothing to do
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in PARADELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			/*
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARADELETE_COMMAND) {
				//startRange holds id of last edit group before paragraph break
				//endRange holds either end of startRange edit group(last span of paragraph), or end of first edit group after para break
				//correction = 1st span of after para break
				
				//if correction == "" then make sure newspeaker attribute cleared
				//	use endRange to get parent paragraph.  delete nextsibs and clear attribute
				//else use correction to get parent previousSibling 
				//don't delete paragraph if no previous siblings
				//handle attributes
				
				//note newspeaker will be removed by default if it exists on next paragraph
				//startRange holds id of last edit group before paragraph break
				//endRange holds either end of startRange edit group, or end of first edit group after para break
				try {
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						curPara = aSpan.parentNode;
						if (curPara != null) {
							tempPara = curPara.nextSibling;
							if (tempPara != null) {
								//never delete captioner paragraph, so double check
								if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
									//okay, ready to go.  Start moving from tempPara to curPara
									aSpan = tempPara.firstChild;
									while (aSpan != null) {
										//get ptr to next sib before we lose it
										tmpSpan = aSpan.nextSibling;
										//move the aSpan one
										curPara.appendChild(aSpan);
										//update aSpan to next sib
										aSpan = tmpSpan;
									}
									
									//delete tempPara
									curPara.parentNode.removeChild(tempPara);
									
									
									//okay, do we have a special again?
									tempPara = curPara.nextSibling;
									if ((tempPara != null) && (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null)) {
										if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
										} else {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
										}
									} else {
										//remove attribute (if any)
										curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
									}
								} else {
									//next para was not special.  Remove attribute since it is wrong
									curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
								}
							} else {
								//no following paragraph so remove attribute if any
								curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
							}
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in PARADELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
			*/
			
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==SPEAKEREDIT_COMMAND) {
				try {
					//should check if this is a newspeaker paragraph by looking for marking attribute
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						//Get parent
						tempPara = aSpan.parentNode;
						if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
							//update text
							tmpTxt = correction.replace(/^\s+|\s+$/g,'');
							//---### tempPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, tmpTxt + " ");
							tempPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, tmpTxt);   //---###//---###//---###
							//unhide it
							tempPara.setAttribute(NEWSPEAKER_ATTR, SHOWSPEAKER_TEXT);
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in SPEAKEREDIT_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==SPEAKERDELETE_COMMAND) {
				//low = 1st span of paragraph
				//high = end of edit group of low
				try {
					if (((aSpan = document.getElementById(endRange)) != null) ) {
						//Get parent
						if ((tempPara = aSpan.parentNode) != null) {
							//don't bother to check if attributes there, just remove
							tempPara.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
							tempPara.removeAttribute(NEWSPEAKER_ATTR);
							
							//are we a special paragraph
							if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//yes we are.
								//restore previous paragraph mark to standard form
								if ((tempPara = tempPara.previousSibling) != null) {
									tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, PARAGRAPH_MARK);
								}
							}
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in SPEAKERDELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==NEWSPEAKER_COMMAND) || (command==PARAGRAPH_COMMAND)) {
				try {
					//startRange is edit group to apply punctuation to, or span clicked on if nothing to punctuate
					//endRange is end of edit group of span clicked on
					//correction holds span id of span clicked on
					if ((correction != "") && ((aSpan = document.getElementById(correction)) != null) && spanHasUndeletedText(aSpan)) {
						//create new paragraph, but only if span not first in paragraph
						//NOTE: if someone joins late it might be their first in paragraph.  For others, it is not so we 
						//need to handle this correctly
						
						curPara = aSpan.parentNode;
						if (curPara.firstChild !== aSpan) {   //---### firstChild //---###
							//create the new paragraph
							tempPara = document.createElement("p");
							//tag to indicate it was a corrector-added paragraph
							tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");
							//now go through the spans appending them to their new parent paragraph
							//ie moving from original paragraph to tempPara
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move the aSpan one
								tempPara.appendChild(aSpan);
								//update aSpan to next sib
								aSpan = tmpSpan;
							}
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
							
							//---###//---### (DPK - added Jan 2016)
							// Retain any special paragraph marking that exists on the paragraph being split by copying the mark to the inserted new paragraph.
							var specialParaValue;
							if ((specialParaValue = curPara.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE)) != null) {
								tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, specialParaValue);
								}
							//---###//---###
							
							curPara = tempPara;  //update for later use
							
							//apply punctuation if we have the span.  Don't worry about it if we don't have the span
							//convert correction to number
							correction = parseInt(correction, 10);
							
							//apply punctuation to previous word...(only on new paragraph)
							//Make sure there is a previous word
							if ((correction != startRange) && ((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
								tmpTxt = aSpan.textContent;
								if (tmpTxt.length == 1) {
									//this shouldn't happen but deal with it
									if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.')) {
										aSpan.textContent = ". ";
									} else if (tmpTxt.charAt(0) == '?') {
										aSpan.textContent = "? ";
									} else if (tmpTxt.charAt(0) == '!') {
										aSpan.textContent = "! ";
									} else {
										aSpan.textContent = tmpTxt + ". ";
									}
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
									//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
									
								} else {
									localTmpTxt = tmpTxt;
									//if certain chars at end, don't modify.  Otherwise add a period
									//---###//---###
									//---###//---### Revise trailing punctuation behavior for comma and/or other characters ??? (DPK - Jan 2016)
									//---###//---###
									localTmpTxt = localTmpTxt.replace(/([^\?\.,\!:;\s])\s*$/,"$1. ");
									////tmpChar = localTmpTxt.charAt(localTmpTxt.length-2);
									//if ((tmpChar != '.') && (tmpChar != '?') && (tmpChar != '!')) {
									//	//append the period 
									//	localTmpTxt = localTmpTxt.replace(/\s$/,". ");
									//}
									//now see if there was a change
									if (localTmpTxt != tmpTxt) {
										//content changed
										aSpan.textContent = localTmpTxt;
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
									}
								}
							}
						}
						//okay tag paragraphs appropriately
						//curPara is paragraph to apply newspeaker to
						if (command == NEWSPEAKER_COMMAND) {
							//mark it
							curPara.setAttribute(NEWSPEAKER_ATTR, SHOWSPEAKER_TEXT);
							//set attribute for text to display on newspeaker paragraph
							curPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
						
							//put special paragraph marking on previous paragraph (if exists) to indicate a corrector-generated paragraph follows
							if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
								if ((tempPara = curPara.previousSibling) != null) {
									tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, PARAGRAPH_PLUS_MARK);
								}
							}
						} else {
							//put special paragraph marking on previous paragraph (if exists) to indicate a corrector-generated paragraph follows
							if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
								if ((tempPara = curPara.previousSibling) != null) {
									//---### curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
									tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE, PARAGRAPH_MARK);
								}
							}
						}
						
						//capitalize word we clicked on
						aSpan = document.getElementById(correction);
						tmpTxt = aSpan.textContent;
						if (tmpTxt != null) {
							localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(correction,endRange);
							}
						}
					}
				} catch (e) {
					errorOut("Error in NEWSPEAKER_COMMAND/NEWPARAGRAPH command. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			/*
			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==NEWSPEAKER_COMMAND) || (command==PARAGRAPH_COMMAND)) {
				try {
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						//if (((aSpan = document.getElementById(startRange)) != null) ) {
						
						//startRange is span id of word before span clicked on
						//endRange is span id of last span in edit group of span clicked on
						//correction holds span id of span clicked on
						if ((correction != "") && ((aSpan = document.getElementById(correction)) != null) && spanHasUndeletedText(aSpan)) {
							//create new paragraph, but only if span not first in paragraph
							//NOTE: if someone joins late it might be first in paragraph.  For others, it is not
							
							curPara = aSpan.parentNode;
							if (curPara.firstChild !== aSpan) {
								//create the new paragraph
								tempPara = document.createElement("p");
								//tag to indicate it was a corrector-added paragraph
								tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");
								if (command == NEWSPEAKER_COMMAND) {
									//mark it
									tempPara.setAttribute(NEWSPEAKER_ATTR, SHOWSPEAKER_TEXT);
									//set attribute for text to display on newspeaker paragraph
									tempPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
									//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
									curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
								} else {
									//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
									curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
								}
								//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  
								curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
								
								//convert correction to number
								correction = parseInt(correction, 10);

								//capitalize word while we have it...(only on new paragraph)
								tmpTxt = aSpan.textContent;
								if (tmpTxt != null) {
									localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
									if (localTmpTxt != tmpTxt) {
										//content changed
										aSpan.textContent = localTmpTxt;
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(correction,endRange);
									}
								}

								//now go through the spans appending them to their new parent paragraph
								//ie moving from original paragraph to tempPara
								while (aSpan != null) {
									//get ptr to next sib before we lose it
									tmpSpan = aSpan.nextSibling;
									//move the aSpan one
									tempPara.appendChild(aSpan);
									//update aSpan to next sib
									aSpan = tmpSpan;
								}
								
								//apply punctuation to previous word...(only on new paragraph)
								//Make sure there is a previous word
								if ((correction != startRange) && ((aSpan = document.getElementById(startRange)) != null) && spanHasUndeletedText(aSpan)) {
									tmpTxt = aSpan.textContent;
									if (tmpTxt.length == 1) {
										//this shouldn't happen but deal with it
										if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.')) {
											aSpan.textContent = ". ";
										} else if (tmpTxt.charAt(0) == '?') {
											aSpan.textContent = "? ";
										} else if (tmpTxt.charAt(0) == '!') {
											aSpan.textContent = "! ";
										} else {
											aSpan.textContent = tmpTxt + ". ";
										}
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
										

									} else {
										localTmpTxt = tmpTxt;
										//if certain chars at end, don't modify.  Otherwise add a period
										localTmpTxt = localTmpTxt.replace(/([^\?\.,\!:;\s])\s*$/,"$1. ");
										////tmpChar = localTmpTxt.charAt(localTmpTxt.length-2);
										//if ((tmpChar != '.') && (tmpChar != '?') && (tmpChar != '!')) {
										//	//append the period 
										//	localTmpTxt = localTmpTxt.replace(/\s$/,". ");
										//}
										//now see if there was a change
										if (localTmpTxt != tmpTxt) {
											//content changed
											aSpan.textContent = localTmpTxt;
											//set flags, editor and style to indicate this was a quickclick
											setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
											//checkIfRestoredToOriginal(startRange, getEndOfEditGroup(startRange, false));
										}
									}
								}

							} else {
								if (command == NEWSPEAKER_COMMAND) {
									//mark it
									curPara.setAttribute(NEWSPEAKER_ATTR, SHOWSPEAKER_TEXT);
									//set attribute for newspeaker text to display on paragraph
									curPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
									//if this paragraph a corrector paragraph, change form of paragraph marker
									if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
										//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
										if ((tempPara = curPara.previousSibling) != null) {
											tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
										}
								}
							}
						}
//					}
				} catch (e) {
					errorOut("Error in NEWSPEAKER_COMMAND/NEWPARAGRAPH command. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
			*/
			
			/*
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==NEWSPEAKER_COMMAND) {
				try {
					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						if (((aSpan = document.getElementById(startRange)) != null) ) {
							
							//create the new paragraph
							var tempPara = document.createElement("p");
							//get current paragraph - we will insert the new para after this current para (but more complex than that - see below)
							var curPara = aSpan.parentNode;
							//use the id of the current para to construct the id for the new para
							tempPara.setAttribute("id",curPara.getAttribute("id") + "a" + globalState.clientGeneratedParagraphCnt++);
							//tag to indicate it was a user added paragraph
							//associate it with the last captioner paragraph
							tempPara.setAttribute("mypara", curPara.getAttribute("id"));
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  if null, puts at end
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
							//now detach the span(s) from old para and attach to new para
							//point to first node that needs to move

							//capitalize it while we have it...
							tmpTxt = aSpan.textContent;
							if (tmpTxt != null) {
								var localTmpTxt = tmpTxt;
								//tmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								tmpTxt = "SPEAKER: " + tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = tmpTxt;
									if (!spanIsMarkedEdited(aSpan)) {
										setSpanEdited(aSpan, localTmpTxt);
									} //else already edited and saved
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,correctorInitials);
								}
							}
							//now go through the spans appending them to their new parent paragraph
							var tmpSpan;
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move this sib
								tempPara.appendChild(aSpan);
								//update to next sib
								aSpan = tmpSpan;
							}
						}
					}
				} catch (e) {
					debug("Error in NEWSPEAKER_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]");
				}
			*/
				
			/*
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARAGRAPH_COMMAND) {
				try {
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						if (((aSpan = document.getElementById(startRange)) != null) ) {
							//capitalize word while we have it...
							tmpTxt = aSpan.textContent;
							if (tmpTxt != null) {
								localTmpTxt = tmpTxt;
								localTmpTxt = localTmpTxt.charAt(0).toUpperCase() + localTmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = localTmpTxt;
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								}
							}
							
							//create new paragraph, but only if span not first in paragraph
							curPara = aSpan.parentNode;
							if (curPara.firstChild !== aSpan) {

							tempPara = document.createElement("p");
							//tag to indicate it was a correcotr-added paragraph
							tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");

							//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
							curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,"newparagraph");
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  if null, puts at end
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);

								//now go through the spans appending them to their new parent paragraph
								//ie moving from original paragraph to tempPara
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move this sib
								tempPara.appendChild(aSpan);
								//update to next sib
								aSpan = tmpSpan;
							}
						}
//					}
				} catch (e) {
					debug("Error in PARAGRAPH_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
			*/
			
			} else {
				errorOut("Received an invalid correction request from server: " + command);
			}
		}
	}
	debug("done with client_update");
	/*
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".caption") {
			styleElem.cssRules[i].style.visibility = "visible";
			break;
		}
	}
	*/
	
	///////////////////////////////////
	//var formF1 = F1Node;
	//var F1ParentDiv = formF1.parentNode;  // "CaptionContent"
	//F1ParentDiv.appendChild(formF1);
	

	
	
//	endTime = new Date().getTime();
//	diff = endTime - startTime;
//	debug("endTime = " + endTime);
//	debug("Diff = " + diff);

	return; 
}


//========================================================//
//========================================================//
function setTooltipText(start, end) {
	var j;
	var toolTipEditor;
	var aSpan;
	var accumulatedOriginalText = "";
	
	//if we don't have first span, skip cuz nothing to put tooltip on
	if ((aSpan = document.getElementById(start)) != null) {
		accumulatedOriginalText += getOriginalSpanText(aSpan);
		toolTipEditor = getSpanEditor(aSpan);
		
		for (j = start+1; j <= end; j++) {
			if ((aSpan = document.getElementById(j)) != null) {
				accumulatedOriginalText += getOriginalSpanText(aSpan);
			}
		}
		//set tool tip on First/master span
		document.getElementById(start).setAttribute(TOOLTIP_ATTRIBUTE, toolTipEditor + " // " + accumulatedOriginalText);
	}
}


//========================================================//
//========================================================//
function checkIfRestoredToOriginal(start, end) {
	//ON HOLD FOR NOW.  NEEED TO DEAL WITH LATE ARRIVALS TO MEETING I.E. NOT PLAYING WITH A FULL DOC

	/*check whole span range, e.g. in applying an edit to a range of spans.  If text matches the concat of all span's original text, then restore all the spans.
	*/
	var j;
	var text;
	var toolTipEditor;
	var aSpan;
	var accumulatedOriginalText = "";
	var tmpText;
	var done = false;
	
	if ((aSpan = document.getElementById(start)) != null) {
		tmpText = getOriginalSpanText(aSpan);
		if (tmpText != null) {
			accumulatedOriginalText = tmpText;
			text = aSpan.textContent;
			toolTipEditor = getSpanEditor(aSpan);

			for (j = start + 1; j <= end; j++) {
				if ((aSpan = document.getElementById(j)) != null) {
					tmpText = getOriginalSpanText(aSpan);
					if (tmpText != null) {
						accumulatedOriginalText += tmpText;
					} else {
						//not been edited - not sure what up here so just quit trying to restore
						done = true;
						break;
					}
				} else {
					done = true;
					break;
				}
			}
			if (!done && (text == accumulatedOriginalText)) {
				//restore spans
				restoreRange(start,end);
			} else {
				//set tool tip on first/master span
				document.getElementById(start).setAttribute(TOOLTIP_ATTRIBUTE,  accumulatedOriginalText  + "[" + toolTipEditor + "]");
			}
		} //else nothing to do
	}
}


/*
//========================================================//
//========================================================//
function ifRestoredToOriginalTextResetSpan(elem) {
	//only dealing with a single span here. If the span is part of an edit group, don't restore
	
	var id = elem.getAttribute("id");
	var text;
	var tmpElem;
	
	if ((elem != null) && ((text = elem.textContent) != null) && (text == getOriginalSpanText(elem))) {
		//we are back at original text. If this is not part of an edit group, treat as a restore
		if (((aSpan = elem.nextSibling) == null) || (aSpan.id == editState.editBoxId) || (aSpan.firstChild != null)) {
			//we are not part of edit group
			//create new span
			tmpElem = document.createElement("span");
			//put text in new span
			tmpElem.appendChild(document.createTextNode(text));
			//insert new span
			elem.parentNode.insertBefore(tmpElem, elem);
			//remove old span
			tmpElem.parentNode.removeChild(elem);
			//set id of new span
			tmpElem.setAttribute("id",id);
		}
	}
}
*/


//========================================================//
//========================================================//
function captionAdd(nodeID, caption) {
	//assume captions will only come in at end of document
	
	var aSpan;
	var tmpEl;
	var tmpId;
	var contentNode = document.getElementById("DocContent");
//	//cancel our edit if nodeID < any span id within the edit group  -not sure how this could happen
//	//Should have gotten a recall that handled this prior

	//if span with this id exists, what should we do with it?
	if ((aSpan = document.getElementById(nodeID)) != null) {
		//This is probably an error.  So let's make the best of it... by dumping everything after
		
		//Cancel our edit if nodeID <= any span id within the edit 
		checkForEditOverlapWithCaptions(nodeID);
		//Remove any paragraphs after span,.
		while ((tmpEl = aSpan.parentNode.nextSibling) != null) {
			contentNode.removeChild(tmpEl);
		}
		
		//Remove any pseudo-element attribute flags cuz, we'll be deleting that paragraph
		aSpan.parentNode.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		
		//next delete nextSibling of span -- make sure any subsequent spans removed and this span is last
		while ((tmpEl = aSpan.nextSibling) != null) {
			aSpan.parentNode.removeChild(tmpEl);
		}
		//finally, remove this span
		aSpan.parentNode.removeChild(aSpan);
	}

	aSpan = document.createElement("span");
	aSpan.setAttribute("id",nodeID);
	aSpan.appendChild(document.createTextNode(decodeURIComponent(caption) + " "));
	contentNode.lastChild.appendChild(aSpan);
}


//========================================================//
//========================================================//
function captionRecall(nodeID) {
	
	var aSpan;
	var tmpElem;
	var parElem;
	var contentNode = document.getElementById("DocContent");
	
	//if we don't have this span then make sure we have NO spans.  Either just joined or something messed up.
	if ((aSpan = document.getElementById(nodeID)) == null) {
		/*
		//clear and reset any possible edit and parameters
		if ((aSpan = getEditNode()) != null) {
			//clear this so no additional cancels come in
			clearInputEventHandlers(aSpan);
		}
		if (waitingToConfirmEdit()) {
			removeDialog1();
		}
		clearEditState();

		//remove all children of content Node
		do {
			contentNode.removeChild(contentNode.firstChild);
		} while (contentNode.firstChild != null);
		
		//start fresh with new P0 paragraph
		aSpan = document.createElement("p");
		aSpan.setAttribute("id","P0");
		contentNode.appendChild(aSpan);
		*/
	} else {
		//check if backing into a span that has been or is currently being edited
		//If so, restore span and other affected spans before doing the recall
		//Also, unlock range if bumped into a lock.
		//need to update aSpan because restore might have created new element

		aSpan = checkAndRestoreCaptionRecallEnvironment(nodeID);
		
		//okay, now we are good to recall...
		
		//first delete next-sibs paragraphs of parent --removes any paragraphs, esp corrector-added paragraphs after span
		parElem = aSpan.parentNode;
		while ((tmpElem = parElem.nextSibling) != null) {
			contentNode.removeChild(tmpElem);
		}
		
		//Remove any pseudo-element attribute flags cuz no paragraphs after
		parElem.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		
		//next delete next sibling of span -- make sure any subsequent spans removed and this span is last
		while ((tmpElem = aSpan.nextSibling) != null) {
			parElem.removeChild(tmpElem);
		}
		//finally, delete this span
		parElem.removeChild(aSpan);
		
		//now if this was the last span of the last paragraph and now the paragraph is empty, reset paragraph cuz no span to associate with a newspeaker (if one)
		if (parElem.firstChild == null) {   //---### firstChild //---###
			parElem.removeAttribute(NEWSPEAKER_ATTR);
			parElem.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
			if (parElem.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
				//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
				if ((parElem = parElem.previousSibling) != null) {
					parElem.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
				}
			}
		}
	}
}


//========================================================//
//========================================================//
function paragraphAdd(nodeID) {

	var contentNode = document.getElementById("DocContent");

	//right now assume will always be added at the end
	var tempPara = document.createElement("p");
	tempPara.setAttribute("id",nodeID); 
	contentNode.appendChild(tempPara);
}


//========================================================//
//========================================================//
function paragraphRecall(nodeID) {

	var aPara;
	var tmpEl;
	var contentNode = document.getElementById("DocContent");

	//if we don't have this paragraph then make sure we have NO paragraphs.  Either just joined or something messed up.
	if ((aPara = document.getElementById(nodeID)) == null) {
		/*
		//clear and reset any possible edit and parameters
		if ((aSpan = getEditNode()) != null) {
			//clear this so no additional cancels come in
			clearInputEventHandlers(aSpan);
		}
		if (waitingToConfirmEdit()) {
			removeDialog1();
		}
		clearEditState();

		//remove all children of content Node
		do {
			contentNode.removeChild(contentNode.firstChild);
		} while (contentNode.firstChild != null);
		
		//start fresh with new P0 paragraph
		aSpan = document.createElement("p");
		aSpan.setAttribute("id","P0");
		contentNode.appendChild(aSpan);
		*/
	} else {
		//we do have this paragraph. Make sure it is last one
		/*
		//dump any edit going on in the paragraph or after (this shouldn't happen. if it does, it means some spans didn't get recalled)
		
		//get first span of paragraph
		tmpEl = aPara.firstChild;
		while (tmpEl != null) {
			if (tmpEl.nodeName.toUpperCase() == "SPAN") {
				break;
			}
			tmpEl = tmpEl.nextSibling;
		}
		if (tmpEl != null) {
			checkForEditOverlapWithCaptions(tmpEl);
		}
		*/

		//okay, now good to continue...
		//removes any paragraphs, esp corrector-added paragraphs after this para
		while ((tmpEl = aPara.nextSibling) != null) {
			contentNode.removeChild(tmpEl);
		}
		//now , delete this para
		contentNode.removeChild(aPara);
		
		//no need to fix attributes on previous sibling as this was a caption paragraph delete
		//if ((aPara = contentNode.lastChild) != null) {
		//	aPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		//}

	}
}


//========================================================//
//========================================================//
function lockUpdate(start, end, initials, id) {
	//apply lock to span range
			
	var j;
	var aSpan;
	var tt;
	
	//now apply lock
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			//indicate it is locked
			setSpanLocked(aSpan, initials, id); 
			// Set highlight styles
			setLockStyle(aSpan);
			//set tooltip - only on spans with content
			if (aSpan.firstChild != null) {
				tt = aSpan.getAttribute(TOOLTIP_ATTRIBUTE);
				if (tt == null) {
					tt = " | ";
				} else {
					tt = " | " + tt;
				}
				aSpan.setAttribute(TOOLTIP_ATTRIBUTE, "LOCKED by: " + initials + tt);
			}
		}
	}
}


//========================================================//
//========================================================//
function editUpdate(start, end, initials, correction) {
//	//before applying new edit... check if stale range
//	if (checkForPossibleStaleEdit(start, end) == 1) {
//		//not stale.  Apply

		//strip out any leading or trailing whitespace and insert only one trailing space in span
		correction = correction.replace(/^\s+|\s+$/g,'');
		applyEditToRange(start, end, correction + " ", initials);
		
//	} else {
//		//was stale - do not apply.  Simply remove locks
//		//and set all background of the span objects back to their previous state.
//		unlockRange(start,end);
//	}
}


//========================================================//
//========================================================//
//dump an edit-in-progress if edit range overlaps with span with nodeID.  
//in fact, dump an edit-in-progress if span's nodeID is <= end range of the edit.
//(can't be editing spans after the current caption coming in, cuz there shouldn't be any)
function checkForEditOverlapWithCaptions(nodeID) {

	if (!noCurrentEdit()) {
		if (parseInt(nodeID, 10) <= parseInt(editState.upperEditRange, 10)) {
			cancelEdit();
		}
	}
/*
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;
	
	//if no edit box, move on
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
			//Determine if we need to kill the edit before applying the correction that came in
			//if the caption is before or equal to the end of an edit group being edited, we need to dump the edit
			if (parseInt(nodeID, 10) <= parseInt(tmpEnd, 10)) {
				//debug('checkForEditOverlapWithCaptions::cancelEdit because nodeID=:'+nodeID+'  is less than tmpEnd '+tmpEnd);
				cancelEdit();
			}
		} else {
			//something wrong...no span after edit input element.
			cancelEdit();
		}
	}
*/
}


//========================================================//
//========================================================//
function checkAndRestoreCaptionRecallEnvironment(nodeID) {

	//
	// if overlap with edit range, kill edit
	// if range locked, unlock range
	// if overlap with an edit group, restore spans of edit group
		
	/*		
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;
	
	//assume nodeID is a valid span id (checked previously)
	
	//figure out how to do paragraph restore(FUTURE)

	startPar = para of start span
	endPar = para of end span
	if startPar != endPar
		do
			curPar = startPar.nextSibling
			if curPar is a user generated paragraph
				move all spans from curPar to StartPar
			else
				startPar = curPar
	while (curPar != endPar)

	//check if span under edit now
	//if no edit box, move on
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
			//Determine if we need to kill the edit before applying the correction that came in
			//if the caption is before the end of an edit group, we need to dump the edit
			if (parseInt(nodeID, 10) <= parseInt(tmpEnd, 10)) {
				debug('checkForEditOverlapWithCaptions::cancelEdit because nodeID=:'+nodeID+'  is less than tmpEnd '+tmpEnd);
				cancelEdit();
			}
		} else {
			//something wrong...no span after edit input element.
			cancelEdit();
		}
	}
		*/
	var theRange;
	
	// if overlap with edit range, kill edit
	checkForEditOverlapWithCaptions(nodeID);

	//Now check if span is locked.  If locked, unlock range
	theRange = getLockedRange(nodeID);
	if (theRange.begin != -1) {
		unlockRange(theRange.begin, theRange.end);
	}
	
	//Now check if span has been edited
	theRange = getEditedRange(nodeID);
	if (theRange.begin != -1) {
		restoreRange(theRange.begin, theRange.end);
	}

	//return node...might be a different node than came in with since restore
	//might have created a new, clean node
	return document.getElementById(nodeID);
}


//========================================================//
//========================================================//
//could be renamed, checkForEditOverlapWithCorrection()
function checkForEditInterference(command, startRange, endRange, corInitials) {

	//check if a command came in that interferes with our edit.  This shouldn't happen if locks where checked before command sent on front end.  couple exceptions - locks and overrides.
	
	// need to check if we are editing and a correction comes in that affects the editing process
	if (!noCurrentEdit()) {
		//we are editing.  see if overlap
		//if there is no overlap, not necessary to interfere with the editing process
		if ( ((startRange >= editState.lowerEditRange) && (startRange <= editState.upperEditRange)) 
			|| ((endRange >= editState.lowerEditRange) && (endRange <= editState.upperEditRange)) 
			|| ((startRange < editState.lowerEditRange) && (endRange > editState.upperEditRange)) ) {
			
			//only allowable overlap situation is if it is our own lock request
			//now need to check if we are dealing with our own lock request, which is perfectly okay and the normal case
			if  (!( (command==LOCK_COMMAND) && (corInitials == userInitials) && (editState.lowerEditRange == startRange) && (editState.upperEditRange == endRange))) {
				// There is a stale edit situation.  We need to kill the edit and restore the dom before applying the correction
				cancelEdit();  //cancel but don't send unlock if edit already sent
			}
		}
	}

/*
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;

		
	// need to check if we are editing and a correction comes in that affects the editing process
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
		
			//Determine if we need to kill the edit before applying the correction that came in
			
			//if there is no overlap, not necessary to interfere with the editing process
			if ( ((startRange >= tmpStart) && (startRange <= tmpEnd)) 
				|| ((endRange >= tmpStart) && (endRange <= tmpEnd)) 
				|| ((startRange < tmpStart) && (endRange > tmpEnd)) ) {
				
				//only allowable overlap situation is if it is our own lock request
				//now need to check if we are dealing with our own lock request, which is perfectly okay and the normal case
				if  (!( (command==LOCK_COMMAND) && (corInitials == userInitials) && (tmpStart == startRange) && (tmpEnd == endRange))) {
					// There is a stale edit situation.  We need to kill the edit and restore the dom before applying the correction
					cancelEdit();  //cancel but don't send unlock if edit already sent
				}
			}
		} else {
			//something wrong...no span after the edit box?
			cancelEdit();
		}
	}
*/
}


//========================================================//
//========================================================//
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


//========================================================//
function hexEncoder(str) {
	var tmpStr = "";
	if (str != "") {
		var re = /(\w)+|([\W])/g;
		tmpStr +=  str.replace( re, replacer);
	}
	return tmpStr;
}


/*
//========================================================//
//========================================================//
//get the last span of an edit group starting with start
function getEndRangeOfEdit(start) {

	var aSpan;
	var endSpanId = start;
	
	if ((aSpan = document.getElementById(start)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null) {
				//at end.  This is okay
				break;
			} else if (spanIsMarkedEditing(aSpan)) {
				//found a span being edited.  Update, then continue
				endSpanId = aSpan.id;
			} else {
				//must not be hidden so at end of our range
				break;
			}
		}
	}
	return endSpanId;
}
*/


//========================================================//
//========================================================//
//check from start to end to see if any span is locked
function isAnyInRangeLocked(start,end) {

	var tmpElem;
	var i;
	
	/*
	var returnVal = true;
	
	for (i = start; i <= end; i++) {
		tmpElem = document.getElementById(i);
		//see if span exists and is locked
		if ((tmpElem == null) || (spanIsMarkedLocked(tmpElem))) {
			//either doesn't exist or is locked, so no need to continue 
			break;
		}
		if (i == end) {
			//made it all the way through so it is not locked
			returnVal = false;
		}
	}
	*/
	var returnVal = false;

	for (i = start; i <= end; i++) {
		if ((tmpElem = document.getElementById(i)) != null) {
			//see if span exists and is locked
			if (spanIsMarkedLocked(tmpElem)) {
				//found one. no need to continue 
				returnVal = true;
				break;
			}
		}
	}

	return returnVal;
}


//========================================================//
//========================================================//
function unlockRange(start,end) {

	var j;
	var aSpan;
	var tt;
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			setSpanUnlocked(aSpan);
			//find out what to set style back to
			if (!spanIsMarkedEdited(aSpan)) {
				//no previous edit
				setCaptionsStyle(aSpan);
			} else {
				//There was a previous edit so must set back to correct style
				setCorrectedStyle(aSpan);
			}
			//strip out lock portion of tooltip
			if (aSpan.firstChild != null) {
				tt = aSpan.getAttribute(TOOLTIP_ATTRIBUTE);
				if (tt != null) {
					tt = tt.replace(/^[\S\s]+\|\s/, "");
					if (tt == "") {
						aSpan.removeAttribute(TOOLTIP_ATTRIBUTE);
					} else {
						aSpan.setAttribute(TOOLTIP_ATTRIBUTE, tt);
					}
				}
			}
		}
	}
}


//========================================================//
//========================================================//
//get the range of the locked block that includes nodeID 
function getLockedRange(nodeID) {

	var lockAttr;
	var aSpan;
	var tmpSpan;
	var range = {"begin":-1,"end":-1};
	var done = false;
	
	if ((tmpSpan = document.getElementById(nodeID)) != null) {
		if (lockAttr = spanIsMarkedLocked(tmpSpan)) {
			range.begin = nodeID;
			range.end = nodeID;
			
			//go forward to get end  (most often we'll be at end already if a recall)
			aSpan = tmpSpan.nextSibling;
			while (aSpan != null) {
				if (spanIsMarkedLocked(aSpan) == lockAttr) {
					range.end = aSpan.getAttribute("id");
					aSpan = aSpan.nextSibling;
					if (aSpan == null) {
						//get next paragraph
						if ((aSpan = tmpSpan.parentNode.nextSibling) != null) {
							aSpan = aSpan.firstChild;
						}
					}
				} else {
					aSpan = null;
				}
			}
			//go backward to get beginning
			aSpan = tmpSpan.previousSibling;
			if (aSpan == null) {
				//get previous paragraph
				if ((aSpan = tmpSpan.parentNode.previousSibling) != null) {
					aSpan = aSpan.firstChild;
				}
			}
			while (aSpan != null) {
				if (spanIsMarkedLocked(aSpan) == lockAttr) {
					range.begin = aSpan.getAttribute("id");
					aSpan = aSpan.previousSibling;
					if (aSpan == null) {
						//get previous paragraph
						if ((aSpan = tmpSpan.parentNode.previousSibling) != null) {
							aSpan = aSpan.firstChild;
						}
					}
				} else {
					aSpan = null;
				}
			}
		}
	}
	
	return range;
}


//========================================================//
//========================================================//
//get the range of the edited block that includes nodeID
//so look for cccEdited and go forward and back until text
function getEditedRange(nodeID) {

	var editAttr;
	var aSpan;
	var tmpSpan;
	var range = {"begin":-1,"end":-1};
	
	
	if ((tmpSpan = document.getElementById(nodeID)) != null) {
		if (spanIsMarkedEdited(tmpSpan)) {
			range.begin = nodeID;
			range.end = nodeID;
			
			//go forward to get end (until get to first span that has text in it)
			aSpan = tmpSpan.nextSibling;
			while ((aSpan != null) && spanIsMarkedEdited(aSpan) && (aSpan.firstChild == null)) {
				range.end = aSpan.getAttribute("id");
				aSpan = aSpan.nextSibling;
			}
			
			//go backward to get to beginning (first non-empty child)
			while ((tmpSpan != null) && spanIsMarkedEdited(tmpSpan) && (tmpSpan.firstChild == null)) {
				range.begin = tmpSpan.getAttribute("id");
				tmpSpan = tmpSpan.previousSibling;
			}
			if (tmpSpan != null) {
				range.begin = tmpSpan.getAttribute("id");
			}
		}
	}
	return range;
}


//========================================================//
//========================================================//
function restoreRange(start, end) {

	//remember to handle locks
	var j;
	var text;
	var aSpan;
	var startPara, endPara, curPara;
	var tmpElem;
	var tmpSpan;
	
		/*
	startPar = para of start span
	endPar = para of end span
	if startPar != endPar
		do
			curPar = startPar.nextSibling
			if curPar is a user generated paragraph
				move all spans from curPar to StartPar
			else
				startPar = curPar
	while (curPar != endPar)
	*/

	/*
	//===needs updating if we want to restore across paragraphs.
	//restore paragraphs
	startPara = document.getElementById(start);
	endPara = document.getElementById(end);
	if ((startPara != null) && (endPara != null)) {
	
		startPara = startPara.parentNode;
		endPara = endPara.parentNode;
		
		if (startPara !== endPara) {
			do {
				curPara = startPara.nextSibling;
				if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
					//it is user generated; move all spans to start
					aSpan = curPara.firstChild;
					while (aSpan != null) {
						//get ptr to next sib before we lose it
						tmpSpan = aSpan.nextSibling;
						//move this sib
						startPara.appendChild(aSpan);
						//update to next sib
						aSpan = tmpSpan;
					}
					//check if we are at end and flag
					if (curPara === endPara) {
						endPara = startPara;
					}
					//now delete it
					curPara.parentNode.removeChild(curPara);
				} else {
					//move start forward to next captioner paragraph
					startPara = curPara;
				}
			} while (startPara != endPara);
		}
	}
	*/
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			//get text.  If none, nothing to restore
			if ((text = getOriginalSpanText(aSpan)) != null) {
				//create new span
				tmpElem = document.createElement("span");
				//put text in new span
				tmpElem.appendChild(document.createTextNode(text));
				//insert new span
				aSpan.parentNode.insertBefore(tmpElem, aSpan);
				//remove old span
				tmpElem.parentNode.removeChild(aSpan);
				//set id of new span
				tmpElem.setAttribute("id",j);
			}
		}
	}
}


//========================================================//
//========================================================//
function noCurrentEdit() {
	var result = true;
	
	if (getNode(editState.editBoxId) != null) {
		result = false;
	} else if (waitingToConfirmEdit()) {
		result = false;
	}
	return (result && !editState.editing);
}


//========================================================//
//========================================================//
function waitingToConfirmEdit() {
	//---### return (document.getElementById("Overlay1").style.visibility == "visible");
	return (document.getElementById("Overlay1").style.display == "block");
}


//========================================================//
//========================================================//
function getEditNode() {
	return getNode(editState.editBoxId);
}


//========================================================//
//========================================================//
function getNode(nodeID) {
	var returnVal = null;
	var tmpNode = document.getElementById(nodeID);
	if ((tmpNode != null) && (tmpNode.parentNode != null)) {
		returnVal = tmpNode; 
	}
	return returnVal;
}


/*
// -1 = error
// 0 = stale
// 1 = not stale
function checkForPossibleStaleEdit(start, end) {
	
	var startNode;
	var endNode;
	var returnVal = -1;
	//make sure spans are still there and not recalled
	startNode = document.getElementById(start);
	endNode = document.getElementById(end);
	if ((startNode != null)  && (endNode != null) && (startNode.parentNode != null) && (endNode.parentNode != null)) {
		//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
		if (startNode.parentNode !== endNode.parentNode) {
			returnVal = 0;
		} else {
			//stale check - start doesn't have a null text element; 
			if (startNode.firstChild != null) {
				//okay continue to check end
				returnVal = checkForPossibleStaleEditEnd(end);
			} //else returnVal
		}
	}
	return returnVal;
}


function checkForPossibleStaleEditEnd(end) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	if ((aSpan = document.getElementById(end)) != null) {
		if ((aSpan = aSpan.nextSibling) == null) {
			//at end of paragraph.  Okay
			returnVal = 1;
		} else if (aSpan.tagName == "input") {
			//bumped into new edit group.  That is okay
			returnVal = 1;
		//} else if ((aSpan.firstChild == null) || (aSpan.firstChild.textContent == "")) {
		//	//stale because we would have included this span in the range if it was null or content was deleteAll'ed
		} else if (aSpan.firstChild == null) {
			//stale because we would have included this span in the range if it was null
			returnVal = 0;
		} else {
			//passed all the stale edit tests.  Good to go
			returnVal = 1;
		}
	} //else error- should not get a null
	return returnVal;
}


function checkForPossibleStaleEditWithEndNotEmpty(start, end) {
//looking for a stale edit, except the end node should not be empty cuz we are going to operate on it's text
//This is different than standard ranges where the end extends up to the last empty node.

// -1 = error
// 0 = stale
// 1 = not stale

	var startNode;
	var endNode;
	var returnVal = -1;
	//make sure spans are still there and not recalled
	startNode = document.getElementById(start);
	endNode = document.getElementById(end);
	if ((startNode != null)  && (endNode != null) && (startNode.parentNode != null) && (endNode.parentNode != null)) {
		//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
		if (startNode.parentNode !== endNode.parentNode) {
			returnVal = 0;
		} else {
			//stale check - start doesn't have a null text element; 
			if ((startNode.firstChild != null) &&  checkThatSpanNotEmpty(endNode)) {
				returnVal = 1;
			} //else returnVal
		}
	}
	return returnVal;
}


function checkThatSpanNotEmpty(endNode) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	//stale check - start doesn't have a null text element or blank text element
	if ((aSpan = endNode.firstChild) == null) {
		// must have gotten swallowed up by a new edit group or a deleteAll and we are stale
		returnVal = 0;
	} else if ((aSpan.nodeType == NODETYPE_TEXT) && (aSpan.textContent != "")) {
		//there is text here to operate on
		returnVal = 1;
	}
	
	return returnVal;
}
*/


//========================================================//
//========================================================//
function applyEditToRange(start, end, text, initials) {
	var j;
	var tmpText;
	var aSpan;
	var startSpan = null;
	var accumulatedOriginalText = "";
	var toolTipEditor = "";
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			// save original captions and mark as edited (if not already saved)
			if (aSpan.firstChild != null) {
				if (!spanIsMarkedEdited(aSpan)) {
					setSpanEditedAndSaveOrigText(aSpan, aSpan.textContent);
				} //else already edited and saved

				//remove text nodes 
				//(FUTURE: allow multiple text nodes - e.g. for "NewSpeaker" associated with a span
				do {
					aSpan.removeChild(aSpan.firstChild);
				} while (aSpan.firstChild != null);
			}
			
			//if first span, put in new text
			if (j == start) {
				startSpan = aSpan;  //save for later use
				if (text == "") {
					//this was a DeleteAll so keep span but mark at special
					text = DELETED_PLACEHOLDER;
					setSpanTextDeletedFlag(aSpan,initials);
				} else {
					//clear a previous special attribute, since now it is normal
					unsetSpanTextDeletedFlag(aSpan);
				}
				aSpan.appendChild(document.createTextNode(text));
			} else {
				//clear a previous special attribute, since now it is normal
				unsetSpanTextDeletedFlag(aSpan);
				
			}
			//remove old attributes and set new ones
			
			//clear locked indicator
			setSpanUnlocked(aSpan);

			//remove editing indicator if set
			unsetSpanEditingFlag(aSpan);
			
			//remove quickclick attribute if set
			unsetSpanQCFlag(aSpan);
			
			//unhide if it was hidden
			unhideElement(aSpan);
			
			//set attribute to indicate who edited this span
			setSpanEditor(aSpan, initials);
			
			//set style to indicate it was corrected
			setCorrectedStyle(aSpan);
			
			//get tooltip info
			if ((tmpText = getOriginalSpanText(aSpan)) != null) {
				accumulatedOriginalText += tmpText;
			} //else error
			//only use editor(s) of first/master span
			if (j == start) {
				toolTipEditor = getSpanEditor(aSpan);
			}
		}
	}
	if (startSpan != null) {
		startSpan.setAttribute(TOOLTIP_ATTRIBUTE, accumulatedOriginalText + "[" + toolTipEditor + "]");
	}
}


//========================================================//
//========================================================//
function unhideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="";
	}
}


//========================================================//
//========================================================//
function hideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="none";
	}
}


//========================================================//
//========================================================//
//========================================================//
function setSpanEditor(aSpan, initials) {
	//mark the initials of the editor

	var tmpTtl;
	if (aSpan != null) {
		//set EDITOR_ATTRIBUTE attribute to indicate who edited this span
		tmpTtl = aSpan.getAttribute(EDITOR_ATTRIBUTE);
		if (tmpTtl == null) {
			//first time editing
			tmpTtl = initials;
		} else {
			////It's been edited before; append this editor
			//tmpTtl += "," + initials;
			//It's been edited before; add this editor if not already there
			tmpTtl += "," + initials;
		}
		aSpan.setAttribute(EDITOR_ATTRIBUTE, tmpTtl);
	}
}


//========================================================//
function getSpanEditor(aSpan) {
	return aSpan.getAttribute(EDITOR_ATTRIBUTE);
}


//========================================================//
/*********** Locked Indicator   *********************/
//========================================================//
function spanIsMarkedLocked(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(LOCKED_ATTRIBUTE) != null);
}


//========================================================//
function setSpanLocked(aSpan,initials,id) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(LOCKED_ATTRIBUTE, initials + id.toString());
	//aSpan.setAttribute(LOCKED_ATTRIBUTE, initials);
}


//========================================================//
function setSpanUnlocked(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(LOCKED_ATTRIBUTE);
}


//========================================================//
/*********** Edited Indicator   *********************/
//========================================================//
function spanIsMarkedEdited(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(EDITED_ATTRIBUTE) != null);
}


//========================================================//
function setSpanEditedAndSaveOrigText(aSpan,text) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(EDITED_ATTRIBUTE, text);
}


//========================================================//
function getOriginalSpanText(aSpan) {
	//assumes aSpan != null already been checked
	return aSpan.getAttribute(EDITED_ATTRIBUTE);
}


//========================================================//
function unsetSpanEdited(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(EDITED_ATTRIBUTE);
}


//========================================================//
/*********** Editing Indicator   *********************/
//========================================================//
function spanIsMarkedEditing(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(EDITING_ATTRIBUTE) != null);
}


//========================================================//
function setSpanEditingFlag(aSpan,initials) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	//aSpan.style.display = 'none';
}


//========================================================//
function unsetSpanEditingFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(EDITING_ATTRIBUTE);
}


//========================================================//
function setSpanEditingStyle(aSpan) {
	//assumes aSpan != null already been checked
	//aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	aSpan.style.display = 'none';
}


//========================================================//
function unsetSpanEditingStyle(aSpan) {
	//assumes aSpan != null already been checked
	//aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	aSpan.style.display = '';
}


//========================================================//
/************** Special DeleteAll Flag ***************/
//========================================================//
function spanIsMarkedTextDeleted(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(DELETED_ATTRIBUTE) != null);
}


//========================================================//
//---###//---###//---###//---###//---###//---###//---### 
function spanHasUndeletedText(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(DELETED_ATTRIBUTE) == null && aSpan.firstChild != null);
}


//========================================================//
function setSpanTextDeletedFlag(aSpan,initials) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(DELETED_ATTRIBUTE, initials);
}


//========================================================//
function unsetSpanTextDeletedFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(DELETED_ATTRIBUTE);
}


//========================================================//
/************** Special QuickClick Flags ***************/
//========================================================//
function spanIsMarkedQC(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(QUICKCLICK_ATTRIBUTE) != null);
}


function setSpanQuickClicked(aSpan, cmd, initials, text) {
	//assumes aSpan != null already been checked
	if (!spanIsMarkedEdited(aSpan)) {
		setSpanEditedAndSaveOrigText(aSpan, text);
	} //else already edited and saved
	
	aSpan.setAttribute(QUICKCLICK_ATTRIBUTE, cmd);
	setSpanEditor(aSpan, initials);
	setCorrectedStyle(aSpan);
}


//========================================================//
function unsetSpanQCFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(QUICKCLICK_ATTRIBUTE);
}


/*
function removeCorrectorParagraphFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(LOCKED_ATTRIBUTE);
}
*/


//========================================================//
//========================================================//
function setCorrectedStyle(spanElement) {

	if (spanElement != null) {
		spanElement.className = "corrected";
		//spanElement.classList.add("corrected");
	}
}


//========================================================//
//========================================================//
function setCaptionsStyle(spanElement) {
//primarily used when escaping from an edit.

	if (spanElement != null) {
		//spanElement.className = "";
		//spanElement.classList.remove("locked");
		spanElement.removeAttribute("class");
	}
}


//========================================================//
//========================================================//
function setLockStyle(spanElement) {

	if (spanElement != null) {
		spanElement.className = "locked";
		//spanElement.classList.add("locked");
	}
}


//========================================================//
//========================================================//
// The functions below are used to trigger AJAX to check for new captions or corrections every x seconds
/////////////////////////////////////////
//////////////////////////////////////////
function pollNow() {
	
	debug1("::PollNow:: begin");
	immediatePollRequested = true;
	clearTimeout(pollingTimerEvent);
	polling();
	debug1("::PollNow:: end");
	
}


//////////////////////////////////////////
//////////////////////////////////////////
function polling() {
	
	debug1("::polling:: begin");
	if (stopFlag == false) {
		if (!inPollRequest) {
			//xmlhttpPoll("capreceiver", "&v=" + globalState.documentVersion);
			xmlhttpPoll("capreceiver", DOCVERSION_PARAM + "=" + globalState.documentVersion);
		} else {
			debug1("::polling:: in poll request");
		}
		pollingTimerEvent = setTimeout(polling, (CorrectorModeOn ? CORRECTOR_POLL_TIMEOUT : READER_POLL_TIMEOUT));
	}
	debug1("::polling:: end");
	
}


//////////////////////////////////////////
//////////////////////////////////////////
function startPolling() {
	stopFlag = false;
	polling();
}


//////////////////////////////////////////
//////////////////////////////////////////
function stopPolling() {
	stopFlag = true;
	debug("Request to stop Polling received via StopPolling())");
}


function autoScrollBtnClicked() {
	if (document.getElementById("ShowScrollBtn").value == "Pause Auto-scroll") {
		loadStartAutoScrollMessage();
		scrollingTurnedOn = false;
	} else {
		loadStopAutoScrollMessage();
		scrollingTurnedOn = true;
		scrollingIsScrollUpPaused = false;
		scrollingIsKeyPaused = false;
		scrollingIsMousePaused = false;
		prevScrollTop = 0;
	}
}


function loadStartAutoScrollMessage() {
	//// "Auto-scroll OFF: Click to turn on auto-scroll";
	//// "Auto-scroll OFF: Click to Resume";
	//// "Resume Auto-scroll";
	loadNewAutoScrollMessage("Click to Resume Auto-scroll");
}


function loadStopAutoScrollMessage() {
	loadNewAutoScrollMessage("Pause Auto-scroll");
}


function loadNewAutoScrollMessage(newMsgText) {
	if (document.getElementById("ShowScrollBtn").value != newMsgText) {
		document.getElementById("ShowScrollBtn").value = newMsgText;
	}
}


function scrollingPage() {	
	var docEle = document.getElementById("CaptionWindow");
	var newScrollTop = docEle.scrollTop;
	var scrollOverflow = docEle.scrollHeight - (newScrollTop + docEle.offsetHeight);
	var scrollMessageDisplaySetting = (newScrollTop > 0 || scrollOverflow > 2) ? "block" : "none";
	
	//---###//---###//---###//---###//---###//---###
	var captionsNode = document.getElementById("CaptionWindow");
	document.getElementById("ShowScroll").style.right = (captionsNode.offsetWidth - captionsNode.clientWidth + 2) + "px";
	document.getElementById("ShowScroll").style.bottom = (captionsNode.offsetHeight - captionsNode.clientHeight + 1) + "px";
	//---###//---###//---###//---###//---###//---###
	
	if (scrollingTurnedOn == false) {
		loadStartAutoScrollMessage();
		document.getElementById("ShowScroll").style.display = scrollMessageDisplaySetting;
		scrollingTimerEvent = setTimeout(scrollingPage, 100);
		return;
	}
	
	var scrollingIsUserPaused = (scrollingIsKeyPaused == true || scrollingIsMousePaused == true || noCurrentEdit() == false);
	
	if (scrollOverflow < 3) {
        scrollingIsScrollUpPaused = false;
	} else if (newScrollTop < prevScrollTop && scrollOverflow > 5) {
		if (scrollingIsUserPaused == true) {
			prevScrollTop = newScrollTop;
		} else {
			scrollingIsScrollUpPaused = true;
		}
	}	
	
	if (scrollingIsScrollUpPaused == true) {
		loadStartAutoScrollMessage();
	} else {
		loadStopAutoScrollMessage();	
		if (scrollingIsUserPaused == true) {
			scrollMessageDisplaySetting = "none";
		}
	}
	document.getElementById("ShowScroll").style.display = scrollMessageDisplaySetting;
	
    if (scrollingIsScrollUpPaused == false && scrollingIsUserPaused == false)
        {
		docEle.scrollTop = newScrollTop + Math.max(1, (scrollOverflow + 20) / 10, scrollOverflow - 500);
		prevScrollTop = docEle.scrollTop;
        }
    
	scrollingTimerEvent = setTimeout(scrollingPage, 50);
}


function initVars(selection) {
	initColorsSelectBox();
	initColorPickerRows();
	initFontFaceSelectBox();
	initFontSizeSelectBox();
	loadDefaultUserSettings();
	window.addEventListener('resize', function() {
		updateQuickHelpLayout();
		updateDialogPosition();
	});
	scrollingPage();
}


// Initialize the settings for the color sets select box
function initColorsSelectBox() {
	var SelectNode = document.getElementById("ColorSet");
	var colorSetKeys = Object.keys(colorSetsObj);
	var key;
	for (key in colorSetKeys) {
		var option = document.createElement("option");
		option.value = colorSetKeys[key];
		option.text = colorSetsObj[colorSetKeys[key]].picker_label;
		SelectNode.add(option);
	}
}


// Initialize the color block tables in the color picker
function initColorPickerRows() {
	var colorGunValues = ["00", "33", "66", "99", "CC", "FF" ];
	var groupSize = colorGunValues.length;
	var outerRowNode = document.createElement("tr");
	var outerCellNode;
	var tableNode;
	var rowNode;
	
	for (var i = 0; i < groupSize; i++) {
		if (i % 3 == 0) {
			outerCellNode = document.createElement("td");
		}
		tableNode = document.createElement("table");
		for (var j = 0; j < groupSize; j++) {
			rowNode = document.createElement("tr");
			for (var k = 0; k < groupSize; k++) {
				rowNode.appendChild(createColorPickerCell("#" + colorGunValues[j] + colorGunValues[i] + colorGunValues[k]));
			}
			tableNode.appendChild(rowNode);
		}
		outerCellNode.appendChild(tableNode);
		if (i % 3 == 2) {
			outerRowNode.appendChild(outerCellNode);
		}
	}
	document.getElementById("colorPickerTable").appendChild(outerRowNode);
}


function createColorPickerCell(cssColor) {
	var cell = document.createElement("td");
	cell.style.backgroundColor = cssColor;
	var button = document.createElement("button");
	button.setAttribute("onclick", "setColor('" + cssColor + "');");
	button.setAttribute("title", cssColor);
	cell.appendChild(button);
	return cell;
}


// Initialize the settings for the font face select box
function initFontFaceSelectBox() {
	var SelectNode = document.getElementById("FontFace");
	var fontFamilyKeys = Object.keys(fontFamiliesObj);
	var key;
	for (key in fontFamilyKeys) {
		var fontFamilyObj = fontFamiliesObj[fontFamilyKeys[key]];
		var option = document.createElement("option");
		option.value = fontFamilyKeys[key];
		option.style.fontFamily = fontFamilyObj.font_stack;
		option.text = fontFamilyObj.picker_label;
		SelectNode.add(option);
	}
}


// Initialize the settings for the font size select box
function initFontSizeSelectBox() {
	var SelectNode = document.getElementById("FontSize");
	var index;
	for (index = 0; index < fontSizes.length; index++) {	
		var option = document.createElement("option");
		option.value = fontSizes[index];
		option.text = fontSizes[index] + " pixels";
		SelectNode.add(option);
	}
}


function openQuickHelpDialog() {
	document.getElementById("QuickHelp").style.display = "block";
	document.getElementById("QuickHelpIcon").blur();
	updateQuickHelpLayout();
	document.getElementById("CloseQuickHelpIcon").focus();
}


function updateQuickHelpLayout() {
	var table1Node = document.getElementById("QuickHelpTable1");
	var table2Node = document.getElementById("QuickHelpTable2");
	if (document.getElementById("QuickHelpBackdrop").offsetLeft > table2Node.offsetWidth + 8) {
		table1Node.style.display = "";
	} else if (table2Node.offsetTop > table1Node.offsetTop) {
		table1Node.style.display = "table";	
	}
}


function closeQuickHelpDialog() {
	document.getElementById("QuickHelp").style.display = "none";
	document.getElementById("QuickHelpIcon").focus();
}


function openSettingsDialog() {
	if (document.getElementById("Settings").style.display != "block") {
		closeQuickHelpDialog();
		loadSettingsDialog();
		prevSettingsObj = JSON.parse(JSON.stringify(currentSettingsObj));  // puts a COPY of currentSettingsObj into prevSettingsObj
		document.getElementById("Settings").style.display = "block";
		/*
		document.getElementById("SettingsIcon").blur();
		*/
		document.getElementById("CloseSettingsIcon").focus();
	}
}


function loadDefaultUserSettings() {
	currentSettingsObj = JSON.parse(JSON.stringify(defaultSettingsObj));   // puts a COPY of defaultSettingsObj into currentSettingsObj
	document.getElementById("ReaderModeBtn").checked = false;
	document.getElementById("PausePollingBtn").checked = false;
	applyUserSettings();
	loadSettingsDialog();
}


function keepNewUserSettings() {
	applyUserSettings();
	document.getElementById("Settings").style.display = "none";
	closeColorPicker();
	document.getElementById("SettingsIcon").focus();
}


function restorePrevUserSettings() {
	currentSettingsObj = JSON.parse(JSON.stringify(prevSettingsObj));   // puts a COPY of prevSettingsObj into currentSettingsObj
	applyUserSettings();
	document.getElementById("Settings").style.display = "none";
	closeColorPicker();
	document.getElementById("SettingsIcon").focus();
}


var colorButtonIdNode = null;   //---###//---###//---###//---###


function showColorPicker(colorButtonId) {
	colorButtonIdNode = document.getElementById(colorButtonId);
	document.getElementById("colorPickerScreen").style.display = "block";
	document.getElementById("colorPicker").style.display = "block";
	document.getElementById("closeColorPickerIcon").focus();
}


function setColor(newHexRgb) {
	if (colorButtonIdNode != null) {
		colorButtonIdNode.value = newHexRgb;
		showNewUserSettings();
	}
	closeColorPicker();
}


function closeColorPicker() {
	document.getElementById("colorPicker").style.display = "none";
	document.getElementById("colorPickerScreen").style.display = "none";
	if (colorButtonIdNode != null) {	
		colorButtonIdNode.previousElementSibling.focus();
	}
	colorButtonIdNode = null;
}


function loadIntoCustomColors() {
	currentSettingsObj.custom_colors = JSON.parse(JSON.stringify(colorSetsObj[currentSettingsObj.color_set_key]));     // puts a COPY of the current color set Object into currentSettingsObj.custom_colors
	currentSettingsObj.color_set_key = "custom_colors";
	document.getElementById("ColorSet").value = currentSettingsObj.color_set_key;
	applyUserSettings();
	document.getElementById("ColorSet").focus();
}


function loadSettingsDialog() {
	document.getElementById("ColorSet").value = currentSettingsObj.color_set_key;
	loadCustomColorsSubDialog();
	
	document.getElementById("FontFace").value = currentSettingsObj.font_face_key;
	document.getElementById("FontSize").value = currentSettingsObj.font_size;
	document.getElementById("CaptionsBold").checked = (currentSettingsObj.bold_text == true);
	document.getElementById("CorrectedCaptionsUnderline").checked = (currentSettingsObj.cor_text_underlined == true);
}


function loadCustomColorsSubDialog() {
	closeColorPicker();
	var usingCustomColors = (currentSettingsObj.color_set_key == "custom_colors");
	if (usingCustomColors) {
		var customColorsObj = currentSettingsObj.custom_colors;
		
		document.getElementById("capTextColorButton").style.backgroundColor = customColorsObj.cap_text;
		document.getElementById("capTextColor").defaultValue = customColorsObj.cap_text;
		document.getElementById("capTextColor").value = customColorsObj.cap_text;
		
		document.getElementById("corTextColorButton").style.backgroundColor = customColorsObj.cor_text;
		document.getElementById("corTextColor").defaultValue = customColorsObj.cor_text;
		document.getElementById("corTextColor").value = customColorsObj.cor_text;
		
		document.getElementById("backgroundColorButton").style.backgroundColor = customColorsObj.background;
		document.getElementById("backgroundColor").defaultValue = customColorsObj.background;
		document.getElementById("backgroundColor").value = customColorsObj.background;
		
		document.getElementById("LockedBgColorButton").style.backgroundColor = customColorsObj.locked_bg;
		document.getElementById("LockedBgColor").defaultValue = customColorsObj.locked_bg;
		document.getElementById("LockedBgColor").value = customColorsObj.locked_bg;
	}
	document.getElementById("CustomColorSettings").style.display = (usingCustomColors) ? "block" : "none";
	document.getElementById("EditColors").style.display = (usingCustomColors) ? "none" : "inline-block";
}

//custom_colors: { picker_label: "Custom Colors", cap_text: "#000000", background: "#FFFFFF", cor_text: "#E00000", locked_bg: "#F8E800" }

function saveUserSettings() {
	var usingCustomColors = (currentSettingsObj.color_set_key == "custom_colors");
	if (usingCustomColors) {
		if ((document.getElementById("capTextColor").value).match(/^#[0-9,a-f]{6}$/i) != null) {
			currentSettingsObj.custom_colors.cap_text = document.getElementById("capTextColor").value;
		}
		if ((document.getElementById("corTextColor").value).match(/^#[0-9,a-f]{6}$/i) != null) {
			currentSettingsObj.custom_colors.cor_text = document.getElementById("corTextColor").value;
		}
		if ((document.getElementById("backgroundColor").value).match(/^#[0-9,a-f]{6}$/i) != null) {
			currentSettingsObj.custom_colors.background = document.getElementById("backgroundColor").value;
		}
		if ((document.getElementById("LockedBgColor").value).match(/^#[0-9,a-f]{6}$/i) != null) {
			currentSettingsObj.custom_colors.locked_bg = document.getElementById("LockedBgColor").value;
		}
	}
	currentSettingsObj.color_set_key = document.getElementById("ColorSet").value;
	document.getElementById("CustomColorSettings").style.display = (usingCustomColors) ? "block" : "none";
	document.getElementById("EditColors").style.display = (usingCustomColors) ? "none" : "inline-block";
	
	currentSettingsObj.font_face_key = document.getElementById("FontFace").value;
	currentSettingsObj.font_size = document.getElementById("FontSize").value;
	currentSettingsObj.bold_text = (document.getElementById("CaptionsBold").checked == true);
	currentSettingsObj.cor_text_underlined = (document.getElementById("CorrectedCaptionsUnderline").checked == true);
}


function updateCustomColor(inputNodeId) {
	document.getElementById(inputNodeId).previousElementSibling.style.background = document.getElementById(inputNodeId).value;
	showNewUserSettings();
}


function showNewUserSettings() {
	saveUserSettings();
	applyUserSettings();
}


function applyUserSettings() {
	var styleElem = document.getElementById("userStyles").sheet;
	
	var colorSetObj = colorSetsObj[currentSettingsObj.color_set_key];
	if (currentSettingsObj.color_set_key == "custom_colors") {
		colorSetObj = currentSettingsObj.custom_colors;
	}
	loadCustomColorsSubDialog();
	
	CorrectorModeOn = (authenticatedCorrector == true && document.getElementById("ReaderModeBtn").checked == false);
	document.getElementById("QuickHelpIcon").style.display = (CorrectorModeOn) ? "inline-block" : "none";
	
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		var matchText = styleElem.cssRules[i].selectorText;
		
		if (matchText == ".caption") {
			styleElem.cssRules[i].style.color = colorSetObj.cap_text;
			styleElem.cssRules[i].style.backgroundColor = colorSetObj.background;
			styleElem.cssRules[i].style.fontFamily = fontFamiliesObj[currentSettingsObj.font_face_key].font_stack;
			styleElem.cssRules[i].style.fontSize = currentSettingsObj.font_size + "px";
			styleElem.cssRules[i].style.fontWeight = (currentSettingsObj.bold_text == true) ? "bold" : "normal";
			
		//---###//---### DPK - added 9 Feb 2016
		} else if (matchText.match(/\.caption/i) != null && matchText.match(/input:focus$/i) != null) {
			styleElem.cssRules[i].style.outlineColor = colorSetObj.cor_text;
		//---###//---###	
			
		} else if (matchText == ".corrected" || (matchText.match(/^p\[cccnewspeaker=/i) != null && matchText.match(/:before$/i) != null)) {
			styleElem.cssRules[i].style.color = colorSetObj.cor_text;
			styleElem.cssRules[i].style.textDecoration = (currentSettingsObj.cor_text_underlined == true) ? "underline" : "none";
			
		} else if (matchText.match(/\[cccquick\]/i) != null && matchText.match(/\.corrected/i) != null) {
			styleElem.cssRules[i].style.color = (CorrectorModeOn) ? colorSetObj.cor_text : colorSetObj.cap_text;
			styleElem.cssRules[i].style.textDecoration = (CorrectorModeOn && currentSettingsObj.cor_text_underlined == true) ? "underline" : "none";
			
		} else if (matchText == ".locked") {
			styleElem.cssRules[i].style.backgroundColor = colorSetObj.locked_bg;
			
		} else if (matchText.match(/^p\[cccnextpara/i) != null && matchText.match(/:after$/i) != null) {
			styleElem.cssRules[i].style.color = colorSetObj.cor_text;
			
			var rgbArray_cap = cssHexToRgbArray(colorSetObj.cap_text);
			var rgbArray_cor = cssHexToRgbArray(colorSetObj.cor_text);
			var rgbArray_bg = cssHexToRgbArray(colorSetObj.background);
			
			var tintedRgbArray = blendedRgbArray(rgbArray_bg, rgbArray_cor, 1.75 + greyChannel(rgbArray_bg) / 18);
			styleElem.cssRules[i].style.backgroundColor = rgbArrayToCssHex(blendedRgbArray(tintedRgbArray, greyedRgbArray(tintedRgbArray), 0.75));
			
			var lightBgFlag = (greyChannel(rgbArray_bg) > greyChannel(rgbArray_cap));
			var lightRgbArray = blendedRgbArray(rgbArray_bg, rgbArray_cap, (lightBgFlag ? 2 : 0.25));
			var darkRgbArray = blendedRgbArray(rgbArray_bg, rgbArray_cap, (lightBgFlag ? 0.25 : 2));
			var lightBorder = rgbArrayToCssHex(blendedRgbArray(lightRgbArray, greyedRgbArray(lightRgbArray), 0.5));
			var darkBorder = rgbArrayToCssHex(blendedRgbArray(darkRgbArray, greyedRgbArray(darkRgbArray), 0.5));
			styleElem.cssRules[i].style.borderColor = lightBorder + " " + darkBorder + " " + darkBorder + " " + lightBorder;
			
		} else if (matchText.match(/\[cccdelall\]/i) != null && matchText.match(/span/i) != null) {
			styleElem.cssRules[i].style.display = (CorrectorModeOn) ? "inline" : "none";
			
		} else if (matchText.match(/\[cccdelall\]/i) != null && matchText.match(/\.corrected/i) != null) {
			styleElem.cssRules[i].style.color = colorSetObj.background;
			styleElem.cssRules[i].style.backgroundColor = colorSetObj.cor_text;
			
		}
	}
	
	if (document.getElementById("PausePollingBtn").checked != stopFlag) {
		if (document.getElementById("PausePollingBtn").checked == true)
			stopPolling();
		else
			startPolling();
	}
}


// convert 0..255 R,G,B array values to a css #hexidecimal color string
function rgbArrayToCssHex(rgbArray) {
	return "#" + (("000000" + (rgbArray[0] << 16 | rgbArray[1] << 8 | rgbArray[2]).toString(16).toUpperCase()).substr(-6));
}


// convert a  css #hexidecimal color string to 0..255 R,G,B array values
function cssHexToRgbArray(cssHex) {
	var hex = parseInt(cssHex.substr(-6), 16);
	return [hex >> 16, hex >> 8 & 0xFF, hex & 0xFF];
}


function blendedRgbArray(rgbArray1, rgbArray2, ratio) {
	var r = Math.round((rgbArray1[0] * ratio + rgbArray2[0]) / (ratio + 1));
	var g = Math.round((rgbArray1[1] * ratio + rgbArray2[1]) / (ratio + 1));
	var b = Math.round((rgbArray1[2] * ratio + rgbArray2[2]) / (ratio + 1));
	return [r, g, b];
}


function greyedRgbArray(rgbArray) {
	var grey = greyChannel(rgbArray);
	return [grey, grey, grey];
}


////// 0.2126 * R + 0.7152 * G + 0.0722 * B
function greyChannel(rgbArray) {
	return Math.round((rgbArray[0] * 2 + rgbArray[1] * 6 + rgbArray[2]) / 9);
}


//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###


/*
old code from when using comet method
//////////////////////////////////////////
//////////////////////////////////////////
function loadIframe(srcPath) {
	//var i = document.getElementById("comet_iframe");
	var i = document.createElement("iframe");
	i.id = "comet_iframe";
	i.name = "comet_iframe";
	i.className = "iframeStyle";
	//i.scrolling = "auto";
	//i.frameborder = "0";
	document.getElementById("iframeDiv").appendChild(i);
	//document.body.appendChild(i);
	i.src = srcPath;
}
*/


