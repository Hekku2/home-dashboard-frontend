/**
 * This file contains all necessary Angular service definitions for 'frontend.core.layout' module.
 *
 * Note that this file should only contain services and nothing else.
 */
(function () {
  'use strict';

  // Generic service to return all available menu items for main level navigation.
  angular.module('frontend.core.layout')
    .factory('HeaderNavigationItems', [
      'AccessLevels',
      function factory(AccessLevels) {
        return [
          {
            state: 'details.overview',
            title: 'Overview',
            access: AccessLevels.anon
          },
          {
            state: 'details',
            title: 'Details',
            access: AccessLevels.user
          },
          {
            state: 'admin',
            title: 'Admin',
            access: AccessLevels.admin
          }
        ];
      }
    ])
  ;

  // Generic service to return all available menu items for specified sub level navigation.
  angular.module('frontend.core.layout')
    .factory('ContentNavigationItems', [
      'AccessLevels',
      function factory(AccessLevels) {
        var items = {
          'details': [
            {
              state: 'details.sensors',
              title: 'Sensors',
              access: AccessLevels.user
            }
          ],
          'admin': [
            {
              state: 'admin.users',
              title: 'Users',
              access: AccessLevels.admin
            },
            {
              state: '',
              title: 'Request log',
              access: AccessLevels.admin
            },
            {
              state: 'admin.login-history',
              title: 'Login history',
              access: AccessLevels.admin
            }
          ]
        };

        return {
          getItems: function getItems(section) {
            return items[section];
          }
        };
      }
    ])
  ;
}());
