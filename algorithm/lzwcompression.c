/* Filename: $RCSfile: lzwcompression.c,v $*/
static char *RCSinfo="$Id: lzwcompression.c,v 1.1.1.1 2012/08/06 02:08:17 chakra Exp $";
/*
Program to compress the data using the LZW algorithm.
source :-http://marknelson.us/1989/10/01/lzw-data-compression/
LZW Fundamentals

The original Lempel Ziv approach to data compression was first 
published in in 1977, followed by an alternate approach in 1978.
Terry Welch's refinements to the 1978 algorithm were published
in 1984. The algorithm is surprisingly simple. In a nutshell,
LZW compression replaces strings of characters with single codes.
It does not do any analysis of the incoming text. Instead, it just
adds every new string of characters it sees to a table of strings.
Compression occurs when a single code is output instead of a string
of characters.

The code that the LZW algorithm outputs can be of any arbitrary length,
but it must have more bits in it than a single character. The first 256
codes (when using eight bit characters) are by default assigned to the standard
character set. The remaining codes are assigned to strings as the algorithm proceeds.
The sample program runs as shown with 12 bit codes. This means codes 0-255
refer to individual bytes, while codes 256-4095 refer to substrings.
Compression

The LZW compression algorithm in its simplest form is shown in Figure 1.
A quick examination of the algorithm shows that LZW is always trying to 
output codes for strings that are already known. And each time a new code 
is output, a new string is added to the string table.

Routine LZW_COMPRESS
PLAIN TEXT
CODE:

   1. STRING = get input character
   2. WHILE there are still input characters DO
   3.  CHARACTER = get input character
   4.  IF STRING+CHARACTER is in the string table then
   5.    STRING = STRING+character
   6.  ELSE
   7.    output the code for STRING
   8.    add STRING+CHARACTER to the string table
   9.    STRING = CHARACTER
  10.  END of IF
  11. END of WHILE
  12. output the code for STRING


The Compression Algorithm
Figure 1

A sample string used to demonstrate the algorithm is shown in Figure 2.
The input string is a short list of English words separated by the '/' character.
Stepping through the start of the algorithm for this string, you can see that the
first pass through the loop, a check is performed to see if the string "/W" is in the table.
Since it isn't, the code for '/' is output, and the string "/W" is added to the
table. Since we have 256 characters already defined for codes 0-255,
the first string definition can be assigned to code 256. After the third letter,
'E', has been read in, the second string code, "WE" is added to the table, and the
code for letter 'W' is output. This continues until in the second word, the characters 
'/' and 'W' are read in, matching string number 256. In this case, the code 256 is output, 
and a three character string is added to the string table. The process continues until 
the string is exhausted and all of the codes have been output.


Input String = /WED/WE/WEE/WEB/WET
Character Input 	Code Output 	New code value 	New String
/W 			/ 		256 		/W
E 			W		257		WE
D 			E 		258 		ED
/ 			D 		259 		D/
WE 			256 		260 		/WE
/ 			E 		261 		E/
WEE 			260 		262 		/WEE
/W 			261 		263		E/W
EB 			257 		264 		WEB
/ 			B 		265 		B/
WET 			260 		266 		/WET
EOF 			T

The Compression Process
Figure 2

The sample output for the string is shown in Figure 2 along with the 
resulting string table. As can be seen, the string table fills up rapidly, 
since a new string is added to the table each time a code is output. In this 
highly redundant input, 5 code substitutions were output, along with 7 characters. 
If we were using 9 bit codes for output, the 19 character input string would be 
reduced to a 13.5 byte output string. Of course, this example was carefully chosen 
to demonstrate code substitution. In real world examples, compression usually doesn't 
begin until a sizable table has been built, usually after at least one hundred or 
so bytes have been read in.
*/
/*

=============================================================================================
Modification log
-----------------
Date		revision Number	Description				Author
----		---------------	-----------				------
20-Apr-2010	1.0-1.3		nothing big difference			Chakravarthi Ponmudi
19-May-2010 	1.4         	Implemented to use RB Tree      	Chakravarthi Ponmudi
22-May-2010	1.5		Change tbl to hold char pointer		Chakravarthi Ponmudi
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

