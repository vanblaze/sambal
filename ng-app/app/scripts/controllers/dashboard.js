'use strict';

/**
 * @ngdoc function
 * @name midwestApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the midwestApp
 */
angular.module('midwestApp')

  .controller('DashboardCtrl', function ($scope, $http, $modal, $location, session) {

    $scope.host = $location.host();

    $scope.payId = 0;
    $scope.amount = 0;
    $scope.status = 'invite';
    $scope.shirt = {
      Short: {
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0
      },
      Long: {
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0
      }
    };
    $scope.products = {};

    var acceptMsg = ['Wow, your sense of judgment must be wayyyy off', 'It\'s good to be noble, but there\'s a reason why noblemen are vanishing in this age', 'Well, if you must...', 'Hmm, how did you become captain again?', 'Err on the side of caution, not on the side of losing'];
    function getAcceptMessage() {
      return acceptMsg[Math.floor(Math.random() * acceptMsg.length)];
    }

    var declineMsg = ['It had to be done....', 'Can\'t say I blame you', 'Be proud of yourself. Tomorrow, you\'ll win', 'Remember this moment you saved the team, captain', 'You came, you saw the truth, you kicked him out' ];
    function getDeclineMessage() {
      return declineMsg[Math.floor(Math.random() * declineMsg.length)];
    }
    $scope.todos = [
      {
        title: 'Audition for Midwest Night',
        label: 'More info',
        target: '_self',
        link: 'promo/auditions'
      },
      {
        title: 'Manage your sports/teams',
        label: 'Team management page',
        link: 'teams'
      },
      {
        title: 'Survey for Malaysia Midwest Games 2015',
        label: 'I\'ll help!',
        target: '_blank',
        link: 'https://www.surveymonkey.com/s/RGN5S96'
      }];

    session.getUser().then(function(user) {
      if (!user.registration_payment_status) {
        $scope.todos.unshift({
          title: 'Pay for registration',
          label: 'Pay now',
          link: 'payment'
        });
      }

      if (user.registration_payment_status) {
        $scope.todos.unshift({
          title: 'Register for sports',
          label: 'Register now',
          link: 'sportsreg'
        });
      }


    $http.get('/api/participants/get_invite')
      .success(function(result){
        $scope.participating = result.participants;
        $scope.$watch('participating', function() {
          $scope.participating.forEach(function(participate){
            $http.get('/api/teams/' + participate.team_id)
              .success(function(data){
                participate.name = data.team.name;
                participate.gamename = data.team.game.name;
                participate.gamecategory = data.team.game.category;
              });
          });
        });
      });
    });

    $scope.accept = function (id) {
      $http.patch('/api/participants/accept/' + id)
        .success(function() {
          $scope.status = 'accept';
          toastr.success(getAcceptMessage(), 'You\'ve accepted the invitation of this team\'s captain');
        });
    };

    $scope.decline = function (id) {
      $http.patch('/api/participants/decline/' + id)
        .success(function() {
          $scope.status = 'decline';
          toastr.error(getDeclineMessage(), 'You\'ve declined the invitation from this team\'s captain');
          console.log('declined!');
        });
    };

    $http
      .get('/api/participants/get')
      .success(function(data) {
        $scope.teams = data.participants;
        $scope.$watch('teams', function() {
          var count = 0;
          $scope.teams.forEach(function(team){
            $http.get('/api/teams/' + team.team_id)
              .success(function(data){
                team.name = data.team.name;
                team.gamename = data.team.game.name;
                team.gamecategory = data.team.game.category;
                team.index = count;
                count++;
              });
          });
          console.log($scope.teams.length);
        });
      });

    $http
      .get('/api/products')
      .success(function(data) {
        $scope.products = data.products;
        console.log($scope.products);
      });

    var findProductId = function(sleeve, size) {
        for (var product in $scope.products) {
          if ($scope.products.hasOwnProperty(product)) {
            if (product.name === ('MMG2015 Official Shirt ' + sleeve + ' Sleeve') &&
              product.size === size) {
              return product.id;
            }
          }
        }
    };

    $scope.submitShirtSale = function() {
      console.log('here');
      for (var sleeveType in $scope.shirt) {
        console.log(sleeveType);
        if ($scope.shirt.hasOwnProperty(sleeveType)) {
          for (var quantity in sleeveType) {
            if (sleeveType.hasOwnProperty(quantity)) {
              console.log(quantity);
              if (quantity !== 0) {
                findProductId(sleeveType.name, quantity.name);
              }
            }
          }
        }
      }
    };

    $scope.open = function (size) {
      $modal.open({
        templateUrl: 'official_shirt.html',
        controller: 'ShirtCtrl',
        size: size,
        resolve: {
          payId: function () {
            return $scope.payId;
          },
          amount: function () {
            return $scope.amount;
          }
        }
      });
    };



  });
