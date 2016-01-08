/**
 * Angular module for details component. This component is divided to following logical components:
 *
 *  frontend.details.overview
 *  frontend.details.sensor
 *  frontend.details.measurement
 *
 * Each component has it own configuration for ui-router.
 */
(function() {
  'use strict';

  // Define frontend.admin module
  angular.module('frontend.details', [
    'frontend.details.overview',
    'frontend.details.sensor',
    'frontend.details.measurement'
  ]);

  // Module configuration
  angular.module('frontend.details')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('details', {
            parent: 'frontend',
            data: {
              access: 1
            },
            views: {
              'content@': {
                controller: [
                  '$state',
                  function($state) {
                    $state.go('details.measurements');
                  }
                ]
              },
              'pageNavigation@': {
                templateUrl: '/frontend/core/layout/partials/navigation.html',
                controller: 'NavigationController',
                resolve: {
                  _items: [
                    'ContentNavigationItems',
                    function resolve(ContentNavigationItems) {
                      return ContentNavigationItems.getItems('details');
                    }
                  ]
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());
