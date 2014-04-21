/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';

		$routeProvider.when('/', {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html'
		}).when('/:state', {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html'
		}).when('/:state/:status', {
		  controller: 'TodoCtrl',
		  templateUrl: 'todomvc-index.html'
		}).otherwise({
			redirectTo: '/'
		});
	});
