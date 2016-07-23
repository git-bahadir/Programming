package chakra.src.logistic;

import java.util.Hashtable;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TextGeneralizer {
	
	Map<String, Double> wordList = new Hashtable<String, Double>();
	
	public String modtext(String data)
	{
		char[] text=data.toCharArray();
		int i=0;
		StringBuilder str=new StringBuilder();
		while (i<text.length)
		{
			switch (text[i])
			{
			case '\\' :
			case '*':
			case '@':
			case '-':
			case ':':
			case '/':
			case '\'':
			case '.':
			case ';':
			case ')':
			case '&':
			case '(':
			case '#':
				str.append(" !splchar! ");
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				str.append(" !digit! ");
				break;
			case '`':
				
				break;
			default:
				str.append(text[i]);	
			}
			i++;
		}
		return str.toString().replaceAll("^ +| +$|( )+", "$1");
	}
	public String[] splitdata(String data)
	{
		return data.toUpperCase().replace(",","").split(" ");
	}
	public void buildList(String[] data)
	{
		for(String Key:data)
		{
			Key= Key.trim();
			double count = returnMatch("!DIGIT!",Key);
			if (count > 0)
			{
				addKey("!DIGIT!",count);
			}
			
			count = returnMatch("!SPLCHAR!",Key);
			if (count > 0)
			{
				addKey("!SPLCHAR!",count);
			}
		
			Key = Key.replaceAll("!DIGIT!","");
			Key = Key.replaceAll("!SPLCHAR!","");
			if (Key.length() > 0){
			
			if (Key.length() == 1 && Key.matches("[a-zA-Z]+"))
				Key = new String("Single Alphabet");
			
			addKey(Key);
			
			}
			
			
		}
	}
	private void addKey(String Key)
	{
		double value=0;
		if(wordList.containsKey(Key))
		{
			value = (double) wordList.get(Key);
		}
		value++;
		wordList.put(Key,value);
	}
	private void addKey(String Key,double value)
	{
		double temp=0;
		if(wordList.containsKey(Key))
		{
			temp = (double) wordList.get(Key);
		}
		value+=temp;
		wordList.put(Key,value);
	}
	public void getList()
	{
		for(String key:wordList.keySet())
		{
			if(wordList.get(key) > 5)
			 System.out.println(key + " - " + wordList.get(key));
			
		}
	}
	private double returnMatch (String exp,String data)
	{
		Pattern p = Pattern.compile(exp);
	    Matcher m = p.matcher(data);
	    double count = 0;
	    while (m.find()){
	    	count +=1;
	    }
	    return count;
	}

}
