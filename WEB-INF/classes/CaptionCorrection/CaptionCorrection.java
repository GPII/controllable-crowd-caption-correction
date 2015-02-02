/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package CaptionCorrection;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author trace
 */
/**************************************************/
public class CaptionCorrection {

	public static boolean debug = false;
	//public static RunTask runTask = null;

	//private int NUM_CAPTIONS_RECALLABLE = 30;
	private Map<String, MeetingRoom> meetingRooms;
	//private Map<String, Handlers> processors;

	String ADMIN_RESP = "adminrsp";
	String ADMIN_REAS = "adminre";
	String ADMIN_OK = "OK";
	String ADMIN_NOK = "NOK";

	String ADMIN_PARAM = "admincmd";
	String ADMIN_PASSWD_PARAM = "adminpwd";

	String ADMIN_COMMAND_CREATE_PARAM = "create";
	String ADMIN_COMMAND_OPEN_PARAM = "open";
	String ADMIN_COMMAND_CLOSE_PARAM = "close";
	String ADMIN_COMMAND_MOD_PARAM = "mod";
	String ADMIN_COMMAND_CAPTION = "caption";
	String ADMIN_COMMAND_RESET = "reset";
	String ADMIN_COMMAND_MODCAP_PARAM = "modcap";

	String ROOM_PARAM = "room";
	//String COMMAND_PARAM = "command";

	/**************************************************/
	public CaptionCorrection() {
		init();
	}
	
	/**************************************************/
	public void init() {
		meetingRooms = Collections.synchronizedMap(new HashMap<String, MeetingRoom>());
		//runTask = new RunTask();

		/*processors = new HashMap<String, Handlers>();
		Handlers h;
		h =  new StreamTextProcessor();
		processors.put("st", h);
		h =  new TraceCaptionProcessor();
		processors.put("tr", h);
		h =  new CorrectionProcessor1();
		processors.put("cc1", h);
		*/

	}
	
	/**************************************************/
	public Handlers getProcessor(String processorStr) {
	
		Handlers hndlr = null;
		if (processorStr.equals("st")) {
			hndlr = new StreamTextProcessor();
			//runTask.callBack(hndlr);
		} else if (processorStr.equals("tr")) {
			hndlr = new TraceCaptionProcessor();
		}
		return hndlr;
		//return processors.get(processorStr);
	}

	/**************************************************/
	public boolean meetingAdmin(String adminPwd) {
		boolean result = false;
		if (adminPwd != null) {
				if (adminPwd.equals("password1234567890")) {
				//FUTURE: check in database
				result = true;
			}
		}
		return result;
	}
	
