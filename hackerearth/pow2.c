#include <stdio.h>
const long long mod = 1000000007;
int n;
int s[500007];

long long  int pow2(int n) {
    long long int base = 3, ans = 1;
    while (n) {
      printf("\n%d",n);
      if (n % 2) ans = (ans * base);
        base = (base * base);
      printf("\n%lld   %lld",base,ans);
      n /= 2;
    }
    return ans;
}
int main()
{
  printf("\n%lld\n",pow2(4));
}
