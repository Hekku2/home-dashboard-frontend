/**
 * This file contains all necessary Angular model definitions for 'frontend.admin.users' module.
 */
(function () {
  'use strict';

  /**
   * Model for User API, this is used to wrap all User objects specified actions and data change actions.
   */
  angular.module('frontend.admin.users')
    .service('UsersModel', [
      'DataModel',
      function(DataModel) {
        return new DataModel('user');
      }
    ])
  ;
}());
