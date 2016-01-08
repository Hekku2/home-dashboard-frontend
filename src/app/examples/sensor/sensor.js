/**
 * Sensor component to wrap all sensor specified stuff together. This component is divided to following logical
 * components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.examples.sensor' angular module.
 */
(function() {
  'use strict';

  // Define frontend.examples.sensor angular module
  angular.module('frontend.examples.sensor', []);

  // Module configuration
  angular.module('frontend.examples.sensor')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Sensors list
          .state('examples.sensors', {
            url: '/examples/sensors',
            views: {
              'content@': {
                templateUrl: '/frontend/examples/sensor/list.html',
                controller: 'SensorListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'SensorModel',
                    function resolve(
                      ListConfig,
                      SensorModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'measurements',
                        limit: config.itemsPerPage,
                        sort: 'name ASC'
                      };

                      return SensorModel.load(parameters);
                    }
                  ],
                  _count: [
                    'SensorModel',
                    function resolve(SensorModel) {
                      return SensorModel.count();
                    }
                  ]
                }
              }
            }
          })

          // Single sensor
          .state('examples.sensor', {
            url: '/examples/sensor/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/examples/sensor/sensor.html',
                controller: 'SensorController',
                resolve: {
                  _sensor: [
                    '$stateParams',
                    'SensorModel',
                    function resolve(
                      $stateParams,
                      SensorModel
                    ) {
                      return SensorModel.fetch($stateParams.id);
                    }
                  ],
                  _measurements: [
                    '$stateParams',
                    'MeasurementModel',
                    function resolve(
                      $stateParams,
                      MeasurementModel
                    ) {
                      return MeasurementModel.load({sensor: $stateParams.id});
                    }
                  ],
                  _measurementsCount: [
                    '$stateParams',
                    'MeasurementModel',
                    function resolve(
                      $stateParams,
                      MeasurementModel
                    ) {
                      return MeasurementModel.count({sensor: $stateParams.id});
                    }
                  ]
                }
              }
            }
          })

          // Add new sensor
          .state('examples.sensor.add', {
            url: '/examples/sensor/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/examples/sensor/add.html',
                controller: 'SensorAddController'
              }
            }
          })
        ;
      }
    ])
  ;
}());
