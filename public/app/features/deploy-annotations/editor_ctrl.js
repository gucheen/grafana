define([
  'angular',
  'lodash'
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('DeployAnnotationsEditorCtrl', function($scope) {
    const annotationDefaults = {
      "datasource": "timeline",
      "enable": false,
      "iconColor": "rgba(255, 96, 96, 1)",
      "name": "deploy_annotations",
      "query": '',
      "textField": "desc",
      "titleField": "title",
      "deployTag": true
    };

    $scope.init = function() {
      $scope.appId = '';
      if (_.isArray($scope.dashboard.annotations.list)) {
        const deployAnnotation = _.find($scope.dashboard.annotations.list, 'deployTag');
        $scope.deployAnnotation = deployAnnotation || annotationDefaults;
        if ($scope.deployAnnotation.query) {
          $scope.appId = $scope.deployAnnotation.query.substr(6);
        }
      } else {
        $scope.dashboard.annotations.list = [];
      }
    };

    $scope.update = function() {
      $scope.deployAnnotation.query = 'appId:' + $scope.appId;
      $scope.broadcastRefresh();
    };

    $scope.add = function() {
      const query = 'appId:' + $scope.appId;
      $scope.deployAnnotation = _.assign(
        annotationDefaults,
        {
          query: query,
          enable: true
        }
      );
      $scope.dashboard.annotations.list.push($scope.deployAnnotation);
      $scope.broadcastRefresh();
    };

    $scope.removeAnnotation = function() {
      var index = _.findIndex($scope.dashboard.annotations.list, 'deployTag');
      $scope.dashboard.annotations.list.splice(index, 1);
      $scope.appId = '';
      $scope.broadcastRefresh();
    };

  });

});
