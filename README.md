# html5 Game Quintus / Angular js
 HTML5 Game made with Quintus js integrated in  Angular js

The game code was downloaded from quintus web page http://www.html5quintus.com/ , and was modifided to work with angular.js, for this proyect I use angular.js because I need to do some API request like GET and POST, with GET I get the levels array and with the POST I store the scores.

The first challenge  is the integration of 3rd party java script library Quintus with Angular.js, so I made an Angular.js a new module that I called angularquintus.js (in folder js):

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

Then in my main angular file app.js I can call 'Quintus' module and set up the initial configuration:

    var app = angular.module('logic', ['Quintus','ui.bootstrap'])
    .config(function(QProvider) {
								QProvider.include(['Sprites','Scenes','Input','2D','Touch','UI','Audio']);
								QProvider.setup("myGame");                   // Add a canvas element onto the page 
        QProvider.controls();                        // Add in default controls (keyboard, buttons)
        QProvider.touch();																											// Add in touch support (for the UI)
        QProvider.enableSound();                     // Add sound   
	});
