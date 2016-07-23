/*
   **insertion sort.c
   **author     : chakravarthi
   **date       : 22/10/2012
   ** logic to implement insertion sort
*/
#include <stdio.h>
int insertionsort(int *p,int len)
{
  int i,j;
  int key;
  for(j=2;j<=len;j++)
  {
    key=p[j];
    i=j-1;
    while(i>0 && p[i]>key)
    {
      p[i+1]=p[i];
      i--;
    }
    p[i+1]=key;
  }
  return 0;
}

