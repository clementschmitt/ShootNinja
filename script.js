var canvas = CE.defines("canvas_id").
	extend(Input).
	extend(Animation).
	extend(Hit).
	ready(function() {
		canvas.Scene.call("MyScene");
	});

canvas.Scene.new({
	name: "MyScene",
	materials: {
		images: {
			img_id: "images/background1.png"
		}
	},
	preload: function(stage, pourcent) {
		
	},
	ready: function(stage) {
	
		function addEntities(x, y){
			var entity = Class.New("Entity", [stage]);
			entity.rect(100); //carré
			entity.position(x,y);
			entity.el.fillStyle = "red";
			entity.el.fillRect(0,0,100,100);
			stage.append(entity.el);
			return entity;			
		}
		
		this.entityA = addEntities(0,100);
		this.entityB = addEntities(500,100);
		
		/*this.element = this.createElement();
		this.element.drawImage("img_id");
		stage.append(this.element);*/
		/*
		canvas.Input.keyDown(Input.A, function(e){
			console.log("A is pressed");
		});*/
	
		/*Création d'un élément scène
		this.element = this.createElement();
		this.element.drawImage("img_id");
		stage.append(this.element);*/
	},
	render: function(stage) {
		this.entityA.move(5);
		this.entityA.hit([this.entityB], function(state, el){
			if (state == "over"){
				el.fillStyle = "green";
				el.fillRect(0,0,100,100);
			}
		});
		/*var element = this.element;
		canvas.Input.keyDown(Input.Right, function(e){
			element.x += 5;
		});
		canvas.Input.keyDown(Input.Left, function(e){
			element.x -= 5;
		});*/
		stage.refresh();
	},
	exit: function(stage) {

	}
});
