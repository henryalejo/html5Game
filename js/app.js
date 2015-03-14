(function (){
    var app = angular.module('logic', ['Quintus','ui.bootstrap'])
    

    .config(function(QProvider) {
		QProvider.include(['Sprites','Scenes','Input','2D','Touch','UI']);
		QProvider.setup("myGame");                         // Add a canvas element onto the page
        QProvider.controls();                        // Add in default controls (keyboard, buttons)
        QProvider.touch();                            // Add in touch support (for the UI)
       	

	});
	//app.run();
  //app.constant('API_URL', 'http://localhost:3000/api/');
	
	app.controller('GameLogicController',function($scope,Q,$http,Myfactory,$modal) {

		////console.log('entra al controller');
		$scope.score=0;		
		$scope.myfactory=Myfactory;
    $scope.myfactory.setProviders();
		$scope.levelnumber=1;
		$scope.lives= new Array(3);
    $scope.maxlevels=1;
     $scope.miarray= [
[ 1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,1,1,1,0,0,1,0,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
[ 1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
[ 1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
[ 1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,1],
[ 1,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1],
[ 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
[ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
[ 1,0,0,1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
[ 1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
[ 1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
[ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];


		$scope.plusScore = function(score){
			$scope.score= $scope.score+score;
			$scope.$apply();
			/*
			$scope.$apply(function(){
				$scope.score= $scope.score+1;

			})
			*/

     
    
	
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
          
          this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
              $scope.plusScore(100);
              this.destroy();
              //console.log('level: '+$scope.levelnumber+'  maxlevels: '+ $scope.maxlevels);
              if($scope.levelnumber < $scope.maxlevels){
                $scope.levelnumber++;
                Q.stageScene("nextLevel",1,{ label: "You Won" }); 

              }else{
                 Q.stageScene("youLose",1, { label: "Winner" }); 
                  collision.obj.destroy();
              };
            	
              
              //$scope.modalScore($scope.score);
              
              


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
                  Q.stageScene("endGame",1, { label: "You Died" }); 
                  collision.obj.destroy();
              }
              else{
                  Q.stageScene("youLose",1, { label: "You Lose" }); 
                  collision.obj.destroy();
              };         	
            	
            }
          });
          
          this.on("bump.top",function(collision) {
            if(collision.obj.isA("Player")) { 
              this.destroy();
              collision.obj.p.vy = -300;
              $scope.plusScore(1);
             

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

          

          ////console.log($scope.miarray);
	      	$scope.load($scope.level)
      	

        });
          
         //With angular we recicle the load function for each level 
        $scope.load = function(level){

          Q.scene("level1",function(stage) {
            stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json' , sheet: 'tiles' }));

            var player = stage.insert(new Q.Player({x:level.player[0], y:level.player[1]} ));
            stage.add("viewport").follow(player);
            //los de el api
            stage.insert(new Q.Enemy({ x: level.enemy[0], y: level.enemy[1] }));
            stage.insert(new Q.Enemy({ x: level.enemy[0]+100, y: level.enemy[1] }));
            ////
            stage.insert(new Q.Enemy({ x: 700, y: 0 }));
            stage.insert(new Q.Enemy({ x: 800, y: 0 }));        
            stage.insert(new Q.Tower({ x: level.tower[0], y: level.tower[1] }));
          });

          Q.load(['../images/sprites.png', '../data/sprites.json','../images/tiles.png'], function() {      
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



	})
	//this factory provide levels generated by API REST
	.factory('Myfactory', function($http){
        var providers = [];
        return {

          getByLevel: function(level) {
                return providers.then(function(prov){
                  return prov.data.filter(function(data){
                    return data.number == level;
                })[0];;
                });
            },
          /*
            getByLevel: function(level) {
                return providers.filter(function(data){
                    return data.data.number == level;
                })[0];
            },
          */
            setProviders: function() {
            	providers = $http.get('http://localhost:3000/api/levels');
							
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
app.controller('ModalAddScore', function ($scope,scoredom, $modalInstance,$filter,$http) {
            $scope.score=scoredom;
           
           
         
        $scope.ok = function () {
            ////console.log('entra ok');
            var data = {
                    name: $filter('limitTo')($scope.player.name, 20),
                    score:$scope.score
                              
            };
                $http.post('http://localhost:3000/api/players',data).success(function(data, status) {
                console.log('Succes post'); 
                $scope.cancel();
                //$route.reload();
               // $scope.exito=true;
                });
            
        };
    
        $scope.cancel = function () {
            
             $modalInstance.dismiss('cancel');
        };
    });

	



})();
