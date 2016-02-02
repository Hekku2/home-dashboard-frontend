/**
 * Angular module for frontend.details.overview component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function () {
  'use strict';

  // Define frontend.public module
  angular.module('frontend.details.overview', []);

  // Module configuration
  angular.module('frontend.details.overview')
    .config([
      '$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('details.overview', {
            url: '/overview',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/details/overview/overview.html',
                controller: 'OverviewController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'SensorOverviewModel',
                    function resolve(ListConfig,
                                     SensorOverviewModel) {
                      return SensorOverviewModel.load();
                    }
                  ]
                }
              },
              'pageNavigation@': false
            }
          })
        ;
      }
    ])
  ;
}());
