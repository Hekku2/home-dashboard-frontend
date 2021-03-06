/**
 * This file contains all necessary Angular controller definitions for 'frontend.details.sensor' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller for new sensor creation.
  angular.module('frontend.details.sensor')
    .controller('SensorAddController', [
      '$scope', '$state',
      'MessageService', 'SensorModel',
      function controller($scope, $state,
                          MessageService, SensorModel) {
        // Initialize sensor model
        $scope.sensor = {
          name: '',
          description: ''
        };

        /**
         * Scope function to store new sensor to database. After successfully save user will be redirected
         * to view that new created sensor.
         */
        $scope.addSensor = function addSensor() {
          SensorModel
            .create(angular.copy($scope.sensor))
            .then(
              function onSuccess(result) {
                MessageService.success('New sensor added successfully');

                $state.go('details.sensor', {id: result.data.id});
              }
            )
          ;
        };
      }
    ])
  ;

  // Controller to show single sensor on GUI.
  angular.module('frontend.details.sensor')
    .controller('SensorController', [
      '$scope', '$state', '_', 'moment',
      'UserService', 'MessageService',
      'SensorModel', 'MeasurementModel',
      '_sensor', '_measurements', '_measurementsCount',
      function controller($scope, $state, _, moment,
                          UserService, MessageService,
                          SensorModel, MeasurementModel,
                          _sensor, _measurements, _measurementsCount) {
        // Set current scope reference to models
        SensorModel.setScope($scope, 'sensor');
        MeasurementModel.setScope($scope, false, 'measurements', 'measurementsCount');

        // Expose necessary data
        $scope.user = UserService.user();
        $scope.sensor = _sensor;
        $scope.measurements = _measurements;
        $scope.measurementsCount = _measurementsCount.count;

        // Sensor delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteSensor();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        // Scope function to save modified sensor.
        $scope.saveSensor = function saveSensor() {
          var data = angular.copy($scope.sensor);

          // Make actual data update
          SensorModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Sensor "' + $scope.sensor.name + '" updated successfully');
              }
            )
          ;
        };

        // Scope function to delete sensor
        $scope.deleteSensor = function deleteSensor() {
          SensorModel
            .delete($scope.sensor.id)
            .then(
              function onSuccess() {
                MessageService.success('Sensor "' + $scope.sensor.name + '" deleted successfully');

                $state.go('details.sensors');
              }
            )
          ;
        };

        var times = _.range(24).map(function (x, i) {
          return moment().subtract(24 - i - 1, 'hours');
        });

        var labels = times.map(function (time) {
          return time.format('HH:mm');
        });

        var data = times.map(function (time) {
          var measurementsInRange = _.filter(_measurements, function (measurement) {
            return Math.abs(moment(measurement.timestamp).diff(time)) < 1800000;
          });

          if (measurementsInRange.length === 0) {
            return 0;
          }

          var total = _.sumBy(measurementsInRange, function (item) {
            return item.value;
          });
          return total / measurementsInRange.length;
        });

        $scope.labels = labels;
        $scope.data = [data];
        $scope.series = ['Temperatures'];
      }
    ])
  ;

  // Controller which contains all necessary logic for sensor list GUI on boilerplate application.
  angular.module('frontend.details.sensor')
    .controller('SensorListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig',
      'SocketHelperService', 'UserService', 'SensorModel',
      '_items', '_count',
      function controller($scope, $q, $timeout,
                          _,
                          ListConfig,
                          SocketHelperService, UserService, SensorModel,
                          _items, _count) {
        // Set current scope reference to model
        SensorModel.setScope($scope, false, 'items', 'itemCount');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.user = UserService.user();

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(SensorModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'name',
          direction: true
        };

        // Initialize filters
        $scope.filters = {
          searchWord: '',
          columns: $scope.titleItems
        };

        // Function to change sort column / direction on list
        $scope.changeSort = function changeSort(item) {
          var sort = $scope.sort;

          if (sort.column === item.column) {
            sort.direction = !sort.direction;
          } else {
            sort.column = item.column;
            sort.direction = true;
          }

          _triggerFetchData();
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch sensor data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch sensor data
         * from server.
         */
        $scope.$watch('itemsPerPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _triggerFetchData();
          }
        });

        var searchWordTimer;

        /**
         * Watcher for 'filter' scope variable, which contains multiple values that we're interested
         * within actual GUI. This will trigger new data fetch query to server if following conditions
         * have been met:
         *
         *  1) Actual filter variable is different than old one
         *  2) Search word have not been changed in 400ms
         *
         * If those are ok, then watcher will call 'fetchData' function.
         */
        $scope.$watch('filters', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            if (searchWordTimer) {
              $timeout.cancel(searchWordTimer);
            }

            searchWordTimer = $timeout(_triggerFetchData, 400);
          }
        }, true);

        /**
         * Helper function to trigger actual data fetch from backend. This will just check current page
         * scope variable and if it is 1 call 'fetchData' function right away. Any other case just set
         * 'currentPage' scope variable to 1, which will trigger watcher to fetch data.
         *
         * @private
         */
        function _triggerFetchData() {
          if ($scope.currentPage === 1) {
            _fetchData();
          } else {
            $scope.currentPage = 1;
          }
        }

        /**
         * Helper function to fetch actual data for GUI from backend server with current parameters:
         *  1) Current page
         *  2) Search word
         *  3) Sort order
         *  4) Items per page
         *
         * Actually this function is doing two request to backend:
         *  1) Data count by given filter parameters
         *  2) Actual data fetch for current page with filter parameters
         *
         * These are fetched via 'SensorModel' service with promises.
         *
         * @private
         */
        function _fetchData() {
          $scope.loading = true;

          // Common parameters for count and data query
          var commonParameters = {
            where: SocketHelperService.getWhere($scope.filters)
          };

          // Data query specified parameters
          var parameters = {
            populate: 'measurements',
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = SensorModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
            ;

          // Fetch actual data
          var load = SensorModel
            .load(_.merge({}, commonParameters, parameters))
            .then(
              function onSuccess(response) {
                $scope.items = response;
              }
            )
            ;

          // And wrap those all to promise loading
          $q
            .all([count, load])
            .finally(
              function onFinally() {
                $scope.loaded = true;
                $scope.loading = false;
              }
            )
          ;
        }
      }
    ])
  ;
}());
