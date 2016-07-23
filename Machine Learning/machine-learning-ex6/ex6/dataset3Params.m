function [C, sigma] = dataset3Params(X, y, Xval, yval)
%EX6PARAMS returns your choice of C and sigma for Part 3 of the exercise
%where you select the optimal (C, sigma) learning parameters to use for SVM
%with RBF kernel
%   [C, sigma] = EX6PARAMS(X, y, Xval, yval) returns your choice of C and 
%   sigma. You should complete this function to return the optimal C and 
%   sigma based on a cross-validation set.
%

% You need to return the following variables correctly.
range1=[0.01; 0.03; 0.1; 0.3; 1; 3];
C = 1;
sigma = 0.3;
error_pred = 0;


% ====================== YOUR CODE HERE ======================
% Instructions: Fill in this function to return the optimal C and sigma
%               learning parameters found using the cross validation set.
%               You can use svmPredict to predict the labels on the cross
%               validation set. For example, 
%                   predictions = svmPredict(model, Xval);
%               will return the predictions on the cross validation set.
%
%  Note: You can compute the prediction error using 
%        mean(double(predictions ~= yval))
%
error_exp=100;
c1=0;
sigma1=0;
k=1;
for i = 1:length(range1)
   C=range1(i);
   for j= 1:length(range1)
        sigma=range1(j);
        model= svmTrain(X, y, C, @(x1, x2) gaussianKernel(x1, x2, sigma)); 
         predictions = svmPredict(model, Xval);
         error_pred = mean(double(predictions ~= yval));
         if (error_pred < error_exp)
             c1=C;
             sigma1=sigma;
             error_exp=error_pred;
         endif
         k=k+1;
   endfor
endfor   
C=c1;
sigma=sigma1;
% =========================================================================

end
