%create training sets,Cross Validation sets and test sets
clear all;
newparam;
data=Data;
clear Data;
[m n]=size(data);
y=[data(:,n)];

no_of_doorsets = size(find(y==1));
no_of_addrsets = size(find(y==2));
no_of_lmsets = size(find(y==3));

dx1 = idivide (no_of_doorsets*60 , 100,"fix");
dx2 = idivide (no_of_doorsets*20 , 100,"fix");
dx3 = no_of_doorsets - dx1 - dx2;


ax1 = idivide (no_of_addrsets*60 , 100,"fix");
ax2 = idivide (no_of_addrsets*20 , 100,"fix");
ax3 = no_of_addrsets - dx1 - dx2;

lx1 = idivide (no_of_lmsets*60 , 100,"fix");
lx2 = idivide (no_of_lmsets*20 , 100,"fix");
lx3 = no_of_lmsets - lx1 - lx2;


dset = data(find(y==1),:);
aset = data(find(y==2),:);
lset = data(find(y==3),:);

trainset = [dset(1:dx1,:);aset(1:ax2,:);lset(1:lx1,:)];
cvset = [dset(dx1+1:dx1+dx2,:);aset(ax1+1:ax1+ax2,:);lset(lx1+1:lx1+lx2,:)];
testset=[dset(dx1+dx2+1:dx1+dx2+dx3,:);aset(ax1+ax2+1:ax1+ax2+ax3,:);lset(lx1+lx2+1:lx1+lx2+lx3,:)];

save -binary trainset.mat trainset;
save -binary cvset.mat cvset;
save -binary testset.mat testset;

clear all;
