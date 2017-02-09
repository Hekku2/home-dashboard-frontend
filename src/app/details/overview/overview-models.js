/**
 * This file contains all necessary Angular model definitions for 'frontend.details.overview' module.
 */
(function () {
  'use strict';

  /**
   * Model for Sensor API, this is used to wrap all Overview objects specified actions and data change actions.
   */
  angular.module('frontend.details.overview')
    .factory('SensorOverviewModel', [
      '$log',
      'DataModel', 'DataService',
      function factory($log,
                       DataModel, DataService) {
        var model = new DataModel('sensor');

        model.sensorOverview = function sensorOverview() {
          var self = this;

          return DataService
            .collection(self.endpoint + '/sensorOverview', {})
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('SensorOverviewModel.sensorOverview() failed.', error, self.endpoint);
              }
            )
            ;
        };

        return model;
      }
    ])
  ;
}());
