package chakra.src.logistic;
import Jama.util.*;
import Jama.*;
import java.io.*;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
public class ParamGen {
	static int paramsize=50;

	public double[] inputParam(String data)
	{
		//System.out.println("Number of Characters in the word " + data.length());
		char[] c = data.trim().toCharArray();
		double[] param=new double[paramsize];
		for (int i=0;i<paramsize;i++)
		{
			param[i]=0.0;
		}
		int i=0;
		if (c.length <=0 )
		{
			return null;
		}
		i = 0;
		while(i<c.length && i< paramsize)
		{
			param[i]=(double) c[i];
			i++;
		}
		return param;
			
	}
	public ArrayList<double[]>  splitData(String data)
	{
		String[] tok = data.split("\\,",-1);
		ArrayList<double[]> paramList = new ArrayList<double[]>();
		int i =0;
		while (i<tok.length)
		{
			paramList.add(this.inputParam(tok[i]));
			
			i++;
		}
		System.out.print("Size of this paramList is " + paramList.size());
		return paramList;
	}
	
}
