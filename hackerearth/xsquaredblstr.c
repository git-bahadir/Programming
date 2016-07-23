#include <stdio.h>
#include <unistd.h>
#define debug 0 
#define strsize 103
int isdblstr(char *,int);
int f1(char *s1,char *s2,char *s);
int readinput(FILE *fp,char *buf,size_t len)
{
  len=getline(&buf,&len,fp);
  if (buf[len-1] == '\n')
    buf[len-1] = '\0';
  if (buf[len-2] == '\r')
    buf[len-2]='\0';
  return len;
}
int main()
{
  char string[strsize];   //contains the input from the test file
  int len;            //length of the input string
  int t_no;           //number of testcases

  len=strsize;           // maximum size of possible input
  if((len=readinput(stdin,string,len)) <=0)
    return -1;
  sscanf(string,"%d",&t_no);
  if (debug)
    printf("Number of testcases : %d\n",t_no);
  for(;t_no>0;t_no--)
  {
    len=strsize;
    if ((len=readinput(stdin,string,len)) <=0)
      return -2;
    if (debug)
      printf("\n%s.\n",string);
    if (isdblstr(string,len))
      printf("Yes\n");
    else
      printf("No\n");
  }
}
int isdblstr(char *str,int len)
{
  char *s1,*s2;
  int i=0;
  int run=1;
  int pvlen=0,tlen=0;
  s1=str;
  while(*s1 != '\0')
  {
    s2=s1+1;
    run=1;
    for (;*s2 != '\0' && run ;s2++)
    {
      if (*s1 == *s2)
      {
        run=0;
        tlen=1+f1(s1+1,s2+1,s2);
      }
    }
    if (pvlen < tlen)
      pvlen=tlen;
    s1++;
  }
  if (debug)
    printf("String with maxium length of %d for string %s found\n",pvlen,str);
  return pvlen;
}
int f1(char *s1,char *s2,char *s)
{
  int tlen=0;
  char *ts2;
  if (*s2 == '\0')
    return tlen;
  for (;s1 < s && tlen ==0;s1++)
  {
    ts2=s2;
    for (;*ts2!='\0' && tlen==0;ts2++)
    {
      if (*s1 == *ts2)
      {
        tlen=1+f1(s1+1,ts2+1,s);

      }
    }
  }
  return tlen;
}


