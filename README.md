# Html5 Game  made with Angular and Quintus js
HTML5 Game made with Quintus js integrated in  Angular js check out quintus at https://github.com/cykod/Quintus

The game code was downloaded from quintus web page http://www.html5quintus.com/ , and It was modifided to work with angular.js, for this project I use angular.js because I need to do some API request like GET and POST, with GET I pull the levels array and with the POST I store the scores.

First create the HTML file and pull quintus javascript library and angular.js:
```html
<!DOCTYPE html>
<html>
  <head>
  <script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.js'></script>
  <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
  </head>
<body>
<!-- Your code here -->>
</body>
</html>
```

Then the challenge  is the integration of  Quintus  library with Angular.js, so You sholud made an  Angular.js new module, in this example  I called angularquintus.js (in folder js):
```javascript
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
```
Then in the main angular file app.js You can call 'Quintus' module and set up the initial configuration:
```javascript
    var app = angular.module('logic', ['Quintus','ui.bootstrap'])
    .config(function(QProvider) {
	QProvider.include(['Sprites','Scenes','Input','2D','Touch','UI','Audio']);
	QProvider.setup("myGame");		// Add a canvas element onto the page 
        QProvider.controls();			// Add in default controls (keyboard, buttons)
        QProvider.touch();			// Add in touch support (for the UI)
        QProvider.enableSound();		 // Add sound   
	});
```
Now in the angular modules  You can use Q as It used to do.
```javascript

app.controller('mycontroller',function(Q) {
	Q.scene("level1",function(stage) {
            //Your code here
          });
	};

	Q.load([''], function() {      
          //Your code here
          Q.stageScene("level1");
  	};
 }
```
If you wanna call  the level JSON data from API, now It's easy with angular.js, just use the service $http:
```javascript
//Your code here
$http.get('myApiURl').then(function(data){
	Q.load(['level.json'], function() {      
          //Your code here
          Q.assets['level.json']=data.data[0].levelarray;
          Q.stageScene("level1");
  };    
});
//Your code here   
```
Don't forget pull the all the files in your HTML code, an add a tag with id="myGame" to render your canvas from  QProvider.setup("myGame");:
```html
<!DOCTYPE html>
<html ng-app="logic">
  <head>
	  <script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.js'></script>
	  <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
	  <script type="text/javascript" src="js/angularquintus.js"></script>
	  <script type="text/javascript" src="js/app.js"></script>
  </head>
<body ng-controller="mycontroller">
	<div id="myGame"></div>
<!-- Your code here -->
</body>
</html>
```
And Enjoy programing
