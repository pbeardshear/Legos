var CommController = function () {
	// @Private
	var _events = {};
	var _eventScope;
	var genericHandler = function (e, scope) {
		// Loop over each of the handlers we have registered for this event,
		// executing them in order.  If one of the events returns false, we
		// break out of the event execution loop
		var eventList = _events[e.type];
		for (var i = eventList.length - 1; i >= 0; i--) {
			if (!eventList[i].handler.call(scope || this, e)) {
				break;
			}
		}
	};
	
	// @Public
	this.registerEvent = function (e) {
		if (!e.type || !e.handler || !e.node) {
			throw new TypeError("Required argument to registerEvent is an object with type, handler, and node properties.");
		}
		
		if (_events[e.type]) {
			_events[e.type].push({ handler: e.handler });
		}
		else {
			_events[e.type] = [{ handler: e.handler }];
		}
		
		e.node.addEventListener(e.type, function (event) { e.handler.call(this, event, e.args); }, false);
	};
	
	// Fires off an event, without DOM interaction, in order to pass "events" on from
	// object to object
	this.fireEvent = function (e, scope) {
		if (!e.type) {
			throw new TypeError("Event object must have an event type.");
		}
		genericHandler(e, scope);
	};
};