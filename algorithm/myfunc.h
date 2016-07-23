#include <stdio.h>
#define CHAR 1
#define INT 2
#define DOUBLE 3
#define FLOAT 4
int readfile(FILE *fp,void *p,int in_type, int out_type)
{
  int byte_read;
  while((byte_read=getc(fp))!=EOF)
  {
    switch (in_type)
    {
      case CHAR:
        if (byte_read=10)                 /* A new line read?          */
          return 0;                       /* Yes, return the value read*/
        else                              /* No, convert to INT        */
        {                                 
          *p=*p*10+(byte_read-0x30);
        }
      case default:
        printf("Format received is not yet suported\n");
        return -1;
    } 
  }
}
 
