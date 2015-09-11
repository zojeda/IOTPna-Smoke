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
      controller: function($window, $scope, $http, $log) {
        var self = this;
        this.error = undefined;
        $http.get('/api/thresholds/thermometer')
            .success(function(data) {
                self.thermometer = { 
                    type: data[0].type,
                    value: data[0].default, 
                    min: data[0].min, 
                    max: data[0].max 
                }
            })
            .error(function(data) {
                $log.log('Error: ' + data);
            });
        
        $http.get('/api/thresholds/smoke')
            .success(function(data) {
                self.smokeLevel = {
                    type: data[0].type,
                    value: data[0].default, 
                    min: data[0].min, 
                    max: data[0].max 
                }
            })
            .error(function(data) {
                $log.log('Error: ' + data);
            });
          
        $http.get('/api/thresholds/humidity')
            .success(function(data) {
                self.humidity = { 
                    type: data[0].type,
                    value: data[0].default, 
                    min: data[0].min, 
                    max: data[0].max 
                }
            })
            .error(function(data) {
                $log.log('Error: ' + data);
            });
             
        var socketio = $window.io.connect(this.url);

        socketio.on('data', function(data) {
          var time = new Date(data.time);

          self.historicalChartConfig.series[0].data.push([time.getTime(), data.temperature]);
          self.historicalChartConfig.series[1].data.push([time.getTime(), data.smoke]);
          self.error = undefined;
          self.thermometer.value = data.temperature;
          self.smokeLevel.value = data.smoke;
          self.humidity.value = data.humidity;
          $scope.$apply();
        });
        socketio.on('error', function(message) {
          self.error = message;      
          $scope.$apply();
        });

        socketio.on('status', function(message) {
          self.status = message;
          $scope.$apply();
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
