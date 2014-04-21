/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */


angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, todoStorage) {
	  'use strict';

    var TODO_TYPE_must = 1, TODO_TYPE_should = 2, TODO_TYPE_could = 3;
    function stateToDBValue(state) { if (state === 'should') return TODO_TYPE_should; else if (state === 'could') return TODO_TYPE_could; else return TODO_TYPE_must; }
    function stateHumanValue(state) { if (state === TODO_TYPE_should) return 'should'; else if (state === TODO_TYPE_could) return 'could'; else return 'must'; }


		var todos = $scope.todos = todoStorage.get();

		$scope.newTodo = '';
		$scope.editedTodo = null;

		$scope.$watch('todos', function (newValue, oldValue) {
		  if (!$scope.currentState) $scope.currentState = stateHumanValue(TODO_TYPE_must);
		  $scope.mustCount = $filter('filter')(todos, { state: TODO_TYPE_must }).length;
		  $scope.shouldCount = $filter('filter')(todos, { state: TODO_TYPE_should }).length;
		  $scope.couldCount = $filter('filter')(todos, { state: TODO_TYPE_could }).length;

		  $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
			if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
				todoStorage.put(todos);
			}
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
		  var status = $scope.status = $routeParams.status || '';
		  var currentState = stateToDBValue($routeParams.state);
		  $scope.currentState = $routeParams.state;

			$scope.statusFilter = (status === 'active') ?
				{ completed: false, state: currentState } : (status === 'completed') ?
				{ completed: true, state: currentState } : { state: currentState};
		});

		$scope.addTodo = function () {
			var newTodo = $scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}

			todos.push({
				title: newTodo,
				completed: false,
				state: stateToDBValue($scope.currentState)
			});

			$scope.newTodo = '';
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.doneEditing = function (todo) {
			$scope.editedTodo = null;
			todo.title = todo.title.trim();

			if (!todo.title) {
				$scope.removeTodo(todo);
			}
		};

		$scope.revertEditing = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.doneEditing($scope.originalTodo);
		};

		$scope.removeTodo = function (todo) {
			todos.splice(todos.indexOf(todo), 1);
		};

		$scope.clearCompletedTodos = function () {
			$scope.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				todo.completed = !completed;
			});
		};
	});
