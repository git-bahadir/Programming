package chakra.src.logistic;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;



public class TrainAddressModule {
	
	private ArrayList<Double > Y = new ArrayList<Double>();
	private ArrayList<double[]> X = new ArrayList<double[]>();
	private Matrix Matrix_X;
	private Matrix Matrix_y;
	public TrainAddressModule(String fileName) throws IOException
	{
		BufferedReader inputFile;
		try {
			inputFile = new BufferedReader(new FileReader(fileName));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			System.out.println("Specified file " + fileName + " Couldn't be opened");
			e.printStackTrace();
			throw (e);
		}
		String data ;
		try {
			while ((data=inputFile.readLine())!=null)
			{
				data = data.toUpperCase();
				String tok[] = data.split("\\|",-1);
				//Expected number of token is only 2 at this point. as we should ideally have X and Y
				if (tok.length != 2)
					throw new IllegalArgumentException("Function : TrainAddressModule Location 1");
				Y.add(Double.parseDouble(tok[1]));
				X.add((new ParamGen()).inputParam(tok[0]));
				
				
			}
		} catch (IllegalArgumentException e){
			throw (e);
			
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Reading of the file failed");
			e.printStackTrace();
			throw(e);
		}
		/*Now create the X and Y matrices*/
	    double temp_X[][] = new double[X.size()][ParamGen.paramsize];
		double temp_y[]=new double[Y.size()];//
		int i=0;
		int j=0;
		for (double[] a:X)
		{
			for(j=0;j<a.length;j++)
			{
				temp_X[i][j]=a[j];
			}
			i++;
		}
		i=0;
		for(double a:Y)
		{
			temp_y[i]=a;
			i++;
		}
		Matrix_X = new Matrix(temp_X,X.size(),ParamGen.paramsize);
		Matrix_y = new Matrix(temp_y,Y.size());
		
	}
	public void printXY()
	{
		System.out.println("Matrix X");
		//Matrix_X.print(3, 0);
		//System.out.println("Matrix Y");
		//Matrix_y.print(3,0);
		
		int rows,cols;
		rows= Matrix_X.getRowDimension();
		cols=Matrix_X.getColumnDimension();
		System.out.print("[");
		for (int i=0;i<rows;i++)
		{
			for(int j=0;j<cols;j++)
			{
				System.out.print(Matrix_X.get(i, j) + " ");
			}
			System.out.println(";");
					
		}
		System.out.print("]");
		
		cols=Matrix_y.getRowDimension();
		
		System.out.println();
		
		System.out.print("[");
		for (int i=0;i<cols;i++)
		{
			System.out.println(Matrix_y.get(i, 0) + ";");
			
		}
		System.out.print("]");
		
	}
	public Matrix getX()
	{
		return Matrix_X;
	}
	public Matrix getY()
	{
		return Matrix_y;
	}
	

}
