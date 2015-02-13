/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package CaptionCorrection;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.*;

/**
 *
 * @author trace
 */
public class StreamTextProcessor implements Handlers {

	//HttpServletRequest request;
	String command;
	String baseUrl;
	String event;
	String lastID;
	String paramStr;
	String paramStrEncoded;
	HttpServletRequest request;

	StreamTextProcessor() {
		//throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	public void init (HttpServletRequest request) {

		baseUrl = request.getParameter("url");
		event = request.getParameter("event");
		lastID = request.getParameter("last");
		
	}
		
	public void handleProcessing (HttpServletRequest request)  {
	
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
	
	public StreamTextProcessor(HttpServletRequest request) {
			System.err.println("StreamTextProcessor" );
	}
	
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
}
