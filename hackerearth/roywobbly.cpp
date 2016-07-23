#include<cstdio>
#include<iostream>
#include<string>
using namespace std;
#define debug 0
#define NL cout<<"\n"
int main()
{
  
  int testcase;
  scanf("%d",&testcase);
  if (debug)
  {
    cout<<"Testcase :"<<testcase;
    NL;
  }
  while(testcase > 0)
  {
    testcase--;
    int n,k;
    scanf("%d %d",&n,&k);
    if (debug)
    {
      cout<<"N length"<<n;NL;
      cout<<"K the number"<<k;NL;
    }
    int s1,s2;
    s2=k%9;
    if (s2==0)
    {
      s1=k/9;
      s2=9;
      if (s2<=s1)
        s2--;
    }
    else
    {
      s1=k/9+1;
      if(s2<=s1)
        s2--;
    }
    if (debug)
    {
      cout<<s1<<s2;
      NL;
    }
    if (s1 > 9)
    {
      cout<<-1;NL;
      continue;
    }

    int i=1;
    while(n>0)
    {
      if(i%2==1)
      {
        cout<<s1;
      }
      else
      {
        cout<<s2;
      }
      i++;n--;
    }
    NL;
  }
}
