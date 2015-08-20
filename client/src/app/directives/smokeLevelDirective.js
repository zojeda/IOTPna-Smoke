'use strict';

angular.module('smokeWebClient')
  .directive('hxSmokeLevel', function() {
    function link(scope, element, attrs) {

      var smokeLevel;

      function updateSmokeLevel() {
        if (smokeLevel) {
          var yval = -(300 / 181) * smokeLevel + 181;
          element.find('#smoke_level_rect').attr('y', yval);
        }
      }
      scope.$watch(attrs.level, function(value) {
        smokeLevel = value;
        updateSmokeLevel();
      });
      updateSmokeLevel();
    }

    return {
      templateUrl: 'app/directives/smokeLevel.svg',
      link: link
    };
  });
