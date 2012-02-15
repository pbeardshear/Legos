// Pulled from grid.js
// General tile highlighting functionality
function getTilePosition(x, y, heightOffset) {
	var tx, ty;
	var coords = cartesianToIsometric(x, y);
	if (coords.x < 600 && coords.x > 0 && coords.y < 600 && coords.y > 0) {
		tx = Math.floor(coords.x / tileSize);
		ty = Math.floor(coords.y / tileSize);
	}
	else {
		tx = null;
		ty = null;
	}
	return { 'x': tx, 'y': ty };
}

function fillTile (tx, ty, context, fill) {
	context.save();
	context.fillStyle = fill;
	context.toIsometric(0);
	context.fillRect(tx*tileSize, ty*tileSize, tileSize, tileSize);
	context.restore();
}

