package org.myexp.chakra;

import java.io.*;
import java.net.MalformedURLException;
//import java.net.*;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.CookieManager;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.NicelyResynchronizingAjaxController;
import com.gargoylesoftware.htmlunit.ScriptResult;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlCheckBoxInput;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlImageInput;
import com.gargoylesoftware.htmlunit.html.HtmlLink;
import com.gargoylesoftware.htmlunit.html.HtmlOption;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlSelect;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTable;
import com.gargoylesoftware.htmlunit.html.HtmlTableCell;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;
import com.gargoylesoftware.htmlunit.javascript.background.JavaScriptJobManager;
import com.gargoylesoftware.htmlunit.javascript.host.Event;

public class FacebookLogin {

	public static void main(String[] args) throws IOException, InterruptedException {
		// TODO Auto-generated method stub
		java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(java.util.logging.Level.OFF);
		WebClient webClient = new WebClient(BrowserVersion.CHROME);
		webClient.setAjaxController(new NicelyResynchronizingAjaxController());
		CookieManager cookieMan = new CookieManager();
		cookieMan = webClient.getCookieManager();
		InterceptWebConnection a=new InterceptWebConnection(webClient);
		cookieMan.setCookiesEnabled(true);
		webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
		HtmlPage page = null;
		try {
			page = webClient.getPage("http://www.justdial.com/Chennai/ma-%3Cnear%3E-Villivakkam");

		} catch (FailingHttpStatusCodeException e) {
			// TODO Auto-generated catch block
	
			e.printStackTrace();

		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		} 
		
		System.out.println(page.getTitleText());
		final String pageAsXml = page.asXml();
		System.out.println("Page1=\n" + pageAsXml);         
		String s = "window.scrollBy(0, window.innerHeight);document.documentElement.scrollTop;";
		ScriptResult sr = page.executeJavaScript("window.scrollBy(0, window.innerHeight)");
		JavaScriptJobManager manager = page.getEnclosingWindow().getJobManager();

		while (manager.getJobCount() > 4) {
		    System.out.println("SCript Job count = " + manager.getJobCount());
		    Thread.sleep(1000);
		}
		System.out.println("Result= " + sr.getJavaScriptResult() + "\n");

		HtmlPage page2 = (HtmlPage) sr.getNewPage();
		if(page == page2)
		    System.out.println("No difference");
		else
		    System.out.println("Page2\n" + page2.asXml());
		
		
	

	}
}
