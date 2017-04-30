
var app = angular.module('project', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController',
  })
  .when('/signup', {
   templateUrl: 'signup.html',
   controller: 'SignupController',
  });
});

app.controller('HomeController', function($scope, $http){

  $scope.submitNewComment = function(){
    $http.post('/myArrays',{newComment: $scope.newComment}).then(function(){
        getComment();
        $scope.newComment = '';
    });
  };

  $scope.removeComment = function(myArray){
    $http.put('/myArrays/remove',{myArray: myArray}).then(function(){
        getComment();
    });
  };

  $scope.login = function(){
    $http.put('/users/login', {username: $scope.username, password: $scope.password})
    .then(function(){
      alert('Successfully signed in!!');
    }, function(err){
        alert("bad login");
    });
  }

  function getComment(){
    $http.get('/myArrays').then(function(response){
      $scope.myArrays = response.data;
    });
  }
getComment();
});


app.controller('SignupController', function($scope, $http){
$scope.submitSignup = function(){
  var newUser = {
    username: $scope.username,
    password: $scope.password
  };

  $http.post('/users',newUser).then(function(){
      alert('success!!')
  });

}
});
