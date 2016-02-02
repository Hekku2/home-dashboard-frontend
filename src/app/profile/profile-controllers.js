/**
 * This file contains all necessary Angular controller definitions for 'frontend.profile' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single user on GUI.
  angular.module('frontend.profile')
    .controller('ProfileController', [
      '$scope', '$state',
      'UserService',
      function controller($scope, $state,
                          UserService) {
        // Expose necessary data
        $scope.user = UserService.user();
      }
    ])
  ;
}());
