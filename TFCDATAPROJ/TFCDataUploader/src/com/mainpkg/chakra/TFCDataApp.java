package com.mainpkg.chakra;

import java.io.*;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Iterator;
//import java.net.*;
import java.util.List;

import org.tfcdata.bcard.BcardInterface;
import org.tfcdata.bcard.HOP;

import com.mainpkg.chakra.InterceptWebConnection;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.CookieManager;
import com.gargoylesoftware.htmlunit.ElementNotFoundException;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
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
import com.gargoylesoftware.htmlunit.javascript.host.Event;
import com.gargoylesoftware.htmlunit.javascript.host.html.HTMLInputElement;





public class TFCDataApp {
	private WebClient webClient;
	private CookieManager cookieMan;
	private HtmlPage page;
	private InterceptWebConnection a;
	private int totalAttempts,passAttempts,failAttempts;
	public TFCDataApp() throws InterruptedException
	{
		totalAttempts=0;
		passAttempts=0;
		failAttempts=0;
		webClient = new WebClient(BrowserVersion.FIREFOX_31);
		/*turn on the cookies*/
		cookieMan = new CookieManager();
		cookieMan.setCookiesEnabled(true);
		//a=new InterceptWebConnection(webClient);
		webClient.getOptions().setCssEnabled(false);
		webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(java.util.logging.Level.OFF);
		try {
			this.loadPage("http://tfcdatas.com/index_ba.php");
			webClient.getOptions().setJavaScriptEnabled(true);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.print("TFCDataApp couldn't be initialized");
		}
	}
	
