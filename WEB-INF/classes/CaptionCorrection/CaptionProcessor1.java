
package CaptionCorrection;
//package capreceiver;
import java.io.*;
import java.util.*;
import java.net.URLEncoder;
import java.net.URLDecoder;

public class CaptionProcessor1 {

	private static final String CAPTION_COMMAND_PLUS = "C~";
	private static final String CAPTION_RECALL_COMMAND_PLUS = "CR~";
	private static final String CAPTIONER_PARAGRAPH_COMMAND_PLUS = "P~";
	private static final String CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS = "PR~";
	
	private static final String CANCELLOCK_COMMAND = "CancelLock";
	private static final String OVERRIDE_COMMAND = "OverrideLock";

	int globalSpanId;
	int maxGlobalSpanId;
	int globalParagraphId;
	CaptionBuffer b;
	StringBuffer tokenBuffer;
	StringBuffer commandBuffer;
	int commandBufferHighSpan;
	int commandBufferLowSpan;
	int lastValidSpanId;

	public boolean flushedFlag;
	//public ArrayList<String> meetingRoomLockList; 
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public CaptionProcessor1(int numElements, String roomId) {
		globalSpanId = 0;
		maxGlobalSpanId = 0;
		globalParagraphId = 0;
		b = new CaptionBuffer(numElements,roomId);
		tokenBuffer = new StringBuffer();
		commandBuffer = new StringBuffer();
		commandBufferHighSpan = -1;
		commandBufferLowSpan = maxGlobalSpanId;
		lastValidSpanId = -1;
		flushedFlag = false;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
//	public void setLockList(ArrayList<String> list) {
//		meetingRoomLockList = list;
//	}


//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setGlobalSpanID(int num, int max) {
		globalSpanId = num;
		maxGlobalSpanId = max;
	}

	//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setGlobalParagraphID(int num) {
		globalParagraphId = num;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getGlobalSpanID() {
		return globalSpanId;
	}

