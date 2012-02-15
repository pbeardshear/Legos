var Buffer = (function () {
	// @Private
	var _tileList;
	
	// Sorts the given list of tiles into correct rendering order
	function orderBuffer (tiles, append) {
		_tileList = (append ? _tileList.concat(tiles) : tiles);
		// Sorts using insertion sort, could potentially be improved by using something like merge sort,
		// but we are assuming now that the buffer list will likely never be long even to see a significant
		// time divergence
		// TODO: Remove duplicates, or ensure that passed tiles do not contain duplicates
		for (var i = 1; i < _tileList.length; i++) {
			var value = _tileList[i];
			for (var j = i - 1; j >= 0 && (_tileList[j].x - _tileList[j].y) < (value.x - value.y); j--) {
				_tileList[j+1] = _tileList[j];
			}
			_tileList[j+1] = value;
		}
	}
	
	// @Public
	return {
		init: function () {
			_tileList = [];
		},
		// Writes a list of tile data to the buffer
		// @param {bool}: append -> don't clear existing data when adding new data
		// @param {bool}: autoFlush -> automatically flush the tile data after writing
		write: function (tiles, append, autoFlush) {
			orderBuffer(tiles, append);
			if ( autoFlush ) {
				this.flush();
			}
		},
		// Render the tile data currently in the buffer to the screen
		flush: function () {
			for (var i = 0; i < _tileList.length; i++) {
				Grid.drawTile(_tileList[i]);
			}
			// Clear the buffer
			_tileList = [];
		}
	};
})();