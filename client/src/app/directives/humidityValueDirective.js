'use strict';

angular.module('smokeWebClient')
  .directive('hxHumidityValue', function() {
    function link(scope, element, attrs) {

      var humidityValue;

      function updateHumidityValue() {
        if (humidityValue) {
          var opacityValue = "opacity:" + humidityValue/100.0;
          element.find('#humidity_value').attr('style', opacityValue);
        }
      }
      scope.$watch(attrs.value, function(value) {
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
