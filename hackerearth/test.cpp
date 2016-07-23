#include <iostream>
#include <cstdio>
using namespace std;

int main()
{
    long long int n,m,t;
    scanf("%lld",&t);
    while(t--)
    {
        scanf("%lld %lld",&n,&m);
        long long ans=0;
        if(m==1)
            printf("%lld\n",n);
        else{
        while(n>0)
        {
            ans=ans+n%m;
            n/=m;
            printf("%lld %lld\n",ans,n);
        }
        printf("%lld\n",ans);
        }
    }
    return 0;
}
