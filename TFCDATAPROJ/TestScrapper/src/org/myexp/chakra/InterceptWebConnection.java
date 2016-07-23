package org.myexp.chakra;

import java.io.*;

import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.util.*;

public class InterceptWebConnection extends FalsifyingWebConnection {
	 public InterceptWebConnection(WebClient webClient) throws IllegalArgumentException{
	        super(webClient);
	    }
	    @Override
	    public WebResponse getResponse(WebRequest request) throws IOException {
	        WebResponse response=super.getResponse(request);
	        System.out.println(response.getWebRequest().getUrl().toString());
	        if(response.getWebRequest().getUrl().toString().endsWith("jquery.min.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        if(response.getWebRequest().getUrl().toString().endsWith("jquery.autocomplete.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        return super.getResponse(request);
	    }
}
