'use strict';
/* global zxcvbn*/

var sc = angular.module('stellarClient');

sc.controller('PasswordCtrl', function($scope) {  
  $scope.loading = false;
  $scope.passwordConfirmation = '';
  $scope.passwordLevel = null;
  $scope.passwordStrength = '';
  $scope.rawScore = 0;
  
  $scope.$watch('data.password', function(newValue, oldValue) {
    if (newValue === '') {
      $scope.passwordLevel = null;
      $scope.passwordStrength = '';
      $scope.rawScore = 0;
      return;
    }
    var score = zxcvbn(newValue).score;
    $scope.rawScore = score;
    $scope.status.passwordValid = (score > 3);
    $scope.errors.passwordErrors = [];
    $scope.checkConfirmPassword();

    if (score < 2) {
      $scope.passwordLevel = 'level1';
      $scope.passwordStrength = 'WEAK';
    } else if (score < 3) {
      $scope.passwordLevel = 'level2';
      $scope.passwordStrength = 'ALMOST';
    } else if (score < 4) {
      $scope.passwordLevel = 'level3';
      $scope.passwordStrength = 'GOOD';
    } else {
      $scope.passwordLevel = 'level4';
      $scope.passwordStrength = 'STRONG';
    }
  });

  $scope.checkConfirmPassword = function(){
    $scope.status.passwordConfirmValid = ($scope.data.password === $scope.data.passwordConfirmation);

    if($scope.status.passwordConfirmValid) {
      $scope.errors.passwordConfirmErrors = [];
    }
  };

  $scope.passwordClass = function(){
    return $scope.status.passwordValid ? 'glyphicon-ok' : 'glyphicon-none';
  };

  $scope.confirmPasswordClass = function(){
    if($scope.status.passwordConfirmValid) {
      return 'glyphicon-ok';
    } else {
      var passwordPrefix = $scope.data.password.slice(0, $scope.data.passwordConfirmation.length);
      return $scope.data.passwordConfirmation !== passwordPrefix ? 'glyphicon-remove' : 'glyphicon-none';
    }
  };

  // Validate the passwords are valid and matching.
  function validateInput() {
    // Remove any previous error messages.
    $scope.errors.passwordErrors        = [];
    $scope.errors.passwordConfirmErrors = [];

    var validInput = true;

    if(!$scope.data.password){
      validInput = false;
      $scope.errors.passwordErrors.push('The password field is required.');
    }
    else if(!$scope.status.passwordValid){
      validInput = false;
      $scope.errors.passwordErrors.push('The password is not strong enough.');
    }
    else if(!$scope.status.passwordConfirmValid){
      validInput = false;
      $scope.errors.passwordConfirmErrors.push('The passwords do not match.');
    }

    return validInput;
  }

  $scope.validators.push(validateInput);
});
