describe("Clase PlayerShip", function(){
    // Una vez comenzado el juego deber� aparecer la nave del jugador en
    // la parte inferior

    // La nave debera moverse a izquierda y derecha con las teclas de las
    // flechas izda y dcha

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
    				missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
    				enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    				explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    				fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
    		}
		}

    });
    
    afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
    });



    it("draw", function(){
        // Comprobamos que draw llama a SpriteSheet.draw con los
        // parametros adecuados
        spyOn(SpriteSheet, "draw");

        // Necesitamos tener Game.width y Game.height para que el
        // constructor de PlayerShip pueda inicializar x e y
        Game = {width: 320, height: 480, playerOffset: 10};

        var miNave = new PlayerShip();

        miNave.draw();
        console.log(miNave);

        expect(SpriteSheet.draw).toHaveBeenCalled();
         expect(SpriteSheet.draw.calls[0].args[1]).toEqual("ship");
         expect(SpriteSheet.draw.calls[0].args[2]).toEqual(miNave.x);
         expect(SpriteSheet.draw.calls[0].args[3]).toEqual(miNave.y);
         expect(SpriteSheet.draw.calls[0].args[4]).toEqual(0);
        
    });


    it("step sin teclas pulsadas", function(){
        // Escribe tests para la clase PlayerShip
        // Deberian comprobar que:

        // 2. Tras llamar a step sin haber pulsado teclas la nave se
        // muestra en el mismo lugar

        // 3. Tras llamar a step con una flecha pulsada, se actualiza
        // la posicion de la nave


        // Necesitamos tener Game.width y Game.height para que el
        // constructor de PlayerShip pueda inicializar x e y. Y
        // necesitamos Geame.keys para saber si se ha pulsado una
        // tecla
        Game = {width: 320, height: 480, keys: {'left': false}};
        
        // Creamos un PlayerShip para testar
        var miNave = new PlayerShip();        

         miNave.step(1); // Hacemos como que ha pasado 1 segundo
        // Tras step, con Game.keys['left'] == false, no debe haberse movido,
        // por lo que lo comparamos con la posici�n x inicial de PlayerShip
        expect(miNave.x).toEqual(Game.width/2 - miNave.w / 2);


    });


    it("step con tecla left pulsada", function(){
        // 3. Tras llamar a step con una flecha pulsada, se actualiza
        // la posicion de la nave


        // Hacemos que se pulse la tecla left:
        Game = {width: 320, height: 480, keys: {'left': true}};

        // Creamos un PlayerShip para testar
        var miNave = new PlayerShip();

        // Tras el siguiente step deber�a moverse a la izquierda a
        // esta posici�n:
        function xNueva(dt) {
         var vxNueva = -miNave.maxVel;
         var xNueva = miNave.x + vxNueva * dt;
         if (xNueva < 0) xNueva = 0;
         return xNueva;
        }

        var dt = 1;
         miNave.step(dt); // Hacemos como que ha pasado 1 segundo
        // Tras step, con Game.keys['left'] == true, debe haberse
        // movido a la izquierda. Con dt==1s la nueva x es < 0 => se
        // queda en 0
        expect(xNueva(dt)).toEqual(0);
        expect(miNave.x).toEqual(xNueva(dt));

        var dt = 0.1;
         miNave.step(dt); // Hacemos como que ha pasado 1 segundo
        // Tras step, con Game.keys['left'] == true, debe haberse
        // movido a la izquierda
        expect(miNave.x).toEqual(xNueva(dt));


    });
    
    
    it("step con tecla fire pulsada", function(){
        

        SpriteSheet = {
                        map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
                                        missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
                }
        
        Game = {width: 320, height: 480, keys: {'fire': false}};

        var miNave = new PlayerShip();


        var theboard = function () {
                this.contador = 0;
                this.add = function () { this.contador = this.contador + 1 }
        }
        
        
        // Sin pulsar disparo, no debe disparar
        miNave.board = new theboard();
        var dt = 1;
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(0)
        
        // Tras mantener pulsado espacio, debe disparar solo 2 misiles
        miNave.board = new theboard();
        Game = {width: 320, height: 480, keys: {'fire': true}};
        miNave.step(dt)
        miNave.step(dt)
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(2);
        
        //Suelto espacio, no debe disparar
        miNave.board = new theboard();
        Game = {width: 320, height: 480, keys: {'fire': false}};
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(0);
        
        // Disparo a rafagas
        miNave.board = new theboard();
        Game = {width: 320, height: 480, keys: {'fire': true}}; // pulso disparo
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(2); // 2 misiles disparados
        Game = {width: 320, height: 480, keys: {'fire': false}}; // suelto disparo
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(2); // Sigue habiendo 2 misiles disparados
        Game = {width: 320, height: 480, keys: {'fire': true}}; // pulso disparo
        miNave.step(dt)
        expect(miNave.board.contador).toEqual(4); // En total, 4 misiles disparados

    });
    
    it("step con tecla leftFireBall pulsada", function(){
    
            SpriteSheet = {
                        map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
                                 fireball: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
                }
            Game = {width: 320, height: 480, keys: {'leftFireBall': false}};

                var miNave = new PlayerShip();

            var theboard = function () {
                        this.contador = 0;
                        this.add = function () { this.contador = this.contador + 1 }
                }
                // Sin pulsar disparo, no debe disparar
                miNave.board = new theboard();
                var dt = 1;
                miNave.step(dt)
                expect(miNave.board.contador).toEqual(0)
        
                // Tras mantener pulsado tecla leftfireball, debe disparar una bola de fuego
                miNave.board = new theboard();
                Game = {width: 320, height: 480, keys: {'leftFireBall': true}};
                miNave.step(dt)
                miNave.step(dt)
                //miNave.step(dt)
                expect(miNave.board.contador).toEqual(1);
        
                //Suelto espacio, no debe disparar
                miNave.board = new theboard();
                Game = {width: 320, height: 480, keys: {'leftFireBall': false}};
                miNave.step(dt)
                expect(miNave.board.contador).toEqual(0);
    
    
    });
    
        it("step con tecla rightFireBall pulsada", function(){
    
            SpriteSheet = {
                        map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
                                 fireball: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
                }
            Game = {width: 320, height: 480, keys: {'rightFireBall': false}};

                var miNave = new PlayerShip();

            var theboard = function () {
                        this.contador = 0;
                        this.add = function () { this.contador = this.contador + 1 }
                }
                // Sin pulsar disparo, no debe disparar
                miNave.board = new theboard();
                var dt = 1;
                miNave.step(dt)
                expect(miNave.board.contador).toEqual(0)
        
                // Tras mantener pulsado tecla leftfireball, debe disparar una bola de fuego
                miNave.board = new theboard();
                Game = {width: 320, height: 480, keys: {'rightFireBall': true}};
                miNave.step(dt)
                miNave.step(dt)
                //miNave.step(dt)
                expect(miNave.board.contador).toEqual(1);
        
                //Suelto espacio, no debe disparar
                miNave.board = new theboard();
                Game = {width: 320, height: 480, keys: {'rightFireBall': false}};
                miNave.step(dt)
                expect(miNave.board.contador).toEqual(0);
    
    
    });



});



