describe("class PuntuacionSpec", function(){

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
               map : {enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
                	explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
                	fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
                	missile: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }}
                };
		gameboard = new GameBoard();
		});
		
		afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
       });

	it("Puntos al matar un enemigo()",function(){
		Game={width: 320, height:480};
		var enem =new Enemy({ x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2 , E: 100, health:10 });
		var puntos =new GamePoints();
		enem.board= {add: function(obj) {}, remove: function () {return true}};
		
		expect(Game.points).toBe(0);
		enem.hit(10);
		expect(Game.points).toBe(100);
	});
	
	it ("Puntos del misil al matar un enemigo()", function(){
		Game={width: 320, height:480};
		var enem =new Enemy({ x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2 , E: 100, health:10 });
		var missile = new PlayerMissile(100,100);
		var puntos =new GamePoints();
		enem.board= {add: function(obj) {}, remove: function () {return true}};
		
		gameboard.add(missile);
        gameboard.add(enem);
        expect(Game.points).toBe(0);
        gameboard.step(0.0000001);
        enem.hit(10);
        expect(Game.points).toBe(100);

	});
	
	it("reinicio del contador al perder()", function(){
		Game = {setBoard: function(){}};
		var puntos =new GamePoints();
		Game.points=1000;
		expect(Game.points).toBe(1000);
		loseGame();
		expect(Game.points).toBe(0);
	
	
	});
	
	it("bola de fuego con enemigo()", function(){
		Game={width: 320, height:480};
		var enem =new Enemy({ x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2 , E: 100, health:10 });
		var fireball = new FireBall(100,100, 5);
		var puntos =new GamePoints();
		enem.board= {add: function(obj) {}, remove: function () {return true}};
		
		gameboard.add(fireball);
        gameboard.add(enem);
        expect(Game.points).toBe(0);
        gameboard.step(0.0000001);
        enem.hit(10);
        expect(Game.points).toBe(100);

	
	});



});
