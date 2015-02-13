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

	public static boolean debug = true;
	

	/********** CONSTANTS  *******************/
	private static final int CAPCOR_BUFFER_SIZE = 2000000;
	private static final int NUM_CAPTIONS_RECALLABLE = 5000;
	private static final long FLUSHTIMEOUT = 1000;
	
	private static final String CAPTION_COMMAND_PLUS = "C~";
	private static final String CAPTION_RECALL_COMMAND_PLUS = "CR~";
	private static final String CAPTIONER_PARAGRAPH_COMMAND_PLUS = "P~";
	private static final String CAPTIONER_PARAGRAPH_RECALL_COMMAND_PLUS = "PR~";
	private static final String CAPCOR_DATA_INIT_STRING = "\n" + CAPTIONER_PARAGRAPH_COMMAND_PLUS + "P0\n";
	
	String ROOM_PARAM = "roomid";
	String CORRECTOR_COMMAND_PARAM = "command";
	String CORRECTOR_PWD_PARAM = "pwd";
	String CORRECTOR_PARAM = "initials";
	String STARTRANGE_PARAM = "start";
	String ENDRANGE_PARAM = "end";
	String DATA_PARAM = "data";

	private static final String LOCK_COMMAND = "Lock";
	private static final String EDIT_COMMAND = "Edit";
	private static final String CANCELLOCK_COMMAND = "CancelLock";
	private static final String DELETEALL_COMMAND = "DeleteAll";
	
	private static final String COMMA_COMMAND = "Comma";
	private static final String PERIOD_COMMAND = "Period";
	private static final String QUESTION_COMMAND = "Question";
	private static final String CAPITALIZE_COMMAND = "Capitalize";
	private static final String PARAGRAPH_COMMAND = "Paragraph";
	private static final String NEWSPEAKER_COMMAND = "Newspeaker";
	
	private static final String OVERRIDE_COMMAND = "OverrideLock";
	
	String ACCEPT_INDICATOR = "~OK;";
	String DENY_INDICATOR = "~!;1";


	
	/********** ADMINISTRATION  *******************/
	private String meetingRoom;		//meeting room name
	
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
	private int capcorBufPos = 0;  //first empty position in array/number of bytes of data in array
	private int capcorBufCapacity = CAPCOR_BUFFER_SIZE;  //number of bytes allocated for capcorBuf array
	
	private int startSpanID = 0;
	private int startParaID = 0;
	
	private Long flushTimerStart;
	
	public ArrayList<String> lockList;  //start, end, initials
	
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
		lockList = new ArrayList<String>();
		capcorBuf = new byte[capcorBufCapacity];
		
		createPathToFile();
		initCapcorBuf();
		
		//setup caption processor
		captionsProcessor = new CaptionProcessor1(NUM_CAPTIONS_RECALLABLE, meetingRoom);
		captionsProcessor.setGlobalSpanID(startSpanID);
		captionsProcessor.setGlobalParagraphID(startParaID);
		captionsProcessor.setLockList(lockList);
		
		//if new meeting room, initialize data
		try {
			if (capcorFileRW.length() == 0) {
				appendCapcorData(CAPCOR_DATA_INIT_STRING);
			}
		} catch (IOException e) {
				System.err.println("Error in MeetingRoom.init()");
		
		}
	}

	/*c**************************************/
	public void setCaptioner (HttpServletRequest req, Handlers hndlr) {
		captionHandler = hndlr;
		captionHandler.init(req);
		
	}
	
	/***************************************/
	public void setCorrector (Handlers hndlr) {
		correctionHandler = hndlr;
	}
	

	/*c**************************************/
	private void initCapcorBuf() {
	
		if (debug) {System.err.println("Got in MeetingRoom.initCapcorBuf");}
		capcorBufPos = 0;
		//close if open first
		File file = new File(abspath_meetingFile);
		try {
			capcorFileRW = new RandomAccessFile(file, "rws");
			loadCapcorBuffer(0);
			if (debug) {System.err.println("capcorBufPoos = [" + capcorBufPos + "]");}
			updateGlobalIDs();

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
	public void appendCapcorData(String str) {
		
		long offset = 0;
		byte[] tmp;
		if ((str != null) && (str.length() != 0)) {
			tmp = str.getBytes();
			try {
				offset = capcorFileRW.length();
				if ((tmp.length) >= capcorBufCapacity) {
					//can't handle it right now, too big
					if (debug) {System.err.println("New data sent to appendCapcorData() will cause us to exceed capcorBufCapacity!  Current capcorBufPos = [" + capcorBufPos + "]");}
					throw new IOException();
				}
				
				if ((capcorBufPos + tmp.length) >= capcorBufCapacity) {
					//need to deal with this better later...because it will crash things
					if (debug) {System.err.println("New data sent to appendCapcorData() will cause us to exceed capcorBufCapacity!  Current capcorBufPos = [" + capcorBufPos + "]");}
					throw new IOException();
					/*
					//start a new capcor file
					buildFilePaths(++meetingRoomSuffix);
					initCapcorBuf();
					*/
				}

				capcorFileRW.seek(offset);
				capcorFileRW.write(tmp);
				for (int i = 0; i < tmp.length; i++) {
					capcorBuf[(int)(offset) + i] = tmp[i];
				}
				//update position index for our byte array
				capcorBufPos += tmp.length;
				if (debug) {System.err.println("new capcorBufPos = [" + capcorBufPos + "]");}
			
			} catch (IOException e) {
				System.err.println("Exception1 in appendCapcorData()!!!!");
				try {
					capcorFileRW.setLength(offset);
					capcorBufPos = (int) offset;
				} catch (IOException f) {
					System.err.println("Exception2 in appendCapcorData()!!!!");
				}
			}
		}
	}
	
	/***************************************/
	private void updateGlobalIDs() {
		//get last Caption~nnn
		//parse forward for any recalls and decrement
		String tmpStr;
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
			int i = tmpStr.lastIndexOf("\n" + CAPTION_COMMAND_PLUS);
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
			} else {
				if (debug) {System.err.println("No Captions~ found in MeetingRoom.updateGlobalIDs");}
			}
			
			startSpanID = startID;
			if (debug) {System.err.println("startSpanID = [" + startSpanID + "]");}
			
			
			//do same for paragraph marker
			startID = 0;
		
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
			} else {
				if (debug) {System.err.println("No paragraphs~ found in MeetingRoom.updateGlobalIDs");}
			}
		} catch (Exception e) {
			System.err.println("Error in MeetingRoom.updateGlobalIDs");
		}
		startParaID = startID;
		if (debug) {System.err.println("startParaID = [" + startParaID + "]");}

		
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
				appendCapcorData(captionsProcessor.getCommandBuffer());
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

	
	/***************************************/
	private void getDataInfo(HttpServletRequest request, HttpServletResponse response) {
	
		int chunkSize = 10000;
		int end = capcorBufPos;
		response.setContentType("text/html;charset=UTF-8");
		String tmpLast = request.getParameter("last");
		int last;
	
		try {
			last = Integer.parseInt(tmpLast);
		} catch (Exception e) {
			last = 0;
		}
		if (last < 0) {
			//set last to current position
			last = capcorBufPos;
		} else if (last > capcorBufPos) {
			last = capcorBufPos;
		}
		try {
			OutputStream out = response.getOutputStream();

			//out.write("<!DOCTYPE html>".getBytes());
			//out.write("<html>".getBytes());
			//out.write("<head>".getBytes());
			//out.write("<title>Servlet CapReceiver</title>".getBytes());            
			//out.write("</head>".getBytes());
			//out.write("<body>".getBytes());
			//out.write(("<h1>Servlet CapReceiver at " + request.getContextPath() + "</h1>").getBytes());
			
			if ((last + chunkSize) < capcorBufPos) {
				//give only a chunkSize ammout of data
				//need to find break
				String tmpStr = new String(capcorBuf,last+chunkSize, capcorBufPos - (last + chunkSize), "US-ASCII");
				int syncOffset = tmpStr.indexOf("\n");
				if (syncOffset != -1) {
					end = last + chunkSize + syncOffset + 1;  //+1 to include \n
				}
			}
			
			out.write(("~OK;last=" + end + "~").getBytes());
			if (last < end) {
				out.write(capcorBuf, last, end - last);
				if (debug) {System.err.println("last = [" + last + "]  new last = [" + end + "]");}
				if (debug) {
					String tmp = new String(capcorBuf,last, end - last, "US-ASCII");
					if (debug) {System.err.println("chunk written  = [" + tmp + "]");}
				}
				
			}
			//out.write(("\n<h1>Byte Array Position = [" + capcorBufPos + "]</h1>").getBytes());
			//out.write("</body>".getBytes());
			//out.write("</html>".getBytes());
		          
			out.close();
			last = capcorBufPos;
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
				if (corPwd.equals("password123456")) {
				//check in database
				result = true;
			}
		}
		return result;
	}

	/***************************************/
	//no admin commands - no captions-  just normal polling or correction processing
	public void processRequest(HttpServletRequest request, HttpServletResponse response) {
	
		String command;
		String outStr;
		
		//if (debug) {System.err.println("Got in MeetingRoom.processRequest");}
		command = request.getParameter(CORRECTOR_COMMAND_PARAM);
		if (command == null) {
			//no command.  Default to reader
			getDataInfo(request, response);
		} else {
			if (meetingCorrector(request.getParameter(CORRECTOR_PWD_PARAM))) {
				//got password and command....process
				outStr = processCorrection(request, response);
			} else {
				outStr = "\nCommand password not valid for command \"" + command + "\".";
			}
			try {
				response.setContentType("text/html;charset=UTF-8");
				OutputStream out = response.getOutputStream();
				out.write((outStr).getBytes());
				out.close();
			} catch (IOException e) {
				System.err.println("Error in MeetingRoom.processRequest()");
			}
		}
		checkForStuckCaption();
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
		
		String requestString;
		String fullCorrectionStr;
		String tmpCorrectionStr;
		
		command = request.getParameter(CORRECTOR_COMMAND_PARAM);
		lowerRange = request.getParameter(STARTRANGE_PARAM);
		upperRange = request.getParameter(ENDRANGE_PARAM);
		corrector = request.getParameter(CORRECTOR_PARAM);
		
		tmpStr = request.getParameter(ROOM_PARAM);
		if (tmpStr != null) {
			roomName = tmpStr.toLowerCase();
		} else {
			roomName = "";
		}
		encodedData = encodeURIComponent(request.getParameter(DATA_PARAM));
		
		requestString = command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "~" + roomName + "\n";
		fullCorrectionStr = "";
		Boolean acceptFlag = false;

		//try to get run-lock for a period of time
		//if can't get lock, deny request
		//if (!getRunLock() ) {
		//	//deny request
		
	synchronized (this) {
		//got run lock so proceed quickly

		Boolean foundLock = false;
		if ((foundLock = command.equals(LOCK_COMMAND)) || command.equals(COMMA_COMMAND) || command.equals(PERIOD_COMMAND) || command.equals(QUESTION_COMMAND) ||
					command.equals(CAPITALIZE_COMMAND) || command.equals(PARAGRAPH_COMMAND)  ||  command.equals(NEWSPEAKER_COMMAND)) {
			if (lockCollide(lowerRange,upperRange)) {
				//deny request  //default
				//clear correction string //default
			} else {
				//if (command.equals(LOCK_COMMAND)) {
				if (foundLock) {
					//**ADD** to lock list
					lockList.add(lowerRange + "~" + upperRange + "~" + corrector);
				} //else don't
				//add to corrections file
				fullCorrectionStr = command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "\n";
				acceptFlag = true;
			}
		} else if (command.equals(CANCELLOCK_COMMAND) || command.equals(EDIT_COMMAND) || command.equals(DELETEALL_COMMAND)) {
			//Unlock, edit and deleteAll must match range and initials.
			//check for exact matches and remove them
			try {
				for (int i=0; i < lockList.size(); i++) {
					if ( (lockList.get(i)).equals(lowerRange + "~" + upperRange + "~" + corrector) ) {
						lockList.remove(i);
						fullCorrectionStr = command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "\n";
						acceptFlag = true;
						break;  //should only be 1 exact match in the file, else we got other problems
					}
				}
			} catch (Exception e) {
				System.err.println("Error in MeetingRoom.processCorrection()");
			
			}
		} else if (command.equals(OVERRIDE_COMMAND)) { 
				
			//Override - remove any collisions from lock file and send as unlocks.  Also send original command
			//check for collisions and remove them.
			//builds string of unlock commands that need to be added to corrections file
			tmpCorrectionStr = removeCollisions(lowerRange, upperRange, corrector);
			//build full set of correction commands
			fullCorrectionStr = tmpCorrectionStr + command + "~" + lowerRange + "~" + upperRange + "~" + encodedData + "~" + corrector + "\n";
			acceptFlag = true;
		} else {
			//don't know what command it is
		}
		if (fullCorrectionStr != "") {
			appendCapcorData(fullCorrectionStr);
		}
		
		//unlock run lock
	}
		if (acceptFlag) {
			return (ACCEPT_INDICATOR + requestString);
		} else {
			return (DENY_INDICATOR + requestString);
		}


	}
		
	/**************************************************/
	public Boolean lockCollide(String lower, String upper) {
	
		
		Boolean found = false;
		String[] tmpStrArray;
		int iLower = Integer.parseInt(lower);
		int iUpper = Integer.parseInt(upper);
		
		try {
			for (int i=0; i < lockList.size(); i++) {
				tmpStrArray = (lockList.get(i)).split("\\~");
				if ((iLower >= Integer.parseInt(tmpStrArray[0]) && iLower <= Integer.parseInt(tmpStrArray[1])) || 
						(iUpper >= Integer.parseInt(tmpStrArray[0]) && iUpper <= Integer.parseInt(tmpStrArray[1])) || 
						(iLower < Integer.parseInt(tmpStrArray[0]) && iUpper > Integer.parseInt(tmpStrArray[1]))) {
					found = true;
					break;
				}
			}
		} catch (Exception e) {
			System.err.println("Error in MeetingRoom.lockCollide()");

		}
		return found;
	}
		
	/**************************************************/
	public String removeCollisions(String lower, String upper, String corrector) {
	
		Boolean found = false;
		String tmpStr = "";
		String[] tmpStrArray;
		int iLower = Integer.parseInt(lower);
		int iUpper = Integer.parseInt(upper);
		
		try {
			for (int i=0; i < lockList.size(); i++) {
				tmpStrArray = (lockList.get(i)).split("\\~");
				if ((iLower >= Integer.parseInt(tmpStrArray[0]) && iLower <= Integer.parseInt(tmpStrArray[1])) || 
						(iUpper >= Integer.parseInt(tmpStrArray[0]) && iUpper <= Integer.parseInt(tmpStrArray[1])) || 
						(iLower < Integer.parseInt(tmpStrArray[0]) && iUpper > Integer.parseInt(tmpStrArray[1]))) {
					//collision found.  Remove it and send an unlock command with this range and our initials
					lockList.remove(i);
					tmpStr += CANCELLOCK_COMMAND + "~" + tmpStrArray[0] + "~" + tmpStrArray[1] + "~~" + corrector + "\n";
				}
			}
		} catch (Exception e) {
			System.err.println("Error in MeetingRoom.removeCollisions()");
		}
		return tmpStr;
	}
	
	/***************************************/
	public void checkForStuckCaption() {
	
		if (captionsProcessor.flushedFlag == false) {
			Long curTime = new Long(System.currentTimeMillis());
			if ((curTime - flushTimerStart) > FLUSHTIMEOUT) {
				//try to flush.  
				captionsProcessor.flushTokenBuffer();
				//If we flushed the token, pass command on
				if (captionsProcessor.flushedFlag == true) {
					appendCapcorData(captionsProcessor.getCommandBuffer());
					captionsProcessor.clearCommandBuffer();
					if (debug) {System.err.println("***");}
				}
			}
		}
	}
	
	
	/***************************************/
	public void processCaptions(HttpServletRequest request, HttpServletResponse response) {
	
		if (debug) {System.err.println("Got in MeetingRoom.processCaptions");}
		String caption = "";
		if (captionHandler != null) {
			captionHandler.handleProcessing(request);
		} else {
			//send to default caption processor.  Straight text
			
			if (debug) {System.err.println("pre-token buffer = [" + captionsProcessor.tokenBuffer + "]");}
			caption = request.getParameter("caption");
			if (debug) {System.err.println("encoded raw caption = [" + captionsProcessor.encodeURIComponent(caption) + "]");}
			
			if (caption == null) {
				if (debug) {System.err.println("caption is null");}
			} else if (caption.equals("")) {
				if (debug) {System.err.println("caption is empty");}
			} else {
				int clen = caption.length();
				if (debug) {System.err.println("caption length = [" + clen + "]");}
			}
			
			if (!caption.equals("")) {
				//reset time stamp
				flushTimerStart = new Long(System.currentTimeMillis());
				if (debug) {System.err.println("flushTimerStart = [" + flushTimerStart + "]");}

				captionsProcessor.processCaptions(caption);
			} 
			if (debug) {System.err.println("command= [" + captionsProcessor.commandBuffer + "]");}
			if (debug) {System.err.println("post-token buffer = [" + captionsProcessor.tokenBuffer + "]");}

				
			appendCapcorData(captionsProcessor.getCommandBuffer());
			captionsProcessor.clearCommandBuffer();
			if (debug) {System.err.println("***");}

		}
	}
/*	
//////////////////////////////////////////////
	//////////////////////////////////////////////
	public boolean wake() throws IOException {
	
		boolean returnVal = true;
		
		if (_request == null ) {
			if (debug) {System.err.println("request = null");}
			return false;
		}


		ServletContext context = _request.getServletContext();
		AsyncContext async;
		try {
			async = _request.getAsyncContext();
		} catch (IllegalStateException  e) {
			System.err.println("Caught IllegalStateException  in wake : " + e.getMessage());
			System.err.println("Must have refreshed browser.  Should drop down one callback.");
			async = null;
		} catch (Exception e) {
			System.err.println("Caught an error  in wake : " + e.getMessage());
			async = null;
		}
		if (async == null) {
			if (debug) {System.err.println("async was null in wake ");}
			returnVal = false;
		} else if (async.getRequest() != null) {
			//if (debug) {System.err.println("dispatching now");}
			async.dispatch();
			returnVal = true;
		} else {
			if (debug) {System.err.println("we're all done");}
			_request = null;
			async.complete();
			returnVal = false;
		}
		//if (debug) {System.err.println("returning a value of: " + returnVal);}
		return returnVal;
	}
	* */
}
