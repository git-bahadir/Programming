/*
   Panda has become a scientist recently. In his laboratory, there are infinite number of chambers where a chamber number K is connected to a chamber number K-1.

The numbering of chambers start from 0. Initially, X number of particles are present in the chamber number 0. The number of particles present in chamber K is K times the number of particles present in chamber K-1. You are supposed to help Panda in finding out the number of particles in a given chamber number N.

Note: The number of particles in chamber K cannot be calculated until the number of particles in chamber K-1 are calculated.

Input Format:

The first line will contain the integer T, the number of test cases. Each test case consists of two space separated integers N and X.

Output Format:

For each test case, output the answer to Panda's query. Since the output can be very large, output the answer modulo 106+3.
*/
#include <stdio.h>
#define debug 0
const int modulo=1000003;
long long int fact[1000005];
int topfact=1;
int main()
{
  int t_no;
  long long int n,x,i;
  fact[0]=1;
  fact[1]=1;
  scanf("%d",&t_no);
  if (debug)
  {
    printf("No of testcases %d\n",t_no);
  }
  for(;t_no>0;t_no--)
  {
    scanf("%lld %lld",&n,&x);
    if (debug)
    {
      printf("Number of chambers : %lld, first chamber particle %lld:\n",n,x);
    }
    if (n > modulo)
    {
      printf("0\n");
    }
    else
    {
      if (topfact < n)
      {
        for (i=topfact+1;i<=n;i++)
        {
          fact[i]=(i*fact[i-1])%modulo;
        }
        topfact=--i;
      }
      printf("%d\n",((x*fact[n])%modulo));
    }
  }
}
