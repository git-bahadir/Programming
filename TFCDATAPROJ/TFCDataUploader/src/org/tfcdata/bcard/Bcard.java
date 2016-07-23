package org.tfcdata.bcard;

import java.io.*;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.regex.Pattern;
import java.util.regex.Matcher;


public class Bcard {
	private BufferedReader inputFile;
	private ArrayList<BcardItem> listBcard; 
	private int IllegalTokencount=0;
	public Bcard()
	{
		listBcard = new ArrayList<BcardItem> (0);
	}
	public Bcard(String filename,int i) throws IOException
	{
		this();
		try {
			linkData(filename,i);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void linkData(String fileName,int i) throws IOException
	{
		this.inputFile = new BufferedReader(new FileReader(fileName));
		inputFile.readLine();   //ignore first line
		setRestorePoint(i);
		
	}
	private BcardItem createBcard() throws ArrayIndexOutOfBoundsException, Exception
	{
		BcardItem oBI=null;
		String tfcData = inputFile.readLine();
		if (tfcData == null)
		{
		//	System.out.println("No Data to read from");
			return null;
		}
		String[] tok = tfcData.split("\\|",-1);
		if (tok.length != 12)
		{
			System.out.println(tfcData);
			System.out.println("Invalid tokens as the number of tokens are " + tok.length + " where as expected was 12");
			throw new IllegalStateException();
		}
		oBI = new BcardItem();
		int i =0;
		while (i < tok.length)
		{
			switch (i)
			{
			case 0: 
				oBI.setBusinessName(tok[i]);
				break;
			case 1:
				setContact(oBI,tok[i],true);
				break;
			case 2:
				setContact(oBI,tok[i],false);
				break;				
			case 3:
				oBI.setDoorNO(tok[i]);
				break;
			case 4:
				oBI.setStreeAdd(tok[i]);
				break;
			case 5:
				oBI.setLandMark(tok[i]);
				break;
			case 6:
				oBI.setArea(tok[i]);
				break;
			case 7:
				oBI.setCity(tok[i]);
				break;
			case 8:
				oBI.setPinCode(tok[i]);
				break;
			case 9:
				setHOP(oBI,tok[i]);
				break;
			case 10:
				
				break;
			case 11:
				oBI.setBusinessCategory(tok[i]);
				break;
			}
			i++;
		}
	//	this.listBcard.add(oBI);
		return oBI;
		
	}
	public void showall()
	{
		for (BcardItem e:this.listBcard)
		{
			System.out.println(e.bcardDisplay());
		}
	}
	private void setHOP(BcardItem oBI, String Token) throws ArrayIndexOutOfBoundsException,Exception {
		// TODO Auto-generated method stub
		//System.out.println(oBI.getBusinessName());
		String[] tok = Token.split(",");
		final String[] WeekDay = {"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"};
		HOP[] hop = new HOP[7];
		for (int i=0;i<hop.length;i++)
		{
			hop[i]=new HOP();
		}
		
		int i=0;
		while (i < tok.length && i < 7 && !tok[i].isEmpty())
		{
			if (tok[i].matches(WeekDay[i] + ".*"))
			{
				String[] s1 = tok[i].replaceFirst(WeekDay[i],"").replaceFirst(":", "").trim().split("-");
				try
				{
					if (s1[0].contains("Closed"))
					{
						hop[i].setClosed(true);
					}
					else if (s1[0].toLowerCase().contains("open"))
					{
						hop[i].setOpen24Hrs(true);
					}
					else
					{
						String from[],to[];
						from = s1[0].split(":");
						to=s1[1].split(":");
						int fromHH = Integer.parseInt(from[0].trim());
						int toHH = Integer.parseInt(to[0].trim());
						int fromMN,toMN;
						if (from[1].contains("am"))
						{
							fromMN=Integer.parseInt(from[1].replace("am","").trim());
						}
						else
						{
							fromMN=Integer.parseInt(from[1].replace("pm","").trim());
							fromHH=(fromHH+12)%24;
						}
						if (to[1].contains("am"))
						{
							toMN=Integer.parseInt(to[1].replace("am","").trim());
						}
						else
						{
							toMN=Integer.parseInt(to[1].replace("pm","").trim());
							toHH=(toHH+12)%24;
						}
								
						hop[i].setHop(fromHH,fromMN,toHH,toMN);
						
					}

				//System.out.println(s1[0] + s1[1]);
				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					throw new ArrayIndexOutOfBoundsException("Parsing of HOP failed\n");

				}
				catch(Exception e)
				{
					throw new Exception(oBI.getBusinessName());
				}
				
			}
			else
			{
				throw new IllegalArgumentException("Invalid Weekdays" + tok[i]);
			}
			
			i++;
		}
		oBI.setHOP(hop);
	}
	private void setContact(BcardItem oBI, String Token,boolean mobile) {
		// TODO Auto-generated method stub
		String[] tok = Token.split(",");
		//System.out.println(Token + " contains " + tok.length);
		int i = 0;
		while (i < tok.length && !tok[i].isEmpty())
		{
			if (mobile)
			{
				oBI.setMobileNum(tok[i]);
			}
			else
			{
				oBI.setTelphone(tok[i].replaceAll("44-",""));
			}
			i++;
		}
		
	}
	private boolean isMobile(String number)
	{
		/*Mobile Number Patterns*/
		String pattern1="(((/+)?(91))([-\\s]))([0-9]{10})(?![0-9])";
		String pattern2="([0-9]{10})(?![0-9])";
		if (number.matches(pattern1) || number.matches(pattern2))
		{
			System.out.println("Match found for " + number);
			return true;
		}
		
		return false;
	}
	private void pattern_find(String regexp,String text)
	{
		 Pattern pattern = Pattern.compile(regexp);
		 Matcher matcher = pattern.matcher(text);
         boolean found = false;
         while (matcher.find()) {
        	 String S1 = String.format("I found the text \"%s\" starting at index %d and ending at index %d.%n", matcher.group(), matcher.start(),matcher.end());
		     System.out.println(S1);
		     found = true;
         }
         if(!found){
        	 System.out.println("No match found.%n");
         }
	}
	private void setRestorePoint(int i) throws IOException
	{
		while (i>0)
		{
			inputFile.readLine();
			i--;
		}
	}
	public BcardItem getBcard() throws ArrayIndexOutOfBoundsException, Exception
	{
		try {
			BcardItem temp = this.createBcard();
			if (temp != null)
			{
				this.listBcard.add(temp);
			}
			return temp;
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			this.IllegalTokencount++;
			if (this.IllegalTokencount > 5)
			{
				System.out.println("Too many data is discard, check the input\n");
				throw e;	
			}
			return this.getBcard();
		}
	}

	

}
