#include<stdio.h>
#include<stdlib.h>
#define USER_TYPE
typedef long U_TYPE;		
#include"RB_TREE.h"

int mycomp(U_TYPE *a1, U_TYPE *a2)
{
	return 1;
}
struct rb_node *root;  //Defining a root node. No duplicates of root are allowed.
int main()
{
	
	int i;
	for (i=0;i<10;i++)
	{
		root=add(root,i,(int (*) (void *,void *))mycomp);
	}
//	treeprint(root);
	exit(0);
}
