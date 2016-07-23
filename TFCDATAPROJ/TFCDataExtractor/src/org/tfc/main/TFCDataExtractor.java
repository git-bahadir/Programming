/**
 * 
 */
package org.tfc.main;



import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.*;

import org.jsoup.*;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;


/**
 * @author chakravarthi.p
 *
 */
public class TFCDataExtractor {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println("Business Name|Mobile|Telephone|Door NO|Street address|Landmark|Area|City|Pincode|Hours of operationi|Listed Busniess|Business for TFCDATA");
		Document doc = null;
		//Element contents;
		Elements elements;
		int count=0,count1=0;;
		try
		{
//			doc = Jsoup.parse(new File("C:/Users/chakravarthi.p/Documents/testfile/Grocery Stores in Villivakkam, Chennai, Grocery Shop, India _ Justdial.html"),null);
			doc = Jsoup.parse(new File("/home/chakra/Programming/tfcdatas/Raw html/bu.html"),null);
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
			if (name.toUpperCase().indexOf("VILLIVAKKAM")> 0)
			{
				count1++;
				System.out.println();
				System.out.print(name.substring(0,name.toUpperCase().indexOf("IN VILLIVAKKAM")));
				/*for (Element e2:content.getElementsByClass("jrcw"))
				{
					for(Element e1:e2.getElementsByAttribute("href"))
					{
						System.out.print("|" + e1.text());
					}
				}*/
				getOtherDetails(content);
				//return;
			}
			/*try{
				Thread.sleep(1*1000);
			}
			catch (InterruptedException e)
			{
			
			}*/
		}
		System.out.println("");
		System.out.println("Total number of records read " + count + "and got data for" + count1);
	}
	public static void getOtherDetails(Element content)
	{
		String temp=content.getElementsByClass("jaid").first().getElementsByAttribute("onClick").first().attr("onClick");
		String temp1 = temp.substring(temp.indexOf("http"));
	    String Link = temp1.substring(0,temp1.indexOf("tab="));
	    Document doc = null;
	    try {
			doc = Jsoup.connect(Link).timeout(20*1000).get();
			//System.out.println("");
			getAddress(doc);
			System.out.print(getHOP(doc));
			//System.out.println(doc.html());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    
	    
		
	}
	private static boolean isMobile(String number)
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
	public static void getAddress(Document doc)
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
	    System.out.print("|" + mob.toString() + "|" + tel.toString());
	    
	    
	    itr=doc.getElementsByClass("dtls_addr").select("ul li abbr").iterator();
        if (itr.hasNext())
	    {  	
		   	System.out.print("|" + itr.next().text());
	    }
	    else
	    	System.out.print("|");
	   /* itr=doc.getElementsByClass("dtls_addr").select("ul li a").iterator();
	    
	    if (itr.hasNext())
	    {  	
	    	System.out.println("\n\n" + itr.next().html() + "\n\n");
	    	if (itr.hasNext())
	    	{
	    		System.out.println("\n\n" + itr.next().html() + "\n\n");
	    	
	    		//System.out.print("|" + itr.next().text());
	    	}
	    }
	    else
	    	System.out.print("|");*/
	    
	    System.out.print("|||Villivakkam|Chennai|600049");
	    
	    
		
	}
	public static String getHOP(Document doc)
	{
		String address;
	    Elements elements=doc.getElementsByClass("tabcont").select("tr");
	    System.out.print("|");
	    int i= 0;
	    for (Element e1:elements)
	    {
	    	if (i>0)
	    		System.out.print(",");
	    	i++;	    		
	    	System.out.print(e1.text());
	    }
	    System.out.print("|");
	    elements=doc.getElementsByClass("tabcont").select("div#alsocont p");
	    i=0;
	    for(Element e1:elements)
    	{
	    	if (i>0)
	    		System.out.print(",");
	    	i++;
    		System.out.print(e1.text());
    	}
	    System.out.print("|");
	   // System.out.println(elements.html());
	    /*for (Element e1:elements)
	    {
	    	System.out.print("|");
	    	int i=0;
	    	for (Element row:e1.select("tr"))
	    	{
	    		if (i > 0)
	    			System.out.print(",");
	    		i++;
	    		System.out.print(row.text());
	    	}
	    	System.out.print("|");
	    	for(Element e2:e1.select("div#alsocont"))
	    	{
	    		for(Element e3:e2.getElementsByTag("p"))
	    			System.out.print(e3.text());
	    	}
	    	//System.out.println(e1.select("table").text());
	    }*/
		address="";
		return address;
	}
	/*private static String downloadHtml(String path) {
	    InputStream is = null;
	    try {
	        String result = "";
	        String line;

	        URL url = new URL(path);
	        is = url.openStream();  // throws an IOException
	        BufferedReader br = new BufferedReader(new InputStreamReader(is));

	        while ((line = br.readLine()) != null) {
	            result += line;
	        }
	        return result;
	    } catch (IOException ioe) {
	        ioe.printStackTrace();
	    } finally {
	        try {
	            if (is != null) is.close();
	        } catch (IOException ioe) {
	            // nothing to see here
	        }
	    }
	    return "";
	}*/

}
