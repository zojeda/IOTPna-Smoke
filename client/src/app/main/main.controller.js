'use strict';

angular.module('smokeWebClient')
  .controller('MainCtrl', function($scope) {
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
        text: 'Hello'
      },
      useHighStocks: true
    };
    $scope.historicalChartConfig.series.push({
       id: 1,
       data: [
           [1147651200000, 23.15],
           [1147737600000, 23.01],
           [1147824000000, 22.73],
           [1147910400000, 22.83],
           [1147996800000, 22.56],
           [1148256000000, 22.88],
           [1148342400000, 22.79],
           [1148428800000, 23.50],
           [1148515200000, 23.74],
           [1148601600000, 23.72],
           [1148947200000, 23.15],
           [1149033600000, 22.65]
       ]
   },   {
       id: 2,
       data: [
           [1147651200000, 25.15],
           [1147737600000, 25.01],
           [1147824000000, 25.73],
           [1147910400000, 25.83],
           [1147996800000, 25.56],
           [1148256000000, 25.88],
           [1148342400000, 25.79],
           [1148428800000, 25.50],
           [1148515200000, 26.74],
           [1148601600000, 26.72],
           [1148947200000, 26.15],
           [1149033600000, 26.65]
       ]

   }

   );

    $scope.thermometer = {
      value: '100'
    }
    $scope.smokeLevel = {
      value: '50'
    }
  })
  .directive('ngThermometer', function() {
    return {
      templateUrl: '../app/directives/thermometer.html'
    }
  })
  .directive('ngSmokeLevel', function() {
    return {
      templateUrl: '../app/directives/smokeLevel.html'
    }
  });
