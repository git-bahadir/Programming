#include<iostream>
#include<cstdio>
#define debug 1
#define NL cout<<"\n"
using namespace std;
int main()
{
  int t,up,lo,l;
  scanf("%d",&t);
  if (debug)
  {
    cout<<"Total number of testcase is "<<t;NL;
  }
  while(t>0)
  {
    t--;
    scanf("%d",&l);
    if (debug)
    {
      cout<<"Length of the rope"<<l;NL;
    }
    int max_burn_time=l;
    int burn_time=0;
    int temp=l;
    int n=1;
    while (temp > 1)
    {
      temp--;
      scanf("%d",&up);
      burn_time=n+up;
      if(burn_time > max_burn_time)
      {
        max_burn_time=burn_time;
      }
      n++;
    }
    /*Now read lower this can be in loop as well.*/
    temp=l;
    n=1;
    while (temp > 1)
    {
      temp--;
      scanf("%d",&up);
      burn_time=n+up;
      if(burn_time > max_burn_time)
      {
        max_burn_time=burn_time;
      }
      n++;
    }
    cout<<max_burn_time;NL;
  }
}
