package org.tfcdata.bcard;

import java.util.Iterator;
import java.util.ArrayList;

public class BcardItem implements BcardInterface{
	private String bname;
	private ArrayList<String> mobnum;
	private ArrayList<String> telnum;
	private String dNO;
	private String stAdd;
	private String landMark;
	private String area;
	private String city;
	private String pincode;
	private HOP[] hop;
	private String bCat;
	public BcardItem()
	{
		bname="";
		mobnum= new ArrayList<String> (0);
		telnum=new ArrayList<String> (0);
		dNO="";
		stAdd="";
		landMark="";
		area="";
		city="";
//		hop = new HOP[7];
		pincode="";
		bCat="";
	}

	public String getBusinessName() {
		// TODO Auto-generated method stub
		return this.bname;
	}

	public ArrayList<String> getMobile() {
		// TODO Auto-generated method stub
		return this.mobnum;
	}

	public ArrayList<String> getTelephone() {
		// TODO Auto-generated method stub
		return this.telnum;
	}

	public String getBusinessCategory() {
		// TODO Auto-generated method stub
		return this.bCat;
	}

	public HOP[] getHOP() {
		// TODO Auto-generated method stub
		return this.hop;
	}

	public void setBusinessName(String bName) {
		
		// TODO Auto-generated method stub
		this.bname = bName;
	}

	public void setMobileNum(String mNumber) {
		// TODO Auto-generated method stub
		this.mobnum.add(mNumber);
		
	}

	public void setTelphone(String tNumber) {
		// TODO Auto-generated method stub
		this.telnum.add(tNumber);
	}

	public void setBusinessCategory(String bCat) {
		// TODO Auto-generated method stub
		this.bCat = bCat;
	}

	public void setHOP(HOP[] hop) {
		// TODO Auto-generated method stub
		this.hop = hop;
	}

	public String getDoorNO() {
		// TODO Auto-generated method stub
		return this.dNO;
	}

	public String getStreetAdd() {
		// TODO Auto-generated method stub
		return this.stAdd;
	}

	public String getArea() {
		// TODO Auto-generated method stub
		return this.area;
	}

	public String getPinCode() {
		// TODO Auto-generated method stub
		return this.pincode;
	}

	public String getCity() {
		// TODO Auto-generated method stub
		return this.city;
	}

	public void setDoorNO(String dNO) {
		// TODO Auto-generated method stub
		this.dNO = dNO;
	}

	public void setArea(String area) {
		// TODO Auto-generated method stub
		this.area = area;
		
	}

	public void setPinCode(String pincode) {
		// TODO Auto-generated method stub
		this.pincode = pincode;
	}

	public void setCity(String city) {
		// TODO Auto-generated method stub
		this.city = city;
	}

	public void setStreeAdd(String sAdd) {
		// TODO Auto-generated method stub
		this.stAdd = sAdd;
	}

	public String getLandMark() {
		// TODO Auto-generated method stub
		return this.landMark;
	}

	public void setLandMark(String landMark) {
		// TODO Auto-generated method stub
		this.landMark =landMark;
	}
	
	public String bcardDisplay()
	{
		StringBuilder str = new StringBuilder("Business Details \n");
		str.append("Business Name : " + this.getBusinessName() + "\n");
		str.append("Business Category : " + this.getBusinessCategory() + "\n");
		str.append("Contacts \n");
		Iterator<String> itr = mobnum.iterator();
		if (itr.hasNext())
		{
			str.append("\t Mobile : ");
			while (itr.hasNext())
			{
				str.append(itr.next().toString() + "   ");
			}
		}
		itr = telnum.iterator();
		if (itr.hasNext())
		{
			str.append("\t Tele   : ");
			while (itr.hasNext())
			{
				str.append(itr.next().toString() + "   ");
			}
		}
		str.append("\n Address : \n");
		str.append("Door Number/Apartment Name/Building Number : " + this.getDoorNO() + "\n");
		str.append("Street address                             : " + this.getStreetAdd() + "\n");
		str.append("Area                                       : " + this.getArea() + "\n");
		str.append("City and pincode                           : " + this.getCity() + "  " + this.getPinCode() + "\n");
		str.append("Landmark                                   : " + this.getLandMark()  + "\n");
		str.append("Hours of Operation    \n");
		for (int i= 0;i<7;i++)
		{
			str.append(this.hop[i].Time24() +"\n");
		}

		return str.toString();
	}

	@Override
	public String getState() {
		// TODO Auto-generated method stub
		
		return "TamilNadu";
	}

	@Override
	public void setState(String state) {
		// TODO Auto-generated method stub
		
	}

}
