/*Algorithms -design and analysis part 1
count inversion */
#include<stdio.h>
#include<stdlib.h>
#define DIVIDE_LIMIT 3
#define debug
//function prototype
int *read(int *);	// function to read the data
void divide_sort_merge(int *array, int n); //driver function to do actual task of counting inversion
void copy_left_array(int *full_set,int *sub_set,int ss_cnt);
void copy_right_array(int *full_set,int *sub_set,int rss_cnt,int lss_cnt) ;

void count_inversion_sort(int *array,int n);
void merge_count(int *array,int *l_array,int *r_array,int l_noe,int r_noe);
//Global Variables

int num_of_inverse=0;
int temp[]={5,8,4,28,6,2,14,15,19,54,14,10,65,94,100};

//MAIN
int main()
{
/*Read the data */
int num_of_elements;
int *p = read(&num_of_elements);

divide_sort_merge(p,num_of_elements);
printf("\n The number of inversions in the given array is :%i\n",num_of_inverse);
return(0);
}
/* divide_sort_merge as suggest is a three step alogrithm.It divides the problem to a smaller subset and finds the inversion. Once done, sort the array. Then it merges the smaller sorted array to arrive @ bigger sorted array.*/

void divide_sort_merge(int *array, int n)
{
#if defined debug
	printf("\ninside divide_sort_merge and the array passed is :\n");
	int d_i =0;
	for (d_i =0;d_i<n;d_i++)
		printf("\t%i",array[d_i]);
#endif
	if (n > DIVIDE_LIMIT)
	{
		int *r_array,*l_array,r_noe,l_noe; // right array, left array, number of elements in right and left.
		if (n%2 == 0)
		{
			l_noe=r_noe=n/2;
		}
		else
		{
			l_noe = (n-1)/2;
			r_noe = (n+1)/2;
		}
		r_array = malloc(r_noe * sizeof(int));
		l_array = malloc(l_noe * sizeof(int));
		copy_left_array(array,l_array,l_noe);
		divide_sort_merge(l_array,l_noe);
		copy_right_array(array,r_array,r_noe,l_noe);
		divide_sort_merge(r_array,r_noe);
		merge_count(array,l_array,r_array,l_noe,r_noe);
	}
	else
	{
		count_inversion_sort(array,n);
	}	
	
}
int *read(int *n) //temporary implementation for this function.
 {
	*n=15;
	
	return temp;
}
void copy_left_array(int *full_set,int *sub_set,int ss_cnt)  //whole array, sub_set array and no_of elements in the subset
{
	int i =0;
	for (i=0;i<ss_cnt;i++)
		sub_set[i]=full_set[i];
}
void copy_right_array(int *full_set,int *sub_set,int rss_cnt,int lss_cnt) //whoel array, sub_set array, count of subset, offset in the whole array
{
	int i=0,temp;
	for (i=0;i<rss_cnt;i++)
	{
		temp=lss_cnt+i;
		sub_set[i]=full_set[temp];		
	}

}
void count_inversion_sort(int *array,int n)
{
#if defined debug
	printf("\n inside count_inversion_sort\n");
#endif
//count the inversion   N will always be less than or equal to divide limt
	int i=0,j=0;
	int temp;
	for(i=0;i<n;i++)
	{
		for(j=i+1;j<n;j++)
		{
#if defined debug
			printf("\nComparing element %i & %i\n",array[i],array[j]);
#endif
			if (array[i] > array[j])
			{
				 num_of_inverse++;
#if defined debug
				printf("Incrementing num of inverse %i\n",num_of_inverse);
#endif
			}

		}
	}
//sort the array
	for(i=0;i<n;i++)
	{
		for(j=i+1;j<n;j++)
		{
			if(array[i] > array[j])
			{
				temp=array[j];
				array[j]=array[i];
				array[i]=temp;	
			}
		}
	}
#if defined debug
	printf("\n sorted array is :\n");
	for (i=0;i<n;i++)
		printf("\t%i",array[i]);
#endif

	
}
//Function to count the split inversions
void merge_count(int *array,int *l_array,int *r_array,int l_noe,int r_noe)
{
#if defined debug
	printf("\ninside merge and count function and number of inversion is %i\n",num_of_inverse);
	printf("\n\tl_array\tr_array\tarray\n");
#endif
	int total_elements = l_noe + r_noe;
	int i=0,j=0,k=0;
	for (i=j=k=0; k< total_elements;k++)
	{
#if defined debug
		printf("\t%i\t%i",l_array[i],r_array[j]);
#endif
		if (i >= l_noe)
		{
			array[k]=r_array[j];
			j++;
		}
		else if (j>=r_noe)
		{
			array[k]=l_array[i];
			i++;
		}
		else if (l_array[i] > r_array[j])
		{
			array[k]=r_array[j];
			 num_of_inverse= num_of_inverse + l_noe - (j+1);
			j++;
		}
		else if(l_array[i] <= r_array[j])
		{
			array[k]=l_array[i];
			i++;
		}
#if defined debug
		printf("\t%i\n",array[k]);
#endif		
	}
#if defined debug
		printf("\nNumber of inverse is %i\n",num_of_inverse);
#endif
			
}
