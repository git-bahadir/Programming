#include<iostream>
#include<string>
#include<cstring>
using namespace std;
#define debug 0
#define NL cout<<"\n"
int main()
{
  string s;
  int testcase;
  int charcnt[25];
  cin>>testcase;
  if (debug)
  {
    cout<<"Number of testcases "<<testcase;NL;
  }
  while(testcase >0)
  {
    testcase--;
    cin>>s;
    memset(charcnt,0,sizeof(charcnt));
    if (debug)
      cout<<s<<"  "<<s.length()<<"   ";
    for(int i=0;i<s.length();i++)
    {
      charcnt[s[i]-'a']++;
    }
    int ans=0;
    for (int i=0;i<26;i++)
    {
      ans+=charcnt[i]%2;
    }
    ans--;
    cout<<max(ans,0);NL;
  }
}
