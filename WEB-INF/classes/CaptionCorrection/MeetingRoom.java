/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package CaptionCorrection;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;

/**
 *
 * @author trace
 */
public class MeetingRoom {

	public static boolean debug = false;
	

	/********** CONSTANTS  *******************/
	private static final int CAPCOR_BUFFER_SIZE = 2000000;   // maximum number of characters in the captioner/corrector commands buffer
	private static final int DOCVER_ARRAY_SIZE = 250000;   // maximum number of captioner words
	private static final int NUM_CAPTIONS_RECALLABLE = 5000;   // maximum number of recallable captioner words
	private static final long FLUSHTIMEOUT = 1000;   // milliseconds
	private static final int MAX_DOC_VER = Integer.MAX_VALUE;

	
	String ROOM_PARAM = "room";
	String CORRECTOR_COMMAND_PARAM = "cmd";
	String CORRECTOR_PWD_PARAM = "pwd";
	String CORRECTOR_PARAM = "who";
	String STARTRANGE_PARAM = "strt";
	String ENDRANGE_PARAM = "end";
	String DATA_PARAM = "data";
	String DOCVERSION_PARAM = "ver";
	String MEETING_DOC_ID_PARAM = "id";
	String RESPONSE_STATUS_PARAM = "resp";
	String RESPONSE_REASON_PARAM = "reas";
	String ACCEPT_INDICATOR = "accept";
	String DENY_INDICATOR = "deny";
	
	String ADMIN_COMMAND_CAPTION = "caption";
	String ADMIN_COMMAND_RESET = "reset";


	private static final String CAPTION_COMMAND_PLUS = "C~";
	private static final String CAPTION_RECALL_COMMAND_PLUS = "CR~";
	private static final String CAPTIONER_PARAGRAPH_COMMAND_PLUS = "P~";
	private static final String CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS = "PR~";
	//private static final String CAPCOR_DATA_INIT_STRING = "\n" + CAPTIONER_PARAGRAPH_COMMAND_PLUS + "P0\n";
	private static final String CAPCOR_DATA_INIT_STRING = "\n";
	private static final String CAPCOR_DATA_DELIM = "\n";
	
	private static final String LOCK_COMMAND = "L";
	private static final String EDIT_COMMAND = "ED";
	private static final String CANCELLOCK_COMMAND = "CL";
	private static final String DELETEALL_COMMAND = "DE";
	
	private static final String COMMA_COMMAND = "CO";
	private static final String PERIOD_COMMAND = "PE";
	private static final String QUESTION_COMMAND = "QU";
	private static final String CAPITALIZE_COMMAND = "CA";
	private static final String PARAGRAPH_COMMAND = "PA";
	private static final String NEWSPEAKER_COMMAND = "NE";
	
	private static final String OVERRIDE_COMMAND = "OV";
	private static final String RESTORE_COMMAND = "RE";
	private static final String SPEAKEREDIT_COMMAND = "SP";
	
	

	
	/********** ADMINISTRATION  *******************/
	private String meetingRoom;		//meeting room name
	private long meetingDocId;		//unique id associated with this meeting instance and current document
	
	String relpath_meetingRoom;		//relative path to the directory setup for the meeting room
	String meetingFilename;			//name of the main file with captions and corrections for the meeting
	int meetingSuffix = 0;			//for future use if need to start a new file for a meeting due to length
	String relpath_meetingFile;		//relative path to the main meeting file (relative to program context)
	String abspath_meetingFile;		//absolute path to the main meeting file
	
	RandomAccessFile capcorFileRW;
	
	/********** Handlers  *******************/
	private Handlers captionHandler = null;
	private Handlers correctionHandler = null;
	private CaptionProcessor1 captionsProcessor = null;  //processes captions when we get them
	//private String subscriberMethod;
	
	/********** DATA  *******************/
	private byte[] capcorBuf;
	private int capcorBufPos = 0;  // first empty position in array/number of bytes of data in array
	private int capcorBufCapacity = CAPCOR_BUFFER_SIZE;  //number of bytes allocated for capcorBuf array

	private int[] docVersionArray;
	//private int docverArrayPos = 0;  // first empty position in array/number of bytes of data in array
	private int docVerArrayCapacity = DOCVER_ARRAY_SIZE;  // number of ints allocated for docVersionArray array
	
