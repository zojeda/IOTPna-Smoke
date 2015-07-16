'use strict';

angular.module('smokeWebClient')
  .controller('MainCtrl', function($scope, socketio) {
    $scope.error = undefined;

    socketio.on('data', function(data) {
      var time = new Date(data.time);

      $scope.historicalChartConfig.series[0].data.push([time.getTime(), data.temperature]);
      $scope.historicalChartConfig.series[1].data.push([time.getTime(), data.smoke]);
      $scope.thermometer.value = data.temperature;
      $scope.error = undefined;
      $scope.smokeLevel.value = data.smoke;
    });

    socketio.on('error', function(message) {
      $scope.error = message;
    });

    socketio.on('status', function(message) {
      $scope.status = message;
    });

    $scope.historicalChartConfig = {
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
        text: 'Datos'
      },
      useHighStocks: true
    };
    $scope.historicalChartConfig.series.push({
        id: 'Temperature',
        data: []
      },   {
        id: 'Smoke/Gas',
        data: []

      }

    );

    $scope.thermometer = {
      value: '100'
    }
    $scope.smokeLevel = {
      value: '50'
    }
  });
