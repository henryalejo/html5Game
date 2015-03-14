(function (){
    var app = angular.module('Quintus',[])
	    	.provider('Q', function(){
	      	
		        var instance = Quintus();

		        this.include = function(array) {
		          instance.include(array.join(','));
		        };
		        this.setup = function(setup) {
		          instance.setup(setup);
		        };
		        this.controls = function(controls) {
		          instance.controls(controls);
		        };
		        this.touch = function(touch) {
		          instance.touch(touch);
		        };

		        this.$get = function() {
		          return instance;
		        };

	      })
	

})();