	private int startSpanID = 0;
	private int startParaID = 0;
	
	private Long flushTimerStart;
	
	
	/********** CLIENTS  *******************/
	private ArrayList<Handlers> clientList;

	
	/*c************  CONSTRUCTOR  **************************/
	public MeetingRoom (HttpServletRequest request, String roomStr) {
		meetingRoom = roomStr;
		meetingSuffix = 0;
		flushTimerStart = new Long(System.currentTimeMillis());

		ServletContext context = request.getServletContext();
		
		//setup file paths to meeting room files
		buildFilePaths(context, meetingSuffix);
	}
	

	/*c**************************************/
	public void init() {
		
		clientList = new ArrayList<Handlers>();
		capcorBuf = new byte[capcorBufCapacity];
		docVersionArray = new int[docVerArrayCapacity];
		
		meetingDocId = 0;
		createPathToFile();
		initCapcorBuf();
		//meetingDocId = System.currentTimeMillis();

		updateGlobalIDs();
		initDocVerArray();

		//setup caption processor
		captionsProcessor = new CaptionProcessor1(NUM_CAPTIONS_RECALLABLE, meetingRoom);
		captionsProcessor.setGlobalSpanID(startSpanID, docVerArrayCapacity - 1);
		captionsProcessor.setGlobalParagraphID(startParaID);

	}

	/***************************************/
	public void setCaptioner (HttpServletRequest req, Handlers hndlr) {
		captionHandler = hndlr;
		//captionHandler.init(req, this);
		captionHandler.init(req);
		captionHandler.setMeetingRoom(this);
	}
	
	/***************************************/
	public Handlers getCaptioner () {
		return captionHandler;
		
	}
	
	/***************************************/
	public void setCorrector (Handlers hndlr) {
		correctionHandler = hndlr;
	}
	

	/*c**************************************/
	private void initCapcorBuf() {
	
		String tmpStr;
		if (debug) {System.err.println("Got in MeetingRoom.initCapcorBuf");}
		capcorBufPos = 0;
		//close if open first
		File file = new File(abspath_meetingFile);
		try {
			capcorFileRW = new RandomAccessFile(file, "rws");
			loadCapcorBuffer(0);
			if (debug) {System.err.println("capcorBufPos = [" + capcorBufPos + "]");}
			
			//if new meeting room, initialize data
			try {
				if (capcorFileRW.length() == 0) {
					//appendCapcorData(CAPCOR_DATA_INIT_STRING);
					//meetingDocId = System.currentTimeMillis();
					appendCapcorData(Long.toString(System.currentTimeMillis()) + CAPCOR_DATA_DELIM);
					
					//byte[] bytes = ByteBuffer.allocate(8).putLong(someLong).array();
					//appendCapcorDataBytes(ByteBuffer.allocate(8).putLong(meetingDocId).array(),
					
				} 
				/*else if (capcorFileRW.length() >= 9) {
					//get meetingDocId
					//find first newline
					//Bytes.indexOf(capcorBuf, (byte) CAPCOR_DATA_DELIM);
					tmpStr = new String(capcorBuf,0, 8, "US-ASCII");
					meetingDocId = Long.parseLong(tmpStr);
				} else {
					meetingDocId = System.currentTimeMillis();
				}*/
			} catch (IOException e) {
					System.err.println("Error in MeetingRoom.init()");
			
			}
			
//			updateGlobalIDs();
//			initDocVerArray();

		} catch (IOException e) {
				System.err.println("Error in MeetingRoom.initCapcorBuf()");
			
		}
	}
	
	/*c**************************************/
	//read data into buffer starting at position passed in
	private void loadCapcorBuffer(int pos) {
	
		int bytesRead = 0;
		capcorBufPos = pos;
		try {
			capcorFileRW.seek(capcorBufPos);
			
			while ((bytesRead != -1) && (capcorBufPos < capcorBufCapacity)) {
				bytesRead = capcorFileRW.read(capcorBuf, capcorBufPos, capcorBufCapacity-capcorBufPos);
				if (bytesRead != -1) capcorBufPos += bytesRead;
			}

		} catch (IOException e) {
			System.err.println("Exception in loadCapcorBuffer reading file....capcorBufPoos = [" + capcorBufPos + "]");
		}
	}
	
	/*c**************************************/
	//add the string to the file and buffer

