package org.util.chakra;
import java.util.Hashtable;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class InputParameter {
	
	Map<String, Double> paramList = new Hashtable<String, Double>();
	private static String[] parameters={"!DIGIT!",
		"!SPLCHAR!",
	//	"!SingleChar!",
		"NO",
		"BLOCK",
		"TYPE",
		"ROAD",
		"NAGAR",
		"STREET",
		"RAILWAY",
		"OPP",
		"OPPOSITE",
		"STAND",
		"SCHOOL",
		"NEAR",
		"BUS",
		"BANK",
		"THEATRE",
		"STATION"};
	public InputParameter()
	{
		for (String key:InputParameter.parameters)
			this.paramList.put(key,0.0);

	}
	private void addKey(String Key)
	{
		double value=0;
		if(paramList.containsKey(Key))
		{
			value = (double) paramList.get(Key);
			value++;
			paramList.put(Key,value);
		}
		else
		{
			throw new IllegalArgumentException("Invalid Key");
		}
		
	}
	private void addKey(String Key,double value)
	{
		double temp=0;
		if(paramList.containsKey(Key))
		{
			temp = (double) paramList.get(Key);
			value+=temp;
			paramList.put(Key,value);
		}
		else
		{
			throw new IllegalArgumentException("Invalid Key");
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
	public double[] getParameter(String data)
	{
		double[] X = new double[InputParameter.parameters.length];
		for (String key:InputParameter.parameters)
		{
			this.addKey(key, this.returnMatch(key,data));
		}
		int i=0;
		for(String key:paramList.keySet())
		{
			X[i] = paramList.get(key);
			i++;
			
		}
		return X;
		
	}
	public void displaykey()
	{
		for(String key:paramList.keySet())
		{
			System.out.print(key + " | ");
		}
		System.out.println();
		
	}

}

