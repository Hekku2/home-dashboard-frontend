/**
 * Measurement component to wrap all measurement specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.examples.measurement' angular module.
 */
(function() {
  'use strict';

  // Define frontend.examples.measurement angular module
  angular.module('frontend.examples.measurement', []);

  // Module configuration
  angular.module('frontend.examples.measurement')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Measurement list
          .state('examples.measurements', {
            url: '/examples/measurements',
            views: {
              'content@': {
                templateUrl: '/frontend/examples/measurement/list.html',
                controller: 'MeasurementListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'MeasurementModel',
                    function resolve(
                      ListConfig,
                      MeasurementModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        limit: config.itemsPerPage,
                        sort: 'timestamp DESC'
                      };

                      return MeasurementModel.load(parameters);
                    }
                  ],
                  _count: [
                    'MeasurementModel',
                    function resolve(MeasurementModel) {
                      return MeasurementModel.count();
                    }
                  ],
                  _sensors: [
                    'SensorModel',
                    function resolve(SensorModel) {
                      return SensorModel.load();
                    }
                  ]
                }
              }
            }
          })

          // Single measurement
          .state('examples.measurement', {
            url: '/examples/measurement/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/examples/measurement/measurement.html',
                controller: 'MeasurementController',
                resolve: {
                  _measurement: [
                    '$stateParams',
                    'MeasurementModel',
                    function resolve(
                      $stateParams,
                      MeasurementModel
                    ) {
                      return MeasurementModel.fetch($stateParams.id, {populate: 'sensor'});
                    }
                  ]
                }
              }
            }
          })

          // Add new measurement
          .state('examples.measurement.add', {
            url: '/examples/measurement/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/examples/measurement/add.html',
                controller: 'MeasurementAddController',
                resolve: {
                  _sensors: [
                    'SensorModel',
                    function resolve(SensorModel) {
                      return SensorModel.load();
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
