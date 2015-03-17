(function (){
    var app = angular.module('logic', ['Quintus','ui.bootstrap'])
    

    .config(function(QProvider) {
     // QProvider.$get({audioSupported: ['wav']});
		QProvider.include(['Sprites','Scenes','Input','2D','Touch','UI','Audio']);
		QProvider.setup("myGame");                         // Add a canvas element onto the page
        QProvider.controls();                        // Add in default controls (keyboard, buttons)
        QProvider.touch();
        QProvider.enableSound();                            // Add in touch support (for the UI)
       	

	});
	//app.run();
  //app.constant('API_URL', 'http://localhost:3000/api/');
	app.constant('API_URL', 'https://shrouded-atoll-7236.herokuapp.com/api/');
  
	app.controller('GameLogicController',function($scope,Q,$http,Myfactory,$modal,API_URL) {

		////console.log('entra al controller');
		$scope.score=0;		
		$scope.myfactory=Myfactory;
    $scope.myfactory.setProviders();
		$scope.levelnumber=1;
		$scope.lives= new Array(3);
    $scope.maxlevels=4;
    $scope.players=[];
    $scope.sound=true;
    $http.get(API_URL+'players').success(function(data) {
                  console.log('Succes get players'); 
                  console.log(data);
                  $scope.players=data;
                });
    //console.log($scope.players);
    $scope.miarray= 
[
[ 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,1,0,0,0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1],
[ 1,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1],
[ 1,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[ 1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
[ 1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
[ 1,1,0,0,0,1,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,1,0,1],
[ 1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1],
[ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1],
[ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];
  $scope.test={
    "levelname": "level4",
  "player": {"x":1150, "y":10},
  "tower": {"x":100, "y": 10},
  "enemy": {"x":50, "y": 90}};


		$scope.plusScore = function(score){
			$scope.score= $scope.score+score;
			$scope.$apply();
			
		};
		$scope.lessLives=function(){
			if( $scope.lives.length > 0){
				$scope.lives=new Array($scope.lives.length -1)
				$scope.$apply();
			}
			else{
				//console.log("se murio parce");
			}
		}
		

		 Q.Sprite.extend("Player",{
        init: function(p) {
          this._super(p, { sheet: "player"});
          this.add('2d, platformerControls');
          this.on("jump",function(obj){ Q.audio.play('../assets/smb_jump-small.mp3');              });
          //this.on("jump");
          this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
              $scope.plusScore(100);
              this.destroy();
              //console.log('level: '+$scope.levelnumber+'  maxlevels: '+ $scope.maxlevels);
              if($scope.levelnumber < $scope.maxlevels){
                $scope.levelnumber++;
                Q.stageScene("nextLevel",1,{ label: "You Won" }); 
                Q.audio.stop('../assets/map-1.mp3');
                Q.audio.play('../assets/smb_stage_clear.mp3');

              }else{
                 Q.stageScene("youLose",1, { label: "Winner" }); 
                  collision.obj.destroy();
                  Q.audio.stop('../assets/map-1.mp3');
                  Q.audio.play('../assets/smb_world_clear.mp3');
              };
            	
            }
          });
        }

        

      });

      Q.Sprite.extend("Tower", {
        init: function(p) {
          this._super(p, { sheet: 'tower' });
        }
      });


      Q.Sprite.extend("Enemy",{
        init: function(p) {
          this._super(p, { sheet: 'enemy', vx: 100 });
          this.add('2d, aiBounce');

          

          this.on("bump.left,bump.right,bump.bottom",function(collision) {
            if(collision.obj.isA("Player")) { 

              if($scope.lives.length>0){
                  $scope.lessLives();
                  $scope.score=0;
                  $scope.$apply;
                  Q.stageScene("endGame",1, { label: "You Died" }); 

                  collision.obj.destroy();
                  Q.audio.stop('../assets/map-1.mp3');
                  Q.audio.play('../assets/smb_mariodie.mp3');
              }
              else{
                  Q.stageScene("youLose",1, { label: "You Lose" }); 
                  collision.obj.destroy();
                  Q.audio.stop('../assets/map-1.mp3');
                   Q.audio.play('../assets/smb_gameover.mp3');
              };         	
            	
            }
          });
          
          this.on("bump.top",function(collision) {
            if(collision.obj.isA("Player")) { 
              this.destroy();
              Q.audio.play('../assets/smb_coin.mp3');
              collision.obj.p.vy = -300;
              $scope.plusScore(25);
             

            }
          });
          
        }
      });


      Q.scene('youLose',function(stage) {
        var box = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
        
        var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                 label: "Restart" }))         
        var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                              label: stage.options.label }));
        var label2 = box.insert(new Q.UI.Text({x:10, y: -5 - label.p.h, 
                                              label: "Score: "+$scope.score }));
        button.on("click",function() {
          
          $scope.modalScore($scope.score);          
          $scope.score=0;            
          $scope.levelnumber=1;
          $scope.lives= new Array(3);
          Q.clearStages();
          $scope.myfactory.getByLevel($scope.levelnumber).then(function(resp) {
          
            $scope.load(resp);
          }); 
        });
        box.fit(20);
      });

      Q.scene('endGame',function(stage) {
        var box = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
        
        var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                 label: "Try Again" }))         
        var label = box.insert(new Q.UI.Text({x:8, y: -10 - button.p.h, 
                                              label: stage.options.label }));
        button.on("click",function() {
          Q.clearStages();
          //$scope.modalScore($scope.score);
          $scope.myfactory.getByLevel($scope.levelnumber).then(function(resp) {
          $scope.level = resp;
            $scope.load($scope.level)
          }); 
        });
        box.fit(20);
      });

        Q.scene('nextLevel',function(stage) {
                var box = stage.insert(new Q.UI.Container({
                  x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
                }));
                
                var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                         label:"Go to level "+$scope.levelnumber }))         
                var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                      label: stage.options.label }));
                button.on("click",function() {
                  
                  Q.clearStages();
                  //$scope.modalScore($scope.score);
                  $scope.myfactory.getByLevel($scope.levelnumber).then(function(resp) {
                  $scope.level = resp;
                    $scope.load($scope.level)
                  }); 
                });
                box.fit(20);
              });
      

      

        //this is for load the game the firts time
      	$scope.myfactory.getByLevel($scope.levelnumber).then(function(resp) {
          $scope.level = resp;

	      	$scope.load($scope.level);
      	
        });
          
         //With angular we recicle the load function for each level 
        $scope.load = function(level){
          //level.enemy=$scope.test.enemy;
          //level.tower=$scope.test.tower;
          //level.player=$scope.test.player

          Q.scene("level1",function(stage) {
            stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json' , sheet: 'tiles' }));

            var player = stage.insert(new Q.Player(level.player));
            stage.add("viewport").follow(player);
            //los de el api
            stage.insert(new Q.Enemy(level.enemy));
            stage.insert(new Q.Enemy({ x: level.enemy.x +100, y: level.enemy.y }));
            ////
            stage.insert(new Q.Enemy({ x: 700, y: 0 }));
            stage.insert(new Q.Enemy({ x: 800, y: 0 }));        
            stage.insert(new Q.Tower(level.tower));
            Q.audio.stop('../assets/map-1.mp3');
            if($scope.sound)
            Q.audio.play('../assets/map-1.mp3',{ loop: true });
          });

          Q.load(['../images/sprites.png', '../data/sprites.json','../images/tiles.png','../assets/map-1.mp3','../assets/smb_jump-small.mp3','../assets/smb_coin.mp3','../assets/smb_stage_clear.mp3','../assets/smb_world_clear.mp3','../assets/smb_gameover.mp3','../assets/smb_mariodie.mp3'], function() {      
          Q.assets['level.json']=level.levelarray;
          //Q.assets['level.json']=$scope.miarray;
          //console.log(level.levelarray);
          //console.log($scope.miarray);
          Q.sheet("tiles","../images/tiles.png", { tilew: 32, tileh: 32 });
          Q.compileSheets("../images/sprites.png","../data/sprites.json");
          Q.stageScene("level1");

          });
        };

        $scope.modalScore = function (score) {
          ////console.log('entro a edit modal siganture');
          $scope.score2=score;
          var modalInstance = $modal.open({
              templateUrl: 'tpl/addscore.html',
              controller: 'ModalAddScore',
              size: 'sm'
              ,
              resolve: {
                    scoredom: function () {
                  return $scope.score2;
                }
              }
          });   
        };

        $scope.stopMusic = function(){
          $scope.sound=!$scope.sound;
          if(!$scope.sound)
          Q.audio.stop('../assets/map-1.mp3');
          else Q.audio.play('../assets/map-1.mp3',{ loop: true });;
        };



	})
	//this factory provide levels generated by API REST
	.factory('Myfactory', function($http, API_URL){
        var providers = [];
        return {

          getByLevel: function(level) {
                return providers.then(function(prov){
                  return prov.data.filter(function(data){
                    return data.levelnumber == level;
                })[0];;
                });
            },
          /*
            getByLevel: function(level) {
                return providers.filter(function(data){
                    return data.data.levelnumber == level;
                })[0];
            },
          */
            setProviders: function() {
            	providers = $http.get(API_URL+'levels');
							
            },
            getProviders: function() {
                return providers.then(function(data){
                  return data.data;
                });
            }
        };
    });

/*
	.directive('angularQuintus', function() {
  		return {
  			//myGame has not good program practices
    		template: '<h1><label class="label label-default">{{score}}</label></h1><canvas id="myGame" width="500" height="500"></canvas>'
 		 };
	});  
*/    
//fin del controller
app.controller('ModalAddScore', function ($scope,scoredom, $modalInstance,$filter,$http,API_URL) {
            $scope.score=scoredom;          
           
         
        $scope.ok = function () {
              
            var data = {
                    playername: $filter('limitTo')($scope.player.name, 20),
                    score:$scope.score
                              
            };
                $http.post(API_URL+'players',data).success(function(data, status) {
                  console.log('success post'); 
                  $scope.cancel();
                });
            
        };
    
        $scope.cancel = function () {
            
             $modalInstance.dismiss('cancel');
        };
    });

	



})();
