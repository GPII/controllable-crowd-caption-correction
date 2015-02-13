/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package CaptionCorrection;

import javax.servlet.http.HttpServletRequest;



/**
 *
 * @author trace
 */
public class TraceCaptionProcessor implements Handlers {
	
	HttpServletRequest request;

	TraceCaptionProcessor() {
		//throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}
	
	public void handleProcessing (HttpServletRequest request) {
		
	}
	
	public void init (HttpServletRequest request) {
	}
	
	public TraceCaptionProcessor(HttpServletRequest request) {
			System.err.println("TraceCaptionProcessor" );
	}
	
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
}
