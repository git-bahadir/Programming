/*******************************************************************************
  ** FIND_MAXIMUM_SUBARRAY :- Divide and conquer algorithm for find the maximum
  ** contiguos sub array in an array. Written as part of excercise in 
  ** Introduction to Algorithms.
  ** Date Written : 10/10/2012
  ** Written by   : Chakravarthi Ponmudi
  ** version      :0.1
*******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
int g_i=0;
int find_maximum_subarray(int *array,int *low,int *high,int *sum)
{
   int mid=0,mid_1=0;
  int left_sum=0,right_sum=0,cross_sum=0,c_low=0,c_high=0;
  int recur_occ=++g_i;
  int l_low=0,l_high=0,r_low=0,r_high=0;
  if (*low==*high)                          /*If the number of elements is    */
  {
    *sum=array[*low];
    return 0;                               /*only one, return back to caller */
  }
  mid=(*low+*high)/2;                       /* get the mid point of the array */
/*
** Invoke find_maximum_subarray on left half,right half recursively. To find 
** any maximum value on the crossing point call finc_max_crossing_subarray
** function .
*/
  l_low=*low;
  l_high=mid;
  if (find_maximum_subarray(array,&l_low,&l_high,&left_sum) < 0)
    return -1;
  r_low=mid+1;
  r_high=*high;
  if (find_maximum_subarray(array,&r_low,&r_high,&right_sum) < 0)
    return -1;
  c_low=*low;
  c_high=*high;
  if (find_max_crossing_subarray(array,&c_low,&mid,&c_high,&cross_sum)<0)
    return -1;
  if (left_sum >= right_sum && left_sum >=cross_sum)
  {
    *sum=left_sum;
    *low=l_low;
    *high=l_high;
   // return 0;
  }
  else if (right_sum >= left_sum && right_sum >=cross_sum)
  {
    *sum=right_sum;
    *low=r_low;
    *high=r_high;
   // return 0;
  }
  else
  {
    *sum=cross_sum;
   *low=c_low;
    *high=c_high;
  //  return 0;
  }
  return 0; 
}
int find_max_crossing_subarray(int *array, int *low,int *mid,int *high,int *sum)
{
  int left_sum,right_sum,i,max_left=0,max_right=0;
  left_sum=INT_MIN;
  int t_sum=0;
  right_sum=INT_MIN;
  for (i=*mid;i>=*low;i--)
  {
    t_sum+=array[i];
    if (left_sum < t_sum)
    {
      left_sum=t_sum; 
      max_left=i;
    }
  }
  *low=max_left;
  t_sum=0;
  for (i=(*mid)+1;i<=*high;i++)
  {
    t_sum+=array[i];
    if(right_sum < t_sum)
    {
      right_sum=t_sum;
      max_right=i;
    }
  }
  *high=max_right;
  *sum=right_sum+left_sum;
  return 1;
}  
