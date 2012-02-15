var Layer = function (height) {
	// @Private
	var _height = height;
	var stepHeight = 15;
	var tileSize = 30;
	var sqrt = Math.sqrt(2);
	var gridSize = 600;
	var _canvas = document.getElementById('grid-action-' + height);
	// Tiles on this layer
	var _tiles = [];
	
	function cartesianToIsometric (ox, oy, height) {
		var x = ox - 100;
		var y = oy - 300 + stepHeight*(height-1);
		var ix = (sqrt*x/2 - sqrt*y);
		var iy = (sqrt*x/2 + sqrt*y);
		return { 'x': ix, 'y': iy };
	}
	
	function getTilePosition(x, y, height) {
		var tx, ty;
		var coords = cartesianToIsometric(x,y, height);
		if (coords.x < gridSize && coords.x > 0 && coords.y < gridSize && coords.y > 0) {
			tx = Math.floor(coords.x / tileSize);
			ty = Math.floor(coords.y / tileSize);
		}
		else {
			tx = null;
			ty = null;
		}
		return new Tile(tx, ty, 1, height);
	}
	
	// Determine the tiles that may be blocking certain parts of
	// the tile that we are going to draw
	function affectedTiles(x, y) {
		// Check the three possible occulding tiles
		var leftTile = (new Tile(x-1, y, 1, height)).toString();
		var centerTile = (new Tile(x-1, y+1, 1, height)).toString();
		var rightTile = (new Tile(x, y+1, 1, height)).toString();
		return {
			left: Grid.tileExists(leftTile),
			center: Grid.tileExists(centerTile),
			right: Grid.tileExists(rightTile)
		};
	}
	
	function handleClick (o) {
		var e = o.event;
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var tile = getTilePosition(x, y, height);
		if (Grid.tileExists(tile)) {
			// User clicked on an already existing tile
			return;
		}
		else if (tile.x === null || tile.y === null) {
			// Break and don't draw tile
			return (height !== 1);
		}
		
		if (height === 1) {
			// drawTile(tile.x, tile.y);
			var occulsions = affectedTiles(tile.x, tile.y);
			Grid.drawTile(tile, occulsions);
			return false;
		}
		else {
			if (Grid.tileExists(new Tile(tile.x, tile.y, 1, (height-1)))) {
				var occulsions = affectedTiles(tile.x, tile.y);
				Grid.drawTile(tile, occulsions);
				return false;
			}
		}
		// Continue iterating
		return true;
	}
	
	app.commController.registerEvent({ type: 'tileClick', node: _canvas, handler: handleClick });
	
	// @Public
	this.canvas = _canvas;
	this.addTile = function (tile) {
		_tiles.push(tile);
	};
	
	this.getTiles = function () {
		return _tiles;
	};
};