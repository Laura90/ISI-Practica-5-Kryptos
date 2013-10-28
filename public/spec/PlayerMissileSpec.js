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

describe("Clase PlayerMissile", function(){

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
			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
		}
	});
	
	afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
    });
	

	it("PlayerMissile.draw()", function(){
	
		
		m = new PlayerMissile(10,10);
		
		spyOn(SpriteSheet, "draw");
		
		m.draw(ctx)
		
		expect(SpriteSheet.draw).toHaveBeenCalled();
		expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("missile");
 		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(m.x);
 		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(m.y);
 		
		

	});
	
	it("PlayerMissile.step()", function(){
	
		m = new PlayerMissile(10,90);
		m2 = new PlayerMissile(10,20);
  		
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
		
		expect(m.y).toEqual(90 - 10 + m.vy * dt);
		expect(m.board.collide).toHaveBeenCalled();
		
  		spyOn(m2.board, "remove")
  		
		m2.step(dt)
		expect(m2.board.remove).toHaveBeenCalled();
		expect(m2.board.collide).toHaveBeenCalled();
 		
		

	});
	



})
