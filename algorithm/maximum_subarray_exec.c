#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "heapsort.h"
// include "myfunc.h"
#define TRUE 1
#define FALSE 0;
int getint(FILE *);
int main (int argc, char *argv[])
{
  FILE *fp;
  int data,*data_array,*temp_array,total_entries;
  int low,high,sum;
  int first_record = TRUE;
  if (argc==1)
  {
    printf("No file name present\n");
    return 1;
  }
  if((fp=fopen(*++argv,"r"))==NULL)         /* open the input file and if it   */
  {                                         /* fails print the message and exit*/
    printf("Opening of the input file %s failed\n",*argv);
    return 1;
  }
/*
** Read thru the data and store it in a array. while reading, points to be noted,
** 1) first record = total number of records in file
** 2) data records
*/
  printf("\n time at start of the file%d\n",clock());  
  while((data=getint(fp)) !=EOF)
  {
    if (first_record == TRUE)
    {
      if((data_array=(int *)malloc(data*sizeof(int)))==NULL)
      {
        printf("memory allocation for array failed\n");
        return 1;
      }
      total_entries=data;
      first_record = FALSE;
      temp_array=data_array;
    }
    else
    {
      *temp_array=data;
      ++temp_array;
    }
  }
  printf("\n time at end of reading file %d/%d\n",clock(),CLOCKS_PER_SEC);
  low=0;
  high=total_entries-1;
  sum=0;  
/*
   **implementation of counting sort
*/
  counting_sort(data_array,total_entries,20000001);

  
  //find_maximum_subarray(data_array,&low,&high,&sum);
  //printf("\nLow :%d  High:%d  sum:%d",low,high,sum);
/* 
  ** implementor for heapsort
  ** heapsort.c
*/
  struct heap heaper;
  heaper.heaplen=total_entries-1;
  heaper.heapsize=heaper.heaplen;
  heaper.array=data_array;
  printf("\n time at start of the heapsort%d,%d\n",clock(),CLOCKS_PER_SEC);  
  
  if (heapsort(&heaper) != 0)
  {
    printf("call to heapsort failed\n");
    exit -1;
  }
  printf("\n time at end the heapsort%d,%d\n",clock(),CLOCKS_PER_SEC); 
/*
   ** IMplement insertion sort
   **
*/
  printf("\n time at end the insertion sort%d,%d\n",clock(),CLOCKS_PER_SEC);  
  if (insertionsort(data_array,total_entries-1)>0)
  {
    printf("\n error in insertion sort\n");
  }
  printf("\n time at end the insertion sort%d,%d\n",clock(),CLOCKS_PER_SEC);  
  return 0;
}
int getint(FILE *fp)
{
  int data,value;
  int negative=FALSE;
  value=0;
  data=0;
  while((value = getc(fp))!=EOF)
  { 
    if(value==10)
    {
      if (negative)
         data=data*(-1);
      return data;
    }
    else if(value == '-')
    {
      negative=TRUE;
    }
    else
    {
      data=data*10+(value-0x30);
    }
  }
}

