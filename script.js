var mouse = [0,0];
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


});

function Fish() {
  this.position = [0,0];
  this.element = $('#fish');
}

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



function Food() {


  this.id = $('#container .food').length;
  this.element = $('<div class="food" id="food-'+this.id+'"></div>');
  this.setRandomPosition();

  $('#container').append(this.element);
}

Food.prototype.setRandomPosition = function () {
    var x = Math.floor(Math.random()*100),
        y = Math.floor(Math.random()*100);
    this.position = [x,y];
    this.element.css({
      top: this.position[0] + "vh",
      left: this.position[1] + "vw"
    });
};

Food.prototype.destroy = function() {
  this.element.remove();
};
