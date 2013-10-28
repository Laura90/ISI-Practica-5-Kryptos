
describe("class Sprite", function(){
	
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

	it("Sprite.draw()",function(){
	
		var s= new Sprite();
		
		
		spyOn(SpriteSheet, "draw");
		s.sprite="fireball";
		s.draw(ctx);
		
		expect(SpriteSheet.draw).toHaveBeenCalled();
		expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("fireball");
 		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(s.x);
 		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(s.y);
	
	});
	
	it("Sprite.merge()", function(){
	
		var s = new Sprite();
		
		s.sprite ="fireball";
		
		
		s.merge({vx:-100});
		
		expect(s.vx).toBe(-100);
	
	});




		

	it("Sprite.step()", function(){
		
		var obj = new Sprite();
		
		spyOn(obj, "merge");
		obj.setup('fireball', {vx: -100})
		
		expect(obj.sprite).toBe("fireball");
		expect(obj.merge).toHaveBeenCalled();
		expect(obj.w).toBe(64);
		expect(obj.h).toBe(64);
		expect(obj.frame).toBe(0);
		
  		
	});
 		
		
			
});


