'use strict';

angular.module('midwestApp')
  .controller('UserSettingsCtrl', function ($scope, $rootScope, universityResource, User, session, $timeout, $location) {
    $scope.universities = [];
    $scope.isReady = false;
    $scope.isError = false;

    universityResource().then(function(resp) {
      $scope.universities = resp.universities;
    });

    $scope.updateUserInfo = function() {
      $scope.isReady = false;
      $scope.editedUser.$update(function(resp) {
        $rootScope.currentUser = resp.user;
        $scope.isReady = true;
        $location.path('/dashboard');
      }, function(resp) {
        $scope.isError = true;
        $scope.isReady = true;
        console.log('Failed to update user info, response : ', resp);
      });
    };

    var populateForm = function(currentUserVal) {
      if (currentUserVal !== undefined && $scope.editedUser === undefined) {
        $scope.editedUser = new User({id: 'me'});
        $scope.editedUser.first_name = $rootScope.currentUser.first_name;
        $scope.editedUser.last_name = $rootScope.currentUser.last_name;
        $scope.editedUser.university = $rootScope.currentUser.university.name;
        $scope.editedUser.email = $rootScope.currentUser.email;
        $scope.isReady = true;
      }
    };

    $rootScope.$watch('currentUser', populateForm);

  });
