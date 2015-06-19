'use strict';

angular.module('smokeWebClient', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'highcharts-ng'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
