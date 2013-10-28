/*


En el anterior prototipo, el objeto Game permite gestionar una pila de
tableros (boards). Los tres campos de estrellas, la pantalla de inicio
y el sprite de la nave del jugador se añaden como tableros
independientes para que Game pueda ejecutar sus métodos step() y
draw() periódicamente desde su método loop(). Sin embargo los tableros
no pueden interaccionar entre sí. Resulta difícil con esta
arquitectura pensar en cómo podría por ejemplo detectarse la colisión
de una nave enemiga con la nave del jugador, o cómo podría detectarse
si un disparo de colisiona con una nave.

Este es precisamente el requisito que se ha identificado para este
prototipo: gestionar la interacción entre los elementos del
juego. Piensa en esta clase como un tablero de juegos de mesa, sobre
el que se disponen los elementos del juego (fichas, cartas, etc.). En
este caso serán naves enemigas, nave del jugador y disparos los
elementos del juego. Para Game, GameBoard será un tablero más, por lo
que deberá ofrecer los métodos step() y draw(), y será responsable de
mostrar todos los objetos que contenga cuando Game llame a estos
métodos.



Especificación: GameBoard debe

- mantener una colección de objetos a la que se pueden añadir y de la
  que se pueden eliminar sprites

- interacción con Game: cuando reciba los métodos step() y draw() debe
  ocuparse de que se ejecuten estos métodos en todos los objetos que
  contenga.

- debe detectar la colisión entre objetos. Querremos que los disparos
  de la nave del jugador detecten cuándo colisionan con una nave
  enemiga, que una nave enemiga detecte si colisiona con la nave del
  jugador, que un disparo de la nave enemiga detecte si colisiona con
  la nave del jugador,... necesitamos saber de qué tipo es cada objeto.


*/

describe("Clase GameBoard", function(){

	var canvas, ctx;
	var SpriteSheetOrig, GameOrig;
	
	beforeEach(function(){
		loadFixtures('index.html');
		
		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		
		newboard = new GameBoard();
		SpriteSheetOrig = SpriteSheet;
        GameOrig = Game;
	});
	
	afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
    });




	it("GameBoard.Add()", function(){
		
		var dummy = function () {}
		d = new dummy();
		newboard.add(d);
		expect(newboard.objects.length).toEqual(1);
		


	});
	
	it("Remove from objects", function(){
		
		var dummy = function () {}
		
		d = new dummy();
		d2 = new dummy();
		
		newboard.add(d);
		newboard.add(d2);
		
		expect(newboard.objects.length).toEqual(2);
		
		newboard.resetRemoved();
		newboard.remove(d);
		newboard.finalizeRemoved();
		
		expect(newboard.objects.length).toEqual(1);
		expect(newboard.objects[0]).toEqual(d2);

	});
	

	it("GameBoard.draw()", function(){
		
		var dummy = function () {
			this.draw = function (){}
		}
		
		d = new dummy();
		d2 = new dummy();
		
		newboard.add(d);
		newboard.add(d2);
		
		spyOn(d, "draw");
		spyOn(d2, "draw");
		
		newboard.draw(ctx);
		
		expect(d.draw).toHaveBeenCalled();
		expect(d2.draw).toHaveBeenCalled();
		

	});
	
	it("GameBoard.step()", function(){
		
		var dummy = function () {
			this.step = function (){}
		}
		
		d = new dummy();
		d2 = new dummy();
		
		newboard.add(d);
		newboard.add(d2);
		
		spyOn(d, "step");
		spyOn(d2, "step");
		
		var dt = 1;
		newboard.step(dt);
		
		expect(d.step).toHaveBeenCalled();
		expect(d2.step).toHaveBeenCalled();


	});
	
	it("GameBoard.collide()", function(){
		
		var missile = function () {
			this.x =140
			this.y =428
			this.h = 40
			this.w = 40
		}
		
		misil = new missile();
		misil2 = new missile();
		
		newboard.add(misil);
		newboard.add(misil2);
		
		expect(newboard.collide(misil)).toEqual(misil2);
		

	});
	
	it("GameBoard.iterate()", function(){
		
		var dummy = function () {
			this.f = function () {}
		}
		var dummy1 = new dummy();
		var dummy2 = new dummy();
		newboard.add(dummy1);
		newboard.add(dummy2);
		
		spyOn(dummy2, "f");
		spyOn(dummy1, "f");
		
		newboard.iterate("f")
		expect(dummy1.f).toHaveBeenCalled();
		expect(dummy2.f).toHaveBeenCalled();
		
	});

	it("GameBoard.overlap()", function(){
		
		var ojt = function (x,y,h,w) {
			this.x = x
			this.y = y
			this.h = h
			this.w = w
		}
		var dummy1 = new ojt(10,10,10,10);
		var dummy2 = new ojt(15,15,15,15);
		var dummy3 = new ojt(30,30,15,15);

		expect(newboard.overlap(dummy1,dummy2)).toEqual(true);
		expect(newboard.overlap(dummy1,dummy3)).toEqual(false);
		
	});

	it("GameBoard.detect()", function(){
		
		var dummy = function () {}
		
		var dummy1 = new dummy();
		var dummy2 = new dummy();
		
		newboard.add(dummy1);
		newboard.add(dummy2);
		
		expect(newboard.detect(function() {return true})).toEqual(dummy1);
		
	});







});
