/**
 * Angular module for examples component. This component is divided to following logical components:
 *
 *  frontend.examples.about
 *  frontend.examples.sensor
 *  frontend.examples.measurement
 *
 * Each component has it own configuration for ui-router.
 */
(function() {
  'use strict';

  // Define frontend.admin module
  angular.module('frontend.examples', [
    'frontend.examples.about',
    'frontend.examples.sensor',
    'frontend.examples.measurement'
  ]);

  // Module configuration
  angular.module('frontend.examples')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('examples', {
            parent: 'frontend',
            data: {
              access: 1
            },
            views: {
              'content@': {
                controller: [
                  '$state',
                  function($state) {
                    $state.go('examples.measurements');
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
                      return ContentNavigationItems.getItems('examples');
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
