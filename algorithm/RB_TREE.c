#include<stdio.h>
#include<stdlib.h>
#include"RB_TREE.h"
//Shouldn't be accesible by others.
static struct rb_node *node;  //Defining a new node.
static struct rb_node *NEW_ROOT; //place holder for a new ROOT
static struct rb_node *EXT=NULL;//&leaf_node;   //external node/leaf node
static struct rb_node *house;  //node on which house keeping is required.
static int FTT=TRUE;         //First time initialisation
static int ROOT_CHANGE=FALSE; //Root Change indicator. Indicate if any change
							  //in the root node.
//prototypes
//RB-Tree Functions
static struct rb_node *grandparent(struct rb_node *n);
static struct rb_node *uncle(struct rb_node *n);
static void rotate_right(struct rb_node *n);
static void rotate_left(struct rb_node *n);
static struct rb_node *create_node();
static struct rb_node *add_node(struct rb_node *p,struct rb_node *n,struct rb_node *p_parent,
						int (*comp)(void *,void *));
static struct rb_node *initialise_root(struct rb_node *p,U_TYPE n);
static void perform_housekeeping(struct rb_node *n);
static void case2(struct rb_node *n);
static void case3(struct rb_node *n);
static void case4(struct rb_node *n);
static void case5(struct rb_node *n);
//return Grandparent of a node;
static struct rb_node *grandparent(struct rb_node *n)
{
	if ((n!=EXT) && (n->parent != EXT))
	{
		return n->parent->parent;
	}
	else
		return EXT;
}
//return Uncle of a node
static struct rb_node *uncle(struct rb_node *n)
{
	struct rb_node *g = grandparent(n);
	if (g==EXT)
	{
		return EXT;
	}
	if (n->parent == g->left)
		return g->right;
	else
		return g->left;
}
//rotating right on pivot node n
static void rotate_right(struct rb_node *n)
{
#if defined(debug)
	printf("\nRotating right on %p",n);
#endif	
	fflush(stdout);
	ROOT_CHANGE=FALSE;
	int left_child=0;
	struct rb_node *f_parent,*left_node;
	f_parent=n->parent;
	left_node=n->left;
	if (f_parent != EXT)
	{
		if (n==f_parent->right)
			f_parent->right=left_node;
		else if(n==f_parent->left)
			f_parent->left=left_node;
		else
		{
			printf("error in right rotation\n");
			exit(10);
		}
	}
	else
	{
		ROOT_CHANGE= TRUE;
	}
	left_node->parent=n->parent;
	n->left=left_node->right;
	if (left_node->right != EXT)
	{
		left_node->right->parent=n;
	}
	left_node->right=n;
	n->parent=left_node;
	if (ROOT_CHANGE)
		NEW_ROOT=n->parent;
}
//rotating left on pivot node n
static void rotate_left(struct rb_node *n)
{
#if defined(debug)
	printf("\nRotating left on %p",n);
#endif
	fflush(stdout);
	struct rb_node *f_parent,*right_node;
	f_parent=n->parent;
	right_node=n->right;
	if (f_parent !=EXT)
	{
		if (n==f_parent->right)
			f_parent->right=right_node;
		else if(n==f_parent->left)
			f_parent->left=right_node;
		else
		{
			printf("error in left rotation\n");
			exit(10);
		}
	}
	else
	{
		ROOT_CHANGE= TRUE;
	}
	right_node->parent=n->parent;
	n->right=right_node->left;
	if (right_node->left != EXT)
	{
		right_node->left->parent=n;
	}
	right_node->left=n;
	n->parent=right_node;
	if (ROOT_CHANGE)
		NEW_ROOT=n->parent;

}
//allocating memory of creating the new node
static struct rb_node *create_node()
{
	struct rb_node *temp;
	if ((temp=(struct rb_node *)malloc(sizeof(struct rb_node)))==NULL)
	{
		printf("Creating new node failed\n");
		exit(10);
	}
	return temp;
}
static struct rb_node *add_node(struct rb_node *p,struct rb_node *n,struct rb_node *p_parent,int (*comp)(void *,void *))
{
	if (p==EXT)
	{
		p=n;
		p->left=EXT;
		p->right=EXT;
		p->parent=p_parent;
		house=p;
		return p;
	}
	if ((*comp)(&p->value,&n->value) <=0 )
		p->right=add_node(p->right,n,p,comp);
	else
		p->left= add_node(p->left,n,p,comp);
/*	if (p->value <= n->value)
		p->right=add_node(p->right,n,p);
	else
		p->left= add_node(p->left,n,p);*/
	return p;
}
int numcmp (U_TYPE *x1, U_TYPE *x2)
{
	if (x1<x2)
		return -1;
	else if(x1==x2)
		return 0;
	else
		return 1;
}
		
