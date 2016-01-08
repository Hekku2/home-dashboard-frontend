/**
 * Angular module for frontend.details.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
  'use strict';

  // Define frontend.public module
  angular.module('frontend.details.about', []);

  // Module configuration
  angular.module('frontend.details.about')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('details.about', {
            url: '/about',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/details/about/about.html'
              },
              'pageNavigation@': false
            }
          })
        ;
      }
    ])
  ;
}());
