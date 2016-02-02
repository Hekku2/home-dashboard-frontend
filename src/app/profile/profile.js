/**
 * Profile component to wrap all profile specified stuff together. This component is divided to following logical
 * components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.profile' angular module.
 */
(function () {

  'use strict';
  angular.module('frontend.profile', ['frontend']);

  // Module configuration
  angular.module('frontend.profile')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
        // Single user
          .state('profile', {
            parent: 'frontend',
            url: '/profile',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/profile/profile.html',
                controller: 'ProfileController'
              }
            }
          })
        ;
      }
    ])
  ;
}());

