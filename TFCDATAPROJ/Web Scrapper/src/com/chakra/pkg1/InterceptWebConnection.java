package com.chakra.pkg1;
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
	        String endstring =  response.getWebRequest().getUrl().toString();
	        System.out.println(endstring);
	        return super.getResponse(request);
	    }
	   
}
