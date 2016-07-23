package chakra.src.addmod;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import chakra.src.logistic.InputParameter;
import chakra.src.logistic.ParamGen;
import chakra.src.logistic.TextGeneralizer;
import chakra.src.logistic.TrainAddressModule;
//import Jama.util.*;
//import Jama.*;
//import java.Math;
public class AddressModuleTest {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		TextGeneralizer a;
		BufferedReader inputFile;
		String data;
		InputParameter iX;
		ArrayList<double[]> X = new ArrayList<double[]>();
		ArrayList<Double>  Y = new ArrayList<Double>();
		
		System.out.println(Math.exp(-10));
		
		
		//door no
		a = new TextGeneralizer();
		
		inputFile = new BufferedReader(new FileReader("TestData.csv"));
		String fileline=inputFile.readLine();
		while(fileline != null) {
			String[] tok = fileline.split("\\|");
			data = tok[0];
			if (tok[1].equalsIgnoreCase("1")){
			//	a.buildList(a.splitdata(a.modtext(data)));
				iX = new InputParameter();
			    X.add(iX.getParameter(a.modtext(data).toUpperCase()));
			    Y.add(1.0);
				//data=inputFile.readLine();
			}
	//		a.getList();
			
			//address details
			if (tok[1].equalsIgnoreCase("2")){
				//a.buildList(a.splitdata(a.modtext(data)));
				iX = new InputParameter();
				X.add(iX.getParameter(a.modtext(data).toUpperCase()));
				Y.add(2.0);
				//data=inputFile.readLine();
			}
			//Landmark Details
			if (tok[1].equalsIgnoreCase("3"))
			{
				//a.buildList(a.splitdata(a.modtext(data)));
				iX = new InputParameter();
				X.add(iX.getParameter(a.modtext(data).toUpperCase()));
				Y.add(3.0);
			}
			fileline=inputFile.readLine();
		}
		inputFile.close();
		//a.getList();
		
	/*	TrainAddressModule trainingSets = new TrainAddressModule("/home/chakra/Programming/Java/AddressModule/TestData.csv");
		trainingSets.printXY();
		*/
	
		int j=0;
		iX = new InputParameter();
		iX.displaykey();
		double[] y= new double[Y.size()];
		for (double aa:Y)
		{
			y[j]=aa;
			j++;
		}
		j=0;
		int i=0;
		for (double[] x:X)
		{
			for(j=0;j<x.length;j++)
			{
				System.out.print(x[j] + " ");
			}
			System.out.println( y[i] + ";");
			i++;
		}
		System.out.println("Exit");
	}

}
