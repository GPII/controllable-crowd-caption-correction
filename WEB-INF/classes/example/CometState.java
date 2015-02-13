package example;

import java.io.*;
import java.util.Scanner;
import java.nio.file.Files;
/*import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
*/
import java.net.URLEncoder;

import javax.servlet.*;
import com.caucho.servlet.comet.*;

public class CometState {

	private static final boolean debug = true;

	private ServletRequest _request;
	private String relpath_CaptionsFile;
	private String relpath_CorrectionsFile;
	private String abspath_CaptionsFile;
	private String abspath_CorrectionsFile;
	
	private StringBuffer captionsBuffer;
	//private String _captionsBuffer;
	//private String _tmpCaptionsBuffer;
	
	private String _correctionsBuffer;
	private int CurrentSpanID;
	private int wordCount;
	//private boolean _initialRead;
	private int cnt = 1;
	
	private long captionFileStart;
	private long captionFilePrevLength;
	private int scriptCount;
	
	//thing to keep track of 
	//length of caption file at last read
	//index into character buffer of processed chars read in from file

	public CometState(ServletRequest request) {

		if (debug) {System.err.println("Start CometState contructor");}

		_request = request;
		wordCount = 0;
		//_initialRead = false;
		//_tmpCaptionsBuffer = "";
		//_captionsBuffer = "";
		_correctionsBuffer = "";
		CurrentSpanID = 0;
		captionFileStart = 0;
		captionFilePrevLength = 0;
//		scriptCount = 0;
	}

	public void setAbsCaptionFilePath(String tmpStr) {
		abspath_CaptionsFile = tmpStr;
	}
	
	public void setAbsCorrectionFilePath(String tmpStr) {
		abspath_CorrectionsFile = tmpStr;
	}
	
	public void setCaptionFilePath(String tmpStr) {
		relpath_CaptionsFile = tmpStr;
	}
	
	public void setCorrectionFilePath(String tmpStr) {
		relpath_CorrectionsFile = tmpStr;
	}
	
//	public String getCaptionBuffer() {
//		return _captionsBuffer;
//	}

	public String getEncodedCaptionData() {
		return encodeURIComponent(captionsBuffer.toString());
	}
	
	public int getCaptionBufferCount() {
		return wordCount;
	}
	
	public void setSpanID(int tmpInt) {
		CurrentSpanID = tmpInt;
	}

//	public int getCaptionBufferCount() {
//		return _initialCount;
//		

