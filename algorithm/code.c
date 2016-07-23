int accum=0;
int sum(int x, int y)
{
  int t=x+y;
  accum +=t;
  return t;
}
int main()
{
  int a=0,b=10;
  int ar[10];
  int result=sum(a,b);
  a=result+b;
  ar[0]=a;
}
