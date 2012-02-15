var app = (function () {
	// Move to a more suitable location in the future
	Object.prototype.apply = function (properties) {
		if (typeof properties === 'object') {
			for (var i in properties) {
				if (properties.hasOwnProperty(i)) {
					this[i] = properties[i];
				}
			}
		}
		else {
			throw new TypeError("Object.apply requires an object of property->function mappings.");
		}
	};


	var colors = 35;
	var colorVals = [
		['#A60000', '#BF3030', '#FF0000', '#FF4040', '#FF7373'],	// Red
		['#A64D00', '#BF7230', '#FF7600', '#FF9840', '#FFB473'],	// Orange
		['#A68400', '#BFA230', '#FFCB00', '#FFD840', '#FFE373'],	// Yellow
		['#268E00', '#4AA329', '#3BDA00', '#6BEC3B', '#8EEC6A'],	// Green
		['#05326D', '#274D7E', '#0E51A7', '#4282D3', '#6997D3'],	// Blue
		['#2C0571', '#492A82', '#4811AE', '#7945D6', '#926CD6'],	// Purple
		['#000000', '#333333', '#AAAAAA', '#CCCCCC', '#FFFFFF']		// Greyscale
	];
	var colorsPerRow = 5;
	
	return {
		init: function () {
			// Initialize the communication controller
			this.commController = new CommController();
			
			// Initialize the rest of the application
			Grid.init();
			Buffer.init();
			
			Grid.render();
			
			// Create the tile selection menu
			var colorContainer = document.getElementById('tile-color');
			for (var i = 0; i < colors/colorsPerRow; i++) {
				var row = document.createElement('div');
				row.setAttribute('class', 'tile-selection-row');
				colorContainer.appendChild(row);
				for (var j = 0; j < colorsPerRow; j++) {
					var color = document.createElement('div');
					// var rgb = '#'+Math.floor(Math.random()*16777215).toString(16);
					var rgb = colorVals[i][j];
					color.setAttribute('class', 'tile-selection-color');
					color.setAttribute('style', 'background-color:' + rgb);
					color.setAttribute('value', rgb);
					row.appendChild(color);
					
					this.commController.registerEvent({ 
						node: color, 
						type: 'click', 
						handler: function (e, color) {
							Grid.changeTile(color);
						},
						args: rgb
					});
				}
			}
		}
	};
})();

window.onload = function () {
	app.init();
};