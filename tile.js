var Tile = function (x, y, size, height, style) {
	// @Private
	if (typeof size === "object") {
		var length = size.len;
		var facing = { x: Math.cos(size.angle), y: Math.sin(size.angle) };
		var angle = size.angle;		
	}
	else if (typeof size === "number"){
		var length = Math.floor(size);
		var facing = { x: 1, y: 0 };
		var angle = 0;
	}
	else {
		// Passed in something weird for size
		throw new TypeError("Size argument for Tile expects an object or integer");
	}
	
	
	// @Public instance vars
	this.x = x;
	this.y = y;
	this.height = height;
	this.fill = (style ? style.fill : '#000');
	this.stroke = (style ? style.stroke : '#ccc');
	
	// @Public functions
	this.rotate = function (dir) {
		facing = (dir === 'clockwise' ? 
			{ x: Math.round(Math.cos(angle+(Math.PI/2))), y: Math.round(Math.sin(angle+(Math.PI/2))) } : 
			{ x: Math.round(Math.cos(angle-(Math.PI/2))), y: Math.round(Math.sin(angle-(Math.PI/2))) }
		);
	};
	this.drawingOutline = function () {
		var tiles = [{x: this.x, y: this.y}];
		for (var i = 1; i < length; i++) {
			tiles.push({x: this.x + (facing.x*i), y: this.y + (facing.y*i)});
		}
		return tiles;
	};
};

// Prototype methods
// Need to execute within an anonymous function to give the prototype methods some private scope
(function () {
	var tileSize = 30;
	var x_proj = Math.cos(Math.PI/4);
	var y_proj = -Math.sin(Math.PI/4);
	
	function isometricToCartesian (x, y) {
		var cx = x*x_proj + y*x_proj;
		var cy = (x*y_proj - y*y_proj)/2;
		return { x: cx, y: cy };
	}
	
	Tile.prototype.apply({
		toString: function () {
			var x = this.x || '',
				y = this.y || '',
				height = this.height || '';
			return x.toString() + '-' + y.toString() + '-' + height.toString();
		},
		clone: function () {
			return new Tile(this.x, this.y, this.height);
		},
		getLeftVertex: function () {
			return isometricToCartesian(this.x*tileSize, this.y*tileSize);
		},
		getRightVertex: function () {
			return isometricToCartesian(this.x*tileSize + tileSize, this.y*tileSize + tileSize);
		},
		getBottomVertex: function () {
			return isometricToCartesian(this.x*tileSize, this.y*tileSize + tileSize);
		},
		getTopVertex: function () {
			return isometricToCartesian(this.x*tileSize + tileSize, this.y*tileSize);
		},
		getVertices: function () {
			return {
				top: this.getTopVertex(),
				bottom: this.getBottomVertex(),
				right: this.getRightVertex(),
				left: this.getLeftVertex()
			};
		}
	});
})();


