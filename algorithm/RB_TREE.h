/*RB Tree Simulation
Date : 12th may  2010
Author : Chakravarthi Ponmudi
Source : Wikipedia 

A Generic RB Data_structure Header file. Once this header file is included, any
program will be able to use the feature of the Red Black TREE in their program.


Version 0.0 

Simulating only insertion - Reason being simple */
#define RED 1
#define BLACK 0
#define TRUE 1
#define FALSE 0

#if !defined(USER_TYPE)
typedef int U_TYPE;
#endif
 
#include<stdio.h>
#include<stdlib.h>
//Declaration of RED-BLACK Node
struct rb_node
{
	U_TYPE value;
	struct rb_node *parent;
	struct rb_node *left;
	struct rb_node *right;
	int color;  // RED=1 BLACK =0
};

//RB-Tree Interfacing functions
struct rb_node *add(struct rb_node *p,U_TYPE n,int (*comp)(void *,void *));
//void treeprint(struct rb_node *p);
int numcmp(U_TYPE *,U_TYPE *);



