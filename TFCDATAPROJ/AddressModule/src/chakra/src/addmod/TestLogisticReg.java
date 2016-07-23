package chakra.src.addmod;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

import chakra.src.logistic.*;

public class TestLogisticReg {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		BufferedReader inputFile =new BufferedReader(new FileReader("TestData2.csv"));
		String fileline;
		while((fileline=inputFile.readLine()) != null) {
			String[] tok = fileline.split("\\,");
			int i = 0;
			StringBuilder dno = new StringBuilder();
			StringBuilder ano = new StringBuilder();
			StringBuilder lno = new StringBuilder();
			while(i < tok.length)
			{
				if (tok[i].trim().equalsIgnoreCase("villivakkam") | tok[i].trim().equalsIgnoreCase("Chennai - 600049") )
				{
					
				}else
				{
					String str=tok[i].replaceAll(" ([Rr][Dd][ ,])", " Road ").replaceAll(" ([Rr][Dd]$)", " Road ").replaceAll(" ([sS][Tt][ ,])", " Street ").replaceAll(" ([Ss][Tt]$)", " Street");
					switch((new LogicalRegression()).analyseData(str.trim()))
					{
					case 1:
						if (dno.length() == 0)
						{
							dno.append(str.trim());
						}
						else
						{
							dno.append(" , " + str.trim());
						}
						break;
					case 2:
						if (ano.length() == 0)
						{
							ano.append(str.trim());
						}
						else
						{
							ano.append(" , " + str.trim());
						}
						break;
					case 3:
						if (lno.length() == 0)
						{
							lno.append(str.trim());
						}
						else
						{
							lno.append(" , " + str.trim());
						}
						break;
					default:
						System.out.println(str.trim() + " Unknown");		
					}
				}
				i++;
			}
			System.out.format("%-150s%-50s%-50s%-10s\n",fileline.trim(),dno.toString().trim(),ano.toString().trim(),lno.toString().trim());
		}
		inputFile.close();
	}

}
