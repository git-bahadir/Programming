#include <stdio.h>
#include <unistd.h>
#define debug 0
#define TOTALSIZE 100000
long long int N[TOTALSIZE];
long long int X_N[TOTALSIZE];
int main()
{
	long long int testcase=0;
	long long int t=0,x=0,prev_X_N=0,min_amt=0;
	long long int total_rel=0,total_rec=0;
	int i=0,j=0;
	int highest_in=0;
	scanf("%d",&testcase);
	if (debug)
	{
		printf("Number of testcasea are %d\n",testcase);
	}
	prev_X_N=0;
	for(j=testcase;j>0;j--)
	{
		scanf("%d %d",&t,&x);
		total_rel+=t;
		total_rec+=x;
		N[i]=t;
		X_N[i]=x-t;
		if (prev_X_N<X_N[i])
		{
			prev_X_N=X_N[i];
			highest_in=i;
		}
		if (debug)
		{
			printf("%d %d\n",N[i],X_N[i]);
		}
		i++;
	}
	if (debug)
	{
		printf("%d %d\n",total_rec,total_rel);
	}
	if (total_rec>=total_rel)
	{
		t=N[highest_in];
		min_amt=t;
		for(i=0;i<testcase;i++)
		{
			if((X_N[i]>=t) && (N[i]<min_amt))
			{
				min_amt = N[i];
			}
		}
		printf("%d",min_amt);			
	}
	else
	{
		printf("%d",total_rel-total_rec+1);
	}
 
}

