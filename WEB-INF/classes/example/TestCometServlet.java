package example;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;

import javax.servlet.*;
import javax.servlet.http.*;

import javax.inject.Inject;

import com.caucho.servlet.comet.*;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestCometServlet extends GenericServlet 
{

	private static final boolean debug = false;


	@Inject
	private TimerService _timerService;

	private ArrayList<CometState> _itemList = new ArrayList<CometState>();

	@Override
	public void service(ServletRequest request, ServletResponse response) throws IOException, ServletException
	{
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;

//		AsyncContext async = request.getAsyncContext();
//		if (async != null) {
//			resume(request, response, async);
//			return;
//		}

		if (req.getAttribute("comet") != null) {
			//if (debug) {System.err.println("Going right to resume");}
			try {
				if (debug) {System.err.println("Going to resume from service");}
				resume(request, response, req.getAsyncContext());
//				resume(request, response);
			} catch (IOException e) {
				System.err.println("Caught IOException in service: " + e.getMessage());
			} catch (ServletException e) {
				System.err.println("Caught ServletException in service: " + e.getMessage());
			} catch (IllegalStateException  e) {
				System.err.println("Caught IllegalStateException  in service: " + e.getMessage());
			}
			if (debug) {System.err.println("Came back from resume in service");}
			//return;
		} else {


			if (debug) {System.err.println("Initializing stuff");}
			req.setAttribute("comet", new Boolean(true));
			req.setAttribute("pass1Caption.idCode", new Boolean(true));
			req.setAttribute("pass1Caption.dataValue", new String(""));    
			req.setAttribute("captions.idCode", new Integer (-99));
			req.setAttribute("captions.dataValue", new String(""));    
			req.setAttribute("corrections.idCode", new Integer (-99));
			req.setAttribute("corrections.dataValue", new String("")); 
			req.setAttribute("scriptCounter",new Integer(0));
			req.setAttribute("previousTime",new Long(0));
			req.setAttribute("originalTime",new Long(System.currentTimeMillis()));
			
			/*Integer counter = (Integer) req.getAttribute("scriptCounter");
			if (debug) {System.err.println("current = :" + System.currentTimeMillis());}
			Long start = (Long) System.currentTimeMillis();
			if (debug) {System.err.println("start = :" + start);}
			Long end = (Long) req.getAttribute("previousTime");
			if (debug) {System.err.println("end = :" + end);}
			if (true) {
				req.setAttribute("previousTime",end);
				Long tmp = (Long) req.getAttribute("originalTime");
				if (debug) {System.err.println("originalTime = :" + tmp);}
				Long diff = end - (Long) req.getAttribute("originalTime");
				System.err.println("<div id='js" + counter + "'>");
				System.err.println("<script type='text/javascript'>");
				if (debug) {System.err.println("hbCheck(" + diff.toString() + ");");}
				System.err.println("hbCheck(" + diff.toString() + ");");
				System.err.println("</script></div>");
				//req.setAttribute("scriptCounter",++counter);
				
			}
			Integer counter = (Integer) req.getAttribute("scriptCounter");
			if (debug) {System.err.println("current = :" + System.currentTimeMillis());}
			Long start = new Long(System.currentTimeMillis());
			if (debug) {System.err.println("start = :" + start);}
			Long end = (Long) req.getAttribute("previousTime");
			if (debug) {System.err.println("end = :" + end);}
			
			if (true) {
				req.setAttribute("previousTime",end);
				Long tmp = (Long) req.getAttribute("originalTime");
				if (debug) {System.err.println("originalTime = :" + tmp);}
				Long diff = end - (Long) req.getAttribute("originalTime");
				System.err.println("<div id='js" + counter + "'>");
				System.err.println("<script type='text/javascript'>");
				if (debug) {System.err.println("hbCheck(" + diff.toString() + ");");}
				System.err.println("hbCheck(" + diff.toString() + ");");
				System.err.println("</script></div>");
				//req.setAttribute("scriptCounter",++counter);
				
			}
		*/
		
			
			PrintWriter out = res.getWriter();
			res.setHeader("Cache-Control", "no-cache, must-revalidate");
			res.setHeader("Expires", "Mon, 27 Jul 1997 05:00:00 GMT");

			res.setContentType("text/html");

			out.println("<html><body>");

			// Padding needed because Safari needs at least 1k data before
			// it will start progressive rendering.
			//for (int i = 0; i < 100; i++) {out.println("<span id='junk" + i + "'> </span>");}
			out.println("<span id='nulSpans'>");
			for (int i = 0; i < 100; i++) {out.println("<span></span>");}
			out.println("</span>");
			//setup paths and filenames
			
			//get room id
			String roomID = request.getParameter("id");

			//get the context of our request  
			ServletContext context = request.getServletContext();

			//get date in the format we want
			Format formatter = new SimpleDateFormat("MM_dd_yyyy");
			Date date = new Date();
			//String currentDate = formatter.format(date);
			String currentDate = "d";
			
			//build the working paths  (watch out for direction of slashes.  Different systems use different slash/backslashes)
			String tmpPath = "WEB-INF" + File.separator + "caption_texts" + File.separator;

			// build relative paths to files
			String relpath_CaptionsFile = tmpPath + currentDate + "_" + roomID + ".txt";
			String relpath_CorrectionsFile = tmpPath + currentDate + "_" + roomID + "_fix.txt";

//			//build absolute paths - start with path to context - including trailing slash  eg /var/resin/webapps/ROOT/
			String abspath_CaptionsFile = context.getRealPath("");  
			String abspath_CorrectionsFile = context.getRealPath("");  

			if (debug) {System.err.println("getRealPath_CaptionsFile: "+abspath_CaptionsFile);}
			if (debug) {System.err.println("getRealPath_CorrectionsFile: "+abspath_CorrectionsFile);}

			abspath_CaptionsFile += relpath_CaptionsFile;
			abspath_CorrectionsFile += relpath_CorrectionsFile;
			if (debug) {System.err.println("relpath_CaptionsFile: "+relpath_CaptionsFile);}
			if (debug) {System.err.println("relpath_CorrectionsFile: "+relpath_CorrectionsFile);}

			if (debug) {System.err.println("abspath_CaptionsFile: "+abspath_CaptionsFile);}
			if (debug) {System.err.println("abspath_CorrectionsFile: "+abspath_CorrectionsFile);}

			//AsyncContext async = request.startAsync();
			AsyncContext async = req.startAsync();
			CometState state = new CometState(req);
			state.setCaptionFilePath(relpath_CaptionsFile);
			state.setCorrectionFilePath(relpath_CorrectionsFile);
			state.setAbsCaptionFilePath(abspath_CaptionsFile);
			state.setAbsCorrectionFilePath(abspath_CorrectionsFile);

			//set up commet server handler to call comet_update() function
			out.println("<div id='js'><script type='text/javascript'>");
			out.println("var comet_update = window.parent.comet_update;");
			out.println("var hbCheck = window.parent.hbCheck;");
			out.println("var processPreviousCaptions = window.parent.processPreviousCaptions;");
			out.println("</script></div>");
			boolean buffersLoaded;
			try {
				buffersLoaded = state.loadCaptionBuffer();
			} catch (IOException e) {
				buffersLoaded = false;
			}
			if (!buffersLoaded) {
				out.println("<script type='text/javascript'>");
				out.println("comet_update( 5, 'Failed_to_find_caption_files')");
				out.println("</script>");
				
				async.complete();
			} else {
				//send initial data to client
				out.print("<div id='js0'><script type='text/javascript'>");
				//out.println("readingPreviousCaptions = true;");
				//out.println("prevDataRaw = '" + state.getCaptionBuffer() + "';");
				//out.println("prevDataRawCount = " + state.getCaptionBufferCount() + ";");
				out.print("processPreviousCaptions('js0', " + state.getCaptionBufferCount() + ", '" + state.getEncodedCaptionData() + "');");
				out.println("</script></div>");
				req.setAttribute("scriptCounter",new Integer(1));
				state.setSpanID(state.getCaptionBufferCount());
				// Add the comet state to the controller
				_timerService.addCometState(state);
				if (debug) {System.err.println("Registered CometState with timerService");}
			}
		}
	}

//*****************************************************************
//*****************************************************************
//*****************************************************************
/*	private void resume(ServletRequest request,
                      ServletResponse response,
                      AsyncContext async)
*/
	private void resume(ServletRequest request,
                      ServletResponse response,
                      AsyncContext async)
    throws IOException, ServletException
		{
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;

		if (debug) {System.err.println("resume running");} 
		PrintWriter out;
		try {
			out = res.getWriter();
		} catch (UnsupportedEncodingException  e) {
			System.err.println("Caught an UnsupportedEncodingException  error on getWriter in resume : " + e.getMessage());
			return;
		} catch (IllegalStateException  e) {
			System.err.println("Caught an IllegalStateException error on getWriter in resume : " + e.getMessage());
			return;
		} catch (IOException e) {
			System.err.println("Caught an IOException error on getWriter in resume : " + e.getMessage());
			return;
		}
		////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
		//TimerService objectPtr = (TimerService)req.getAttribute("counterInstance");
		//System.err.println("testCounter: " + objectPtr.getTestCounter());
		
//////////////////////////////////////

		Integer counter = (Integer) req.getAttribute("scriptCounter");
		//out.println("");  //need this here to cause error-out if client no longer there
		Long end = new Long(System.currentTimeMillis());
		if (debug) {System.err.println("       end = :" + end);}
		Long start = (Long) req.getAttribute("previousTime");
		if (debug) {System.err.println("     start = :" + start);}
		if (debug) {System.err.println("difference = :" + (end - start));}
		if ((end - start) > 11000) {
			req.setAttribute("previousTime",end);
			Long tmp = (Long) req.getAttribute("originalTime");
			if (debug) {System.err.println("originalTime = :" + tmp);}
			Long diff = end - (Long) req.getAttribute("originalTime");
			out.print("<div id='HB" + counter + "'>");
			out.println("<script type='text/javascript'>");
			if (debug) {System.err.println("hbCheck(" + diff + ");");}
			out.println("hbCheck('HB" + counter + "', " + diff + ");");
			out.println("</script></div>");
			req.setAttribute("scriptCounter",++counter);
			if (out.checkError()) {
				if (debug) {System.err.println("error writing to client: ");} 
			}
		}

		//get captions
		Integer idCode = (Integer) req.getAttribute("captions.idCode");
		String dataValue = (String) req.getAttribute("captions.dataValue");
		String tempS;

		if (idCode != -99) {
			if (debug) {System.err.println("idCode captions not equal to  -99");}
			out.print("<div id='js" + counter + "'>");
			out.print("<script type='text/javascript'>");
			tempS = "comet_update('js" + counter + "', " + idCode + ", '" + dataValue+ "');";
			if (debug) {System.err.println("data being written to comet" + tempS);}
			out.print(tempS);
			out.println("</script></div>");
			req.setAttribute("scriptCounter",++counter);
			//out.flush();
			if (out.checkError()) {
				if (debug) {System.err.println("error writing to client: ");} 
			}
			idCode = -99;
			dataValue = "";
			req.setAttribute("captions.idCode", idCode);
			req.setAttribute("captions.dataValue", dataValue);
			if (debug) {System.err.println("done with captions and idCode = -99");}
		}
		
		//get corrections
		if (debug) {System.err.println("resume checking corrections");}  
		idCode = (Integer) req.getAttribute("corrections.idCode");
		dataValue = (String) req.getAttribute("corrections.dataValue");
		if (idCode != -99) {
			if (debug) {System.err.println("idCode corrections not equal to  -99");}
			out.print("<div id='js" + counter + "'>");
			out.print("<script type='text/javascript'>");
			tempS = "comet_update('js" + counter + "', " + idCode + ", '" + dataValue+ "');";
			out.println(tempS);
			if (debug) {System.err.println("data being written to comet" + tempS);}
			out.println("</script></div>");
			req.setAttribute("scriptCounter",++counter);
			//out.flush();
			if (out.checkError()) {
				if (debug) {System.err.println("error writing to client: ");} 
			}
			idCode = -99;
			dataValue = "";
			req.setAttribute("corrections.idCode", idCode);
			req.setAttribute("corrections.dataValue", dataValue);    
			if (debug) {System.err.println("done with corrections and idCode = -99");}
		}
		//if (debug) {System.err.println("calling startasync");}  
		try {
				req.startAsync();
			} catch (IllegalStateException  e) {
				System.err.println("Caught IllegalStateException in resume : " + e.getMessage());
			} catch (Exception e) {
				System.err.println("Caught an error  in resume : " + e.getMessage());
			}
		if (debug) {System.err.println("done calling startasync and leaving resume");}  
	}
}

