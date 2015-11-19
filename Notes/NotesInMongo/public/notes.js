var module = angular.module('myapp', ['dndLists']);
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
                        date : new Date(),
                        section : $scope.activeSection};
            console.log(note)
            if ($scope.text.length==0) return;
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

         $scope.writeSections = function() {
                if ($scope.sections && $scope.sections.length>0) {
                    $http.post("/sections/replace", $scope.sections);
             	}
            };

        $scope.addSection = function() {
		    if ($scope.newSection.length==0) return;

		    // check for duplicates
		    for (var i=0;i<$scope.sections.length;i++) {
			    if ($scope.sections[i].title==$scope.newSection) {
			    	return;
			    }
	    	}

		var section = {title: $scope.newSection};
		$scope.sections.unshift(section);
		$scope.activeSection = $scope.newSection;
		$scope.newSection = "";
		$scope.writeSections();
		update();
	}


    $scope.notes = [];
    readSections();
});


