'use strict';

angular.module('smokeWebClient')
  .directive('hxHumidityValue', function() {
    function link(scope, element, attrs) {

      var humidityValue;

      function updateHumidityValue() {
        if (humidityValue) {
        }
      }
      scope.$watch(attrs.level, function(value) {
        humidityValue = value;
        updateHumidityValue();
      });
      updateHumidityValue();
    }
    return {
      templateUrl: 'app/directives/humidityValue.svg',
      link: link
    };
  });
