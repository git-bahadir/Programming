package com.mainpkg.chakra;

import java.io.IOException;

import org.tfcdata.bcard.Bcard;
import org.tfcdata.bcard.BcardItem;
import org.tfcdata.bcard.TestBcard;

public class TFCTest {

	public static void main(String[] args) throws ArrayIndexOutOfBoundsException, NullPointerException, IllegalStateException, Exception {
		// TODO Auto-generated method stub
		TFCDataApp appMain = new TFCDataApp();
		appMain.login("TFC030515CHA", "5bsjc");
		TestBcard tst = new TestBcard();
		int i=723;
		Bcard obj1 = new Bcard("/home/chakra/Programming/tfcdatas/Data/modified/20150825.csv",110-i);
		BcardItem objI;
		while (i>0 & ((objI = obj1.getBcard())!=null))
		{
			System.out.println(i + " : " + objI.getBusinessName());
			i--;
			try
			{
				appMain.makeEntry(objI);
				System.out.println("Successful Entry made");
			}
			catch (ArrayIndexOutOfBoundsException e)
			{
				e.printStackTrace();
				System.out.println(objI.bcardDisplay());
				
			}
			catch (NullPointerException e)
			{
				e.printStackTrace();
				System.out.println(objI.bcardDisplay());
			}
			
		}
		appMain.displayStats();
	}

}
