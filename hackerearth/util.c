#include <stdio.h>
#include <unistd.h>

/*Read a line from input and remove the new line from the input*/
int readinput(FILE *fp,char *buf,size_t len)
{
  len=getline(&buf,&len,fp);
  if (buf[len-1] == '\n')
    buf[len-1] = '\0';
  return len;
}
