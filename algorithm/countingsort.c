/******************************************************************************
   ** countingsort.c
   ** a sorting algorithm with a a running O(n+k)
   ** quite an efficient algorithm.
   ** author    chakravarthi
   ** written   26/10/2012
*******************************************************************************/
#include <stdio.h>
#include <stdlib.h>
/*
   **counting_sort is sort that uses the counting technique to sort the elements
   ** and array. It running at the worst case is O(n+k). If k=O(n), then the 
   ** running time of this routine is theta(n).
   ** this routine has 3 parameters being passed
   **   1) Array to be sorted
   **   2) number of the elements in the array
   **   3) number of elements to be counted.
*/
int counting_sort(int *a,int len, int k)
{
  int *b,*c;
  int i,j;
  if ((b=malloc(len*sizeof(int)))==NULL)
  {
    printf("Memory allocation failed \n");
    return -1;
  }
  if ((c=malloc(k*sizeof(int)))==NULL)
  {
    printf("Memory allocation failed for counting array\n");
    return -1;
  }
  for (i=0;i<=k;i++)
    c[i]=0;             /*init counting array*/
  for (j=0;j<len;j++)
    c[a[j]]=c[a[j]]+1;
  for (i=1;i<=k;i++)
    c[i]=c[i]+c[i-1];
  for(j=len-1;j>=0;j--)
  {
    b[c[a[j]]]=a[j];
    c[a[j]]=c[a[j]]-1;
  }
}





