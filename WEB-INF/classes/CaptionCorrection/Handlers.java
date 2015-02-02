package CaptionCorrection;

import javax.servlet.http.HttpServletRequest;


/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author trace
 */
public interface Handlers {
	
		void handleProcessing(HttpServletRequest request);
		void init (HttpServletRequest request);
		public void setMeetingRoom (MeetingRoom mr);
}
