package org.util.chakra;
import java.text.DecimalFormat;
import java.util.Date;
import java.math.*;
public class LogicalRegression {
	private boolean predict(double[] X,double[] theta)
	{
		int n=0;
		if ((n=theta.length) != X.length)
			throw new IllegalArgumentException("Size of Theata and X doesn't match. Theta's length" + theta.length + " Inputparam length " + X.length);
		double sum=0.0;
		for(int i=0;i<n;i++)
		{
			sum+=theta[i]*X[i];
			
		}
		
		return (sigmoid(sum)>.8);
		
	}
	private double sigmoid(double z)
	{
		return (1/(1-Math.exp(-z)));
	}
	public int analyseData(String data)
	{
		InputParameter iX = new InputParameter();
		TextGeneralizer a = new TextGeneralizer();
	    double[] temp = iX.getParameter(a.modtext(data).toUpperCase());
	    double[] X = new double[temp.length+1];
	    X[0]=1;
	    for(int i=0,j=1;i<temp.length;i++,j++)
	    {
	    	X[j]=temp[i];
	    }
	    if (predict(X,LearnedThetas.dtheta))
	    	return 1;
	    if (predict(X,LearnedThetas.atheta))
	    	return 2;
	    if (predict(X,LearnedThetas.ltheta))
	    	return 3;
	    
	    return 0;
	}

}
