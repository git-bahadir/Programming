function [theta, J_history] = gradientDescent(X, y, theta, alpha, num_iters)
%GRADIENTDESCENT Performs gradient descent to learn theta
%   theta = GRADIENTDESENT(X, y, theta, alpha, num_iters) updates theta by 
%   taking num_iters gradient steps with learning rate alpha

% Initialize some useful values

m = length(y); % number of training examples
X(10,:), y(10), theta, alpha, num_iters
pause

J_history = zeros(num_iters, 1);
grad = zeros(size(theta));
for iter = 1:num_iters

   [ J_history(iter) theta] = costFunction(theta,X, y);

end

end
