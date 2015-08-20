'use strict';

angular.module('smokeWebClient')
  .directive('hxThermometer', function() {
    function link(scope, element, attrs) {

      var temperature;

      function updateTemp() {
        if (temperature) {
          var yval = (250 / 130) * (120 - temperature);
          element.find('#temp_val_rect').attr('y', yval);
        }
      }
      scope.$watch(attrs.temp, function(value) {
        temperature = value;
        updateTemp();
      });
      updateTemp();
    }

    return {
      templateUrl: 'app/directives/thermometer.svg',
      link: link
    };
  });
