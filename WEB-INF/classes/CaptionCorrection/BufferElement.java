

package CaptionCorrection;
//package capreceiver;
import java.io.*;
import java.util.*;

public class BufferElement {
	public String id;
	public StringBuffer token;
		
	public BufferElement() {
		id = "";
		token = new StringBuffer();
	}
	
	public BufferElement( String i, String t) {
		id = i;
		token = new StringBuffer(t);
	}

	public BufferElement( String i, StringBuffer t) {
		id = i;
		token = new StringBuffer();
		token.append(t);
	}


	public static void main(String[] args) {
	
		BufferElement b = new BufferElement("1","This");
		System.out.println(b.id);
		System.out.println(b.token);
		
		b = new BufferElement("2"," is");
		System.out.println(b.id);
		System.out.println(b.token);
		
	}

}
	
	