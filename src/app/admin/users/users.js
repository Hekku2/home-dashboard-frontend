/**
 * User component. This component is divided to following logical components:
 *
 *  Controllers
 *
 * All of these are wrapped to 'frontend.admin.login-history' angular module. This also contains necessary route
 * definitions for this module.
 */
(function() {
  'use strict';

  // Define frontend.admin module.users
  angular.module('frontend.admin.users', []);

  // Module configuration
  angular.module('frontend.admin.users')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('admin.users', {
            url: '/admin/users',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/users/list.html',
                controller: 'UserListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'UsersModel',
                    function resolve(
                      ListConfig,
                      UsersModel
                    ) {
                      var parameters = {
                        limit: config.itemsPerPage,
                        sort: 'username ASC'
                      };

                      return UsersModel.load(parameters);
                    }
                  ],
                  _count: [
                    'UsersModel',
                    function resolve(UsersModel) {
                      return UsersModel.count();
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