	public synchronized void appendCapcorData(String appendDataStr) {
		
		byte[] appendDataArray;
		int appendDataLength;
		
		if ((appendDataStr != null) && (appendDataStr.length() != 0)) {
			appendDataArray = appendDataStr.getBytes();
			appendDataLength = appendDataArray.length;
			
			appendCapcorDataBytes(appendDataArray, appendDataLength);
		}
	}

	/***************************************/
	public synchronized int appendCapcorDataBytes(byte[] appendArray, int appendLength) {
		
		long index = 0;
		int returnVal = -1;
		try {
			//get file length.  This is the index into the capcor data buffer
			//(get here before any other possible exceptions)
			index = capcorFileRW.length();

			if ((capcorBufPos + appendLength) >= capcorBufCapacity) {
			
				// TODO: NEED TO DEAL WITH OVERFLOW BETTER LATER ... LIKE START A NEW FILE, OR EXPAND THE BUFFER
				
				System.err.println("New data sent to appendCapcorDataBytes() will cause us to exceed capcorBufCapacity!  Current capcorBufPos = [" + capcorBufPos + "]");
				throw new IOException();
			}
			
			//start writing at end of file (i.e. append)
			capcorFileRW.seek(index);
			capcorFileRW.write(appendArray);
			
			//now move data to our capcor buffer offset by the index value
			int offset = (int) index;
			for (int i = 0; i < appendLength; i++) {
				capcorBuf[offset++] = appendArray[i];
			}
			//update position index for our byte array
			//capcorBufPos += appendLength;
			capcorBufPos = offset;
			returnVal = offset;
			if (debug) {System.err.println("new capcorBufPos = [" + capcorBufPos + "]");}
		
		} catch (IOException e) {
			System.err.println("Exception1 in appendCapcorDataBytes()!!!!");
			try {
				capcorFileRW.setLength(index);
				capcorBufPos = (int) index;
			} catch (IOException f) {
				System.err.println("Exception2 in appendCapcorDataBytes()!!!!");
			}
		}
		return returnVal;
	}
	