static struct rb_node *initialise_root(struct rb_node *p,U_TYPE n)
{
	p=create_node();
	p->color=BLACK;
	p->parent=EXT;
	p->left=EXT;
	p->right=EXT;
	p->value=n;
	return p;
}
struct rb_node *add(struct rb_node *p,U_TYPE n,int (*comp)(void *,void *))
{
	if (FTT)
	{
		p=initialise_root(p,n);  //first node created,so must be root.
		FTT=FALSE;
		return p;
	}
	struct rb_node *temp;	 //subsequent additions. 
	temp=create_node();	//create new node and...
	temp->color=RED;	//...color it red...
	temp->value=n; 		//..assign the value and finally...
	p=add_node(p,temp,p->parent,comp);	// ...add to the root.
//	printf("\nbefore house keeping");
//	treeprint(p);
	perform_housekeeping(house); //maintain rb tree properties
	if (ROOT_CHANGE)
	{
		p=NEW_ROOT;
		ROOT_CHANGE=FALSE;
	}
	return p;		//return root node back.
}
static void perform_housekeeping(struct rb_node *n)
{
/*House keeping will make sure that all the 5 properties of RB tree is maintained.
Case 1: The new node N is at the root of the tree. In this case, it is repainted black to satisfy Property 2 (The root is black).
 Since this adds one black node to every path at once, Property 5 (All paths from any given node to its leaf nodes contain the same number of black nodes) is not violated.*/
	if (n->parent==EXT)
	{
		 n->color=BLACK;
#if defined(debug)
		printf("\ncase 1\n");
#endif
	}
	else
		case2(n);
}
static void case2(struct rb_node *n)
{
/*Case 2: The new node's parent P is black, so Property 4 (Both children of every red node are black) is not invalidated.
 In this case, the tree is still valid. Property 5 (All paths from any given node to its leaf nodes contain the same number of black nodes) is not threatened,
 because the new node N has two black leaf children, but because N is red, the paths through each of its children have the same number of black nodes as the path through the leaf it replaced, 
which was black, and so this property remains satisfied.*/
	if(n->parent->color == BLACK)
	{
#if defined(debug)
		printf("\ncase 2\n");
#endif
		return;   /*adding a red node to black. Tree is valid*/
	}
	else
	{
		case3(n);
	}
}
static void case3(struct rb_node *n)
{
/*Case 3: If both the parent P and the uncle U are red, then both nodes can be repainted black and the grandparent G becomes red (to maintain Property 5 (All paths from any given node to its leaf 
nodes contain the same number of black nodes)). Now, the new red node N has a black parent. Since any path through the parent or uncle must pass through the grandparent,
 the number of black nodes on these paths has not changed. However, the grandparent G may now violate properties 2 (The root is black) or 4 (Both children of every red node are black)
 (property 4 possibly being violated since G may have a red parent). To fix this, this entire procedure is recursively performed on G from case 1.
 Note that this is a tail-recursive call, so it could be rewritten as a loop; since this is the only loop, and any rotations occur after this loop, this proves that a constant number of rotations occur.*/
	struct rb_node *u=uncle(n), *g;
	if((u!=EXT) && (u->color== RED))
	{
		n->parent->color=BLACK;
		u->color=BLACK;
		g=grandparent(n);
		g->color=RED;
		perform_housekeeping(g);
#if defined(debug)
		printf("\ncase 3\n");
#endif
	}
	else
	{
		case4(n);
	}
}
static void case4(struct rb_node *n)
{
/*Case 4: The parent P is red but the uncle U is black; also, the new node N is the right child of P, and P in turn is the left child of its parent G. 
In this case, a left rotation that switches the roles of the new node N and its parent P can be performed; then, the former parent node P is dealt with using Case 5 (relabeling N and P) because property 4
 (Both children of every red node are black) is still violated. The rotation causes some paths (those in the sub-tree labelled "1") to pass through the new node where they did not before,
 but both these nodes are red, so Property 5 (All paths from any given node to its leaf nodes contain the same number of black nodes) is not violated by the rotation.*/
	struct rb_node *g=grandparent(n);
	if((n==n->parent->right) && (n->parent == g->left))
	{
		rotate_left(n->parent);
		n=n->left;
#if defined(debug)
		printf("\ncase 4.1\n");
#endif
	}
	else if((n==n->parent->left) && (n->parent == g->right))
	{
		rotate_right(n->parent);
		n=n->right;
#if defined(debug)
		printf("\ncase 4.2\n");
#endif
	}
	case5(n);
}
static void case5(struct rb_node *n)
{
/*Case 5: The parent P is red but the uncle U is black, the new node N is the left child of P, and P is the left child of its parent G. In this case, a right rotation on the parent of P is performed;
the result is a tree where the former parent P is now the parent of both the new node N and the former grandparent G. G is known to be black, since its former child P could not have been red otherwise.
 Then, the colors of P and G are switched, and the resulting tree satisfies Property 4 (Both children of every red node are black).
 Property 5 (All paths from any given node to its leaf nodes contain the same number of black nodes) also remains satisfied, since all paths that went through any of these three nodes went through G before,
 and now they all go through P. In each case, this is the only black node of the three.*/
	struct rb_node *g=grandparent(n);
	n->parent->color=BLACK;
	g->color=RED;
	if((n==n->parent->left) && (n->parent==g->left))
	{
		rotate_right(g);
	}
	else if((n == n->parent->right) && (n->parent == g->right))
	{
		rotate_left(g);
	}
#if defined(debug)
	printf("\ncase 5\n");
#endif
}
/*void treeprint(struct rb_node *p)
{
	if(p!=EXT)
	{
		treeprint(p->left);
		//if(p==root)
		//	printf("\nMy address:%9p Parent: %9p left:%9p right:%9p value :%3d \t Color:%d  root",p,p->parent,p->left,p->right,p->value,p->color);
		//else
			printf("\nMy address:%9p Parent: %9p left:%9p right:%9p value :%3d \t Color:%d ",p,p->parent,p->left,p->right,p->value,p->color);
		treeprint(p->right);
	}
}*/

