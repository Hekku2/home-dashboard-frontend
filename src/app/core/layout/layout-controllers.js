/**
 * This file contains all necessary Angular controller definitions for 'frontend.core.layout' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  /**
   * Generic header controller for application layout. this contains all necessary logic which is used on application
   * header section. Basically this contains following:
   *
   *  1) Main navigation
   *  2) Login / Logout
   *  3) Profile
   */
  angular.module('frontend.core.layout')
    .controller('HeaderController', [
      '$scope', '$state',
      'HeaderNavigationItems',
      'UserService', 'AuthService',
      function controller($scope, $state,
                          HeaderNavigationItems,
                          UserService, AuthService) {
        $scope.user = UserService.user;
        $scope.auth = AuthService;
        $scope.navigationItems = HeaderNavigationItems;

        /**
         * Helper function to determine if menu item needs 'not-active' class or not. This is basically
         * special case because of 'details.overview' state.
         *
         * @param   {layout.menuItem}   item    Menu item object
         *
         * @returns {boolean}
         */
        $scope.isNotActive = function isNotActive(item) {
          return !!(item.state === 'details' && $state.current.name === 'details.overview');
        };

        /**
         * Helper function to determine if specified menu item needs 'active' class or not. This is needed
         * because of reload of page, in this case top level navigation items are not activated without
         * this helper.
         *
         * @param   {layout.menuItem}   item    Menu item object
         *
         * @returns {boolean}
         */
        $scope.isActive = function isActive(item) {
          var bits = $state.current.name.toString().split('.');

          return !!(
            (item.state === $state.current.name) ||
            (item.state === bits[0] && $state.current.name !== 'details.overview')
          );
        };

        // Simple helper function which triggers user logout action.
        $scope.logout = function logout() {
          AuthService.logout();
        };
      }
    ])
  ;

  /**
   * Generic navigation controller for application layout. This contains all necessary logic for pages sub-navigation
   * section. Basically this handles following:
   *
   *  1) Sub navigation of the page
   *  2) Opening of information modal
   */
  angular.module('frontend.core.layout')
    .controller('NavigationController', [
      '$scope', '$state', '$uibModal',
      '_items',
      function controller($scope, $state, $uibModal,
                          _items) {
        $scope.navigationItems = _items;
      }
    ])
  ;
}());
