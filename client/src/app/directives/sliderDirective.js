'use strict';

angular.module('smokeWebClient')
  .directive('hxSlider', function($http) {
    function link(scope, element, attrs) {
        var type;
        var min;
        var max;

        function updateSlider() {
            if (type && min >= 0 && max >= 0) {
                element.find('#slider').attr("id", type + "_slider");
                element.find('#minValue').attr("id", type + "_minValue");
                element.find('#maxValue').attr("id", type + "_maxValue");
                
                var slider = document.getElementById(type + "_slider");
                
                noUiSlider.create(slider, {
                    start: [ min, max ],
                    step: 1,
                    margin: 1,
                    connect: true,
                    direction: 'ltr', 
                    behaviour: 'tap-drag',
                    range: {
                        'min': 0,
                        'max': 100
                    },
                    pips: {
                        mode: 'count',
                        values: 11
                    }
                });
                
                slider.noUiSlider.on('update', function(values, handle ) {
                    $("#" + type + "_minValue").text(values[0]);
                    $("#" + type + "_maxValue").text(values[1]);
                });
                
                slider.noUiSlider.on('change', function(values, handle ) {
                    var threshold = { 
                            min: values[0],
                            max: values[1]
                        };

                    $http.put('/api/thresholds/' + type, threshold);
                });
            }
        }

        scope.$watchGroup([attrs.type, attrs.min, attrs.max] , function(newValues, oldValues) {
            type = newValues[0];
            min = newValues[1];
            max = newValues[2];
            updateSlider();
        });
        
        updateSlider();
    }

    return {
      templateUrl: 'app/directives/slider.html',
      link: link
    };
});
