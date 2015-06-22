'use strict';

angular.module('smokeWebClient')
  .controller('MainCtrl', function($scope, socketio) {

    socketio.on('data', function(data) {
      var time = new Date(data.time);

      $scope.historicalChartConfig.series[0].data.push([time.getTime(), data.temperature]);
      $scope.historicalChartConfig.series[1].data.push([time.getTime(), data.smoke]);
    })
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
        text: 'Datos Historicos'
      },
      useHighStocks: true
    };
    $scope.historicalChartConfig.series.push({
        id: 1,
        data: []
      },   {
        id: 2,
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
