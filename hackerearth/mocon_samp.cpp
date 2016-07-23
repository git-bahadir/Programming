// User :: lovelotus ( Prem Kamal )
 
//#include<bits/stdc++.h>
//#define _ ios_base::sync_with_stdio(0);cin.tie(0);
 
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<cmath>
#include<climits>
#include<cassert>
#include<iostream>
#include<algorithm>
#include<string>
#include<utility>
#include<cctype>
#include<stack>
#include<queue>
#include<vector>
#include<map>
#include<set>
#include<deque>
 
#define lli long long int
#define ulli unsigned long long int
#define F first
#define S second
#define pii pair<int,int>
#define pip pair<int,pii>
#define pis pair<int,string>
#define pll pair<lli,lli>
 
using namespace std;
 
struct cmp1
{
    bool operator()(const pii& x,const pii& y)
    {
        return (x.F<y.F);
    }
};
 
struct cmp2
{
    bool operator()(const pii& x,const pii& y)
    {
        return (x.S>y.S);
    }
};
 
vector<pii>v1,v2;
 
int main()
{
    //freopen("C:\\Users\\lovelotus\\Desktop\\input.txt","r",stdin);
    //freopen("C:\\Users\\lovelotus\\Desktop\\output.txt","w",stdout);
    int t,n,i,x,y,maxm=0;
    lli req=0,bal=0;
    v1.clear();
    v2.clear();
    scanf("%d",&n);
    for(i=0;i<n;i++)
    {
        scanf("%d %d",&x,&y);
        if(y-x>0) v1.push_back(pii(x,y));
        else if(x==y)
        {
            maxm=max(x,maxm);
        }
        else v2.push_back(pii(x,y));
    }
    //printf("%d\n",maxm);
    sort(v1.begin(),v1.end(),cmp1());
    sort(v2.begin(),v2.end(),cmp2());
    vector<pii>::iterator it;
    lli ans=0,cur=0;
    for(it=v1.begin();it!=v1.end();it++)
    {
        req=(*it).F;
        bal=(*it).S;
        if(cur<req)
        {
            ans+=req-cur;
            cur=0;
        }
        else cur-=req;
        cur+=bal;
        //printf("%lld %lld %lld\n",req,cur,bal);
    }
    if(cur<maxm)
    {
        ans+=maxm-cur;
        cur=maxm;
        //printf("%lld %lld %lld\n",req,cur,bal);
    }
    for(it=v2.begin();it!=v2.end();it++)
    {
        req=(*it).F;
        bal=(*it).S;
        //printf("<< %lld %lld %lld\n",req,cur,bal);
        if(cur<req)
        {
            ans+=req-cur;
            cur=0;
        }
        else cur-=req;
        cur+=bal;
        //printf(">> %lld %lld %lld\n",req,cur,bal);
    }
    printf("%lld\n",ans);
    return 0;
}
