package org.justdial.chakra;

import java.io.IOException;

public class SearchJustDial {
	
	public Component component;
	public static void main(String[] args) throws IOException, InterruptedException {
		// TODO Auto-generated method stub
		
		//String a[]={"f","g","u"};
		for (int i=0;i<1;i++)
		{
			String searchText = "v";// + a[i];
		    SearchJustDial engine = new SearchJustDial();
		    engine.component.forChar(searchText);
		}

	}
	public SearchJustDial()
	{
		component = new Component();
	}

}
