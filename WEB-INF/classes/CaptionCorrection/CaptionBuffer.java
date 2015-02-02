
package CaptionCorrection;
//package capreceiver;
import java.io.*;
import java.util.*;


public class CaptionBuffer {

	private String roomName;
	private BufferElement[] buffer;
	private int current, len, capacity;
	
	
	public CaptionBuffer(int n, String room) {
		buffer =  new BufferElement[n];
		current = -1;
		len = 0;
		capacity = n;
		roomName = room;
	}

	public int getLength () {
		return len;
	}
	
	public String getRoomName() {
		return roomName;
	}
	
	/* The is a circular stack but always accessible to the current top.  So after you push, the top of stack is currently available.
	When you pop, it removes the current and makes the previous item the top and currently available.
	*/


///////////////////////////////////////////////////////
	public void push(String idStr, StringBuffer tokenStr) {
		//update the ptr then put data in
		
		//update stack pointers
		if (len < capacity) len++;
		if (++current >= capacity) {
			//wrap around
			current = 0;
		}

		//put element in 
		if (buffer[current] == null) {
			buffer[current] = new BufferElement(idStr,tokenStr);
		} else {
			buffer[current].token.setLength(0);
			if (tokenStr.length() != 0) {
				buffer[current].token.append(tokenStr);
			}
			buffer[current].id = idStr;
		}
	}
	

	////////////////////////////////////////
	public boolean pop(BufferElement elem) {
		//remove data from stack then update pointers
		boolean returnVal = false;
		
		if ((len > 0) && (elem != null)) {
			elem.id = buffer[current].id;
			elem.token.setLength(0);
			elem.token.append(buffer[current].token);
			//update pointers
			len--;
			if (--current < 0) current = capacity-1;
			returnVal = true;
		}
		return returnVal;
	}

	
/*
	public BufferElement getContentElement() {
		//get content from current
		BufferElement returnVal = null;
		
		if (len > 0) {
			returnVal = buffer[current];
		}
		return returnVal;
	}

	public char getLastCharOfCurrentElement() {
		//get the last char from the current element
		char returnVal = '\0';
		if (len > 0) {
			if (buffer[current].token.length() != 0) {
				returnVal = buffer[current].token.charAt( buffer[current].token.length() -1 );
			}
		}
		return returnVal;
	}

	public void appendChar(char ch) {
		//append the char to the current element.  If no current element, start one
		buffer[current].token.append(ch);
	}

	public String getCurId() {
		//get the ID from current element
		String returnVal = "";
		if (len > 0) {
			returnVal = buffer[current].id;
		}
		return returnVal;
	}

	public void setCurId(String ident) {
		//set the ID from current element
		if (len > 0) {
			buffer[current].id = ident;
		}
	}
	
	public String getCurToken() {
		//get the token of the current element
		String returnVal = "";
		if (len > 0) {
			returnVal = buffer[current].token.toString();
		}
		return returnVal;
	}

	public void setCurToken(String tok) {
		//set the token of the current element
		if (len == 0) len++;
		buffer[current].token.setLength(0);
		buffer[current].token.append(tok);
	}
*/
	/*
	 public static void main(String[] args) {
        // TODO code application logic here
		
		String curCap = "";

        
		CaptionBuffer b = new CaptionBuffer(5,"test1");
		b.push("1","This");
		b.push("2"," is");
		b.push("3"," a");
		b.push("4","   big");
		b.push("5","\ntest");
		b.push("6","\n\n\nto");
		b.push("7"," day.");
		
		
		BufferElement e = new BufferElement();
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
		b.push("8"," and.");
		b.push("9"," night.");
        b.push("10"," but.");
        b.push("11"," not.");
        b.push("12"," a .");
        b.push("13"," thorough.");
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
        if (!b.pop(e)) return;
		System.out.println(b.getLength());
		System.out.println(e.id + "   " + e.token);
		
    }
*/

}
	
	