	//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getGlobalParagraphID() {
		return globalParagraphId;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public String getRoomName() {
		return b.getRoomName();
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public String getCommandBuffer() {
		return commandBuffer.toString();
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void clearCommandBuffer() {
		commandBuffer.setLength(0);
		commandBufferLowSpan = maxGlobalSpanId;
		commandBufferHighSpan = -1;
		lastValidSpanId = -1;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getLastValidSpanId() {
		return lastValidSpanId;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setLastValidSpanId(int val) {
		lastValidSpanId = val;
	}

	//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setCommandBufferSpanRangeCaption(int id) {
	
		if (id < commandBufferLowSpan) commandBufferLowSpan = id;
		
		//if high is -1, we switch cuz now we have a caption in the buffer that wasn't recalled
		if (id > commandBufferHighSpan) commandBufferHighSpan = id;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setCommandBufferSpanRangeRecall(int id) {
	//we keep track of range of id's recalled so we can use this info when updating doc versions in array.
	//We need to not only update the doc versions of the spans we edit, but also reset the version of the spans
	//we recall.
		
		//if high == -1, that means we have net of no captions - only recalls starting at "low"
		//high == low is the trigger point to flip to -1
		//else we have a net of 1 or more captions from low to high
	
		if (commandBufferHighSpan == -1) {
			commandBufferLowSpan = id;
		} else if (commandBufferLowSpan == commandBufferHighSpan) {
			commandBufferLowSpan = id;
			commandBufferHighSpan = -1;
		} else {
			if (id > 0) commandBufferHighSpan = id -1;
			else commandBufferHighSpan = 0;
		}
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getCommandBufferLowRange() {
	
		return commandBufferLowSpan;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getCommandBufferHighRange() {
	
		return commandBufferHighSpan;
	}
	
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void clearTokenBuffer() {
		tokenBuffer.setLength(0);
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public boolean isSpecialChar(char ch) {

		return ((ch == '\0') || (ch == '\b') || (ch == '\n') || (ch == '\r'));
}

//////////////////////////////////////////////
//////////////////////////////////////////////
//pre-process caption string to handle backspaces where we can.
//not sure worth further pre-processing of crlf's???
	public String preprocessCaptions(String str) {
	
		StringBuffer newStr = new StringBuffer();
		int j;
		int i;
		char cur;
		char prev;
		int len = str.length();

		if (len > 0) {
			prev = str.charAt(0);
			newStr.append(prev);
			for (i=1; i < len; i++) {
				cur = str.charAt(i);
				if (cur == '\b') {
					if (isSpecialChar(prev)) {
						//we can not remove it
						newStr.append(cur);
						prev = cur;
					} else {
						//we can remove prev if there is one
						if ((j = newStr.length()) > 1) {
							newStr.setLength(--j);
							prev = newStr.charAt(j-1);
						} else if (j == 1) {
							newStr.setLength(0);
							prev = '\0';
						}
					}
				} else {
					//just append
					newStr.append(cur);
					prev = cur;
				}
			}
		}
		return newStr.toString();
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void processCaptions(String capStr) {
	
	//if flag set indicating data sent prematurely(flushed stuck token), check if first char is our delim.  Can eat it if it is, else need to 
	//recall or replace prematurely sent
	
	//globalSpanId holds the span ID to be used with the next caption command.  Stays set while token is being built.  Then pushed
	//along with the token to the caption buffer once the whole token is received.  Finally it is used in the caption command in 
	//the commandBuffer along with this token.  It is only incremented after the "send Word to command buffer" call, so it is  ready
	//when the next token starts coming in.
	
		clearCommandBuffer();
		setLastValidSpanId(globalSpanId - 1);  //  A -1 indicates no last valid id
		int end = capStr.length();

		if ((flushedFlag == true) && (end > 0)) {
			if (!isDelim(capStr.charAt(0))) {
				//we need to recall our flushed word
				recallPreviousWord();
			}
			flushedFlag = false;
		}

		boolean done;
		char currentChar;
		//get last char in token buffer
		char prevChar = getLastCharFromTokenBuffer();
		
		//process a char at a time

		for (int i = 0; i < end; i++) {
			done = false;
			//get current char to work with - convert certain <32 chars to space char
			currentChar = sanitize(capStr.charAt(i));

			if (currentChar == '\b') {
				//get previous char from token buffer
				prevChar = truncateTokenBuffer();
				if (prevChar == '\0') {
					//nothing left in buffer
					//Need to recall last word because we backed up past delimiter
					recallPreviousWord();
					prevChar = getLastCharFromTokenBuffer();
				}
				done = true;
			} else if (prevChar == '\r') {
				//need to deal with crlf pair here
				//convert to LF
				prevChar = '\n';
				replaceLastChar(prevChar);
				//if part of crlf pair, we are done
				if (currentChar == '\n') done = true;
			}
			
			//should have prevChar and currentChar setup now
			if (!done) {
				//start a new token on this test (note an empty buffer at start will fail this and jump to append)
				if ((prevChar == '\n') || (!isDelim(prevChar) && isDelim(currentChar))) {
					//we got a new token to send.  What kind?
					if (prevChar == '\n') {
						//paragraph marker
						sendThisPara(globalParagraphId++);
					} else {
						//span id
						if (globalSpanId < maxGlobalSpanId) {
							sendThisWord(globalSpanId++);
						}
					}
					clearTokenBuffer();
				}
				
				//append
				tokenBuffer.append(currentChar);
				prevChar = currentChar;
			}
		} //end for
		
	}


//////////////////////////////////////////////
//////////////////////////////////////////////
	public void sendThisWord(int curId) {

		String idStr = Integer.toString(curId);
		b.push(idStr, tokenBuffer);
		commandBuffer.append(CAPTION_COMMAND_PLUS + idStr + "~" + encodeURIComponent(tokenBuffer.toString().trim()) + "\n");
		setCommandBufferSpanRangeCaption(curId);
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void sendThisPara(int curId) {

		String idStr = "P" + Integer.toString(curId);
		b.push(idStr, tokenBuffer);
		commandBuffer.append(CAPTIONER_PARAGRAPH_COMMAND_PLUS + idStr + "\n");
	}
	
		

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void flushTokenBuffer() {

		clearCommandBuffer();
		char tmpChar = getLastCharFromTokenBuffer();
		if ((tmpChar != '\0') && (!isDelim(tmpChar))) {
			//only flush if not a delim
			if (globalSpanId < maxGlobalSpanId) {
				sendThisWord(globalSpanId++);
			}
			clearTokenBuffer();
			flushedFlag = true;
		}
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void recallPreviousWord() {
	
	//NEW CODE: ADD CODE TO NOT ALLOW A RECALL ON PARAGRAPH P0.  MUST START WITH THAT CUZ SPANS(I.E. CAPTIONS) NEED TO 
	//BE ATTACHED TO(CHILDREN OF) A PARAGRAPH WHETHER OR NOT THE CAPTIONER STARTS WITH ONE 
	//(UNLESS WE CHANGE STRUCTURE ON CLIENT SIDE).  ALTERNATIVELY,
	//WE COULD IMPLEMENT P0 ON CLIENT SIDE AND START AT P1 HERE.  IN THIS CASE, WE STILL WOULD NEED TO CHECK
	//TO MAKE SURE WE DON'T GO BEYOND RECALLING P1
		BufferElement e = new BufferElement();
		//get previous element
		if (b.pop(e)) {
			//see if "word" was a paragraph or a token
			if (e.id.charAt(0) == 'P') {
				commandBuffer.append(CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS + e.id + "\n");;
			} else {
				//it is a span recall.  Check lock file and issue unlocks for any overlap found
				//checkForLockWhileRecalling(e.id);
				commandBuffer.append(CAPTION_RECALL_COMMAND_PLUS + e.id + "\n");
				//if dealing with multiple recalls, combine them by updating to lowest
				setCommandBufferSpanRangeRecall(Integer.parseInt(e.id));
			}
			//put text into buffer
			clearTokenBuffer();  //just to make sure
			tokenBuffer.append(e.token);
			
			//update id counter - only need to be concerned about span id's cuz we don't need para IDs to be sequential
			if (e.id.charAt(0) != 'P') {
				if (globalSpanId > 0) globalSpanId--;
				//or we should use e.id to set globalSpanId
			}
		}
	}
	


//////////////////////////////////////////////
//////////////////////////////////////////////
	public String encodeURIComponent(String s) {
		String result;

		try {
			result = URLEncoder.encode(s, "UTF-8")
				.replaceAll("\\+", "%20");
				//.replaceAll("\\%21", "!")
				//.replaceAll("\\%27", "'")
				//.replaceAll("\\%28", "(")
				//.replaceAll("\\%29", ")")
				//.replaceAll("\\%7E", "~");
		} catch (Exception e) {
			System.err.println("UnsupportedEncodingException in encodeURIComponent: " + e.getMessage());
			result = s;
		}
		return result;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public String decodeURIComponent(String s) {
		String result;

		try {
			result = URLDecoder.decode(s, "UTF-8");
				//.replaceAll("\\+", "%20");
				//.replaceAll("\\%21", "!")
				//.replaceAll("\\%27", "'")
				//.replaceAll("\\%28", "(")
				//.replaceAll("\\%29", ")")
				//.replaceAll("\\%7E", "~");
		} catch (Exception e) {
			System.err.println("UnsupportedEncodingException in encodeURIComponent: " + e.getMessage());
			result = s;
		}
		return result;
	}


//////////////////////////////////////////////
//////////////////////////////////////////////
	public char sanitize(int c) {
	
		char ch = (char) c;

		if ((ch == '\n') ||
			(ch == '\r') ||
			(ch == '\b') ||
			(ch >=  ' ') ) return ch;
		else return ' ';
}
		
//////////////////////////////////////////////
//////////////////////////////////////////////
	public boolean isDelim(char ch) {

		//count a null as a delim.  Won't see in data (current) but does signal empty buffer in previous char
		return ((ch == ' ') || (ch == '\n') || (ch == '\r') || (ch == '\0'));
}



	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public char getLastCharFromTokenBuffer() {
		char ch;
		
		int len = tokenBuffer.length();
		if (len == 0) ch = '\0';
		else ch = tokenBuffer.charAt(len-1);
		return ch;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void replaceLastChar(char ch) {

		int len = tokenBuffer.length();
		if (len != 0) {
			tokenBuffer.setCharAt(len-1, ch);
		}
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public char truncateTokenBuffer() {
	
	//remove one char from end.  Return new "last char".
	//If buffer is empty, return \0 character.
	
		char ch;
		
		int len = tokenBuffer.length() - 1;
		if (len <= 0) {
			ch = '\0';
			clearTokenBuffer();
		} else {
			tokenBuffer.setLength(len);
			ch = tokenBuffer.charAt(len-1);
		}
		return ch;
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
}