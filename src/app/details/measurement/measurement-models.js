/**
 * This file contains all necessary Angular model definitions for 'frontend.details.measurement' module.
 *
 * Note that this file should only contain models and nothing else. Also note that these "models" are just basically
 * services that wraps all things together.
 */
(function () {
  'use strict';

  /**
   * Model for Measurement API, this is used to wrap all Measurement objects specified actions and data change actions.
   */
  angular.module('frontend.details.measurement')
    .factory('MeasurementModel', [
      'DataModel',
      function factory(DataModel) {
        return new DataModel('measurement');
      }
    ])
  ;
}());
