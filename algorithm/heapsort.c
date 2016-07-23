/******************************************************************************
   ** Heap sort implementation.
   ** Author      : Chakravarthi Ponmudi
   ** Date        : 20/10/2012
   ** Source file : heapsort.c
******************************************************************************/
#include "heapsort.h"
#include <stdio.h>
int heapsort(struct heap *hptr)
{
  int i=0;
  int temp=0;
  if (build_max_heap(hptr) != 0)
  {
    printf("\n call to build_max_heap in heapsort failed\n");
    return -1;
  }
  for (i=hptr->heaplen;i>=1;i--)
  {
    temp=hptr->array[0];
    hptr->array[0]=hptr->array[i];
    hptr->array[i]=temp;
    hptr->heapsize--;
    if (max_heapify(hptr,0) != 0)
    {
      printf("\n call to max_heapify in heapsort failed\n");
      return -1;
    }
  }
  return 0;

}
int build_max_heap(struct heap *hptr)
{
  int i=0;
  hptr->heapsize=hptr->heaplen;
  for ( i=hptr->heaplen/2;i>=0;i--)
  {
    if (max_heapify(hptr,i) != 0)
    {
      printf("\n Error in build_max_heap \n");
      return -1;
    }
  }
  return 0;

}
/*
   ** the purpose of this function to maintain the property of the heap
   ** paramter :
   **          heap
   **          node
*/

int max_heapify(struct heap *hptr,int node)
{
  int l_heap=2*(node+1)-1;        /* left node for current node           */    
  int r_heap=2*(node+1);          /* right node for the current node      */
  int largest=0;                  /* temp variable                        */
  int temp;                       /* temp variable                        */
/*
   ** if left node is largest than the parent, then swap the node with. 
   ** Similarly compare the right the new parent,if so, then swap it.
   ** call max heapify on the largest of all three node before swapping
*/
  if (l_heap <= hptr->heapsize)
  {
    if ((hptr->array[l_heap] > hptr->array[node]))
    {
      largest=l_heap;
    }
    else
    {
      largest=node;
    }
  }
  else
  {
    largest=node;
  }
  if (r_heap <= hptr->heapsize)
  {
    if (( hptr->array[r_heap] > hptr->array[largest]))
    {
      largest=r_heap;
    }
  }
  if (largest != node)
  {
    temp=hptr->array[node];
    hptr->array[node] = hptr->array[largest];
    hptr->array[largest]=temp;
    if (max_heapify(hptr,largest) != 0)
    {
      printf("\n Call to Max Heapify failed ****\n");
      return -1;
    }
  }
  return 0;
}

