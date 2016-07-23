package org.tfcdata.bcard;

import java.util.ArrayList;

public interface BcardInterface {
/* Retrieval methods*/
	public String getBusinessName();
	public ArrayList<String> getMobile();
	public ArrayList<String> getTelephone();
	public String getBusinessCategory();
	public HOP[] getHOP();
	public String getDoorNO();
	public String getStreetAdd();
	public String getLandMark();
	public String getArea();
	public String getPinCode();
	public String getCity();
	public String getState();
/* Setter methods*/
	public void setBusinessName(String bName);
	public void setMobileNum(String mNumber);
	public void setTelphone(String tNumber);
	public void setBusinessCategory(String bCat);
	public void setHOP(HOP[] hop);
	public void setDoorNO(String dNO);
	public void setStreeAdd(String sAdd);
	public void setLandMark(String landMark);
	public void setArea(String area);
	public void setPinCode(String pincode);
	public void setCity(String city);
	public void setState(String state);
	
	public String bcardDisplay();
	

}
