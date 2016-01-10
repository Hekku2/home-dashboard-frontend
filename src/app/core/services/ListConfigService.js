/**
 * Simple service to return configuration for generic list. This service contains only
 * getter methods that all list views uses in Boilerplate frontend application.
 *
 * So generally you change these getter methods and changes are affected to all list
 * views on application.
 *
 * @todo text translations
 */
(function() {
  'use strict';

  angular.module('frontend.core.services')
    .factory('ListConfig', [
      '_',
      function factory(_) {
        /**
         * List title item configuration.
         *
         * @type  {{
         *          sensor: *[],
         *          measurement: *[]
         *        }}
         */
        var titleItems = {
          sensor: [
            {
              title: 'Sensor',
              column: 'name',
              class: 'col-xs-10',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Unit',
              column: 'unit',
              class: 'col-xs-11',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Measurements',
              column: false,
              class: 'text-right col-xs-1',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            }
          ],
          measurement: [
            {
              title: 'Value',
              column: false,
              class: 'col-md-1',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Sensor',
              column: 'sensor',
              class: 'col-md-9',
              searchable: true,
              sortable: true,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Timestamp',
              column: 'timestamp',
              class: 'col-md-2 text-right',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            }
          ],
          user: [
            {
              title: 'Username',
              column: 'username',
              class: 'col-md-4',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Name',
              column: 'lastname',
              class: 'col-md-8',
              searchable: true,
              sortable: true,
              inSearch: false,
              inTitle: true
            }
          ],
          userlogin: [
            {
              title: 'IP-address',
              column: 'ip',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Browser',
              column: 'browser',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Operating System',
              column: 'os',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Username',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Login time',
              column: 'createdAt',
              class: 'col-xs-4',
              searchable: false,
              sortable: true,
              inSearch: false,
              inTitle: true
            }
          ]
        };

        return {
          /**
           * Getter method for list default settings.
           *
           * @returns {{
           *            itemCount:            Number,
           *            items:                Array,
           *            itemsPerPage:         Number,
           *            itemsPerPageOptions:  Array,
           *            currentPage:          Number,
           *            where:                {},
           *            loading:              Boolean,
           *            loaded:               Boolean
           *          }}
           */
          getConfig: function getConfig() {
            return {
              itemCount: 0,
              items: [],
              itemsPerPage: 10,
              itemsPerPageOptions: [10, 25, 50, 100],
              currentPage: 1,
              where: {},
              loading: true,
              loaded: false
            };
          },

          /**
           * Getter method for lists title items. These are defined in the 'titleItems'
           * variable.
           *
           * @param   {String}    model   Name of the model
           *
           * @returns {Array}
           */
          getTitleItems: function getTitleItems(model) {
            return _.isUndefined(titleItems[model]) ? [] : titleItems[model];
          }
        };
      }
    ])
  ;
}());
