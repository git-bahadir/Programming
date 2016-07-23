package org.tfc.datasource;

import java.util.List;
import java.util.Map;

public class Bcard {
	private String businessName;
	private String state;
	private String city;
	private String area;
	private List<Telephone> landline;
	private List<Mobile> mobile;
	private List<String> fax;
	private List<String> email;
	private List<String> website;
	private List<Map<String,String>> contacts;  //Contact Person Name and Designation
	private Address add;
	private HoursOfOperation []hop;
	

}
