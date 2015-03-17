(function (){
    var app = angular.module('Quintus',[])
	    	.provider('Q', function(){
	      	
		        var instance = Quintus({audioSupported: ['mp3','wav']});
		        //var instance = Quintus();
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
		        this.enableSound = function(sound) {
		          instance.enableSound(sound);
		        };

		        this.$get = function() {
		          return instance;
		        };

	      })
	

})();