	/***************************************/
	private void updateGlobalIDs() {
		//get last Caption~nnn
		//parse forward for any recalls and decrement
		String tmpStr;
		int i;
		int startID = 0;
		if (debug) {System.err.println("Got in MeetingRoom.updateGlobalIDs");}

		startSpanID = startID;
		try {
			//tmpStr = new String(capcorBuf, "UTF-8");
			tmpStr = new String(capcorBuf,0, capcorBufPos, "US-ASCII");
			if (tmpStr == null) {
				tmpStr = "";
			}
			if (debug) {System.err.println("Capcor String=[" + tmpStr + "]");}
			
			//get meetingDocId
			i = tmpStr.indexOf(CAPCOR_DATA_DELIM);
			if (i > 0) {
				meetingDocId = Long.parseLong(tmpStr.substring(0,i));
			} else {
				meetingDocId = System.currentTimeMillis();
			}

			//now get spanid
			i = tmpStr.lastIndexOf("\n" + CAPTION_COMMAND_PLUS);
			if (i != -1) {
				String tmpRemaining = tmpStr.substring(i + CAPTION_COMMAND_PLUS.length()+1);
				if (debug) {System.err.println("Substring = [" + tmpRemaining + "]");}
				String capIdStr = tmpRemaining.substring(0,tmpRemaining.indexOf("~"));
				startID = Integer.parseInt(capIdStr);
				if (debug) {System.err.println("capIdStr = [" + capIdStr + "]");}
				i = tmpRemaining.lastIndexOf("\n" + CAPTION_RECALL_COMMAND_PLUS);
				if (i != -1) {
					String tmpLast = tmpRemaining.substring(i+CAPTION_RECALL_COMMAND_PLUS.length()+1);
					if (debug) {System.err.println("recall Substring = [" + tmpLast + "]");}
					capIdStr = tmpLast.substring(0,tmpLast.indexOf("\n"));
					startID = Integer.parseInt(capIdStr);
					if (debug) {System.err.println("startID = [" + startID + "]");}
				}
				//We found last span ID used.  So start with next one
				startID++;
			} else {
				if (debug) {System.err.println("No Captions~ found in MeetingRoom.updateGlobalIDs");}
			}
			
			startSpanID = startID;
			if (debug) {System.err.println("startSpanID = [" + startSpanID + "]");}
			
			
			//do same for paragraph marker
			//start at 1 for next available paragraph.
			//(Client will put in P0 when initialized.  That way a client starting
			//in the middle of a meeting will have a paragraph to begin appending spans to.)
			startID = 1;
		
			i = tmpStr.lastIndexOf("\n" + CAPTIONER_PARAGRAPH_COMMAND_PLUS);
			if (i != -1) {
				String tmpRemaining = tmpStr.substring(i + CAPTIONER_PARAGRAPH_COMMAND_PLUS.length()+1);
				if (debug) {System.err.println("Substring = [" + tmpRemaining + "]");}
				//this gets you to the "Pnnnn\n..." part of the string.  Pull out just the number
				i = tmpRemaining.indexOf("\n");
				if (i != -1) {
					String capIdStr = tmpRemaining.substring(1,i);
					startID = Integer.parseInt(capIdStr);
					if (debug) {System.err.println("para startID = [" + startID + "]");}
					i = tmpRemaining.lastIndexOf("\n" + CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS);
					if (i != -1) {
						String tmpLast = tmpRemaining.substring(i+CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS.length()+1);
						if (debug) {System.err.println("nParagraphRecall Substring = [" + tmpLast + "]");}
						capIdStr = tmpLast.substring(1,tmpLast.indexOf("\n"));
						startID = Integer.parseInt(capIdStr);
						if (debug) {System.err.println("para startID = [" + startID + "]");}
					}
				}
				//We found last paragraph ID used.  So start with next one
				startID++;

			} else {
				if (debug) {System.err.println("No paragraphs~ found in MeetingRoom.updateGlobalIDs");}
			}
		} catch (Exception e) {
			System.err.println("Error in MeetingRoom.updateGlobalIDs");
		}
		startParaID = startID;
		if (debug) {System.err.println("startParaID = [" + startParaID + "]");}

	}
	
	
	/***************************************/
	private void initDocVerArray() {

	//init from 0 to  startSpanID with length of capcorBufPos
		int tmpDocVer = capcorBufPos;
		int tmpSpanMax = startSpanID;
		
		int i;
		//just to make sure we don't run off end
		if (tmpSpanMax > docVerArrayCapacity) tmpSpanMax = docVerArrayCapacity;
		
		for (i = 0; i < tmpSpanMax; i++) {
			docVersionArray[i] = tmpDocVer;
		}
		//init from capcorBufPos to end with maxint
		for (i = tmpSpanMax; i < docVerArrayCapacity; i++) {
			docVersionArray[i] = MAX_DOC_VER;
		}
	}


	/*c**************************************/
	private void buildFilePaths(ServletContext context, int num) {
		
		//get date in the format we want
		Format formatter = new SimpleDateFormat("MM_dd_yyyy");
		Date date = new Date();
		//String currentDate = formatter.format(date);
		String currentDate = "d";
		String tmpStr;
		
		//build the working paths  (watch out for direction of slashes.  Different systems use different slash/backslashes)
		relpath_meetingRoom = "WEB-INF" + File.separator + "caption_texts" + File.separator + meetingRoom + File.separator;
		meetingFilename = currentDate + "_" + meetingRoom + "_" + Integer.toString(num) + ".txt";
		
		// build relative paths to files
		relpath_meetingFile = relpath_meetingRoom + meetingFilename;

		tmpStr = context.getRealPath("");
		if (tmpStr.charAt(tmpStr.length()-1) != File.separatorChar) {
			tmpStr += File.separator;
		}

		abspath_meetingFile = tmpStr + relpath_meetingFile;

		if (debug) {System.err.println("relpath_meetingRoom: "+relpath_meetingRoom);}
		if (debug) {System.err.println("meetingFilename: "+meetingFilename);}
		
		if (debug) {System.err.println("getRealPath: "+tmpStr);}
		if (debug) {System.err.println("relpath_meetingFile: "+relpath_meetingFile);}
		if (debug) {System.err.println("abspath_meetingFile: "+abspath_meetingFile);}

	}
	
	/*c**************************************/
	public boolean roomExists() {
		//actually checks if meeting file exists
		//File f = new File(relpath_meetingFile);
		File f = new File(abspath_meetingFile);
		return f.exists();
	}

	/*c**************************************/
	private void createPathToFile() {
		File f = new File(abspath_meetingFile);
		f.getParentFile().mkdirs();
	}
	
