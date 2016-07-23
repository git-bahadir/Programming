package org.justdial.chakra;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.*;

import org.apache.http.conn.ConnectTimeoutException;
import org.util.chakra.*;

public class Component {
	private WebClient webClient;
	private HtmlPage page;
	private InterceptWebConnection a;
	public Component()
	{
		webClient = new WebClient(BrowserVersion.CHROME);
		a=new InterceptWebConnection(webClient);
		webClient.getOptions().setJavaScriptEnabled(true);
		webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		webClient.getOptions().setCssEnabled(false);
		
		java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(java.util.logging.Level.OFF);
		
	}
	public void loadPage(String URL) throws IOException, InterruptedException
	{
		try
		{
			//System.out.println(this.webClient.getCurrentWindow().getInnerHeight());
			this.page = this.webClient.getPage(URL);
			refresh(2);
			//this.webClient.getCurrentWindow().setInnerHeight(6000);
		} catch (FailingHttpStatusCodeException e) {
			// TODO Auto-generated catch block
			System.out.println("Could not load the page " + URL);
			e.printStackTrace();
			throw e;
	
		}catch (ConnectTimeoutException e)
		{
			System.out.println("Could not load the page " + URL + "Retrying");
			Thread.sleep(20*1000);
			this.loadPage(URL);
			
		}catch (UnknownHostException e)
		{
			System.out.println("Could not load the page " + URL + "Retrying");
			Thread.sleep(20*1000);
			this.loadPage(URL);
			
		}catch (SocketTimeoutException e)
		{
			System.out.println("Could not load the page " + URL + "Retrying");
			Thread.sleep(20*1000);
			this.loadPage(URL);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Could not load the page " + URL);
			e.printStackTrace();
			throw e;
	
		} 
		
	}
	private void searchData(String data) throws IOException, InterruptedException
	{
		String URL = "http://www.justdial.com/Chennai/" + data + "-<near>-Villivakkam";
		this.loadPage(URL);
		this.checkPage(data);
	}
	public void forChar(String data) throws IOException, InterruptedException
	{
		int i=0;
		String a[]={"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"};
		for (i=0;i<=25;i++)
		{
			String searchText = data+a[i];
			System.out.println("Searching for String Pattern :" + searchText);
			this.searchData(searchText);
		}
	}
	
	private void checkPage(String data) throws IOException, InterruptedException
	{
		HtmlPage temppage = this.page;
		//System.out.println(page.asXml());
		String path = "//input[@value='" + data + " Near Villivakkam']";
		List<HtmlTextInput> lists = (List<HtmlTextInput>) page.getByXPath(path);
		if (lists.size() == 0)
		{
			//System.out.println(page.asXml());
			System.out.println("No Data found for " + data);
			if ((data.length() > 3) &&(data.toCharArray()[data.length()-1]==data.toCharArray()[data.length()-1]) && (data.toCharArray()[data.length()-1] == data.toCharArray()[data.length()-2]))
			{
				return;
				
			}
			if (data.length() >= 4)
			{
				return;
					
			}
			this.forChar(data);
			return;
		}
		path = "//span[contains(@class, 'jaddt trans')]";
		List<HtmlElement> e1 = (List<HtmlElement>) page.getByXPath(path);
		if (e1.size() > 0)
		{
			System.out.println("Data found for " + data);
			savePage(data);
			return;
		}
		System.out.println("Did not find any match" + data);
		return;
		
		
				
	}
	private void savePage(String data)
	{
		//System.out.println(this.page.asXml());
		try (PrintStream out = new PrintStream(new FileOutputStream("/home/chakra/Programming/tfcdatas/GenHTML/" + data + ".html"))) {
		    out.println(this.page.asXml());
		    out.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private HtmlPage refresh(int i) throws InterruptedException
	{
		int tries=i;
		//System.out.println("refreshing the page");
		HtmlPage temp=(HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();;
		while (tries > 0 ) {
		    tries--;
		    synchronized(temp) {
		        temp.wait(1000);  // How often to check
		    }
		    temp = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
		}
		//System.out.println("refreshing completed");
		page=temp;
		return temp;
	}

}
