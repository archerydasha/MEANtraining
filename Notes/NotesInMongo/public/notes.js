var module = angular.module('myapp', []);
module.controller('NotesController',
	function($scope, $http) {
	    var update = function() {
	        var params = {params:{section:$scope.activeSection}};
	        console.log("we want to find initial set of notes")
            $http.get("/notes", params)
            .success(function(notes) {
                console.log("notes are to be updated")
                $scope.notes = notes;
                });
        };

        $scope.add = function() {
            console.log("we want to save the note")
            var note = { text: $scope.text,
                        date : new Date()};
            console.log(note)
            $http.post("/notes", note)
            .success(function() {
        	    $scope.text = "";
        	    update();
        	    });
        	};

            $scope.remove = function(noteId){
            console.log("we want to delete a note")
            $http.delete("/notes", {params:{id:noteId}})
                .success(function(){
                      update();
                })
            };

            var readSections = function() {
                console.log("reading sections")
            	$http.get("/sections")
            	.success(function(sections) {
            		$scope.sections = sections;
            		console.log(sections)
            		if ($scope.activeSection == null &&
                    $scope.sections.length>0) {
                    			$scope.activeSection =
                    				$scope.sections[0].title;
               		}
            		update();
            	});
            }

            $scope.showSection = function(section) {
            	$scope.activeSection = section.title;
                update();
            }

    $scope.notes = [];
    readSections();
});


