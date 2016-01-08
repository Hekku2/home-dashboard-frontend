/**
 * This file contains all necessary Angular controller definitions for 'frontend.details.measurement' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new measurement creation.
  angular.module('frontend.details.measurement')
    .controller('MeasurementAddController', [
      '$scope', '$state',
      'MessageService',
      'MeasurementModel',
      '_sensors',
      function controller(
        $scope, $state,
        MessageService,
        MeasurementModel,
        _sensors
      ) {
        // Store sensors
        $scope.sensors = _sensors;

        // Initialize measurement model
        $scope.measurement = {
          value: 0,
          sensor: '',
          timestamp: new Date()
        };

        /**
         * Scope function to store new measurement to database. After successfully save user will be redirected
         * to view that new created measurement.
         */
        $scope.addMeasurement = function addMeasurement() {
          MeasurementModel
            .create(angular.copy($scope.measurement))
            .then(
              function onSuccess(result) {
                MessageService.success('New measurement added successfully');

                $state.go('details.measurement', {id: result.data.id});
              }
            )
          ;
        };
      }
    ])
  ;

  // Controller to show single measurement on GUI.
  angular.module('frontend.details.measurement')
    .controller('MeasurementController', [
      '$scope', '$state',
      'UserService', 'MessageService',
      'MeasurementModel', 'SensorModel',
      '_measurement',
      function controller(
        $scope, $state,
        UserService, MessageService,
        MeasurementModel, SensorModel,
        _measurement
      ) {
        // Set current scope reference to model
        MeasurementModel.setScope($scope, 'measurement');

        // Initialize scope data
        $scope.user = UserService.user();
        $scope.measurement = _measurement;
        $scope.sensors = [];
        $scope.selectSensor = _measurement.sensor ? _measurement.sensor.id : null;

        // Measurement delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteMeasurement();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        /**
         * Scope function to save the modified measurement. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveMeasurement = function saveMeasurement() {
          var data = angular.copy($scope.measurement);

          // Set sensor id to update data
          data.sensor = $scope.selectSensor;

          // Make actual data update
          MeasurementModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Measurement "' + $scope.measurement.title + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current measurement. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect user back to measurement list.
         */
        $scope.deleteMeasurement = function deleteMeasurement() {
          MeasurementModel
            .delete($scope.measurement.id)
            .then(
              function onSuccess() {
                MessageService.success('Measurement "' + $scope.measurement.title + '" deleted successfully');

                $state.go('details.measurements');
              }
            )
          ;
        };

        /**
         * Scope function to fetch sensor data when needed, this is triggered whenever user starts to edit
         * current measurement.
         *
         * @returns {null|promise}
         */
        $scope.loadSensors = function loadSensors() {
          if ($scope.sensors.length) {
            return null;
          } else {
            return SensorModel
              .load()
              .then(
                function onSuccess(data) {
                  $scope.sensors = data;
                }
              )
            ;
          }
        };
      }
    ])
  ;

  // Controller which contains all necessary logic for measurement list GUI on boilerplate application.
  angular.module('frontend.details.measurement')
    .controller('MeasurementListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'MeasurementModel', 'SensorModel',
      '_items', '_count', '_sensors',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, MeasurementModel, SensorModel,
        _items, _count, _sensors
      ) {
        // Set current scope reference to models
        MeasurementModel.setScope($scope, false, 'items', 'itemCount');
        SensorModel.setScope($scope, false, 'sensors');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.sensors = _sensors;
        $scope.user = UserService.user();

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(MeasurementModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'timestamp',
          direction: false
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
         * Helper function to fetch specified sensor property.
         *
         * @param   {Number}    sensorId        Sensor id to search
         * @param   {String}    [property]      Property to return, if not given returns whole sensor object
         * @param   {String}    [defaultValue]  Default value if sensor or property is not founded
         *
         * @returns {*}
         */
        $scope.getSensor = function getSensor(sensorId, property, defaultValue) {
          defaultValue = defaultValue || 'Unknown';
          property = property || true;

          // Find sensor
          var sensor = _.find($scope.sensors, function iterator(sensor) {
            return parseInt(sensor.id, 10) === parseInt(sensorId.toString(), 10);
          });

          return sensor ? (property === true ? sensor : sensor[property]) : defaultValue;
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch measurement data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch measurement data
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
         * These are fetched via 'MeasurementModel' service with promises.
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
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = MeasurementModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
          ;

          // Fetch actual data
          var load = MeasurementModel
            .load(_.merge({}, commonParameters, parameters))
            .then(
              function onSuccess(response) {
                $scope.items = response;
              }
            )
          ;

          // Load all needed data
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
