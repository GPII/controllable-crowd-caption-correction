/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package CaptionCorrection;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.*;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Date;
import org.json.*;
/**
 *
 * @author trace
 */
public class StreamTextProcessor implements Handlers {
	String ROOM_PARAM = "room";

	//HttpServletRequest request;
	String command;
	String baseUrl;
	String event;
	String lastID;
	Integer next;
	String paramStr;
	String paramStrEncoded;
	HttpServletRequest request;
	Timer timer;
	private final String USER_AGENT = "Mozilla/5.0";
	JSONObject jsonObj;
	String captions;

	String tmpStr;
	String roomName;
	MeetingRoom roomHndl;
	Boolean stopStreamFlag = true;
	Boolean inPollRequest = false;

	//RunTask rt;

	StreamTextProcessor() {
		//throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	public void init (HttpServletRequest request) {
		baseUrl = request.getParameter("url");
		event = request.getParameter("event");
		lastID = request.getParameter("last");
	}
	
	public void setMeetingRoom (MeetingRoom mr) {
		roomHndl = mr;
	}
	
	public void start () {
		stopStreamFlag = false;
		inPollRequest = false;
		
		startTimer();
	}
	
	public void startTimer() {
		timer = new Timer();
		MyTask task = new MyTask();
		try {
			timer.schedule(task,5000);
		}
		catch (IllegalStateException e) {
		}
	}

	
	
	public void stop () {
		try {
			//timer.cancel();
			stopStreamFlag = true;
		}
		catch (Exception e) {
		}
	}
		
	private class MyTask extends TimerTask {
		public void run () {
		
			Date now = new Date();
			System.out.println("Time is :" + now);
			
			if (stopStreamFlag == false) {
				if (!inPollRequest) {
					
					getStreamText();
				}
				//reset timer
				startTimer();
				
			} else {
				//return last value
			}
			
		}
	}
	
	public void handleProcessing (HttpServletRequest request)  {
	
		System.err.println("baseUrl: " + baseUrl);
		System.err.println("event: " + event);
		System.err.println("lastID: " + lastID);
		
		command = request.getParameter("cmd");
		if (command.equals("start")) {
			start();
		} else if (command.equals("stop")) {
			stop();
		}
	}
	
	public void getStreamText ()  {
		try {
			inPollRequest = true;
			String url = baseUrl + "?event=" + event + "&last=" + lastID;

			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	 
			// optional default is GET
			con.setRequestMethod("GET");
	 
			//add request header
			con.setRequestProperty("User-Agent", USER_AGENT);
	 
			int responseCode = con.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);

	 
			BufferedReader in = new BufferedReader(
					new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();
	 
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
	 /*
	 		if (responseCode == 200) {
				//print result
				System.out.println(response.toString());
				jsonObj = new JSONObject(response.toString());
				try {
					next = jsonObj.getInt("lastPosition");
					lastID = next;
					JSONArray arr = jsonObj.getJSONArray("i");
					int length = arr.length();
					captions = "";
					if (length != 0) {
						for (int cnt = 0; cnt < length; cnt++) {
							captions += arr.getJSONObject(cnt).getString("d");
						}
						//call processor
						roomHndl.processCaptionsSub(captions);
					}
				}
				catch (Exception e) {
				
				}
					
			}
			inPollRequest = false;
	 */
		}
		catch (Exception e) {
			System.out.println(e);
			inPollRequest = false;
			
		}
		inPollRequest = false;
	
	}
	
	/*
	
	public void getStreamText ()  {
		try {
		paramStr = "event=" + event + "&last=" + lastID;
	
		String url = baseUrl;
		//String url = "https://selfsolve.apple.com/wcResults.do";
		
		URL obj = new URL(url);
		//HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
 
		//add reuqest header
		con.setRequestMethod("POST");
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
 
		//String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";
		String urlParameters = paramStr;
 
		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(urlParameters);
		wr.flush();
		wr.close();
 
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'POST' request to URL : " + url);
		System.out.println("Post parameters : " + urlParameters);
		System.out.println("Response Code : " + responseCode);
 
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
 
		//print result
		System.out.println(response.toString());
		}
		catch (Exception e) {
			System.out.println(e);
		}
	
	
	}
	

	public void getStreamText ()  {
		
		String paramStrEncoded;
		//paramStr = baseURL + "?event=" + event + "&last=" + lastID;
		paramStr = "event=" + event + "&last=" + lastID;
		
		try {
			paramStrEncoded = URLEncoder.encode(paramStr, "UTF-8");

			URL url = new URL(baseUrl);

			URLConnection connection = url.openConnection();
			connection.setDoOutput(true);
			OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());
			out.write(paramStrEncoded);
			out.close();

			BufferedReader in = new BufferedReader(
										new InputStreamReader(
										connection.getInputStream()));
			String decodedString;
			while ((decodedString = in.readLine()) != null) {
				System.out.println(decodedString);
			}
			in.close();
		} catch (Exception e) {
		
		}
		
	}
	
	*/
	
	public StreamTextProcessor(HttpServletRequest request) {
			System.err.println("StreamTextProcessor" );
	}
	
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
}
