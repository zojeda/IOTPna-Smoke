'use strict';

angular.module('smokeWebClient')
.controller('MainCtrl', function ($scope) {
    $scope.thermometer = {
        value: '100'
    }
    $scope.smokeLevel = {
        value: '50'
    }    
  })
.directive('ngThermometer', function(){
    return {
        templateUrl: '../app/directives/thermometer.html'
    }
})
.directive('ngSmokeLevel', function(){
    return {
        templateUrl: '../app/directives/smokeLevel.html'
    }
});
