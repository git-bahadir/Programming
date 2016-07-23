/**
 * 
 */
package org.tfc.main;



import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintStream;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.Iterator;
import java.*;

import org.jsoup.*;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

import org.util.chakra.*;


/**
 * @author chakravarthi.p
 *
 */
public class TFCDataExtractor {

	/**
	 * @param args
	 */
	int count=0,count1=0;
	PrintStream out;
	public TFCDataExtractor(String data) throws FileNotFoundException
	{
		try  {
			out = new PrintStream(new FileOutputStream("/home/chakra/Programming/tfcdatas/Data/" + data + ".csv"));
			out.println("Business Name|Mobile|Telephone|Complete Address|Door NO|Street address|Landmark|Area|City|Pincode|Hours of operationi|Listed Busniess|Business for TFCDATA");
			System.out.println(data + "File opened Succesfully");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
	}
	public static void main(String[] args) throws FileNotFoundException {
		// TODO Auto-generated method stub
		
		
		TFCDataExtractor extractor = new TFCDataExtractor("u");
		String Path = "/home/chakra/Programming/tfcdatas/Raw html/";
		File directory = new File(Path);
		String[] myFiles = directory.list(new FilenameFilter() {
		    public boolean accept(File directory, String fileName) {
		        return fileName.endsWith(".html");
		    }
		});
		for (String filename:myFiles)
		{
			System.out.println("Extracting data from file : " + filename);
			System.out.flush();
			extractor.dataExtract(Path+filename);
		}
		extractor.displayStats();
		
		
	}
	public void displayStats()
	{
		out.close();
		System.out.println("");
		System.out.println("Total number of records read " + count + "and got data for" + count1);
	}
	public void dataExtract(String filename)
	{
		Document doc = null;
		//Element contents;
		Elements elements;
		int percount=0;
		try
		{
//			doc = Jsoup.parse(new File("C:/Users/chakravarthi.p/Documents/testfile/Grocery Stores in Villivakkam, Chennai, Grocery Shop, India _ Justdial.html"),null);
			doc = Jsoup.parse(new File(filename),null);
//			doc = Jsoup.connect("http://www.justdial.com/Chennai/aa-%3Cnear%3E-Villivakkam").get();
		}
		catch (Exception e)
		{
			System.out.println("Error in opening file");
		}
		elements = doc.getElementsByClass("jgbg");
				
		for (Element content : elements)
		{
			count++;
			
			
			String name = content.getElementsByClass("jcnwrp").first().getElementsByAttribute("Title").first().attr("title").toString();
			if (name.toUpperCase().indexOf("IN VILLIVAKKAM")> 0)
			{
				count1++;
				percount++;
				out.println(" ");
				out.print(name.substring(0,name.toUpperCase().indexOf("IN VILLIVAKKAM")));
				getOtherDetails(content);
				/*try{
					Thread.sleep(3000);
				}
				catch (InterruptedException e)
				{
				
				}*/
			}
			
		}
		System.out.println("Extracted this page: " + percount);
		
		
	}
	public void getOtherDetails(Element content)
	{
		String temp=content.getElementsByClass("jaid").first().getElementsByAttribute("onClick").first().attr("onClick");
		String temp1 = temp.substring(temp.indexOf("http"));
	    String Link = temp1.substring(0,temp1.indexOf("tab="));
	    Document doc = null;
	    try {
			doc = Jsoup.connect(Link).timeout(20*1000).get();
			//System.out.println("");
			getAddress(doc);
			getHOP(doc);
			//System.out.println(doc.html());
		}catch (SocketTimeoutException e)
		{
			try {
				Thread.sleep(10*1000);
				System.out.println("Some problem with network. Will retry after 10 mins");
				this.getOtherDetails(content);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			
		}catch (UnknownHostException e)
	    {
			try {
				Thread.sleep(10*1000);
				System.out.println("Some problem with network. Will retry after 10 mins");
				this.getOtherDetails(content);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	    }
	    
	    catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    
	    
		
	}
	private boolean isMobile(String number)
	{
		/*Mobile Number Patterns*/
		String pattern1="(((/+)?(91))([-\\s]))([0-9]{10})(?![0-9])";
		String pattern2="([0-9]{10})(?![0-9])";
		if (number.matches(pattern1) || number.matches(pattern2))
		{
			return true;
		}
		
		return false;
	}
	public void getAddress(Document doc)
	{
		String s1;
		//System.out.println(doc.html());
		Iterator<Element> itr;
		itr=doc.getElementsByClass("dtls_addr").select("ul li span a").iterator();
	    StringBuilder mob,tel;
    	mob=new StringBuilder();
    	tel=new StringBuilder();
	    if (itr.hasNext())
	    {
	    	int i=0,j=0;
	    	while(itr.hasNext())
	    	{
	    		if(isMobile((s1=itr.next().text())))/*System.out.print(itr.next().text());*/
	    		{
	    			if (i>0)
		    		{
		    			mob.append(",");
		    		}
		    		i++;
	    			mob.append(s1);
   				}
	    		else
	    		{
	    			if (j>0)
		    		{
		    			tel.append(",");
		    		}
		    		j++;
	    			tel.append(s1);
	    		}
	    		
	    	}
	    		
	    }
	    out.print("|" + mob.toString() + "|" + tel.toString());
	    
	    
	    itr=doc.getElementsByClass("dtls_addr").select("ul li abbr").iterator();
        if (itr.hasNext())
	    {  	
        	String temp = itr.next().text();
		   	out.print("|" + temp);
		   	String[] tok = temp.split("\\,");
			int i = 0;
			StringBuilder dno = new StringBuilder();
			StringBuilder ano = new StringBuilder();
			StringBuilder lno = new StringBuilder();
			while(i < tok.length)
			{
				if (tok[i].trim().equalsIgnoreCase("villivakkam") | tok[i].trim().equalsIgnoreCase("Chennai - 600049") )
				{
					
				}else
				{
					String str=tok[i].replaceAll(" ([Rr][Dd][ ,])", " Road ").replaceAll(" ([Rr][Dd]$)", " Road ").replaceAll(" ([sS][Tt][ ,])", " Street ").replaceAll(" ([Ss][Tt]$)", " Street");
					switch((new LogicalRegression()).analyseData(str.trim()))
					{
					case 1:
						if (dno.length() == 0)
						{
							dno.append(str.trim());
						}
						else
						{
							dno.append(" , " + str.trim());
						}
						break;
					case 2:
						if (ano.length() == 0)
						{
							ano.append(str.trim());
						}
						else
						{
							ano.append(" , " + str.trim());
						}
						break;
					case 3:
						if (lno.length() == 0)
						{
							lno.append(str.trim());
						}
						else
						{
							lno.append(" , " + str.trim());
						}
						break;
					default:
						System.out.println(str.trim() + " Unknown");		
					}
				}
				i++;
			}
			out.print("|" + dno.toString() + "|" +ano.toString() +"|" + lno.toString());
		   	
	    }
	    else
	    	out.print("||||");
	    out.print("|Villivakkam|Chennai|600049");
	    
	    
		
	}
	public String getHOP(Document doc)
	{
		String address;
	    Elements elements=doc.getElementsByClass("tabcont").select("tr");
	    out.print("|");
	    int i= 0;
	    for (Element e1:elements)
	    {
	    	if (i>0)
	    		out.print(",");
	    	i++;	    		
	    	out.print(e1.text());
	    }
	    out.print("|");
	    elements=doc.getElementsByClass("tabcont").select("div#alsocont p");
	    i=0;
	    for(Element e1:elements)
    	{
	    	if (i>0)
	    		out.print(",");
	    	i++;
    		out.print(e1.text());
    	}
	    out.print("|");
		address="";
		return address;
	}

}
