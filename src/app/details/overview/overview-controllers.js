/**
 * This file contains all necessary Angular controller definitions for 'frontend.details.overview' module.
 * Purpose of the overview is to show most recent values of most interesting sensors.
 */
(function() {
  'use strict';

  // Controller which contains all necessary logic for sensor list GUI on boilerplate application.
  angular.module('frontend.details.overview')
    .controller('OverviewController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig',
      'SocketHelperService', 'UserService', 'SensorOverviewModel',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig,
        SocketHelperService, UserService, SensorOverviewModel
      ) {
        // Set current scope reference to model

        // Set initial data
        SensorOverviewModel.sensorOverview()
          .then(
            function onSuccess(data) {
              $scope.currentValues = data;
            }
          );
      }
    ])
  ;
}());
