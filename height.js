// TODO: Height levels > 2, implement tile highlighting

// Implementation of multi-height grid panels
// Pixel height of each level
/*
function gridRender(width, height, minHeight, maxHeight, tileList) {
	var numGrids = maxHeight - minHeight + 1;
	for (var i = 0; i < numGrids; i++) {
		var canvas = document.createElement('canvas');
		canvas.id = "grid-" + i;
		canvas.setAttribute("width", width + "px");
		canvas.setAttribute("height", height + "px");
		document.getElementById('grid-container').appendChild(canvas);
		
		// Probably currently fails because of 'i' going out of scope or being
		// applied as the wrong value (i.e. same value) to each grid
		canvas.addEventListener('tileIn', function (e) {
			// Fill the tile that the mouse occupies
			if (i === 0) {
				// Base grid, should handle all mouse highlighting by default (catch-all)
				fillTile(e.tx, e.ty, this.getContext('2d'), '#BF3030');
				return;
			}
			// Check if the mouse is in a tile at this height
			// If not, bubble the event down to the next lower grid
			for (var k = 0; k < tileList[i]; k++) {
				if (e.tx === tileList[i][k].x && e.ty === tileList[i][k].y) {
					// Mouse does intersect with a tile at this height
					fillTile(e.tx, e.ty, this.getContext('2d'), '#BF3030');
					return;
				}
			}
			// Dispatch to the lower grid
			document.getElementById('grid-'+(i-1)).dispatchEvent(e);
		}, false);
		
		canvas.addEventListener('tileOut', function (e) {
			// Clear the drawn tile
		}, false);
		
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, 1000, 1000);
		context.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
		context.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
		// Base case: 0 -> Main grid is drawn
		if (i !== 0) {
			for (var j = 0; j < tileList[i].length; j++) {
				// drawTile(tileList[i][j].x, tileList[i][j].y, i, context);
			}
		}
		else {
			//context.toIsometric(i);
			//drawGrid(600, context, stepHeight*i);
		}
	}
}
*/

// New grid rendering method
// Draws tiles from left to right and top to bottom
// This ensures that tiles that appear to be closer to the camera are
// not overlapped by tiles that are further away
// @Param {int} gridSize := the height/width of the grid in pixels
// @Param {int} maxHeight := the maximum height that any tile will have.  Minimum height is assumed to be 0.
// @Param {dictionary} tileList := the list of tiles of height greater than 0 (base).
// @Return {void}
function renderGrid(gridSize, maxHeight, tileList) {
	// Insert the canvas objects into the DOM
	for (var i = 0; i < maxHeight; i++) {
		var canvas = document.createElement('canvas');
		canvas.id = "grid-" + i;
		canvas.setAttribute("width", gridSize + "px");
		canvas.setAttribute("height", gridSize + "px");
		document.getElementById('grid-container').appendChild(canvas);
	}
	
	// Now we have the canvas' ready, so we can begin drawing things
	// We start with the base level, one because it is a special case,
	// and two because everything should be drawn on top of it
	var grid = document.getElementById('grid-0').getContext('2d');
	
	drawGrid(gridSize, grid, 0);
}


// Not currently functional
// function changeOfBasis (x, y) {
	// return { x: -( - x + y), y: (0.5*x + y)/2 };
// }
/*
window.onload = function () {
	Grid.init();
	Buffer.init();
	
	// Generate random tiles
	var tiles = [];
	for (var j = 0; j < 50; j++) {
		var x = Math.floor(Math.random()*20);
		var y = Math.floor(Math.random()*20);
		var height = Math.floor(Math.random()*4) + 1;
		tiles.push({"x": x, "y": y, "height": height});
	}
	
	Grid.render();
	// Buffer.write(tiles, false, true);
	
	
	var mouseTile = { x: null, y: null };
	document.getElementById('highlight').addEventListener('mousemove', function (e) {
		var tile = getTilePosition(e.pageX - this.offsetLeft, e.pageY - this.offsetRight, 2);	// <-- 2 represents the max grid height that we are rendering
		if (tile.x !== mouseTile.x || tile.y !== mouseTile.y) {
			var topGrid = document.getElementById('grid-2');
			if (mouseTile.x !== null || mouseTile.x !== null) {
				// Clear out the old tile when the user moves the mouse outside its bounds
				var tileOut = document.createEvent('Event');
				tileOut.initEvent('tileOut', true, true);
				topGrid.dispatchEvent(tileOut);
			}
			mouseTile.x = tile.x;
			mouseTile.y = tile.y;
			// Ensure mouse coordinates are within grid
			if (mouseTile.x !== null || mouseTile.y !== null) {
				// Dispatch the highlight event to the top-level grid
				var tileIn = document.createEvent('Event');
				tileIn.initEvent('tileIn', true, true);
				tileIn.tx = tile.x;
				tileIn.ty = tile.y;
				topGrid.dispatchEvent(tileIn);
			}
		}
	}, false);
	
};
*/