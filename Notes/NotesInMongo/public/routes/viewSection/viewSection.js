module.controller("ViewSectionController",
function($scope, $http, $routeParams) {
    console.log("We are in ViewSectionController")
	$scope.section = $routeParams.name;

	var params = {params: {section:$routeParams.name}};

    $http.get("/notes", params)
		.success(function(notes) {
			$scope.notes = notes;
		});
});