	public long fileLength(String filename) {
//			abspath_CaptionsFile = abspath_CorrectionsFile = context.getRealPath("");  
//			abspath_CaptionsFile += relpath_CaptionsFile;
		File tmpFile = new File (filename);
		return tmpFile.length();
	}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public int getWordCount(StringBuffer strBuf) {

		String str = strBuf.toString();
		int returnVal;
		//get count of number of words
		//StringBuffer buf = new StringBuffer(str);
		//System.err.println("Before replace: " + encodeURIComponent(str));
//		str = str.replaceAll("\\r?\\n", " ");
//		str = str.replaceAll(System.getProperty("line.separator"), " ");
		str = str.replaceAll("\\r?\\n", " ").replaceAll("\\s+", " ").trim();
		//System.err.println("After replace: " + encodeURIComponent(str));
		
		if (str.length() == 0) {
			returnVal = 0;
		} else {
			String s[] = str.split(" ");

		/*	if (debug) {
				for (int i = 0; i < s.length; i++) {
					System.err.println("s[" + i + "]= [" + s[i] + "]");
				}
			}*/
			returnVal = s.length;
		}
		return returnVal;
	}
	
//////////////////////////////////////////////
//////////////////////////////////////////////
	public char normalizeChars(int c) {
	
		char ch = (char) c;
		char returnVal = 0;
	

		if (ch == ' ') {
			returnVal = ' ';
		} else if (ch == '\n') {
			returnVal = '\n';
		} else if (ch == '\r') {
			returnVal = ' ';
		} else if (ch == '\t') {
			returnVal = ' ';
		} else if (ch == '\b') {
			returnVal = ' ';
		} else if (ch == '\f') {
			returnVal = ' ';
		} else {
			returnVal = ch;
		}
		

		return returnVal;

}

//////////////////////////////////////////////
//////////////////////////////////////////////
	public boolean isDelim(char ch) {
		boolean returnVal = false;
		if ((ch == ' ') || (ch == '\n')) returnVal = true;

		return returnVal;
}

		

//////////////////////////////////////////////
//////////////////////////////////////////////
	public StringBuffer readFile(BufferedReader br) {
	

			StringBuffer debBuf = new StringBuffer();

		StringBuffer tmpBuf = new StringBuffer();
		int rawCharCnt = 0;		//count of chars read in from file
		int rawLastDelim = 0;		//index of last delim read in
		char lastChar = 0;
		char thisChar = 0;
		int processedLastDelim = 0;		//position in buffer of last delim

		int ch = 0;
		try {
			br.skip(captionFileStart);
			while ((ch = br.read()) != -1) {
				if (debug) {debBuf.append((char) ch);}
				
				rawCharCnt++;
				//if whitespace, convert to space or newline
				thisChar = normalizeChars(ch);
				if (isDelim(thisChar)) {
					rawLastDelim = rawCharCnt;
					if ((thisChar == ' ') && (isDelim(lastChar))) {
						//ignore
					} else if ((lastChar == ' ') && (thisChar == '\n')) {
						//replace
						tmpBuf.setCharAt(tmpBuf.length()-1,thisChar);
						lastChar = thisChar;
					} else {
						tmpBuf.append(thisChar);
						lastChar = thisChar;
						processedLastDelim = tmpBuf.length();
					}
				} else {
					tmpBuf.append(thisChar);
					lastChar = thisChar;
				}
			}
		} catch (Exception e) {
			System.err.println("Error reading file: " + e.getMessage());
			e.printStackTrace();
			rawLastDelim = 0;
			processedLastDelim = 0;
			tmpBuf.setLength(0);
		}
		
		// rawLastDelim holds position of last delimiter in file
		// tmpBuf holds all the chars from captionFileStart+1 to end
		// cnt holds number of chars read
		
		tmpBuf.setLength(processedLastDelim);
		captionFileStart += rawLastDelim;
		
		//if (debug) {System.err.println("Full text read in: " + encodeURIComponent(debBuf.toString()));}
		
		wordCount = getWordCount(tmpBuf);
		

        return tmpBuf;
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
	// returns count of words read.  -1 if error
	//look at StringBuilder class
	//////////////////////////////////////////////
	//////////////////////////////////////////////////////
	public int readInCaptionDataToTmpBuf() throws IOException {
	
		BufferedReader reader = null;
		//String text = "";
		//StringBuffer text = new StringBuffer("");
		//StringBuffer text;
		//_tmpCaptionsBuffer = "";


		if (debug) {System.err.println("readInCaptionDataToTmpBuf");}
		ServletContext context = _request.getServletContext();
		//now read in caption file into our buffer and count words    note: must use relative path
		//InputStream is = context.getResourceAsStream(relpath_CaptionsFile);  //relative
//		if (is != null) {
		if (debug) {System.err.println("Caption file InputStream is is OK: "+relpath_CaptionsFile);}
		//if (debug) {System.err.println("captionFileStart before =[" + captionFileStart + "]");}
		
		int returnVal = 0;
		try {
			reader = new BufferedReader(new InputStreamReader(context.getResourceAsStream(relpath_CaptionsFile)));
			captionsBuffer = readFile(reader);
		} catch (Exception e) {
			System.err.println("Failed to read data from file. " + e.getMessage());
			returnVal = -1;
		} finally {
			if (reader != null) {
				reader.close();
			}
		}
		
		//if (debug) {System.err.println("captionFileStart after =[" + captionFileStart + "]");}
		//if (debug) {System.err.println("processed text read in: " + getEncodedCaptionData());}

		//if (returnVal != -1) {
		//	returnVal = getWordCount(captionsBuffer);
		//	if (debug) {System.err.println("wordCnt =[" + returnVal + "]");}
		//}
		return returnVal;
	}


	//////////////////////////////////////////////
	//////////////////////////////////////////////
	public boolean loadCaptionBuffer() throws IOException {
	
		long tmpLen = 0;
		boolean returnVal = false;
		
		//read in captions file
		tmpLen = fileLength(abspath_CaptionsFile);
		
		//see if file size changed - meaning new data to process
		if (tmpLen > captionFilePrevLength) {
			if (debug) {System.err.println("File size changed by [" + (tmpLen - captionFilePrevLength) + "]" );}
			if (readInCaptionDataToTmpBuf() == -1) {
				returnVal = false;
			} else {
				captionFilePrevLength = tmpLen;
				if (debug) {System.err.println("Captions file current length: " + captionFilePrevLength);}
				returnVal = true;
			}
		}
		return returnVal;
	}


	//////////////////////////////////////////////
	//////////////////////////////////////////////
	public boolean isClosed() {
		return _request == null;
	}

	//////////////////////////////////////////////
	//////////////////////////////////////////////
	public boolean wake(TimerService ts) throws IOException {
	
		boolean returnVal = true;
		String newCorrections = "";
		String tmpStr="";

		//if (debug) {System.err.println("Pass number: " + cnt++);}
		if (_request == null ) {
			if (debug) {System.err.println("request = null");}
			return false;
		}


		ServletContext context = _request.getServletContext();
		InputStreamReader isr;
		BufferedReader reader;
		InputStream is;
		
		//read in corrections file
		is = context.getResourceAsStream(relpath_CorrectionsFile);
		if (is != null) {
			isr = new InputStreamReader(is);
			reader = new BufferedReader(isr);
			while ((tmpStr = reader.readLine()) != null) {newCorrections+=tmpStr;}
		}

		//read in captions file
		if (loadCaptionBuffer()) {
			//pass the starting ID along with all the text
			_request.setAttribute("captions.idCode", new Integer(CurrentSpanID));
			_request.setAttribute("captions.dataValue", getEncodedCaptionData());  
			
			//update the ID value
			CurrentSpanID += wordCount;

		} else {
			//if (debug) {System.err.println("No Caption Changes");}
		}

		//
		// see if any change in corrections content
		if (!_correctionsBuffer.equals(newCorrections)) {
			//something changed.  get the changes
			//if (debug) {System.err.println("newCorrections=[" + newCorrections + "]\n");}
			//if (debug) {System.err.println("CorrectionsBuffer=[" + _correctionsBuffer + "]\n");}
			tmpStr = newCorrections.replace(_correctionsBuffer, "");
			//vaienviar = vaienviar.replace("'","T");
			//vaienviar = vaienviar.replace("''","T");
			_correctionsBuffer = newCorrections;
			//// remove any pesky characters
			//tmpStr=tmpStr.replace("'","%27");

			//if (debug) {System.err.println("New corrections: " + tmpStr);}
			_request.setAttribute("corrections.idCode", new Integer(-1));
			_request.setAttribute("corrections.dataValue", tmpStr);            
//			async.dispatch();
//			if (debug) {System.err.println();}
//			returnVal = true;
		} else {
			//if (debug) {System.err.println("No Correction Changes");}
		}

//		if (returnVal == true) {
//			//setup for next time
//			async.dispatch();
//			if (debug) {System.err.println();}
//		} else {
//			_request.setAttribute("comet.dataValue", null);
//			_request.setAttribute("comet.idCode", null);

		/////////////////////////////////
		//test for accessing this var
		_request.setAttribute("counterInstance", ts);
		///////////////////////////////
		
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
}

