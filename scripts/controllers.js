//controller function
angular.module('FlickrApp.controllers',[]).
// controller for fethc data from factory 
controller('myController',['$scope','fetchPhotos',function ($scope,fetchPhotos) {
		// for minified app.js to understand we use [] with function as array of strings
	  	$scope.details = []; //assign a array in $scope object
	  	fetchPhotos.fetchData().then(function(data){ //fetching data from factory
	      $scope.details = data; // storing data in array
	  	},
	  	function(err){
	  		$scope.details = err; //storing error
	  	//console.log(err);
	  	});
}]) //end of myController
// photoController to get particular public user's photo
.controller('photoController',['$scope','$rootScope','$http','$q',function ($scope,$rootScope,$http,$q) {
		// declaring $scope and $rootScope object as array
		  $scope.userData = [];
		  $scope.myPublicPhoto = [];
	  	$rootScope.userPhotos = [];
	  	$rootScope.userPhotos.desc = [];
	  	$rootScope.userInfo = [];
	  	$rootScope.friendPic = [];
	  	$rootScope.friendPhoto = [];
	  	$rootScope.myName;
	  	$rootScope.myFriendsPhoto = [];
	  	$rootScope.nameOfPic;
	  	//declaring and initialsing $scope.param object to use in  ajax call
	  	$scope.params = {
        	jsoncallback: 'JSON_CALLBACK',
    	};
    	$scope.api_key = 'c2571fbbfd51eadf7913b812d9c4f502'; //storing api key
      
      // myPublic function which gets the arguments userid and username from ng-click in publicphotos.html
      $scope.myPublicPic = function(photoid,authorname) {
        var url = "http://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key="
                    +$scope.api_key+"&user_id="+photoid+"&format=json";
        //console.log(url);
        var defered = $q.defer(); //creating defer instance
        $scope.getUserInfo = function() {
            $http.jsonp(url,{ //passing url
                 params:$scope.params //passing param
            }).success(function(data) {
                 //console.log(data);
                 defered.resolve(data); //storing the data in resolve state
            }).error(function(data) {
                 defered.reject("Error Occurred"); // reject state to store error
            });
            return defered.promise; //returning the promise
        }
        //getting the values from previous getUserInfo function
        $scope.getUserInfo().then(function(data) {            
            $rootScope.userInfo = data.person; //storing the data from getUserInfo to userInfo $rootScope
           // console.log($rootScope.userInfo);
            //storing the url in $rootScope to show user photos
            $rootScope.imgUrl = "http://farm"+$rootScope.userInfo.iconfarm+
                          ".staticflickr.com/"+$rootScope.userInfo.iconserver+"/buddyicons/"+
                          $rootScope.userInfo.nsid+".jpg";
            var url1 = "http://api.flickr.com/services/rest/?method=flickr.contacts.getPublicList&api_key="+$scope.api_key+"&user_id="+data.person.id+"&format=json";
            // url1 is for getting contacts of user to display in my friend list
              $http.jsonp(url1,{ //passing url1
                  params:$scope.params // passing parameter
              }).success(function(data) { 
                  $rootScope.friendInfo = data; //on success store data in $rootScope.friendInfo object
                  // Using for-in loop to get all user's contact picture to show in friendlist
                  for(k in $rootScope.friendInfo.contacts.contact)
                  {
                      var friendPic = "http://farm"+data.contacts.contact[k].iconfarm+
                              ".staticflickr.com/"+data.contacts.contact[k].iconserver+"/buddyicons/"+
                      data.contacts.contact[k].nsid+".jpg";
                      $rootScope.friendInfo.contacts.contact[k].img = friendPic; //storing contact images to display in myfriend list before name
                  }
              }).error(function(data) {
                  $rootScope.friendInfo.img = data; // if error storing data
              });
        },function(data){ //error function for getUserInfo function
            console.log(data); // console the error
        }); //end of getUserInfo function
        //if photoid is not equal to empty string or null
        if(photoid !== "" || null)
        {
            var url2 = "http://api.flickr.com/services/rest/?method=flickr.photos.search&sort=date-taken-desc&api_key="
            +$scope.api_key+"&user_id="+photoid+"&per_page=24&format=json&callback=jsonFlickrApi";
            //console.log(url2);
            var defered1 = $q.defer(); //creating defer instance as defered1
            $scope.getUserId = function(){
               $http.jsonp(url2,{ //passing url2 to get users public photos
                    params:$scope.params //passing params
                }).success(function(data) {
                    defered1.resolve(data); //on success storing data in resolve state
                }).error(function(data) {
                    defered1.reject("Error Occurred"); //error in rejected state 
                });
              return defered1.promise; //return promises
            }
            //getting user data from above getUserId function
            $scope.getUserId().then(function(data) {            
              $scope.userData = data;
              for(var i in $scope.userData.photos.photo) 
              {
                  var url = "http://farm"+ $scope.userData.photos.photo[i].farm +".staticflickr.com/"+$scope.userData.photos.photo[i].server+"/"+ $scope.userData.photos.photo[i].id+"_"+$scope.userData.photos.photo[i].secret+".jpg";
                  $rootScope.userPhotos.push(url);
              }
            },
            function(err){
              $rootScope.userPhotos = err;
            }); 
        } //end of if statement
      } //end of myPublicPic function

      //myFriendsPhotos function which gets arguments as userid and username from ng-click in Userphotos.html
      $scope.myFriendsPhotos = function(id,name) {
          $rootScope.nameOfPic = name; //storing name in $rootScope obj
            //url to get user friends photos
            var url3 = "http://api.flickr.com/services/feeds/photos_friends.gne?&user_id="+id+"&format=json";
            //console.log(url3);
          $http.jsonp(url3,{
              params:$scope.params //passing params
          }).success(function(data) {
              for(m in data.items){ //on success using for in loop to traverse data items
                $rootScope.myFriendsPhoto.push(data.items[m]); //pushing photos in array
              }
          }).error(function(data) {
              console.log("my friends photo call error");
          });
      } //end of my friends photos
      
      // myfriends from ng-click in UserPhotos to get uid to get photos of friends in contacts and friend name to display
      $scope.myFriends = function(uid,friendname) {
          $rootScope.myName = friendname; // storing friend name in $rootScope obj
          //to get Public contacts of user to display in next page
          var url4 = "http://api.flickr.com/services/rest/?method=flickr.photos.getContactsPublicPhotos&api_key="+$scope.api_key+"&user_id="+uid+"&&include_self=&format=json&callback=jsonFlickrFeed";
          //a function to get public contact photos
          $scope.getFriendsPhoto = function(){
            $http.jsonp(url4,{ //passing url3
              params:$scope.params //passing params
            }).success(function(data) {
            $scope.myPublicPhoto = data; //on success storing data in myPublicPhoto scope obj
              for(k in $scope.myPublicPhoto.photos.photo) //for in loop to traverse photos from above $scope.myPublicPhoto obj
              {
                  var friendPics = "http://farm"+data.photos.photo[k].farm+".staticflickr.com/"+
                            data.photos.photo[k].server+"/"+data.photos.photo[k].id+"_"+data.photos.photo[k].secret+".jpg";
                  $rootScope.friendPhoto.push(friendPics); //pushing photos in an $rootScope.fr array
              }
            }).error(function(data) {
                console.log("friends photo call error");
            });
          }
      $scope.getFriendsPhoto(); //calling above getFriendsPhoto function
  } //end of myFriends function

}]); //end of photoController

