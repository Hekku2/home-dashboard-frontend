/**
 * Sensor component to wrap all sensor specified stuff together. This component is divided to following logical
 * components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.details.sensor' angular module.
 */
(function () {
  'use strict';

  // Define frontend.details.sensor angular module
  angular.module('frontend.details.sensor', ['chart.js']);

  // Module configuration
  angular.module('frontend.details.sensor')
    .config([
      'moment',
      '$stateProvider',
      function config(moment, $stateProvider) {
        $stateProvider
        // Sensors list
          .state('details.sensors', {
            url: '/details/sensors',
            views: {
              'content@': {
                templateUrl: '/frontend/details/sensor/list.html',
                controller: 'SensorListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'SensorModel',
                    function resolve(ListConfig,
                                     SensorModel) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'measurements,group',
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
          .state('details.sensor', {
            url: '/details/sensor/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/details/sensor/sensor.html',
                controller: 'SensorController',
                resolve: {
                  _sensor: [
                    '$stateParams',
                    'SensorModel',
                    function resolve($stateParams,
                                     SensorModel) {
                      return SensorModel.fetch($stateParams.id, {populate: 'group'});
                    }
                  ],
                  _measurements: [
                    '$stateParams',
                    'MeasurementModel',
                    function resolve($stateParams,
                                     MeasurementModel) {
                      return MeasurementModel.load({
                        sensor: $stateParams.id,
                        limit: config.itemsPerPage,
                        where: {'timestamp':{greaterThan: moment().subtract(1, 'days')}},
                        sort: 'timestamp DESC'
                      });
                    }
                  ],
                  _measurementsCount: [
                    '$stateParams',
                    'MeasurementModel',
                    function resolve($stateParams,
                                     MeasurementModel) {
                      return MeasurementModel.count({sensor: $stateParams.id});
                    }
                  ]
                }
              }
            }
          })

          // Add new sensor
          .state('details.sensor.add', {
            url: '/details/sensor/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/details/sensor/add.html',
                controller: 'SensorAddController'
              }
            }
          })
        ;
      }
    ])
  ;
}());
