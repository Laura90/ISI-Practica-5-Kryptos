
describe("class FireBall", function(){
	
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
			map : {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		}
			
		});
		
		afterEach(function() {
                SpriteSheet = SpriteSheetOrig;
                Game = GameOrig;
       });


it("Fireball.step()", function(){
		
		
		fire1 = new FireBall(200,420,1);
		fire2 = new FireBall(250,480,-1);
		fire3 = new FireBall(550,580,-1);

		var dummyFireb = function () {
  			this.remove= function(obj) {}	
  			this.collide= function() {}
  		};
		
		fire1.board = new dummyFireb();
		fire2.board = new dummyFireb();
  		fire3.board = new dummyFireb();

  		
  		spyOn(fire3.board, "remove");
  		spyOn(fire3.board, "collide");
  		spyOn(fire2.board, "collide");
  		spyOn(fire1.board, "collide");
  		
		var dt = 0.1;
		fire1.step(dt);
		expect(fire1.x).toBe(200 - fire1.w/2 +fire1.vx * dt);
		expect(fire1.y).toBe(420 - fire1.h + (fire1.vy -50) * dt);
		expect(fire1.vy).toBe(-800);
		expect(fire1.board.collide).toHaveBeenCalled();
		
		
		fire2.step(dt);
		expect(fire2.x).toBe(250 - fire2.w/2 + fire2.vx * dt);
		expect(fire2.y).toBe(480 - fire2.h + (fire2.vy-50) * dt);
		expect(fire2.vy).toBe(-800);
		expect(fire2.board.collide).toHaveBeenCalled();
		
		fire3.step(1);
		expect(fire3.board.remove).toHaveBeenCalled();
		expect(fire3.board.collide).toHaveBeenCalled();
		
  	
 		
		
			
		});

	it("fireBall.draw()",function() {	
	
		ball= new FireBall(10,10,1);
		
		spyOn(SpriteSheet, "draw");
		
		ball.draw(ctx)
		
		expect(SpriteSheet.draw).toHaveBeenCalled();
		expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("fireball");
 		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(ball.x);
 		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(ball.y);
	
	});
	




});
