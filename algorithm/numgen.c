#include <stdio.h>
#include <stdlib.h>
int main()
{
  int n=20000000;
  int i=0;
  int num=0;
  int temp;
  printf("%d\n",n);
  for (i=1;i<=n;i++)
  {
    num=rand()%20000001;
    printf("%d\n",num);
  }
}
