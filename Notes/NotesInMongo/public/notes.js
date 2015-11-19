var module = angular.module('myapp', []);
module.controller('NotesController',
	function($scope, $http) {
	    var update = function() {
	        console.log("we want to find initial set of notes")
            $http.get("/notes")
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
    $scope.notes = [];
    update();
});


