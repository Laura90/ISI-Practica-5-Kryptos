/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/



describe("Clase EnemyMissile", function(){

	var canvas, ctx;
	var SpriteSheetOrig, GameOrig;
	
	beforeEach(function(){
		loadFixtures('index.html');
		
		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		SpriteSheetOrig = SpriteSheet;
        GameOrig = Game;
        
        SpriteSheet = {
				draw : function () {},
				map : {
					ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
    				explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    				fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    				enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 }
    			}
			}	
	});
	
	afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
    });
	

	it("EnemyMissile.draw()", function(){
	
		
		m = new EnemyMissile(10,10);
		
		spyOn(SpriteSheet, "draw");
		
		m.draw(ctx);
		
		expect(SpriteSheet.draw).toHaveBeenCalled();
		expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("enemy_missile");
 		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(m.x);
 		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(m.y);
 		
		

	});
	
	it("EnemyMissile.step()", function(){
	
		m = new EnemyMissile(10,90);
		m2 = new EnemyMissile(10,470);
  		
  		m.board = {
  			collide: function(obj) {}
  		};
  		m2.board = {
  			remove: function(obj) {},
  			collide: function(obj) {}
  		};
  		
  		spyOn(m.board, "collide");
  		spyOn(m2.board, "collide");
  		
		var dt = 0.1
		m.step(dt)
		
		expect(m.y).toEqual(90 + m.vy * dt);
		expect(m.board.collide).toHaveBeenCalled();
		
  		spyOn(m2.board, "remove")
  		
		m2.step(dt)
		expect(m2.board.remove).toHaveBeenCalled();
		expect(m2.board.collide).toHaveBeenCalled();
 		
		

	});
	
	it ("Eliminar bolas de fuego con misil enemigo" , function() {
	
		
		newboard = new GameBoard();
		
		fireb = new FireBall(100,100,1);
		misil_enemigo = new EnemyMissile(68,46);
		
		newboard.add(fireb);
		newboard.add(misil_enemigo);
		expect(newboard.objects.length).toBe(2);
		
		var collision = newboard.collide(fireb,OBJECT_ENEMY_PROJECTILE);
		
		newboard.step(0.01);
		
		
		expect(collision).toBe(misil_enemigo);
		expect(newboard.objects.length).toBe(0);

	
	
	
	});
	
	it ("Eliminar nave propia con misil enemigo" , function() {
	
		
		newboard = new GameBoard();
		
		nave_propia = new PlayerShip();
		misil_enemigo = new EnemyMissile(141.5,428);
		
		newboard.add(nave_propia);
		newboard.add(misil_enemigo);
		
		expect(newboard.objects.length).toBe(2);
		
		var collision = newboard.collide(nave_propia,OBJECT_ENEMY_PROJECTILE);
		
		newboard.step(0.01);
		
		
		expect(collision).toBe(misil_enemigo);
		expect(newboard.objects.length).toBe(1);
		expect(newboard.objects[0].sprite).toBe("explosion")

	
	
	
	});



})
