#include <cstdio>
#include <iostream>
#define cc_int int
class city
{
  private:
    cc_int no_of_connections;
    cc_int city_name;
    /*stack city*/
  public:
    city(cc_int i)
    {
      city_name=i;
      no_of_connections=0;
    }
    void destroy_city();
    void add_connection(city *new_city);
}
void city::add_connection(city *new_city)
{
  no_of_connections++;
  /*add new_city to the stack*/
}
int main()
{
  cc_int total_ciites,total_connections;
  scanf("%lld %lld",&total_city,&total_connections);
  if (debug)
  {
    printf("Total City %lld,Total Connections %lld\n",total_city,total_connections);
  }
  
  
}
