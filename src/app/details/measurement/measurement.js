/**
 * Measurement component to wrap all measurement specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.details.measurement' angular module.
 */
(function() {
  'use strict';

  // Define frontend.details.measurement angular module
  angular.module('frontend.details.measurement', []);

  // Module configuration
  angular.module('frontend.details.measurement')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Measurement list
          .state('details.measurements', {
            url: '/details/measurements',
            views: {
              'content@': {
                templateUrl: '/frontend/details/measurement/list.html',
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
          .state('details.measurement', {
            url: '/details/measurement/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/details/measurement/measurement.html',
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
          .state('details.measurement.add', {
            url: '/details/measurement/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/details/measurement/add.html',
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
