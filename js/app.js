(function () {
    var app = angular.module('tuti', ['ionic', 'youtube-embed']);

    angular.module('tuti')
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);

    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

    app.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
        $ionicConfigProvider.tabs.position('top'); // other values: top

        $stateProvider
          .state('tabs', {
              url: "/tab",
              abstract: true,
              templateUrl: "templates/tabs.html"
          })
          .state('tabs.home', {
              cache: false,
              url: "/home",
              views: {
                  'home-tab': {
                      templateUrl: "templates/home.html",
                      controller: 'mycontroller'
                  }
              }
          })
          .state('tabs.events', {
              cache: false,
              url: "/events",
              views: {
                  'events-tab': {
                      templateUrl: "templates/events.html",
                      controller: 'mycontroller'
                  }
              }
          })
          .state('tabs.event', {
              cache: false,
              url: "/events/:aId",
              views: {
                  'events-tab': {
                      templateUrl: "templates/event.html",
                      controller: 'mycontroller'
                  }
              }
          })
          .state('tabs.lists', {
              cache: false,
              url: "/lists",
              views: {
                  'lists-tab': {
                      templateUrl: "templates/lists.html"
                  }
              }
          })
          .state('tabs.details', {
              cache: false,
              url: "/lists/:aId",
              views: {
                  'lists-tab': {
                      templateUrl: "templates/details.html",
                      controller: 'mycontroller'
                  }
              }
          })
          .state('tabs.watch', {
              cache: false,
              url: "/watch",
              views: {
                  'watch-tab': {
                      templateUrl: "templates/watch.html",
                      controller: 'mycontroller'
                  }
              }
          });


        $urlRouterProvider.otherwise("/tab/home");

    });

    app.controller('mycontroller', function ($scope, $http, $state, $ionicModal, $ionicListDelegate, $sce, $timeout, $ionicHistory, $ionicSideMenuDelegate) {
        document.addEventListener("deviceready", onDeviceReady, $scope, false);
        function onDeviceReady() {
            $scope.changeOrientationLandscape = function () {
                screen.lockOrientation('landscape');
            }

            $scope.changeOrientationPortrait = function () {
                screen.lockOrientation('portrait');
            }

            $scope.changeOrientationUnlock = function () {
                screen.unlockOrientation();
            }            
        };

        $scope.toggleLeftSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        console.log('mycontroller');

        $scope.showReorderButtons = function () {
            var temp = $ionicListDelegate.showReorder();
            $ionicListDelegate.showReorder(true);
            $ionicListDelegate.showDelete(false);
        };

        $scope.showDeleteButtons = function () {
            $ionicListDelegate.showDelete(true);
            $ionicListDelegate.showReorder(false);
        };

        $http.get('http://tuti.tv/wp-json/wp/v2/video').success(function (data) {
            $scope.artists = data;
            $scope.whichartist = $state.params.aId;
        });

        $http.get('http://tuti.tv/wp-json/wp/v2/event').success(function (data) {
            $scope.events = data;
            $scope.whichevent = $state.params.aId;
        });

        $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.artists.splice(fromIndex, 1);
            $scope.artists.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function (item) {
            $scope.artists.splice($scope.artists.indexOf(item), 1);
        };

        $scope.toggleStar = function (item) {
            item.star = !item.star;
        };

        $scope.doRefresh = function () {
            $http.get('http://tuti.tv/wp-json/wp/v2/video').success(function (data) {
                $scope.artists = data;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        $scope.doRefreshEvents = function () {
            $http.get('http://tuti.tv/wp-json/wp/v2/event').success(function (data) {
                $scope.events = data;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.alert = function (text) {
            alert(text);
        }
        
        //Create Modal for Settings
        $ionicModal.fromTemplateUrl('settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    });

    app.directive('hideTabs', function($rootScope) {
        return {
            restrict: 'A',
            link: function($scope, $el) {
                $rootScope.hideTabs = 'tabs-item-hide';
                $scope.$on('$destroy', function() {
                    $rootScope.hideTabs = '';
                });
            }
        };
    });
}());