	/**************************************************/
	private void openMeetingRoom(HttpServletRequest request, HttpServletResponse response, String roomName) {
	
		String captioner;
		String corrector;
	//open the room back up
		MeetingRoom mr = new MeetingRoom(request,roomName);
		if ((mr == null) || (!mr.roomExists()) ){
			//unable to open meeting room - may not exist- choose new name or join/open existing meeting
			writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" does not exist.  Choose a different room or \\\"" + ADMIN_COMMAND_CREATE_PARAM + "\\\" instead of \\\"" + ADMIN_COMMAND_OPEN_PARAM + "\\\".");
		} else {
			mr.init();
			if ((captioner = request.getParameter("capcode")) != null) {
				mr.setCaptioner(request, getProcessor(captioner));
			} //else use defaults/previous
			if ((corrector = request.getParameter("corcode")) != null) {
				mr.setCorrector(getProcessor(corrector));
			} //else use defaults/previous
			meetingRooms.put(roomName, mr);
			writeToAdmin(request, response, ADMIN_OK, "Room \\\"" + roomName + "\\\" has been opened.");
		}
	}
	
	/**************************************************/
	private void createMeetingRoom(HttpServletRequest request, HttpServletResponse response, String roomName) {
	
		String captioner;
		String corrector;
	//create the room
		MeetingRoom mr = new MeetingRoom(request, roomName);
		if ((mr == null) || (mr.roomExists() )){
			//unable to create meeting room - may already exist- choose new name or join/open existing meeting
			writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" already exists.  Choose a different room or \\\"" + ADMIN_COMMAND_OPEN_PARAM + "\\\" instead of \\\"" + ADMIN_COMMAND_CREATE_PARAM + "\\\".");
		} else {
			mr.init();
			if ((captioner = request.getParameter("capcode")) != null) {
				mr.setCaptioner(request, getProcessor(captioner));
			} //else use defaults
			if ((corrector = request.getParameter("corcode")) != null) {
				mr.setCorrector(getProcessor(corrector));
			} //else use defaults
			meetingRooms.put(roomName, mr);
			writeToAdmin(request, response, ADMIN_OK, "Room \\\"" + roomName + "\\\" has been created and is now open.");
		}
	}
	
	
	
	/**************************************************/
	public synchronized void processRequest(HttpServletRequest request, HttpServletResponse response) {
		//form for creating or modifying a room: admincmd = xxxx command=xxxx roomid=xxxx & adminpwd=xxxx & capcode=xxxx & corcode=xxxx 
		
		String tmpStr;
		String roomName;
		String captioner;
		String corrector;
		String adminCommand;
		
		MeetingRoom roomHndl;
		
//		try {
//			Thread.sleep(50);
//		} catch (InterruptedException e) {
//			System.err.println("Interrupted Exception*********************");
//		}

		
		HttpSession session;
		String sessionId = "";
		long startTime = 0;
		long doneTime = 0;
		long diff = 0;
		
		if (debug) {
			tmpStr = request.getQueryString();
			session = request.getSession(true);  
			sessionId = session.getId(); 
			//Long startTime = new Long(System.currentTimeMillis());
			startTime = System.nanoTime();
			System.err.println("Got in CaptionCorrection.processRequest");
			System.err.println("StartTime [" + startTime + "] in session: " + sessionId);
		}
		
		//Determine what function is coming in.
		tmpStr = request.getParameter(ROOM_PARAM);
		//adminCommand = request.getParameter(ADMIN_PARAM);
		//parse and normalize to make sure valid.  May want to store in database and associate with 
		//software generated file name
		if (tmpStr != null) {
			roomName = tmpStr.toLowerCase();
			//Is there a meeting room open?
			if ((roomHndl = meetingRooms.get(roomName)) != null) {
				//yes, we have an open meeting room
				//see if there is an admin command
				adminCommand = request.getParameter(ADMIN_PARAM);
				if (adminCommand == null) {
					//no admin command.  Default to passing to meeting room
					roomHndl.processRequest(request, response);
				} else if (meetingAdmin(request.getParameter(ADMIN_PASSWD_PARAM))) {
					//check for admin commands
					if (adminCommand.equals(ADMIN_COMMAND_CREATE_PARAM)) {
						writeToAdmin(request, response, ADMIN_OK, "Room " + roomName + " has already been created and is open.");
					} else if (adminCommand.equals(ADMIN_COMMAND_OPEN_PARAM)) {
						writeToAdmin(request, response, ADMIN_OK, "Room " + roomName + " is already open.");
					} else if (adminCommand.equals(ADMIN_COMMAND_CLOSE_PARAM)) {
						//close room
						roomHndl.closeRoom();
						meetingRooms.remove(roomName);
						writeToAdmin(request, response, ADMIN_OK, "Room " + roomName + " has been closed.");
					} else if (adminCommand.equals(ADMIN_COMMAND_RESET)) {
						//MeetingRoom mr = meetingRooms.get(roomName);
						meetingRooms.remove(roomName);
						roomHndl.closeRoom();
						roomHndl.resetRoom();
						createMeetingRoom(request, response, roomName);
					} else if (adminCommand.equals(ADMIN_COMMAND_MOD_PARAM)) {
						//modify setup
						//MeetingRoom mr = meetingRooms.get(roomName);
						if ((captioner = request.getParameter("capcode")) != null) {
							roomHndl.setCaptioner(request, getProcessor(captioner));
						}
						if ((corrector = request.getParameter("corcode")) != null) {
							roomHndl.setCorrector(getProcessor(corrector));
						}
						writeToAdmin(request, response,  ADMIN_OK, "Room " + roomName + " has been modified.");
					} else if (adminCommand.equals(ADMIN_COMMAND_MODCAP_PARAM)) {
						//modify captioner setup
						if (roomHndl.getCaptioner() != null) {
							roomHndl.getCaptioner().handleProcessing(request);
						}
					} else if (adminCommand.equals(ADMIN_COMMAND_CAPTION)) {
						roomHndl.processCaptions(request, response);
					} else {
						writeToAdmin(request, response, ADMIN_NOK, "Administrative Command \\\"" + adminCommand + "\\\" not recognized.");
					}
				} else {
					//check for non-admin commands
					writeToAdmin(request, response, ADMIN_NOK, "Administrative password not valid for command \\\"" + adminCommand + "\\\".");
				}
				
			//meeting room does not exist or not open
			} else if ((adminCommand = request.getParameter(ADMIN_PARAM)) != null) {
				//meeting room does not exist.  If there is an administrative command and credentials, carry out the command
				if (meetingAdmin(request.getParameter(ADMIN_PASSWD_PARAM))) {
					//check for admin commands
					if (adminCommand.equals(ADMIN_COMMAND_CREATE_PARAM)) {
						//create the room
						createMeetingRoom(request, response, roomName);
					} else if (adminCommand.equals(ADMIN_COMMAND_OPEN_PARAM)) {
						//open the room back up
						openMeetingRoom(request, response, roomName);
					} else if (adminCommand.equals(ADMIN_COMMAND_MOD_PARAM)) {
						writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" is not open or does not exist.");
					} else if (adminCommand.equals(ADMIN_COMMAND_CLOSE_PARAM)) {
						writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" is not open or does not exist.");
					} else if (adminCommand.equals(ADMIN_COMMAND_RESET)) {
						writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" must be open to reset it.");
					} else {
						writeToAdmin(request, response, ADMIN_NOK, "Administrative Command \\\"" + adminCommand + "\\\" not recognized or room not open.");
					}
				} else {
					writeToAdmin(request, response, ADMIN_NOK, "Administrative password not valid for command \\\"" + adminCommand + "\\\".");
				}
			} else {
				writeToAdmin(request, response, ADMIN_NOK, "Meeting room \\\"" + roomName + "\\\" is not open or does not exist.");
			}
		} else {
			writeToAdmin(request, response, ADMIN_NOK, "Please specify a meeting room.");
		}
		
		//Long doneTime = new Long(System.currentTimeMillis());
		if (debug) {
			doneTime = System.nanoTime();
			diff = (doneTime - startTime) / 1000;
			System.err.println("Done with CaptionCorrection.processRequest");
			System.err.println("doneTime [" + doneTime + "] in session: " + sessionId);
			System.err.println("elapsed time [" + diff + "]\n\n");
		}

	}

	/***************************************/
	private void writeToAdmin(HttpServletRequest request, HttpServletResponse response, String rsp, String msg) {
	
		if (debug) {System.err.println("writeToAdmin msg: " + msg);}
		//System.err.println("writeToAdmin msg: " + msg);

		response.setContentType("text/html;charset=UTF-8");
		try {
			OutputStream out = response.getOutputStream();
			//out.setBufferSize(); ????
//{\"r\":\"NOK\",\"msg\":\"
			//out.write("<!DOCTYPE html>".getBytes());
			//out.write("<html>".getBytes());
			//out.write("<head>".getBytes());
			//out.write("<title>Servlet CaptionCorrection</title>".getBytes());            
			//out.write("</head>".getBytes());
			//out.write("<body>".getBytes());
			//out.write(("<h1>Servlet CaptionCorrection at " + request.getContextPath() + "</h1>").getBytes());
			out.write(("{\"" + ADMIN_RESP + "\":\"" + rsp + "\",\"" + ADMIN_REAS + "\":\"" + msg + "\"}").getBytes());
			//out.write(msg.getBytes());
			//out.write("</body>".getBytes());
			//out.write("</html>".getBytes());
		          
			out.close();
		} catch (IOException e) {
				System.err.println("writeToAdmin error");
		}
	}
	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		// TODO code application logic here
		CaptionCorrection cc = new CaptionCorrection();
		cc.init();
	}
}
