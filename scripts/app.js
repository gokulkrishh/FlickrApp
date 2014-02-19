'use strict';

//created a module called FlickrApp
angular.module('FlickrApp', [
  'ngRoute',
  'FlickrApp.services',
  'FlickrApp.controllers'
])
//route config function
.config(['$routeProvider',function ($routeProvider) { //passing $routeProvider function
    $routeProvider.when('/', // when / load the following
    {
      controller: 'myController', //controller
      templateUrl: 'templates/Publicphotos.html', //page to load from
    });
    $routeProvider.when('/aboutApp', //when about dev is clicked open following page
    {
      controller: 'myController', 
      templateUrl: 'templates/aboutApp.html',
    });
    $routeProvider.when('/photos', //photos
    {
      controller: 'photoController', //controller is photoController
      templateUrl: 'templates/Userphotos.html',
    });
    $routeProvider.when('/myFriend', // open myfriend when clicked from my friend list
    {
      controller: 'photoController', 
      templateUrl: 'templates/myFriendPhotos.html',
    });
    $routeProvider.when('/myFriends',// to show user family and friends contact random photos with description
    {
      controller: 'photoController', 
      templateUrl: 'templates/myFriends.html',
    });
    $routeProvider.otherwise({redirectTo: '/'}); // other than any link from above, redirect to main page
}]); //end of route function