var canvas = CE.defines("canvas_id").
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
		this.element = this.createElement();
		this.element.drawImage("img_id");
		stage.append(this.element);
	},
	render: function(stage) {
		this.element.x += 1;
		stage.refresh();
	},
	exit: function(stage) {

	}
});
