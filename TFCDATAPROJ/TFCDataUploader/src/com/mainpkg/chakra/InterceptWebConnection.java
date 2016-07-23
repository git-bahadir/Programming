package com.mainpkg.chakra;

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
	        /* for (NameValuePair header : response.getResponseHeaders()) {
	            System.out.println(header.getName() + " : " + header.getValue());
	        }*/
	        String endstring =  response.getWebRequest().getUrl().toString();

	       /* if(endstring.endsWith("chrome.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        if(endstring.endsWith("embed-player.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        if(endstring.endsWith("cal2.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        if(endstring.endsWith("cal_conf22.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        if(endstring.endsWith("query.date_input.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }
	        /*if(response.getWebRequest().getUrl().toString().endsWith("jquery.autocomplete.js")){
	            return createWebResponse(response.getWebRequest(), "", "application/javascript", 200, "Ok");
	        }*/
	        System.out.println(endstring);
	        return super.getResponse(request);
	    }
}