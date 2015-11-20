module.controller("UserFormController", function($scope, $http, $location) {

	$scope.user = { dateOfBirth: 'asd' };

    $scope.submitForm = function() {
          console.log("Performing submit")
		  $http.post("/users", $scope.user)
		  .success(function(data) {
			  console.log("saved!");
			  $location.path("/register");
		  });
	}

});
