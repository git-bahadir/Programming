/******************************************************************************
   ** Heap sort implementation.
   ** Author      : Chakravarthi Ponmudi
   ** Date        : 20/10/2012
   ** Header File : heapsort.h
******************************************************************************/
struct heap
{
  int heapsize;
  int heaplen;
  int *array; 
};
int heapsort(struct heap *hptr);
int build_max_heap(struct heap *hptr);
int max_heapify(struct heap *hptr,int node);