	/***************************************/
	public void closeRoom() {
	
		String cmdStr;
		//do not allow any additional sessions
		//unlock any pending locks
		//dump those that we have 
		//make sure we don't mid-stream.  Either at start or end
		
		//close files nicely if possible
		
		if (captionsProcessor.flushedFlag == false) {
			//try to flush.  
			captionsProcessor.flushTokenBuffer();
			//If we flushed the token, pass command on
			if (captionsProcessor.flushedFlag == true) {
				cmdStr = captionsProcessor.getCommandBuffer();
				processCaptionsHelper(cmdStr);
				captionsProcessor.clearCommandBuffer();
				if (debug) {System.err.println("***flushed");}
			}
		}

		//run finalizer
	}

	/***************************************/
	public void resetRoom() {
	
		//close, copy, create
		//get date in the format we want
		Format formatter = new SimpleDateFormat("yyMMddHHmmssSS");
		Date date = new Date();
		String currentDate = formatter.format(date);
		File curFile = new File(abspath_meetingFile);
		File newFile = new File(abspath_meetingFile+"_"+currentDate);
		curFile.renameTo(newFile);
	}

	//out.write(buffer, offset, num of chars to write)
	/***************************************/
	private void getDataInfo(String tmpLast, HttpServletResponse response) {
		//doing output here to be quicker
		//tmpLast < 0 means just start me at current position
		
		///only synchronized value
		int end = capcorBufPos;
		///
		
		String outStr;
		int chunkSize = 50000;
		int tempCapCorBufPos = end;
		
		response.setContentType("text/html;charset=UTF-8");

		int last;

		try {
			last = Integer.parseInt(tmpLast);
		} catch (Exception e) {
			last = 0;
		}
		
		if (last < 0) {
			//set last to current position but need to tell user what paragraph if there is one
			last = tempCapCorBufPos;
		} else if (last > tempCapCorBufPos) {
			//don't let them go beyond the end
			last = tempCapCorBufPos;
		}
		try {
			OutputStream out = response.getOutputStream();
			if ((last + chunkSize) < tempCapCorBufPos) {
				//give only a chunkSize amount of data
				//need to find break
				String tmpStr = new String(capcorBuf,last+chunkSize, tempCapCorBufPos - (last + chunkSize), "US-ASCII");
				int syncOffset = tmpStr.indexOf("\n");
				if (syncOffset != -1) {
					end = last + chunkSize + syncOffset + 1;  //+1 to include \n
				} else {
					//should be able to get a newline....if not...return nothing and client
					//can try again next time
					end = last;
				}
			}
			
			//out.write(("~OK;last=" + end + "~").getBytes());
			outStr = "{" + assembleResponse(ACCEPT_INDICATOR, "", end) + "}";
			
			out.write ((Integer.toString(outStr.length()) + outStr ).getBytes());
			
			if (last < end) {
				out.write(capcorBuf, last, end - last);
				
				if (debug) {System.err.println("last = [" + last + "]  new last = [" + end + "]");}
				//if (debug) {
				//	String tmp = new String(capcorBuf,last, end - last, "US-ASCII");
				//	if (debug) {System.err.println("chunk written  = [" + tmp + "]");}
				//}
			}
			//out.write(("\"}").getBytes());
			out.close();
		} catch (IOException e) {
			System.err.println("Exception in getDataInfo: " + e.getMessage());
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

	/**************************************************/
	public boolean meetingCorrector(String corPwd) {
		boolean result = false;
		if (corPwd != null) {
				if (corPwd.equals("password1234567890")) {   //---### ***PasswordLocationTag***
				//FUTURE: check in database
				result = true;
			}
		}
		return result;
	}

	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	//no admin commands - no captions-  just normal polling or correction processing
	public void processRequest(HttpServletRequest request, HttpServletResponse response) {
	
		String command;
		String outStr;
		long docId;
		//if (debug) {System.err.println("Got in MeetingRoom.processRequest");}
		try {
			docId = Long.parseLong(request.getParameter(MEETING_DOC_ID_PARAM));
		} catch (Exception e) {
			docId = 0;
		}
		
		//if (docId.equals(meetingDocId)) {
		if (docId != meetingDocId) {
			outStr = "{" + assembleResponse(DENY_INDICATOR, "Meeting Doc Id does not match", -1 ) + "}";
		} else if (request.getParameter(CORRECTOR_COMMAND_PARAM) == null) {
			//no command.  Default to reader
			//output data directly from getDataInfo
			getDataInfo(request.getParameter(DOCVERSION_PARAM), response);
			outStr = "";
		} else if (meetingCorrector(request.getParameter(CORRECTOR_PWD_PARAM))) {
			//got password and command....process
			outStr = "{" + processCorrection(request, response) + "}";
			
		} else {
			//outStr = "\nCommand password not valid for command \"" + command + "\".";
			outStr = "{" + assembleResponse(DENY_INDICATOR, "Command password not valid for command", -1 ) + "}";
		}
		

		if (!outStr.equals("")) {
			try {
				response.setContentType("text/html;charset=UTF-8");
				OutputStream out = response.getOutputStream();
				out.write((outStr).getBytes());
				out.close();
			} catch (IOException e) {
				System.err.println("Error in MeetingRoom.processRequest()");
			}
			//checkForStuckCaption();
		}
	}

	/***************************************/
	private String assembleResponse(String resp, String reason, int ver) {

		return "\"" + RESPONSE_STATUS_PARAM +		"\":\"" + resp + "\"" +
				",\"" + RESPONSE_REASON_PARAM +		"\":\"" + reason + "\"" +
				",\"" + MEETING_DOC_ID_PARAM +		"\":" + meetingDocId + "" +
				",\"" + DOCVERSION_PARAM +			"\":" + ver +		"";
	}

	/***************************************/
	private String assembleResponse(String cmd, String start, String end) {

		return "\"" + CORRECTOR_COMMAND_PARAM +		"\":\"" + cmd + "\"" +
				",\"" + STARTRANGE_PARAM +			"\":\"" + start + "\"" +
				",\"" + ENDRANGE_PARAM +			"\":\"" + end +		"\"";
	}

	/***************************************/
	public String processCorrection(HttpServletRequest request, HttpServletResponse response) {

		String tmpStr;
		String command;
		String lowerRange;
		String upperRange;
		String corrector;
		String roomName;
		String encodedData;
		String documentVersionStr;
		
		String requestString;
		String fullCorrectionStr;
		String tmpCorrectionStr;
		
		command = request.getParameter(CORRECTOR_COMMAND_PARAM);
		lowerRange = request.getParameter(STARTRANGE_PARAM);
		upperRange = request.getParameter(ENDRANGE_PARAM);
		corrector = request.getParameter(CORRECTOR_PARAM);
		documentVersionStr = request.getParameter(DOCVERSION_PARAM);
		
		tmpStr = request.getParameter(ROOM_PARAM);
		if (tmpStr != null) {
			roomName = tmpStr.toLowerCase();
		} else {
			roomName = "";
		}
		encodedData = encodeURIComponent(request.getParameter(DATA_PARAM));
		
		//---###//---### (DPK - modified Mar 2016) 
		//---### Removed the room name parameter from the corrector command string because
		//---### it appears to be totally unused anywhere.  This reduces the size of the command file.
		//---### requestString = command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "~" + roomName + "\n";
		requestString = command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "\n";

		String acceptFlag = DENY_INDICATOR;

		int start;
		int end;
		int documentVersion = -1;
		int newDocumentVersion = -1;
		byte[] cmdRequestArray;
		int cmdRequestLen;
		
		try {
			documentVersion = Integer.parseInt(documentVersionStr);
			start = Integer.parseInt(lowerRange);
			try {
				end = Integer.parseInt(upperRange);
			} catch (Exception e) {
				end = start;
			}
		
			if ((requestString != null) && (requestString.length() != 0)) {
				cmdRequestArray = requestString.getBytes();
				cmdRequestLen = cmdRequestArray.length;
			
				//returns new document version if OK, otherwise -1
				newDocumentVersion = processCapCorCommand(cmdRequestArray, cmdRequestLen, start, end, documentVersion, false);
				
				if (newDocumentVersion != -1) acceptFlag = ACCEPT_INDICATOR;
				
			} 
			
		} catch (Exception e) {
			//acceptFlag = false;
		}

		//if (acceptFlag == true) {
			//return (ACCEPT_INDICATOR + requestString + DOCVER_RESPONSE + newDocumentVersion);
		//} else {
		//	return (DENY_INDICATOR + requestString + DOCVER_RESPONSE + documentVersion);
		//}
		return assembleResponse(acceptFlag, "", newDocumentVersion) + "," + assembleResponse(command, lowerRange, upperRange);

	}


	/***************************************/
	public int processCapCorCommand(byte[] cmdArray, int cmdArrayLen, int start, int end, int docVer_PrevEndSpan, Boolean captionFlag) {
	
	
		//docVer_PrevEndSpan is a dual use variable that holds either the passed docVersion value from the correction routine, or the previous last span ID from the caption routine
		if (debug) {
			System.err.println("********** start processCapCorCommand () ***************");
			System.err.println("BufferPosition = [" + capcorBufPos + "]   " + "cmdArrayLen=[" + cmdArrayLen + "]   start=[" + start + "]   end=[" + end + "]   docVer_PrevEndSpan=[" + docVer_PrevEndSpan + "]");
			System.err.println("cmdArray=[ " + new String(cmdArray) + "]");
			//System.err.print("docVersionArray=[ ");
			//int tend = (end == -1) ? docVer_PrevEndSpan+4 : end + 4;
			//for (int j = 0; j < tend; j++) {
			//	System.err.println(j + " = " + docVersionArray[j]);
			//}
			//System.err.println("]");
		}
		//just make sure we don't run off end
		if ((start >= docVerArrayCapacity) || (end >= docVerArrayCapacity) || (start < 0) || 
			(captionFlag && (docVer_PrevEndSpan >= docVerArrayCapacity))) {
			
			// TODO: NEED TO DEAL WITH OVERFLOW BETTER LATER ... LIKE START A NEW FILE, OR EXPAND THIS ARRAY

			//error
			System.err.println("Error in bound of docVersionArray in processCapCorCommand");
			return -1;
		}

		int newDocVer = 0;
		
		//do some additonal pre-processing to speedup sychronized portion
		int index = start;
		int recalledSpanId = start;
		boolean cleanupRecalledSpansFlag = false;
		boolean checkForStaleFlag = false;

		if (captionFlag) {
			if (end != -1) recalledSpanId = end + 1;
			//else recalledSpanId = start;
			if (recalledSpanId <= docVer_PrevEndSpan) {
				cleanupRecalledSpansFlag = true;
			}
		} else {
			if (start <= end) {
				checkForStaleFlag = true;
				//index = start;
			}
		}
		//end preprocessing
		
		//************ start of synchronized *************//
		synchronized (this) {
			//check if stale - skip if a caption
//			if (!captionFlag) {
//				while (index <= end) {
//					if (docVer_PrevEndSpan < docVersionArray[index++]) {
//						//command rejected
//						newDocVer = -1;
//						break;  //no need to continue checking further
//					}
//				}
//			}
			if (checkForStaleFlag) {
				do {
					if (docVer_PrevEndSpan < docVersionArray[index++]) {
						//command rejected
						newDocVer = -1;
						break;  //no need to continue checking further
					}
				} while (index <= end);
			}
			//if newDocVer still 0 then command was not rejected, so continue
			if (newDocVer == 0) {
				//append data to capcor buffer
				newDocVer = appendCapcorDataBytes(cmdArray, cmdArrayLen);
				
				//if newDocVer == -1, something was wrong and command rejected when trying to append.
				//otherwise, newDocVer holds value of new document version
				if (newDocVer != -1) {
					//update docVer array
					//if end = -1 (means no "net" captions because recalls equal or outnumber captions
					//     , this for-loop will skip
//					for (i = start; i <= end; i++) {
//						docVersionArray[i] = newDocVer;
//					}
					while (start <= end) {
						docVersionArray[start++] = newDocVer;
					}
					
					//If a caption, we need to do more.  
					//We need to reset to MAX_INT any recalled spans that have not been replaced
//					if (captionFlag) {
//						if (end != -1) start = end + 1;
//						for (i = start; i <= docVer_PrevEndSpan; i++) {
//							docVersionArray[i] = MAX_DOC_VER;
//						}
//					}
					if (cleanupRecalledSpansFlag) {
						do {
							docVersionArray[recalledSpanId++] = MAX_DOC_VER;
						} while  (recalledSpanId <= docVer_PrevEndSpan);
					}
				}
			}
		}
		//************ end of synchronized *************//
		
		if (debug) {
			System.err.println("*******");
			System.err.println("BufferPosition = [" + capcorBufPos + "]");
			System.err.print("docVersionArray=[ ");
			int tend = (end == -1) ? docVer_PrevEndSpan+4 : end + 4;
			for (int j = 0; j < tend; j++) {
				System.err.println(j + " = " + docVersionArray[j]);
			}
			System.err.println("]");
			System.err.println("********************************");
		}

		return newDocVer;
	}

	
	/***************************************/
	public void checkForStuckCaption() {
	
		if (captionsProcessor.flushedFlag == false) {
			Long curTime = new Long(System.currentTimeMillis());
			if ((curTime - flushTimerStart) > FLUSHTIMEOUT) {
				//try to flush.  
				captionsProcessor.flushTokenBuffer();
			}
		}
	}
	
	/***************************************/
	/***************************************/
	/***************************************/
	/***************************************/
	
	public void processCaptions(HttpServletRequest request, HttpServletResponse response) {
	
		if (debug) {
			System.err.println("********** start MeetingRoom.processCaptions() ***************");
			System.err.println("globalSpanID = [" + captionsProcessor.getGlobalSpanID() + "]   " + "globalParagraphID =[" + captionsProcessor.getGlobalParagraphID() + "]");
		}
		String caption = "";
		if (captionHandler != null) {
			captionHandler.handleProcessing(request);
		} else {
			//send to default caption processor.  Straight text
			
			if (debug) {System.err.println("pre-token buffer = [" + captionsProcessor.tokenBuffer + "]");}
			caption = request.getParameter(ADMIN_COMMAND_CAPTION);
			if (debug) {System.err.println("encoded raw caption = [" + captionsProcessor.encodeURIComponent(caption) + "]");}
			
			processCaptionsSub(caption);
		}
	}

			
			
	public void processCaptionsSub(String caption) {
	
		
		/*
		if (caption == null) {
			if (debug) {System.err.println("caption is null");}
		} else if (caption.equals("")) {
			if (debug) {System.err.println("caption is empty");}
		} else {
			int clen = caption.length();
			if (debug) {System.err.println("caption length = [" + clen + "]");}
		}
		*/
		String cmdStr;
		
		if (!caption.equals("")) {
			//reset time stamp
			flushTimerStart = new Long(System.currentTimeMillis());
			if (debug) {System.err.println("flushTimerStart = [" + flushTimerStart + "]");}

			captionsProcessor.processCaptions(caption);
			
			if (debug) {
				System.err.println("command= [" + captionsProcessor.commandBuffer + "]");
				System.err.println("post-token buffer = [" + captionsProcessor.tokenBuffer + "]");
				System.err.println("New globalSpanID = [" + captionsProcessor.getGlobalSpanID() + "]   " + "New globalParagraphID =[" + captionsProcessor.getGlobalParagraphID() + "]");
			}
			cmdStr = captionsProcessor.getCommandBuffer();
			processCaptionsHelper(cmdStr);
			captionsProcessor.clearCommandBuffer();
		} else {
			checkForStuckCaption();
			//If we flushed the token, pass command on
			if (captionsProcessor.flushedFlag == true) {
				if (debug) {System.err.println("FLUSH: command= [" + captionsProcessor.commandBuffer + "]");}
				cmdStr = captionsProcessor.getCommandBuffer();
				processCaptionsHelper(cmdStr);
				captionsProcessor.clearCommandBuffer();
			}
		}
		
		if (debug) {System.err.println("***");}
	}


	/***************************************/
	public void processCaptionsHelper(String appendDataStr) {

		byte[] appendDataArray;
		int appendDataLength;
		int low;
		int high;
		int startSpan;
		
		if ((appendDataStr != null) && (appendDataStr.length() != 0)) {
			appendDataArray = appendDataStr.getBytes();
			appendDataLength = appendDataArray.length;
			
			low = captionsProcessor.getCommandBufferLowRange();
			high = captionsProcessor.getCommandBufferHighRange();
			startSpan = captionsProcessor.getLastValidSpanId();
			
			//if high == -1, we net no captions so no update to docArray for captions, but
			// we may need to reset docVer on recalled spans if a net of recalls
			//low = 
			//high = 
			//startSpan = 
			

			processCapCorCommand(appendDataArray, appendDataLength, low, high, startSpan, true);
		}
	}

	
	
}
