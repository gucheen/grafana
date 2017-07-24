define([
  'angular',
  'lodash'
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('DeployAnnotationsEditorCtrl', function($scope) {
    var COLOR_MAP = {
      rollout: 'rgba(255, 96, 96, 1)',
      rollback: 'rgba(255, 96, 96, 1)'
    };

    var DEPLOY_TYPES = ['rollout', 'rollback'];

    var annotationDefaults = {
      datasource: "timeline",
      enable: false,
      iconColor: "rgba(255, 96, 96, 1)",
      name: "deploy_rollout",
      query: '',
      textField: "desc",
      titleField: "title",
      deployTag: true, // deployTag 用来标记着是一个发布专用的 annotation
      type: 'rollout' // type 标识这次发布的类型
    };

    $scope.deployAnnotations = {};

    $scope.init = function() {
      $scope.appId = '';
      $scope.dashboardAnnotations = $scope.dashboard.annotations.list;
      // 检查当前 annotations 中是否有发布专用的 annotation
      if (_.isArray($scope.dashboardAnnotations)) {
        DEPLOY_TYPES.forEach(function(type) {
          $scope.deployAnnotations[type] = _.find($scope.dashboardAnnotations, { type: type });
        });
        if ($scope.deployAnnotations.rollout) {
          $scope.appId = $scope.deployAnnotations.rollout.query.match(/appId:([A-Za-z.]+) AND/)[1];
        }
      }
    };

    $scope.update = function() {
      DEPLOY_TYPES.forEach(function(type) {
        $scope.deployAnnotations[type].query = 'appId:' + $scope.appId + ' AND type:' + type;
      });
      $scope.broadcastRefresh();
    };

    $scope.add = function() {
      DEPLOY_TYPES.forEach(function(type) {
        var query = 'appId:' + $scope.appId + ' AND type:' + type;
        var annotation = _.assign(
          {},
          annotationDefaults,
          {
            query: query,
            enable: true,
            type: type,
            iconColor: COLOR_MAP[type],
            name: 'deploy_' + type
          }
        );
        $scope.deployAnnotations[type] = annotation;
        $scope.dashboardAnnotations.push(annotation);
      });
      $scope.updateSubmenuVisibility();
      $scope.broadcastRefresh();
    };

    $scope.removeAnnotation = function() {
      DEPLOY_TYPES.forEach(function(type) {
        var index = _.indexOf($scope.dashboardAnnotations, $scope.deployAnnotations[type]);
        $scope.dashboardAnnotations.splice(index, 1);
      });
      $scope.appId = '';
      $scope.deployAnnotations = {};
      $scope.updateSubmenuVisibility();
      $scope.broadcastRefresh();
    };

  });

});
