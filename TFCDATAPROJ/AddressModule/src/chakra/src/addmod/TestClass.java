package chakra.src.addmod;

import java.io.IOException;

public class TestClass {

	public static void main(String[] args) throws IOException {
		String str = " rd";
		//System.out.println(str.replaceAll(" ([Rr][Dd])(([, ]*)([[^a-z,0-9,A-Z]*]))", " Road$3"));//.replaceAll("[ ]+([Ss][Tt])([[ ,]*^[a-z,0-9,A-Z]])", " Street$2 "));
		System.out.println(str.replaceAll("([Rr][Dd][ ,])", "Road "));//.replaceAll("[ ]+([Ss][Tt])([[ ,]*^[a-z,0-9,A-Z]])", " Street$2 "));
		System.out.println(str.replaceAll("([Rr][Dd]$)", "Road "));//.replaceAll("[ ]+([Ss][Tt])([[ ,]*^[a-z,0-9,A-Z]])", " Street$2 "));	
		
	}
}
