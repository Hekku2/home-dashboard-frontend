'use strict';

/**
 * Dummy JS file for smart IDEs like php/webStorm.
 *
 * Purpose of this file is to help IDE to use autocomplete features.
 */

var layout = {
  menuItem: {
    state: string,
    title: string,
    access: number
  }
};

var settings = {
  backendUrl: string,
  frontend: {
    hostnames: {
      production: string,
      development: string
    },
    ports: {
      production: number,
      development: number
    }
  }
};
