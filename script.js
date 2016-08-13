var mouse = [0,0],
	foods = [];

function getPixelValue(value, type) {
	var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(type)]];
	return side * (value/100);
}
$(function() {

	document.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		var dot, eventDoc, doc, body, pageX, pageY;

		event = event || window.event; // IE-ism

		// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (event.pageX == null && event.clientX != null) {
			eventDoc = (event.target && event.target.ownerDocument) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = event.clientX +
			(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
			(doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
			(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
			(doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		// Use event.pageX / event.pageY here
		mouse = [event.pageX, event.pageY];

		fish.turnToPointer();
		fish.moveTo(...mouse);

	}

	addFood();


});



function Fish() {
	this.position = [0,0];
	this.size = 50;
	this.element = $('#fish');
	this.updateSize();

	setInterval(function() {
		foods.forEach(function(food) {
			if(fish.isTouchingFood(food)) {
				food.element.addClass('being-eaten');
				setTimeout(function () {
					if(fish.isTouchingFood(food) && $.contains(document, food.element[0]))fish.eatFood(food);
					else food.element.removeClass('being-eaten');
				}, 1000);
			}
		});

	}, 100);
}

Fish.prototype.isTouchingFood = function(food) {
	return (Math.abs(this.position[1] - getPixelValue(food.position[0], 'vw')) < 20)
		&& (Math.abs(this.position[0] - getPixelValue(food.position[1], 'vh')) < 20);
};

Fish.prototype.updateSize = function() {
	this.element.css('height', this.size);
};

Fish.prototype.eatFood = function (food) {
	food.destroy();
	this.size+=4;
	this.updateSize();
};

Fish.prototype.turnToPointer = function () {
	var deltaX = mouse[0] - this.position[0];

	if(deltaX > 0)
		this.element.css('transform', 'rotateY(180deg) translateY(-50%)');
	else
		this.element.css('transform', 'rotateY(0) translateY(-50%)');
};

Fish.prototype.moveTo = function (x,y) {

	this.element.css({
		top: y,
		left: x
	});
	this.position = [x,y];
};

var fish = new Fish();


function addFood() {
	var theFood = new Food();

	var timer = (Math.random()*3);

	// Add food in timer seconds
	setTimeout(addFood, timer*1000);

	// Destroy the food after 8 seconds
	setTimeout(function(){
		theFood.destroy();
	}, 4000);
}

function Food() {


	this.id = $('#container .food').length;
	this.element = $('<div class="food" id="food-'+this.id+'"></div>');
	this.setRandomPosition();

	$('#container').append(this.element);

	foods.push(this);
}

Food.prototype.setRandomPosition = function () {
	var x = Math.floor(Math.random()*100),
		y = Math.floor(Math.random()*100);
	this.position = [x,y];
	this.element.css({
		top: this.position[0] + 'vw',
		left: this.position[1] + 'vh'
	});
};

Food.prototype.destroy = function() {
	this.element.remove();

	// Find the index of this food and remove it from the foods array
	var index = foods.indexOf(this);
	if(index > -1)
		foods.splice(index,1);
};
