// TODO: Adjust redrawing tiles to take into account different tile shapes and sizes
var Grid = (function () {
	// @Private
	var _this;
	var gridSize, tileSize, stepHeight, maxHeight;
	// Grid layers (canvas contexts)
	var tileLayer, actions;
	// Array of Layer objects
	var layers;
	// Array of tile string representations
	var tileList;
	// The current tile shape to draw
	var _currentTile;
	
	// @Constants
	var sqrt = Math.sqrt(2);
	var x_proj = Math.cos(-Math.PI/4);
	var y_proj = Math.sin(-Math.PI/4);
	
	function isometricToCartesian (x, y) {
		var cx = x*x_proj + y*x_proj;
		var cy = (x*y_proj - y*y_proj)/2;
		return { x: cx, y: cy };
	}

	function cartesianToIsometric (ox, oy, height) {
		var x = ox - 100;
		var y = oy - 300 + stepHeight*(height-1);
		var ix = (sqrt*x/2 - sqrt*y);
		var iy = (sqrt*x/2 + sqrt*y);
		return { 'x': ix, 'y': iy };
	}
	
	// Linear algebra transformation functions
	// Isometric matrix
	CanvasRenderingContext2D.prototype.toIsometric = function (height) {
		this.setTransform(sqrt/2, -sqrt/4, sqrt/2, sqrt/4, 100, 300 - stepHeight*height);
	}

	// Original Cartesian matrix, which respects grid offset
	CanvasRenderingContext2D.prototype.toCartesian = function (height) {
		this.setTransform(1, 0, 0, 1, 100, 300 - stepHeight*height);
	}

	// Standard default identity matrix
	CanvasRenderingContext2D.prototype.toIdentity = function (height) {
		this.setTransform(1, 0, 0, 1, 0, 0);
	}
	
	// @Public
	return {
		init: function (initParams) {
			_this = this;
			initParams = initParams || {};
			// If provided, use parameters specified in initParams, otherwise use defaults
			gridSize = initParams.gridSize || 600;
			tileSize = initParams.tileSize || 30;
			stepHeight = initParams.stepHeight || 15;
			maxHeight = initParams.maxHeight || 5;
			
			var container = document.getElementById('grid-container');
			layers = [];
			tileList = [];
			// Create the canvas elements that will represent our layers of action
			for (var i = 0; i < maxHeight; i++) {
				var canvas = document.createElement('canvas');
				canvas.id = 'grid-action-' + i;
				canvas.setAttribute('height', (gridSize) + 'px');
				canvas.setAttribute('width', (gridSize*2) + 'px');
				canvas.setAttribute('style', 'z-index:' + i + ';');
				container.appendChild(canvas);
				canvas.getContext('2d').strokeStyle = "#333333";
				
				layers.push(new Layer(i));
			}
			tileLayer = document.getElementById('tiles').getContext('2d');
			tileLayer.strokeStyle = "#333333";
			
			var action_canvas = document.getElementById('actions');
			actions = action_canvas.getContext('2d');
			
			app.commController.registerEvent({ 
				type: 'click', 
				node: action_canvas, 
				handler: function (e) {
					app.commController.fireEvent({ type: 'tileClick', event: e }, this);
				}
			});
		},
		render: function (height) {
			tileLayer.save();
			tileLayer.toIsometric((height || 0));
			tileLayer.strokeRect(0, 0, gridSize, gridSize);
			var bottomVertex = isometricToCartesian(0, gridSize);
			var rightVertex = isometricToCartesian(gridSize, gridSize);
			
			tileLayer.toCartesian(0);
			
			tileLayer.beginPath();
			tileLayer.moveTo(0, 0);
			tileLayer.lineTo(0, stepHeight);
			tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
			tileLayer.lineTo(rightVertex.x, rightVertex.y + stepHeight);
			tileLayer.lineTo(rightVertex.x, rightVertex.y);
			tileLayer.moveTo(bottomVertex.x, bottomVertex.y);
			tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
			tileLayer.stroke();
			
			tileLayer.restore();
		},
		// TODO: Fix issue with redrawing tiles on the same space
		// Potentially add new "drawNewTile" function or "redrawTile" function that does/doesn't make the existance check
		// however, to simplify things for the buffer, may want to include a property of the tile object saying whether it has
		// been rendered or not
		drawTile: function (tile, occulsions) {
			var x = tile.x, y = tile.y;
			var tx = tileSize*x, ty = tileSize*y;
			var height = tile.height;
			var tileLayer = layers[height].canvas.getContext('2d');
			var bottomVertex = tile.getBottomVertex();
			
			// By default, always draw the top portion of the tile
			tileLayer.save();
			// Draw top
			tileLayer.toIsometric(height);
			tileLayer.fillRect(tx, ty, tileSize, tileSize);
			tileLayer.strokeRect(tx, ty, tileSize, tileSize);
			// Draw top circles
			var offsetShort = tileSize/4;
			var offsetLong = 3*tileSize/4;
			tileLayer.beginPath();
			tileLayer.arc(tx + offsetShort + 5, ty + offsetShort - 5, 4, 0, Math.PI*2, false);
			tileLayer.moveTo(tx + offsetLong + 5, ty + offsetShort - 5);
			tileLayer.arc(tx + offsetLong + 5, ty + offsetShort - 5, 4, 0, Math.PI*2, false);
			tileLayer.moveTo(tx + offsetLong + 5, ty + offsetLong - 5);
			tileLayer.arc(tx + offsetLong + 5, ty + offsetLong - 5, 4, 0, Math.PI*2, false);
			tileLayer.moveTo(tx + offsetShort + 5, ty + offsetLong - 5);
			tileLayer.arc(tx + offsetShort + 5, ty + offsetLong - 5, 4, 0, Math.PI*2, false);
			tileLayer.stroke();
			tileLayer.fill();
			
			
			tileLayer.toCartesian(height);
			if (!occulsions.center) {
				// Draw left
				if (!occulsions.left) {
					var leftVertex = tile.getLeftVertex();
					tileLayer.beginPath();
					tileLayer.moveTo(leftVertex.x, leftVertex.y);
					tileLayer.lineTo(leftVertex.x, leftVertex.y + stepHeight);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y);
					tileLayer.closePath();
					tileLayer.fill();
					tileLayer.stroke();
				}
				// Draw right
				if (!occulsions.right) {
					var rightVertex = tile.getRightVertex();
					tileLayer.beginPath();
					tileLayer.moveTo(rightVertex.x, rightVertex.y);
					tileLayer.lineTo(rightVertex.x, rightVertex.y + stepHeight);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y);
					tileLayer.closePath();
					tileLayer.fill();
					tileLayer.stroke();
				}
			}
			else {
				// Draw chopped
				if (!occulsions.left) {
					var leftVertex = tile.getLeftVertex();
					
					tileLayer.beginPath();
					tileLayer.moveTo(leftVertex.x, leftVertex.y);
					tileLayer.lineTo(leftVertex.x, leftVertex.y + stepHeight);
					tileLayer.lineTo(leftVertex.x + 6, leftVertex.y + stepHeight + 4);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y);
					tileLayer.closePath();
					tileLayer.fill();
					tileLayer.stroke();
				}
				if (!occulsions.right) {
					var rightVertex = tile.getRightVertex();
					tileLayer.moveTo(rightVertex.x - 6, rightVertex.y + stepHeight + 4);
					tileLayer.lineTo(rightVertex.x, rightVertex.y + stepHeight);
					tileLayer.lineTo(rightVertex.x, rightVertex.y);
					tileLayer.lineTo(bottomVertex.x, bottomVertex.y);
					tileLayer.closePath();
					tileLayer.fill();
					tileLayer.stroke();
				}
			}
			
			
			// tileLayer.toCartesian(height);
			// tileLayer.beginPath();
			// tileLayer.moveTo(leftVertex.x, leftVertex.y);
			// tileLayer.lineTo(leftVertex.x, leftVertex.y + stepHeight);
			// tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
			// tileLayer.lineTo(rightVertex.x, rightVertex.y + stepHeight);
			// tileLayer.lineTo(rightVertex.x, rightVertex.y);
			// tileLayer.fill();
			// tileLayer.lineTo(bottomVertex.x, bottomVertex.y);
			// tileLayer.lineTo(bottomVertex.x, bottomVertex.y + stepHeight);
			// tileLayer.stroke();
			
			// tileLayer.toIsometric(height);
			// tileLayer.fillRect(tileSize*x, tileSize*y, tileSize, tileSize);
			// tileLayer.strokeRect(tileSize*x, tileSize*y, tileSize, tileSize);
			
			// tileLayer.moveTo(tileSize*x + (tileSize/2), tileSize*y + (tileSize/2));
			// tileLayer.beginPath();
			// tileLayer.arc(tileSize*x + (tileSize/2), tileSize*y + (tileSize/2), 6, 1.2*Math.PI, Math.PI/3, true);
			// tileLayer.stroke();
			// tileLayer.beginPath();
			// tileLayer.arc(tileSize*x + (tileSize/2) + 5, tileSize*y + (tileSize/2) - 5, 6, 0, Math.PI*2, false);
			// tileLayer.stroke();
			
			// tileLayer.toCartesian(height);
			// tileLayer.beginPath();
			// tileLayer.moveTo(leftVertex.x + 15, leftVertex.y);
			// tileLayer.lineTo(leftVertex.x + 15, leftVertex.y - 4);
			// tileLayer.moveTo(leftVertex.x + 28, leftVertex.y);
			// tileLayer.lineTo(leftVertex.x + 28, leftVertex.y - 4);
			// tileLayer.stroke();
			
			tileLayer.restore();
			
			// Save the drawn tile to the appropriate layer
			var tile = new Tile(x, y, 1, height);
			layers[height].addTile(tile);
			if (tileList.indexOf(tile.toString()) === -1) {
				tileList.push(tile.toString());
			}
			// if (this.tileList.indexOf(tile.toString()) === -1) {
				// this.tileList.push(tile.toString());
			// }
		},
		// Returns true if the tile exists on the grid
		tileExists: function (tile) {
			return tileList.indexOf(tile.toString()) !== -1;
		},
		// Changes the drawing tile size and/or color
		changeTile: function (color) {
			for (var i = 0; i < layers.length; i++) {
				layers[i].canvas.getContext('2d').fillStyle = color;
			}
		}
	};
})();