/*
Copyright (C) 2013 by WebCreative5, Samuel Ronce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

CanvasEngine._presets = {};

Class.create("Preset", {

	name: "",
	preset: {},

	initialize: function(name, preset) {
		return this.set(name, preset);
 	},

 	set: function(name, preset) {
 		this.name = name;
		this.preset = preset;
		CanvasEngine._presets[name] = preset;
		return this;
 	}

});

/**
@doc ui
@static
@class UI Create elements for a user interface

1. Add functionality in CanvasEngine :

		var canvas = CE.defines("canvas_id").
		extend(UI).
		ready(function() {
			canvas.Scene.call("MyScene");
		});

2. Use methods in `ready` of current scene

		var tooltip = canvas.UI.tooltip();
		stage.append(tooltip);

The class includes a Preset notion. The interest is to reuse a configuration several times in your game or application.

	var preset = Class.New("Preset", ["mypreset", {
		img: "my_button"
	}]);

	var el1 = canvas.UI.button(preset),
		el2 = canvas.UI.button(preset);

Here we have created two buttons with the same image. Note that it is possible to use the identifier of the preset on any scene :

	var el3 = canvas.UI.button("mypreset");

> In the case of the button, do not forget to load the image prior to use

Another way to create a preset :

	var preset = Class.New("Preset").set("mypreset", {
		img: "my_button"
	});
	
*/
Class.create("UI", {

/**
@doc ui/
@property scene Change the scene to create the elements
@type CanvasEngine.Scene
@default current scene
@example

	canvas.UI.scene = canvas.Scene.get("MyScene");
*/
	scene: null,

	_getScene: function() {
		if (!this.scene) {
			var scenes = Global_CE.Scene.getEnabled();
			for (var name in scenes) {
			    this.scene = scenes[name];
			    break;
			}
		}
		return this.scene;
	},

	_getParams: function(params) {
		if (typeof params == "string") {
			return CanvasEngine._presets[params];
		}
		else if (params instanceof Class && params.__name__ == "Preset") {
			return params.preset;
		}
		return params;
	},

	// Maybe
	setGraphic: function(els, graphic) {

		var f;

		for (var key in graphic) {
			for (var el_name in els) {
				if (els["@" + el_name]) {

				}
				els[el_name][key];
			}
		}
	},

	// TODO
	progressBar: function(id, pourcent, graphic) {
		
		this._getScene();

		graphic = CanvasEngine.extend(graphic, {
			"width": 100,
			"height": 50,
			"@empty": {
				"fillStyle": 		"black",
				"fillRect": 		""
			},
			"@full": {
				"fillStyle": 		"red"
			}
		});

		var bar = this.scene.createElement(["full", "empty"]);

		bar.empty.append(bar.full);

		return bar.full;
	},

	dialog: function() {

	},


	background: function(params) {
		this._getScene();

		params = this._getParams(params);

		params = CanvasEngine.extend({
			repeat: true
		}, params);

		var img = Global_CE.Materials.get(params.img),
			self = this,
			_canvas, w, h,
			background = this.scene.createElement();

		if (params.repeat) {

			_canvas = this.scene.getCanvas();
			w = _canvas.width;
			h = _canvas.height;

			var elements = {};

			CanvasEngine.each(["lt", "t", "rt", "l", "c", "r", "lb", "b", "rb"], function(i, val) {
				var el = self.scene.createElement(w, h);
			    el.fillStyle = _canvas.createPattern(params.img);
			    el.fillRect();
			    el.x = w * ~~(i / 3) - w;
			    el.y = h * (i % 3) - h;
			    elements[val] = el;
			    background.append(el);
			});

			background.width = w * 3;
			background.height = h * 3;

			background.on("canvas:render", function(el) {

			});

		}

		return background;
	},


/**
@doc ui/
@method draggable Allow elements to be moved using the mouse
@param {CanvasEngine.Element} el (optional) Element to move
@param {Object|String|Pattern} params (optional) Parameters, pattern name or pattern object

* {Array|Grid} grid : Snaps the dragging helper to a grid, every x and y pixels. The array must be of the form [ x, y ]. You can use the Grid class also

		var grid = Class.New("Grid", [10, 5]);
		grid.setCellSize(32, 32);

		canvas.UI.draggable(el, { // el is an element created before
			grid: grid
		});

* {String} axis : Constrains dragging to either the horizontal (x) or vertical (y) axis. Possible values: "x", "y"
* {Integer} distance : Distance in pixels after mousedown the mouse must move before dragging should start.
* {String|Array} containment : Constrains dragging to within the bounds of the specified element or region. Do not forget to give a size elements. If you use the parent, first use the `append()` method
	* "canvas" or "parent"
	* An array defining a bounding box in the form [ x1, y1, x2, y2 ].
* {Function} drag : Triggered while the mouse is moved during the dragging.
	* {Event} event
	* {Object} mouse : Mouse position {x, y}
* {Function} start : Triggered when dragging starts.
	* {Event} event
	* {Object} mouse : Mouse position {x, y}
 * {Function} stop : Triggered when dragging stops.
	* {Event} event

@example	

In `ready` method.

Example 1

	 var el = this.createElement(100, 100);
	 el.fillStyle = "red";
     el.fillRect(0, 0, 100, 100);
     canvas.UI.draggable(el, {
		  axix: "x"
	 });

	 stage.append(el);

Example 2

	 var el = this.createElement(100, 100);
	 el.fillStyle = "red";
     el.fillRect(0, 0, 100, 100);

	 var el2 = this.createElement(10, 10);
	 el2.fillStyle = "green";
     el2.fillRect(0, 0, 10, 10);

     el.append(el2);
     stage.append(el);

     canvas.UI.draggable(el2, {
		 containment: "parent",
		 start: function(event, mouse) {
			console.log("Let's go !");
		 }
	 });
*/
	draggable: function(el, params) {

		this._getScene();

		params = this._getParams(params);

		params = CanvasEngine.extend({
			grid: [1, 1],
			axis: "xy",
			distance: null,
			containment: "canvas"
		}, params);

		var margin = {}, offset = {}, x, y, rx, ry,  parent;

		if (params.grid.__name__ == "Grid") {
			params.grid = [params.grid.cell.width || 1, params.grid.cell.height || 1];
		}

		if (params.containment == "parent") {
			if (!el.parent) {
				params.containment = null;
			}
			else {
				parent = el.parent.position();
				params.containment = [parent.left, parent.top, parent.left + el.parent.width, parent.top + el.parent.height];
			}	
		}
		else if (params.containment == "canvas") {
			params.containment = null;
		}


		var start = function(e, mouse) {
			 this.attr('drag', true);
			 var pos = this.position();
			 margin = {
				x:  pos.left - mouse.x,
				y:  pos.top - mouse.y
			 };
			 offset = this.offset();
			 if (params.start) params.start.call(this, e, mouse);
        },

        drag = function(e, mouse) {
			if (el.attr('drag')) {

				var p = el.parent.position();

				x = ~~((mouse.x + margin.x) / params.grid[0]) * params.grid[0]; 
				y = ~~((mouse.y + margin.y) / params.grid[1]) * params.grid[1];

				rx = x - p.left;
				ry = y - p.top;

				if (/x/.test(params.axis)) {
					if (params.distance) {
						if (Math.abs(-margin.x - x) <= params.distance) {
							el.x = rx;
						}
					}
					else if (params.containment) {
						if (x >= params.containment[0] && x <= params.containment[2] - el.width) {
							el.x = rx;
						}
					}
					else {
						el.x = rx;
					}
						
				}
				if (/y/.test(params.axis)) {
					if (params.distance) {
						if (Math.abs(-margin.y - y) <= params.distance) {
							el.y = ry;
						}
					}
					else if (params.containment) {
						if (y >= params.containment[1] && y <= params.containment[3] - el.height) {
							el.y = ry;
						}
					}
					else {
						el.y = ry;
					}
				}

				if (params.drag) params.drag.call(this, e, mouse);
			}
        },

        stop = function(e) {
			 this.attr('drag', false);
			 if (params.stop) params.stop.call(this, e);
        };
		
		el.on("mousedown", start);
		this.scene.getStage().on("mousemove", drag);
		el.on("mouseup", stop);
	},
	
/**
@doc ui/
@method button Create a button
@param {String} text (optional) Displays text in the center of the button. Do not set this parameter if you want not to text
@param {Object|String|Pattern} params (optional) Parameters, pattern name or pattern object

* {String} img (Obligatory) : Name of the identifier of the image has been loaded
* {Array} img_order : Order of sprite sheet. By default : `["default", "hover", "click", "disabled"]`. You can reduce the array entries
* {Function} click : Triggered when clicking the button
	* {Event} event
* {Function} hover : Triggered when mouse is hovered in the button
	* {Event} event
* {Object} text : If you put a text : {font, color}
	* {String} font : Same value as `font` property
	* {String} color : Same value as `fillStyle` property

Note that you can enable or disable the button :

	el.attr("disabled", true); // el is a element button (see example bellow)

Use the `element:attrChange` event to trigger a function :

	el.on("element:attrChange", function(name, value) {
		if (name == "disabled") {
			if (value) { // value is a boolean
				console.log("Disabled !");
			}
			else {
				console.log("Enabled !");
			}
		}
	});

@return {CanvasEngine.Element}

@example	

In `ready` method.

Example 1

	 var el = canvas.UI.button("Ok", {
		img: "my_button",
		text: {
			color: "white",
			font: "15px Arial"
		}
	 });
	
	 stage.append(el);

Example 2

	var preset = Class.New("Preset", ["mypreset", {
		img: "my_button"
	}]);

	var el = canvas.UI.button(preset);
	// or canvas.UI.button("mypreset");
	
	stage.append(el);
*/
	button: function(text, params) {

		this._getScene();

		if (typeof text != "string") {
			params = text;
			text = false;
		}

		params = this._getParams(params);

		params = CanvasEngine.extend({
			img_order: ["default", "hover", "click", "disabled"]
		}, params);

		var scene = this.scene,
			_canvas = scene.getCanvas(),
			btn = scene.createElement();

		var img = Global_CE.Materials.get(params.img);

		btn.width = img.width / params.img_order.length;
		btn.height = img.height;

		if (text) {
			params.text = CanvasEngine.extend({
				font: '20px Arial',
				color: 'white'
			}, params.text);

			var el = scene.createElement(btn.width,  btn.height);
	        el.font = params.text.font;
	        el.fillStyle = params.text.color;
	        el.fillText(text, "middle");
	        btn.append(el);
	    }

		function _draw(type) {
			if (!type) type = "default";
			var pos = CanvasEngine.inArray(type, params.img_order);
			if (pos == -1) pos = 0;
			btn.drawImage(img, pos *  btn.width, 0, btn.width, btn.height, 0, 0, btn.width, btn.height);
		}

		function _isDisabled() {
			return btn.attr("disabled");
		}

		btn.on("click", function(e) {
			if (params.click) params.click.call(this, e);
		});
		
		btn.on("mouseover", function(e) {
			if (!_isDisabled()) {
				_draw("hover");
				if (params.hover) params.hover.call(this, e);
			}	 
		});

		btn.on("mousedown", function(e) {
			if (!_isDisabled()) {
				 _draw("click");
			}
		});

		btn.on("mouseup", function(e) {
			if (!_isDisabled()) {
				 _draw();
			}
		});
		
		btn.on("mouseout", function(e) {
			if (!_isDisabled()) {
				_draw();
			}
		});

		btn.on("element:attrChange", function(name, value) {
			if (name == "disabled") {
				if (value) _draw("disabled");
				else _draw();
			}
		});

		_draw();
		
		return btn;
	},
	
/**
@doc ui/
@method tooltip Create a tooltip
@param {Object|String|Pattern} params Parameters, pattern name or pattern object

* {String} position : Position of the arrow. `bottom` (default), `top`, `left` or `right`
* {String|Integer} gap : Spacing of the arrow with respect to the pixel top end or left. Put `middle` (by default) to place in the middle
* {Integer} width : Width (px)
* {Integer} height : Height (px)
* {Integer} radius : Rounding corners of the tooltip
* {String} type : `fill` or `stroke` (default)
* {String} color: Color (black by default)
* {Object} arrow : Parameters of the arrow `{base, height, skew}`
	* {Integer} base : Width of the base of the triangle (10 by default)
	* {Integer} height : Triangle Height (10 by default)
	* {Integer} skew : Skew (0 by default)

@return {CanvasEngine.Element}

@example	

In `ready` method.

Example 1

	 var el = canvas.UI.tooltip({
		 position: "top",
		 width: 150,
		 height: 30
	 });
	
	 stage.append(el);

Example 2

	var preset = Class.New("Preset", ["mypreset", {
		 arrow: {
			skew: 10
		 }
	}]);

	var el = canvas.UI.tooltip(preset);
	// or canvas.UI.tooltip("mypreset");
	
	stage.append(el);
*/
	tooltip: function(params) {
	
		this._getScene();

		params = this._getParams(params);

		params = CanvasEngine.extend({
			position: "bottom",
			gap: "middle",
			width: 100,
			height: 80,
			radius: 5,
			type: "stroke",
			color: "black",
			arrow: {}
		}, params);

		params.arrow = CanvasEngine.extend({
			base: 10,
			height: 10,
			skew: 0
		}, params.arrow);

		var scene = this.scene,
			_canvas = scene.getCanvas(),
			el = scene.createElement(),
			w = params.width,
			h = params.height, 
			radius = params.radius;

		el.width = w;
		el.height = h;

		if (params.gap == "middle") {
			if (params.position == "left" || params.position == "right") {
				params.gap = params.height / 2;
			}
			else {
				params.gap = params.width / 2;
			}
			params.gap -= params.arrow.base / 2;
		}

		  el.beginPath();

		  el[params.type + "Style"] = params.color;
		  
		  el.moveTo(radius, 0);

		  if (params.position == "top") {
		  	 el.lineTo(params.gap, 0);
		 	 el.lineTo(params.arrow.base / 2 + params.gap + params.arrow.skew, -params.arrow.height);
		  	 el.lineTo(params.arrow.base + params.gap, 0);
		  }
		 
		  el.lineTo(w - radius, 0); 
		  el.quadraticCurveTo(w, 0, w, radius);

		  if (params.position == "right") {
		  	 el.lineTo(w, params.gap);
		 	 el.lineTo(w + params.arrow.height, params.gap + params.arrow.skew + params.arrow.base / 2);
		  	 el.lineTo(w, params.gap + params.arrow.base);
		  }

		  el.lineTo(w, h-radius);
		  el.quadraticCurveTo(w, h, w-radius, h);

		  if (params.position == "bottom") {
		  	 el.lineTo(w-(w-params.gap) + radius / 2, h);
		 	 el.lineTo(w-(w-params.gap) + radius / 2 - params.arrow.base / 2 + params.arrow.skew, h+params.arrow.height);
		  	 el.lineTo(w-(w-params.gap) + radius / 2 - params.arrow.base, h);
		  }

		  el.lineTo(radius, h);
		  el.quadraticCurveTo(0, h, 0, h-radius);

		  if (params.position == "left") {
		  	 el.lineTo(0, h-(h-params.gap) + radius / 2);
		 	 el.lineTo(-params.arrow.height, h-(h-params.gap) + radius / 2 - params.arrow.base / 2 + params.arrow.skew);
		  	 el.lineTo(0, h-(h-params.gap) + radius / 2 - params.arrow.base);
		  }

		  el.lineTo(0, radius);
		  el.quadraticCurveTo(0, 0, radius, 0);

		  el[params.type]();
	
		return el;
	}
	
	
	
});
var UI = {
	UI: Class.New("UI")
};