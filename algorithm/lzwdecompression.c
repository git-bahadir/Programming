/* Filename: $RCSfile: lzwdecompression.c,v $*/
static char *RCSinfo="$Id: lzwdecompression.c,v 1.1.1.1 2012/08/06 02:08:17 chakra Exp $";


/*
=============================================================================================
Modification log
-----------------
Date		revision Number	Description						Author
----		---------------	-----------						------

=============================================================================================
*/

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#define FOUND 1
#define NOTFOUND 0

#define USER_TYPE

typedef struct tbl
{
	int code;
//	char nstring[10];
	char *nstring;
}U_TYPE;
#include "RB_TREE.h"
struct rb_node *root;

//codetbl[73741824];
int tbl_id=0;
int next_code=256;
char string[20];
char character;
FILE *input;
FILE *temp;
U_TYPE srchout;
/*open the file in input mode*/
void openfile()
{
	if ((input=fopen("/home/chakra/Programming/datain.txt","r"))==NULL) 
	{
		printf("Opening of input file failed/n");
		exit(8);
	}
	if ((temp=fopen("/home/chakra/Programming/temp.txt","w"))==NULL)
	{
		printf("Opening of output failed/n");
		exit(8);
	}
}
char getinputchar()
{
	/*read a particular character from the file*/
	return getc(input);
}
int search(char *s,char c)
{
	int n=0;
	char s1[20];
	s1[0]='\0';
	strcpy(s1,s);
	n=strlen(s1);
	s1[n]=c;
	s1[n+1]='\0';

/*	for(n=0;n<tbl_id;n++)
	{
		if(strcmp(s1,codetbl[n].nstring)==0)
		{
			return FOUND;
		}
	}*/
	if (string_search(root,s1))
		return FOUND;
	return NOTFOUND;	
}
int string_search(struct rb_node *n,char *s)
{
	int x=0;
	if (n==EXT)
		return 0;
	if((x=strcmp(s,n->value.nstring))==0)
	{	
		srchout=n->value;
		return 1;
	}
	else if(x<0)
		string_search(n->left,s);
	else
		string_search(n->right,s);
		
}
void addstr(char *s,char c)
{
	int n=0;
	char s1[20];
	s1[0]='\0';
	strcpy(s1,s);
	n=strlen(s1);
	s1[n]=c;
	s1[n+1]='\0';
	strcpy(s,s1);
}
void printcode(char *s)
{
	int n=0;
	if (string_search(root,s))
	{
	//		printf("%d,",srchout.code);
			fwrite(&srchout.code,4,1,temp);
			return;
	}	
	char s1[20]="/0";
	strcpy(s1,s);
	n=0;
	n=s1[0];
	fwrite(&n,4,1,temp);
}
int mycomp(U_TYPE *n1,U_TYPE *n2)
{
	if (strcmp(n1->nstring,n2->nstring) <= 0)
		return 0;
	return 1;
}
void addcode(char *s,char c)
{	
	int n=0;
	U_TYPE temp1;
	char s1[20];
	s1[0]='\0';
	strcpy(s1,s);
	n=strlen(s1);
	s1[n]=c;
	s1[n+1]='\0';
	temp1.code=next_code++;
	if ((temp1.nstring=(char *)malloc(strlen(s1)))==NULL)
	{
		printf("\nMemory Allocation failure for string\n");
		exit(10);
	}
	strcpy(temp1.nstring,s1);
	root=add(root,temp1,(int (*) (void *,void *))mycomp);
/*	codetbl[tbl_id].code=next_code++;	
	strcpy(codetbl[tbl_id++].nstring,s1);*/
	
}

void move(char *s,char c)
{
	s[0]=c;
	s[1]='\0';
}
int main()
{
	openfile();
	string[0]=getinputchar();	
	string[1]='\0';
	while((character=getinputchar())!=EOF)		
	{
		if (search(string,character) == FOUND )
		{
			addstr(string,character);
		}
		else
		{
			printcode(string);
			addcode(string,character);
			move(string,character);
			/*fprintf(temp,"%d\n",tbl_id);*/
		}	
	}
	printf("\n%d :",next_code);
return 0;
}

