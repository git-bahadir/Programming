package org.tfcdata.bcard;

import java.io.IOException;

public class TestBcard {

	public static void main(String[] args) throws ArrayIndexOutOfBoundsException, Exception {
		// TODO Auto-generated method stub
		TestBcard tst = new TestBcard();
		Bcard obj1 = new Bcard("/home/chakra/Programming/tfcdatas/Data/test.csv",0);
		tst.getdata(obj1);
			
		obj1.showall();

	}
	public void getdata(Bcard obj1) 
	{
		try
		{
			while (obj1.getBcard() != null);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			this.getdata(obj1);
		}
	}

}
