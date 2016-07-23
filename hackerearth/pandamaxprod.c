/*
   Panda has started learning about subsets. His professor gave him a simple task. Given a list of numbers, Panda has to choose the subset which gives the maximum product. However, the professor asked Panda only to submit the maximum product obtained by taking exactly two numbers from the list. Please help Panda in finding out the answer to this assignment.

Input Format:

The first line will contain the integer N, the length of the array. The next line contains N space separated integers.

Output Format:

For each test case, output Panda's query.

Constraints:

2 <= N <= 105

Subtask 1: (25 points)
0 <= Integers <= 10^9

Subtask 2: (75 points)
-10^9 <= Integers <= 10^9
*/
#include <stdio.h>
#define debug 1
int main()
{
  int t_no;
  long long int n1,n2,nn1,nn2,input,r1,r2;
  n1=n2=nn1=nn2=0;
  scanf("%d",&t_no);
  if (debug)
  {
    printf("No of testcases %d\n",t_no);
  }
  for(;t_no>0;t_no--)
  {
    scanf("%lld",&input);
    if (debug)
    {
      printf("Number read %lld\n",input);
    }
    if (input > n1)
    {
      n2=n1;
      n1=input;
    }
    if(input < n1 && input > n2)
      n2=input;
    if(input < nn1)
    {
      nn2=nn1;
      nn1=input;
    }
    if(input > nn1 && input < nn2)
      nn2=input;
  }
  if (debug)
    printf("%lld %lld %lld %lld\n",n1,n2,nn1,nn2);
  if((r1=n1*n2) < (r2=nn1*nn2))
  {
    printf("%lld\n",r2);
  }
  else
    printf("%lld\n",r1);
}