	public void loadPage(String URL) throws IOException, InterruptedException
	{
		try
		{
			this.page = this.webClient.getPage(URL);
			refresh(5);
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
	public void login(String username,String passwd) throws IOException, InterruptedException 
	{
		System.out.println("Performin Login");
		HtmlForm loginForm = page.getFormByName("thisForm");
		if (loginForm == null)
		{
			System.out.println("No Login form found");
			return;
			
		}
		{
			HtmlImageInput submit = loginForm.getInputByName("btnSubmit");
			HtmlTextInput usrname = loginForm.getInputByName("txtusername");
			HtmlPasswordInput password = loginForm.getInputByName("txtpassword");
			usrname.setText(username);
			password.setText(passwd);
			try {
				page=(HtmlPage) submit.click();
				goDataPage();
				webClient.getOptions().setJavaScriptEnabled(true);
				System.out.println("webclient javascript enabled");
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.print("could login with the user name" + username + "and password" + passwd);
				throw e;
			}
		}
		System.out.println("Completed Login");
	}
	public void makeEntry(BcardInterface bcardItem) throws IOException, NullPointerException, IllegalStateException, InterruptedException
	{
		totalAttempts++;
		chooseState();
		try
		{
			selectBusinessCategory(bcardItem.getBusinessCategory());
			fillData(bcardItem);
			submitData();
			checkPage(bcardItem);
		}
		catch (NullPointerException e)
		{
			e.printStackTrace();
			checkPage(bcardItem);
		}
		
	}
	public void displayStats()
	{
		System.out.println("Total Forms attempted : " + String.valueOf(totalAttempts));
		System.out.println("Total Forms passed    : " + String.valueOf(passAttempts));
		System.out.println("Total Forms failed    : " + String.valueOf(failAttempts));
		
	}
	private void setEntryPage() throws InterruptedException, IOException
	{
		HtmlAnchor link = ((List<HtmlAnchor>) page.getByXPath("//a[contains(@href,'data.php')]")).get(0);
		page=link.click();
		refresh(5);
		
		
	}
	private void checkPage(BcardInterface bcardItem) throws InterruptedException, IOException
	{
		try
		{
		HtmlForm tempform = page.getFormByName("st");
		passAttempts++;
		}
		catch(ElementNotFoundException e)
		{
			e.printStackTrace();
			//System.out.println(page.asXml());
			System.out.println(bcardItem.getBusinessName() + " Not succesfull");
			failAttempts++;
			setEntryPage();
			
		}
				
	}
	private void chooseState() throws InterruptedException, IOException
	{
		HtmlForm tempform=null;
		try
		{
			tempform = page.getFormByName("st");
		}
		catch (ElementNotFoundException e)
		{
			setEntryPage();
		}	
		HtmlSelect stateSelect = tempform.getSelectByName("vbstate");
		HtmlOption option = stateSelect.getOptionByValue("Tamilnadu");
		page = stateSelect.setSelectedAttribute(option, true);
		refresh(5);
		
	}
	private void submitData() throws IOException 
	{
		HtmlForm submitForm = this.page.getFormByName("thisForm");
		if (submitForm == null)
		{
			System.out.println("No submit form found");
			throw new IllegalStateException("Submit could not be performed");
			
		}
		{
			HtmlImageInput submit = submitForm.getInputByName("btnSubmit");
			try {
				submit.click();
				//System.out.println("Refreshing page after submit");
				refresh(3);
				
				this.page = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
				//System.out.println("Refreshed page loaded");
				
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.print("could not submit the data");
				throw e;
			} 
		}
	}
	private void selectBusinessCategory(String category) throws IOException, ElementNotFoundException, InterruptedException,IllegalStateException
	{
		HtmlForm searchForm = null;
		searchForm = page.getFormByName("business_category1");
		if (searchForm==null)
		{
			throw new IllegalStateException("Business Category1 not found");
		}
		HtmlTextInput categoryInput = searchForm.getInputByName("cmbcat");
		categoryInput.setText(category);
		HtmlSubmitInput submit = searchForm.getInputByName("submit");
		HtmlPage temppage=submit.click();
		//String path="//form[@name='business_category']/table/tbody/tr//td[contains(lower-case(.),'" + category.toLowerCase() + "')]/parent::tr/td//input[@type='checkbox']";
		String path="//form[@name='business_category']/table/tbody/tr/td//font[normalize-space(lower-case(text()))='" + category.toLowerCase() + "']/parent::td//input[@type='checkbox']";
		List <HtmlCheckBoxInput> lists = (List<HtmlCheckBoxInput>) temppage.getByXPath(path);
		if (lists.size() <= 0)
		{
			throw new NullPointerException(category + "Not Found");
		}
		((HtmlCheckBoxInput) lists.get(0)).setChecked(true);
		searchForm = temppage.getFormByName("business_category");
		HtmlImageInput	btnsubmit = searchForm.getInputByName("btnSubmit");
		//webClient.getOptions().setJavaScriptEnabled(true);
		page=(HtmlPage) btnsubmit.click();
		refresh(2);
//		page=webClient.getPage("http://tfcdatas.com/data_add.php?vbstate=Tamilnadu");
		
	}
	@SuppressWarnings("unchecked")
	private void goDataPage() throws IOException, InterruptedException
	{
		/*When this function is called, we have already logged in and we in the page 
		 * to click usefullinks.php
		 * followed by clicking project.php link
		 * finally to the data.php
		*/
		@SuppressWarnings("unused")
		HtmlPage temppage = null;
		{
			HtmlAnchor link = ((List<HtmlAnchor>) page.getByXPath("//a[contains(@href,'usefullisting.php')]")).get(0);
			try {
				page = link.click();
				refresh(1);
				link = ((List<HtmlAnchor>) page.getByXPath("//a[contains(@href,'before1.php')]")).get(0);
				page = link.click();
				refresh(1);
				link = ((List<HtmlAnchor>) page.getByXPath("//a[contains(@href,'data.php')]")).get(0);
				page=link.click();
				refresh(1);				
			}
			catch (IOException e)
			{
				System.out.println("Page Navigation failed");
				e.printStackTrace();
				throw e;
			}
		}
	}
	private void fillData(BcardInterface bCardObj) throws NullPointerException,IllegalStateException, InterruptedException
	{
		HtmlForm form = this.page.getFormByName("thisForm");
		if (form ==null)
		{
			throw new NullPointerException("Submit page fillData function doesn't contain the required form");
		}
		HtmlSelect select = form.getSelectByName("bstate");
		if (!select.asText().equalsIgnoreCase(bCardObj.getState()))
		{
			throw new IllegalStateException("State should be matching");
		}
		//set the city
		select = form.getSelectByName("bcity");
		HtmlOption option = select.getOptionByValue("CHENNAIreupdation29apr15");
		select.setSelectedAttribute(option,true);
		HtmlTextInput bname = form.getInputByName("bname"); 
		bname.setText(bCardObj.getBusinessName());
		//System.out.println("firing change event");
		//bname.fireEvent(Event.TYPE_CHANGE);
		{
			HtmlTextInput input = form.getInputByName("bpho3");
			try {
				input.click();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		refresh(5);
		//this.webClient.waitForBackgroundJavaScript(4000);
		this.page = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
		form = this.page.getFormByName("thisForm");
		select = form.getSelectByName("barea");
		option = select.getOptionByValue(bCardObj.getArea().toUpperCase());
		select.setSelectedAttribute(option, true);
		//System.out.println("Changing focus from barea to bpho");
		{
			HtmlTextInput input = form.getInputByName("bpho");
			try {
				input.click();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		refresh(5);

	
		this.page = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
		form = this.page.getFormByName("thisForm");
		ArrayList<String> listtel = bCardObj.getTelephone();
		if (listtel.size() > 0)
		{
			Iterator itr1 = listtel.iterator();
			if (itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bpho");
				input.setText(((String)itr1.next()).toString());
				//input.fireEvent(Event.TYPE_BLUR);
				//System.out.println("Changing focus from bpho to bpho2");
				{
					HtmlTextInput dummy = form.getInputByName("bpho2");
					try {
						dummy.click();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				refresh(5);
			}
			if(itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bpho2");
				input.setText(((String)itr1.next()).toString());
				
			}
			if(itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bpho3");
				input.setText(((String)itr1.next()).toString());
				
			}
		}
		ArrayList<String> listmob = bCardObj.getMobile();
		if (listtel.size()==0 && listmob.size()==0)
		{
			throw new IllegalStateException("Either Mobile or Telephone is must");
		}
		if (listmob.size() >0)
		{
			Iterator itr1 = listmob.iterator();
			if (listtel.size()==0)
			{
				if (itr1.hasNext())
				{
					HtmlTextInput input = form.getInputByName("bpho");
					input.setText(((String)itr1.next()).toString());
					//input.fireEvent(Event.TYPE_BLUR);
				//	System.out.println("Changing focus from bpho to bpho2");
					{
						HtmlTextInput dummy = form.getInputByName("bpho2");
						try {
							dummy.click();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
					refresh(5);
				}
			}
			if (itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bmob");
				input.setText(((String)itr1.next()).toString());
			}
			if (itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bmob2");
				input.setText(((String)itr1.next()).toString());
			}
			if (itr1.hasNext())
			{
				HtmlTextInput input = form.getInputByName("bmob3");
				input.setText(((String)itr1.next()).toString());
			}
		}
		
		
		this.page = (HtmlPage) this.webClient.getCurrentWindow().getEnclosedPage();
		loadLocation(bCardObj);
		loadHOP(bCardObj);
	}
	private void loadLocation(BcardInterface bCardObj)
	{
		HtmlForm form = this.page.getFormByName("thisForm");
		HtmlTextInput badd1 = form.getInputByName("badd1");
		HtmlTextInput badd2 = form.getInputByName("badd2");
		badd1.setText(bCardObj.getDoorNO());
		badd2.setText(bCardObj.getStreetAdd());
		if (!bCardObj.getLandMark().isEmpty())
		{
			HtmlTextInput landmark = form.getInputByName("lanm");
			landmark.setText(bCardObj.getLandMark());
		}
		HtmlTextInput pincode = form.getInputByName("bpcode");
		pincode.setText(bCardObj.getPinCode());		
	}
	private void loadHOP(BcardInterface bCardObj)
	{
		HOP[] hops= bCardObj.getHOP();
		String otime ="otime";
		String ctime = "ctime";
		String cbtext="tsatday";
		HtmlForm form = page.getFormByName("thisForm");
		int i=0;		
		for (HOP hop:hops)
		{
			if (hop.is24Hrs())
			{
				if(i==0)
				{
					HtmlSelect otime_s =form.getSelectByName(otime);
					HtmlSelect ctime_s =form.getSelectByName(ctime);
					setTime(otime_s,ctime_s,"00.00","00.00");
				}
				else
				{
					HtmlSelect otime_s =form.getSelectByName(otime+String.valueOf(i));
					HtmlSelect ctime_s =form.getSelectByName(ctime+String.valueOf(i));
					setTime(otime_s,ctime_s,"00.00","00.00");
				}
				continue;
			}
			if (hop.isClosed())
			{
				if(i==0)
				{
					HtmlSelect otime_s =form.getSelectByName(otime);
					HtmlSelect ctime_s =form.getSelectByName(ctime);
					setTime(otime_s,ctime_s,"Closed","Closed");
					HtmlCheckBoxInput cbox = form.getInputByName(cbtext);
					cbox.setChecked(true);
				}
				else
				{
					HtmlSelect otime_s =form.getSelectByName(otime+String.valueOf(i));
					HtmlSelect ctime_s =form.getSelectByName(ctime+String.valueOf(i));
					setTime(otime_s,ctime_s,"Closed","Closed");
					HtmlCheckBoxInput cbox = form.getInputByName(cbtext+String.valueOf(i));
					cbox.setChecked(true);
				}
				continue;
			}
			String openTime = hop.sGetFromHour() + "." + hop.sGetFromMin();
			String closeTime = hop.sGetToHour() + "." + hop.sGetToMin();
			if(i==0)
			{
				HtmlSelect otime_s =form.getSelectByName(otime);
				HtmlSelect ctime_s =form.getSelectByName(ctime);
				setTime(otime_s,ctime_s,openTime,closeTime);
			}
			else
			{
				HtmlSelect otime_s =form.getSelectByName(otime+String.valueOf(i));
				HtmlSelect ctime_s =form.getSelectByName(ctime+String.valueOf(i));
				setTime(otime_s,ctime_s,openTime,closeTime);
			}
			i++;
				
		}
		
	}
	private void setTime(HtmlSelect otime_s, HtmlSelect ctime_s, String openTime, String closeTime)
	{
		HtmlOption option = otime_s.getOptionByValue(openTime);
		HtmlOption option2 = ctime_s.getOptionByValue(openTime);
		otime_s.setSelectedAttribute(option, true);
		ctime_s.setSelectedAttribute(option2, true);
	}

	public void displayXML()
	{
		System.out.println(this.page.asXml());
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
