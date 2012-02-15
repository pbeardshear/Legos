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


	var colors = 16;
	var colorsPerRow = 4;
	
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
					var rgb = '#'+Math.floor(Math.random()*16777215).toString(16);
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