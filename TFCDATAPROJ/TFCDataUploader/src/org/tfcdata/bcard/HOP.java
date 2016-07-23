package org.tfcdata.bcard;

public class HOP {
	private boolean open24hrs;
	private boolean closed;
	private int fromhour;
	private int frommin;
	private int tohour;
	private int tomin;
	public HOP()
	{
		open24hrs=false;
		closed=false;
		fromhour=9;
		frommin=0;
		tohour=19;
		tomin=0;
	}
	public String Time12()
	{
		StringBuilder str=new StringBuilder(0);
		if (this.open24hrs)
			return "open24hrs";
		if (this.closed)
			return "closed";
		if (fromhour < 12 )
		{
			str.append(String.format("%02d",fromhour) + ":" + String.format("%02d",frommin) + "AM");
		}
		else
		{
			str.append(String.format("%02d",fromhour-12) + ":" + String.format("%02d",frommin) + "PM");
		}
		str.append(" - ");
		if (tohour < 12 )
		{
			str.append(String.format("%02d",tohour) + ":" + String.format("%02d",tomin) + "AM");
		}
		else
		{
			str.append(String.format("%02d",tohour-12) + ":" + String.format("%02d",tomin) + "PM");
		}
		return str.toString();
		
	}
	public String Time24()
	{
		StringBuilder str=new StringBuilder(0);
		if (this.open24hrs)
			return "open24hrs";
		if (this.closed)
			return "closed";
		str.append(String.format("%02d",fromhour) + ":" + String.format("%02d",frommin) + " - " + String.format("%02d",tohour) + ":" + String.format("%02d",tomin));
		return str.toString();
		
	}
	public int getFromHour()
	{
		if (is24Hrs() || isClosed())
		{
			return -1;
		}
		return this.fromhour;
	}
	public int getToHour()
	{
		if (is24Hrs() || isClosed())
		{
			return -1;
		}
		return this.tohour;
	}
	public int getFromMin()
	{
		if (is24Hrs() || isClosed())
		{
			return -1;
		}
		return this.frommin;
	}
	public int getToMin()
	{
		if (is24Hrs() || isClosed())
		{
			return -1;
		}
		return this.tomin;
	}
	public String sGetFromHour()
	{
		if (is24Hrs() || isClosed())
		{
			return null;
		}
		return String.format("%02d",getFromHour());
	}
	public String sGetToHour()
	{
		if (is24Hrs() || isClosed())
		{
			return null;
		}
		return String.format("%02d",getToHour());
	}
	public String sGetFromMin()
	{
		if (is24Hrs() || isClosed())
		{
			return null;
		}
		return String.format("%02d",getFromMin());
	}
	public String sGetToMin()
	{
		if (is24Hrs() || isClosed())
		{
			return null;
		}
		return String.format("%02d",getToMin());
	}
	public boolean is24Hrs()
	{
		return this.open24hrs;
	}
	public boolean isClosed()
	{
		return this.closed;
	}
	public void setOpen24Hrs(boolean val)
	{
		if (this.closed==true && val==true)
		{
			throw new IllegalArgumentException("Cannot set 24Hrs open, when Closed is already set");
		}
		this.open24hrs=val;
	}
	public void setClosed(boolean val)
	{
		if (this.open24hrs==true && val==true)
		{
			throw new IllegalArgumentException("Cannot set Closed, when 24 Hrs open is already set");
		}
		this.closed=val;
	}
	public void setHop(int fromHH,int fromMN,int toHH,int toMN)
	{
		if (fromHH > 23 || toHH > 23)
		{
			throw new IllegalArgumentException("Invalid time. It should be 24 hour format");
		}
		this.fromhour=fromHH;
		this.frommin=fromMN;
		this.tohour=toHH;
		this.tomin=toMN;
	}

}
