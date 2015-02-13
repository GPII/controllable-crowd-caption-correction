/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package capreceiver;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.*;
import java.util.*;
import CaptionCorrection.CaptionCorrection;

/****************************************************************
 *
 * @author trace
 */
@WebServlet(urlPatterns = {"/CapReceiver", "/capreceiver"})

public class CapReceiver extends HttpServlet {

	//public static boolean debug = false;
	public static CaptionCorrection cccHandler;
  
    public void init() throws ServletException {
		System.err.println("initializing CaptionCorrection Context");

		this.getServletContext().setAttribute("captioncorrection",(Object) new CaptionCorrection());
		cccHandler = (CaptionCorrection) this.getServletContext().getAttribute("captioncorrection");
		/*
		CaptionCorrection ccc = (CaptionCorrection) this.getServletContext().getAttribute("captioncorrection");

		if (ccc == null) {
			System.err.println("We lost the CaptionCorrection handle in testing");
		} else {
				System.err.println("got ccc set in testing");
		}
*/

    }
	   
    
	/****************************************************************
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

		cccHandler.processRequest(request, response);
		/*
		CaptionCorrection ccc = (CaptionCorrection) request.getServletContext().getAttribute("captioncorrection");

		if (ccc == null) {
			System.err.println("We lost the CaptionCorrection handle");
		} else {
			//System.err.println("We got P from context.");
			ccc.processRequest(request, response);
		}
		*/
    }

    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String tmpStr = request.getQueryString();
			processRequest(request, response);
		} catch (IOException e) {
			System.err.println("Exception in doGet: " + e.getMessage());
		} catch (ServletException e) {
			System.err.println("Exception in doGet: " + e.getMessage());
		}
    }

	/****************************************************************
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String tmpStr = request.getQueryString();
			processRequest(request, response);
		} catch (IOException e) {
			System.err.println("Exception in doPost: " + e.getMessage());
		} catch (ServletException e) {
			System.err.println("Exception in doPost: " + e.getMessage());
		}
    }

	/****************************************************************
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }
}
