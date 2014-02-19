'use strict';

//factory to get public photos
angular.module('FlickrApp.services',[]) 
.factory('fetchPhotos',function ($http,$q,$rootScope) { 
  //url to get public photos
  var url = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&callback=jsonFlickrFeed";
  var defered = $q.defer();//creating a defer instance
  var params = {
    jsoncallback: 'JSON_CALLBACK' //callback name
  };
    return {
      fetchData :function(){ // on return fetchData 
        $http.jsonp(url,{ //passing url
          params:params //passing params
        }).success(function(data) {
          defered.resolve(data); //on success data is in resolve state
        }).error(function(data) {
          defered.reject("Error Occurred"); //on error data is in rejected state
        });
      return defered.promise; //return promise
    } //end of fetchData function
  } //end of return
});
