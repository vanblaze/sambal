'use strict';

describe('Controller: AccommodationCtrl', function () {

  // load the controller's module
  beforeEach(module('midwestApp'));

  var AccommodationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccommodationCtrl = $controller('AccommodationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
