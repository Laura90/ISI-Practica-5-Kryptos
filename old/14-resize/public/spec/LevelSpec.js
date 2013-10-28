describe("LevelSpec", function() {
        
		var canvas, ctx;
		var SpriteSheetOrig, GameOrig;
		var callback = function() {};
        
        var LevelPrueba = [
         // Comienzo, Fin, Frecuencia, Tipo, Override
                [ 0, 4000, 500, 'step' ],
                [ 6000, 13000, 800, 'ltr' ],
                [ 10000, 16000, 400, 'circle' ],
                [ 17800, 20000, 500, 'straight', { x: 50 } ],
                [ 18200, 20000, 500, 'straight', { x: 90 } ],
                [ 18200, 20000, 500, 'straight', { x: 10 } ],
                [ 22000, 25000, 400, 'wiggle', { x: 150 } ],
                [ 22000, 25000, 400, 'wiggle', { x: 100 } ]
        ];
        
		beforeEach(function(){
			loadFixtures('index.html');
		
			canvas = $('#game')[0];
			expect(canvas).toExist();

			ctx = canvas.getContext('2d');
			expect(ctx).toBeDefined();
			SpriteSheetOrig = SpriteSheet;
            GameOrig = Game;
            /*
			SpriteSheet = {
				map : {enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 }}
			}
			*/
		});
		
		afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
        });
        
        it("level.step()", function() {

			SpriteSheet.map = {
                     ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
                     missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
                     enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
                     enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
                     enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
                     enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
                     explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
	                 fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }
              };

             var nivel = new Level(LevelPrueba, callback);
             var gameboard = new GameBoard();
             gameboard.add(nivel);
             var dt = 1;
             spyOn(nivel.board, "add");
             spyOn(nivel, "callback");
            
                                
                /*- si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.*/
                
			nivel.step(dt);
			expect(nivel.t).toBe(dt*1000);
			expect(nivel.callback).not.toHaveBeenCalled();

			nivel.board.add.reset();
			nivel.t = 3500;
			nivel.step(dt);            
			expect(nivel.t).toBe(3500 + dt*1000);
			expect(nivel.levelData.length).toBe(LevelPrueba.length-1);
			expect(nivel.callback).not.toHaveBeenCalled();

			nivel.board.add.reset();
			nivel.t = 11000;
			nivel.step(dt);
			expect(nivel.t).toBe(11000 + dt*1000);
			expect(nivel.levelData.length).toBe(LevelPrueba.length-1);
			expect(nivel.callback).not.toHaveBeenCalled();
                
            nivel.t = 26000;
        	nivel.board.cnt[OBJECT_ENEMY] = 0;
			nivel.step(dt);
			expect(nivel.callback).toHaveBeenCalled();

        });
        
        it("levelConstructor()", function(){
        	var nivel = new Level(LevelPrueba, callback);
        	expect(nivel.callback).toBe(callback);
        	expect(nivel.levelData.length).toBe(LevelPrueba.length);
        	expect(nivel).toBeDefined();
        });
        
        
        
});







/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
             Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
   Ejemplo:
           [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/
