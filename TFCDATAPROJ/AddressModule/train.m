%%This is function is to test if the address module will work fine or not
clear all;
close all;
clc;
load trainset;
[M N]=size(trainset);

X=trainset(:,1:N-1);
y=trainset(:,N);
%%plotData(X,y);
tempY=y;
y(find(tempY==1),1)=0;
y(find(tempY==2),1)=0;
y(find(tempY==3),1)=1;


[m n] = size(X);

X = [ones(m, 1) X];

initial_theta = zeros(n + 1, 1);
lambda = .01;

% Set Options
options = optimset('GradObj', 'on', 'MaxIter', 400);

% Optimize
[theta, J, exit_flag] = ...
	fminunc(@(t)(costFunctionReg(t, X, y, lambda)), initial_theta, options);
	
% Print theta to screen
fprintf('Cost at theta found by fminunc after adding regularisation: %f\n', J);
%fprintf('theta: \n');
%fprintf(' %f \n', theta);

load cvset;
CV_X=cvset(:,1:N-1);
CV_y=cvset(:,N);
CV_y(find(CV_y==1),1)=0;
CV_y(find(CV_y==2),1)=0;
CV_y(find(CV_y==3),1)=1;


CV_X= [ones(size(CV_X,1), 1) CV_X];
pred = predict(theta,CV_X);
fprintf('\nTraining Set Accuracy: %f\n', mean(double(pred == CV_y)) * 100);
save ltheta.mat theta;

load testset;
test_X=testset(:,1:N-1);
test_y=testset(:,N);


test_y(find(test_y==1),1)=0;
test_y(find(test_y==2),1)=0;
test_y(find(test_y==3),1)=1;

test_X = [ones(size(test_X,1), 1) test_X];
pred = predict(theta,test_X);
fprintf('\nTraining Set Accuracy on test set: %f\n', mean(double(pred == test_y)) * 100);



