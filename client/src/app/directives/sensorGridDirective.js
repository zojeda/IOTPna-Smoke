'use strict';

angular.module('smokeWebClient')
  .directive('hxSensorGrid', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/sensorGrid.html',
      scope: {
        url: '='
      },
      controllerAs: 'grid',
      controller: function($window) {
        var self = this;
        this.error = undefined;

        this.thermometer = {
          value: '100'
        };
        this.smokeLevel = {
          value: '50'
        };
        this.humidity = {
          value: '50'
        };

        var socketio = $window.io.connect(this.url);

        socketio.on('data', function(data) {
          var time = new Date(data.time);

          self.historicalChartConfig.series[0].data.push([time.getTime(), data.temperature]);
          self.historicalChartConfig.series[1].data.push([time.getTime(), data.smoke]);
          self.thermometer.value = data.temperature;
          self.error = undefined;
          self.smokeLevel.value = data.smoke;
          self.$apply();
        });
        socketio.on('error', function(message) {
          self.error = message;
          self.$apply();
        });

        socketio.on('status', function(message) {
          self.status = message;
          self.$apply();
        });

        this.historicalChartConfig = {
          options: {
            chart: {
              zoomType: 'x'
            },
            rangeSelector: {
              enabled: true
            },
            navigator: {
              enabled: true
            }
          },
          series: [],
          title: {
            text: 'Historical Data'
          },
          useHighStocks: true
        };
        this.historicalChartConfig.series.push({
          id: 'Temperature',
          data: []
        },   {
          id: 'Smoke/Gas',
          data: []

        });
      }
    };
  });
