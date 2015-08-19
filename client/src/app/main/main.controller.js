'use strict';

angular.module('smokeWebClient')
  .controller('MainCtrl', function($scope, $window, $log) {
    $scope.sensorDevices = [];
    $scope.apkDir = $window.location.origin + '/apk/android-debug.apk';
    $scope.cordovaClient = $window.cordova !== undefined;
    if ($scope.cordovaClient) {
      $window.ZeroConf.watch('_sensorGrid._tcp.local.', function(event) {
        $log.log(event);
        var url = event.service.urls[0];
        if (event.action === 'added') {
          $scope.sensorDevices.push({
            location: url,
            name: event.service.name
          });
          $scope.$apply();
        }
        if (event.action === 'removed') {
          for (var i in $scope.sensorDevices) {
            if ($scope.sensorDevices[i].location === url) {
              $scope.sensorDevices.splice(i, 1);
              break;
            }
          }
        }
      });
    } else {
      var webServer = $window.location.origin;
      $scope.sensorDevices.push({
        location: webServer,
        name: 'web'
      });
    }
  });
