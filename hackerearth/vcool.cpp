#include<iostream>
using namespace std;
//#define debug 1;
#define NL cout<<"\n"
int coolarr[99999];
int main()
{
  int testcase,number,coolness;
  int num1=7;
  int highest=0;
  int coolcount=0;
  cin>>testcase;
#ifdef debug
  cout<<"Number of testcases "<<testcase;
  NL;
#endif
  while(testcase>0)
  {
    coolcount=0;
    cin>>number>>coolness;
    testcase--;
    if (number < highest)
    {
      cout<<count(number,coolness);
    }
    else
    {
      cout
    while(number > 0)
    {
      int temp=number;
#ifdef debug
      cout<<"temp before :"<<temp;
      NL;
#endif
      temp=temp & num1;
#ifdef debug
      cout<<"temp :"<<temp;
      NL;
#endif
      if (temp==5)
      {
        coolcount++;
      }
      number=number>>1;

    }
    if (coolcount>=coolness)
      cout<<coolcount<<"\n";
    else
      cout<<"\n";
  }
  return 0;
}

