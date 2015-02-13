
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
	int globalParagraphId;
	CaptionBuffer b;
	StringBuffer tokenBuffer;
	StringBuffer commandBuffer;
	public boolean flushedFlag;
	public ArrayList<String> meetingRoomLockList; 
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public CaptionProcessor1(int numElements, String roomId) {
		globalSpanId = 0;
		globalParagraphId = 0;
		b = new CaptionBuffer(numElements,roomId);
		tokenBuffer = new StringBuffer();
		commandBuffer = new StringBuffer();
		flushedFlag = false;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setLockList(ArrayList<String> list) {
		meetingRoomLockList = list;
	}


//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setGlobalSpanID(int num) {
		globalSpanId = num;
	}

	//////////////////////////////////////////////
//////////////////////////////////////////////
	public void setGlobalParagraphID(int num) {
		globalParagraphId = num;
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
	}
				
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void clearTokenBuffer() {
		tokenBuffer.setLength(0);
	}
				
//////////////////////////////////////////////
//////////////////////////////////////////////
	public void processCaptions(String capStr) {
	
	//if flag set indicating data sent prematurely, check if first char is our delim.  Can eat it if it is, else need to 
	//recall or replace prematurely sent
	
		clearCommandBuffer();
		int end = capStr.length();

		if ((flushedFlag == true) && (end > 0)) {
			if (!isDelim(capStr.charAt(0))) {
				//we need to recall our flushed word
				recallPreviousWord();
			}
			flushedFlag = false;
		}


		String curId;
		
		boolean done;
		char currentChar;
		char prevChar = getLastChar();
		
		//process a char at a time

		for (int i = 0; i < end; i++) {
			done = false;
			//get current char to work with
			currentChar = sanitize(capStr.charAt(i));

			if (currentChar == '\b') {
				prevChar = truncate();
				if (prevChar == '\0') {
					//Need to recall last word because we backed up past delimiter
					recallPreviousWord();
					prevChar = getLastChar();
				}
				done = true;
			} else if (prevChar == '\r') {
				//convert to LF
				prevChar = '\n';
				replaceLastChar(prevChar);
				//if part of crlf pair, we are done
				if (currentChar == '\n') done = true;
			}
			
			if (!done) {
				//start a new token on this test (note an empty buffer at start will fail this and jump to append)
				if ((prevChar == '\n') || (!isDelim(prevChar) && isDelim(currentChar))) {
					//we got a new token to send.  What kind?
					if (prevChar == '\n') {
						//paragraph marker
						curId = "P" + Integer.toString(++globalParagraphId);
					} else {
						//span id
						curId = Integer.toString(++globalSpanId);
					}
					sendThisWord(curId);
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
	public void sendThisWord(String curId) {

		b.push(curId, tokenBuffer);
		if (curId.charAt(0) == 'P') {
			commandBuffer.append(CAPTIONER_PARAGRAPH_COMMAND_PLUS + curId + "\n");
		} else {
			commandBuffer.append(CAPTION_COMMAND_PLUS + curId + "~" + encodeURIComponent(tokenBuffer.toString().trim()) + "\n");
		}
	}
		
		
	/**************************************************/
	public void checkForLockWhileRecalling(String id) {
		
		String corrector = "CR";
		String tmpStr = "";
		String[] tmpStrArray;
		int iLower = Integer.parseInt(id);
		
		try {
			for (int i=0; i < meetingRoomLockList.size(); i++) {
				tmpStrArray = (meetingRoomLockList.get(i)).split("\\~");
				if ((iLower >= Integer.parseInt(tmpStrArray[0])) && (iLower <= Integer.parseInt(tmpStrArray[1]))) {
					//collision found.  Remove it and send an unlock command with this range and our initials
					meetingRoomLockList.remove(i);
					tmpStr += CANCELLOCK_COMMAND + "~" + tmpStrArray[0] + "~" + tmpStrArray[1] + "~~" + corrector + "\n";
				}
			}
		} catch (Exception e) {
			System.err.println("Error in checkForLockWhileRecalling()");
		}
		//tmpStr += OVERRIDE_COMMAND + "~" + Integer.toString(iLower) + "~" + Integer.toString(iLower) + "~" + "" + "~" + corrector + "\n";
		commandBuffer.append(tmpStr);
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void flushTokenBuffer() {

		clearCommandBuffer();
		char tmpChar = getLastChar();
		if ((tmpChar != '\0') && (!isDelim(tmpChar))) {
			//only flush if not a delim
			sendThisWord(Integer.toString(++globalSpanId));
			clearTokenBuffer();
			flushedFlag = true;
		}
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public void recallPreviousWord() {
	
		BufferElement e = new BufferElement();
		//get previous element
		if (b.pop(e)) {
			if (e.id.charAt(0) == 'P') {
				commandBuffer.append(CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS + e.id + "\n");;
			} else {
				//it is a span recall.  Check lock file and issue unlocks for any overlap found
				checkForLockWhileRecalling(e.id);
				commandBuffer.append(CAPTION_RECALL_COMMAND_PLUS + e.id + "\n");;
			}
			//put text into buffer
			clearTokenBuffer();  //just to make sure
			tokenBuffer.append(e.token);
			
			//update id counter - only need to be concerned about span id's
			if (e.id.charAt(0) != 'P') globalSpanId--;
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
	public char getLastChar() {
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
	public char truncate() {
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
