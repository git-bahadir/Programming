clear all;
clc;
load doortheta.mat;
dtheta=theta;
clear theta;
load addtheta.mat;
atheta=theta;
clear theta;
load lmtheta.mat;
lmtheta=theta;
clear theta;

X;
y;

testset=[X y];

%load testset;

test_X=testset(:,1:50);
test_X= [ones(size(test_X,1), 1) test_X];
test_y=testset(:,51);
temp_y=test_y;


test_y(find(temp_y==1),1)=1;
test_y(find(temp_y==2),1)=0;
test_y(find(temp_y==3),1)=0;
pred1 = predict(dtheta,test_X);
fprintf('\nTraining Set Accuracy for doors: %f\n', mean(double(pred1 == test_y)) * 100);

test_y(find(temp_y==1),1)=0;
test_y(find(temp_y==2),1)=1;
test_y(find(temp_y==3),1)=0;
pred2 = predict(atheta,test_X);
fprintf('\nTraining Set Accuracy for address: %f\n', mean(double(pred2 == test_y)) * 100);


test_y(find(temp_y==1),1)=0;
test_y(find(temp_y==2),1)=0;
test_y(find(temp_y==3),1)=1;
pred3 = predict(lmtheta,test_X);
fprintf('\nTraining Set Accuracy for landmark: %f\n', mean(double(pred3 == test_y)) * 100);

