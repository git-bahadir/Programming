package com.chakra.pkg1;

import java.io.IOException;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.CookieManager;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


public class WebScrapper {

	private WebClient webClient;
	private CookieManager cookieMan;
	public HtmlPage page;
	private InterceptWebConnection a;
	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		WebScrapper wb1 = new WebScrapper("https://highlanderlink.ucr.edu/organizations");
		//System.out.println(wb1.page.asXml());

	}
	public WebScrapper(String link) throws InterruptedException
	{
		webClient = new WebClient(BrowserVersion.FIREFOX_31);
		/*turn on the cookies*/
		cookieMan = new CookieManager();
		cookieMan.setCookiesEnabled(true);
		//a=new InterceptWebConnection(webClient);
		//webClient.getOptions().setCssEnabled(false);
		//webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
		//webClient.getOptions().setThrowExceptionOnScriptError(false);
		webClient.getOptions().setJavaScriptEnabled(true);
		java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(java.util.logging.Level.OFF);
		try {
			this.loadPage(link);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.print("Webapp couldn't be initialized");
		}
		List<HtmlAnchor> links = ((List<HtmlAnchor>) page.getByXPath("//div[@id='results']/div/h5/a"));
		for (HtmlAnchor link1:links)
		{
			System.out.println(link1.asText());
			try {
				HtmlPage tpage  = link1.click();
				List<HtmlAnchor> abouts = ((List<HtmlAnchor>) tpage.getByXPath("//div[@class='col-xs-12 col-sm-7']/a"));
				refresh(2);
				if (abouts.size() == 1)
				{
					tpage = abouts.get(0).click();
					refresh(2);
					List<HtmlElement> el1 = ((List<HtmlElement>) tpage.getByXPath("//div[@class='col-xs-12 col-sm-4']"));
					for (HtmlElement e : el1)
					{
						System.out.println(e.asText());
						System.out.println("");
					}
				}
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	public void loadPage(String URL) throws IOException, InterruptedException
	{
		try
		{
			this.page = this.webClient.getPage(URL);
			refresh(1);
		}
		catch (FailingHttpStatusCodeException e) {
			// TODO Auto-generated catch block
			System.out.println("Could not load the page " + URL);
			e.printStackTrace();
			throw e;

		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Could not load the page " + URL);
			e.printStackTrace();
			throw e;

		}
	}
	private HtmlPage refresh(int i) throws InterruptedException
	{
		//System.out.println("refreshing the page");
		HtmlPage temp=(HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();;
		while (i > 0 ) {
		    i--;
		    synchronized(temp) {
		        temp.wait(1000);  // How often to check
		    }
		    temp = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
		}
		//System.out.println("refreshing completed");
		page=(HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();;
		return temp;
	}

}
