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

          this.historicalChartConfig.series[0].data.push([time.getTime(), data.temperature]);
          this.historicalChartConfig.series[1].data.push([time.getTime(), data.smoke]);
          this.thermometer.value = data.temperature;
          this.error = undefined;
          this.smokeLevel.value = data.smoke;
          this.$apply();
        });
        socketio.on('error', function(message) {
          this.error = message;
          this.$apply();
        });

        socketio.on('status', function(message) {
          this.status = message;
          this.$apply();
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
