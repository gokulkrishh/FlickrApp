//created a module called FlickrApp
var FlickrApp = angular.module('FlickrApp',['ngRoute']); 
// adding controller as myController 
FlickrApp.controller('myController',publicFeed); 

// creating a factory service
FlickrApp.factory('fetchPhotos',function($http,$q,$rootScope){
  var url = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&callback=jsonFlickrFeed";
  var defered = $q.defer();//creating a defer instance
  var params = {
    jsoncallback: 'JSON_CALLBACK'
  };
  return{
    fetchData :function(){
      $rootScope.$broadcast("loader_show");
      $http.jsonp(url,{
        params:params
      }).success(function(data) {
        defered.resolve(data);
        }).error(function(data) {
        defered.resolve("Error Occurred");
      });
      return defered.promise;
    }
  }
});
        
//passing a fectchPhotos factory service
function publicFeed($scope,fetchPhotos) {
  $scope.details = [];
  //fetching defered funz
  fetchPhotos.fetchData().then(function(data){
      $scope.details = data;
  },
  function(err){
  $scope.details = err;
  //console.log(err);
  });
}  
      
// user photo controller
FlickrApp.controller('photoController',userPhotoId);
function userPhotoId($scope,$rootScope,$http,$q) {
  $scope.userData = [];
  $rootScope.userPhotos = [];
  $rootScope.userPhotos.desc = [];
  //$rootScope.desc = [];
  $rootScope.userInfo = [];
  $rootScope.friendPic = [];
  $scope.myPublicPhoto = [];
  $rootScope.friendPhoto = [];
  $rootScope.myName;
  $rootScope.myFriendsPhoto = [];
  $rootScope.nameOfPic;
  // myfriends funz
  $scope.myFriends = function(uid,friendname) {
    $rootScope.myName = friendname;
    var api_key = 'c2571fbbfd51eadf7913b812d9c4f502';
    $scope.params = {
      jsoncallback: 'JSON_CALLBACK',
    };

  //ajax call for user detail
  var url5 = "http://api.flickr.com/services/rest/?method=flickr.photos.getContactsPublicPhotos&api_key="+api_key+"&user_id="+uid+"&&include_self=&format=json&callback=jsonFlickrFeed";
  //console.log(url5);
  
  //to getFriendPhoto
  $scope.getFriendsPhoto = function(){
      $http.jsonp(url5,{
        params:$scope.params
      }).success(function(data) {
        console.log("friends photo call");
        $scope.myPublicPhoto = data;
        console.log(data);
        for(k in $scope.myPublicPhoto.photos.photo)
        {
            var friendPics = "http://farm"+data.photos.photo[k].farm+".staticflickr.com/"+
            data.photos.photo[k].server+"/"+data.photos.photo[k].id+"_"+data.photos.photo[k].secret+".jpg";
            $rootScope.friendPhoto.push(friendPics);
        }
        //console.log($rootScope.friendPhoto);
      }).error(function(data) {
          console.log("friends photo call error");
        });
    }
    $scope.getFriendsPhoto();
  }    
   //end of myFriends funz
        
   //my friendsphotos funz
   $scope.myFriendsPhotos = function(id,name) {
      $rootScope.nameOfPic = name;
      var url6 = "http://api.flickr.com/services/feeds/photos_friends.gne?&user_id="+id+"&format=json";
      $scope.params = {
        jsoncallback: 'JSON_CALLBACK',
      };
      //console.log(url6);
      $http.jsonp(url6,{
        params:$scope.params
      }).success(function(data) {
      /*console.log("friends photo call");
      console.log(data);*/
      for(m in data.items){
        $rootScope.myFriendsPhoto.push(data.items[m]);
      }
      //console.log($rootScope.myFriendsPhoto);
      }).error(function(data) {
          console.log("my friends photo call error");
      });
    }
    //end of my friends photos

        //to get Public pic
    $scope.myPublicPic = function(photoid,authorname) {
    var api_key = 'c2571fbbfd51eadf7913b812d9c4f502';
    $scope.params = {
        jsoncallback: 'JSON_CALLBACK',
    };
    //ajax call for user detail
    var url1 = "http://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key="
                +api_key+"&user_id="+photoid+"&format=json";
    //console.log(url1);
    var defered = $q.defer();
    $scope.getUserInfo = function(){
        $http.jsonp(url1,{
              params:$scope.params
        }).success(function(data) {
        //console.log("userinfo call");
        defered.resolve(data);
        //console.log(data);
        }).error(function(data) {
            console.log("userinfo error");
            defered.rejected("Error Occurred");
        });
        return defered.promise;
    }
    //getting userinfo funz
    $scope.getUserInfo().then(function(data) {            
        $rootScope.userInfo = data.person;
        //console.log($rootScope.userInfo);
        $rootScope.imgUrl = "http://farm"+$rootScope.userInfo.iconfarm+
                ".staticflickr.com/"+$rootScope.userInfo.iconserver+"/buddyicons/"+
                 $rootScope.userInfo.nsid+".jpg";
        //console.log($rootScope.imgUrl);
        var url3 = "http://api.flickr.com/services/rest/?method=flickr.contacts.getPublicList&api_key="+api_key+"&user_id="+data.person.id+"&format=json";
            $http.jsonp(url3,{
              params:$scope.params
            }).success(function(data) {
              //console.log("friendinfo call");
              $rootScope.friendInfo = data;
              //friend list profile pic
              for(k in $rootScope.friendInfo.contacts.contact)
              {
                  //console.log(data.contacts.contact[k]);
                  var friendPic = "http://farm"+data.contacts.contact[k].iconfarm+
                   ".staticflickr.com/"+data.contacts.contact[k].iconserver+"/buddyicons/"+
                  data.contacts.contact[k].nsid+".jpg";
                  $rootScope.friendInfo.contacts.contact[k].img = friendPic;
                  //console.log($rootScope.friendInfo.contacts.contact);
              }
            }).error(function(data) {
                  $rootScope.friendInfo.img = data;
                  console.log("friendinfo error");
            });
    },function(data){
        console.log(data);
    });
          
    //ajax call for user public photos
    if(photoid !== "" || null)
    {
        var url2 = "http://api.flickr.com/services/rest/?method=flickr.photos.search&sort=date-taken-desc&api_key="
        +api_key+"&user_id="+photoid+"&per_page=30&format=json&callback=jsonFlickrApi";
        var defered1 = $q.defer();
        //console.log(url1);
        $scope.getUserId = function(){
          $http.jsonp(url2,{
            params:$scope.params
          }).success(function(data) {
            //console.log("2nd call");
            defered1.resolve(data);
          }).error(function(data) {
              console.log("1st error");
              defered1.resolve("Error Occurred");
          });
          return defered1.promise;
        }
        //getting userId
        $scope.getUserId().then(function(data){            
        $scope.userData = data;
        for(var i in $scope.userData.photos.photo){
          var url = "http://farm"+ $scope.userData.photos.photo[i].farm +".staticflickr.com/"+$scope.userData.photos.photo[i].server+"/"+ $scope.userData.photos.photo[i].id+"_"+$scope.userData.photos.photo[i].secret+".jpg";
                    //console.log("user pic info");
          $rootScope.userPhotos.push(url);
          //$rootScope.userPhotos.push();
        }
      },
      function(err){
          $rootScope.userPhotos = err;
          console.log(err);
      });
    } // end of if stmt
  }
}
//controller for friend list
FlickrApp.controller('FriendPic',friendList);
    function friendList($scope,fetchPhotos) {
    $scope.details1 = [];
    fetchPhotos.fetchData().then(function(data){
    $scope.details1 = data;
    //console.log(data);
    },
    function(err){
        $scope.details1 = err;
        console.log(err);
    });
  }
 
  //routing 
  FlickrApp.config(function($routeProvider) {
    $routeProvider.when('/', 
    {
      controller:'myController', 
      templateUrl:'templates/Publicphotos.html',
    });
    $routeProvider.when('/photos', 
    {
      controller:'photoController', 
      templateUrl:'templates/Userphotos.html',
    });
    $routeProvider.when('/aboutApp', 
    {
      controller:'myController', 
      templateUrl:'templates/aboutApp.html',
    });
    $routeProvider.when('/myFriend', 
    {
      controller:'photoController', 
      templateUrl:'templates/myFriendPhotos.html',
    });
    $routeProvider.when('/myFriends', 
    {
      controller:'photoController', 
      templateUrl:'templates/myFriends.html',
    });
    $routeProvider.otherwise({redirectTo:'/'});
});
// end of routing