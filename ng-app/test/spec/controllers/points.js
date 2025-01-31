'use strict';

describe('Controller: PointsCtrl', function () {

  // load the controller's module
  beforeEach(module('midwestApp'));

  var PointsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PointsCtrl = $controller('PointsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
