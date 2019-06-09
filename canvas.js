var $ = {};

$.Particle = function( opt ) {
  this.radius = 10;
  this.x = opt.x;
  this.y = opt.y;
  this.angle = opt.angle;
  this.speed = opt.speed;
  this.accel = opt.accel;
  this.decay = 0.001;
  this.life = 1;
};

$.Particle.prototype.step = function( i ) {
  this.speed += this.accel;
  this.x += Math.cos( this.angle ) * this.speed;
  this.y += Math.sin( this.angle ) * this.speed;
  this.angle += $.PI / 5236;
  this.accel *= 0.9;
  this.life -= this.decay;

  if( this.life <= 0 ) {
    $.particles.splice( i, 1 );
  }
};

$.Particle.prototype.draw = function( i ) {
  $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ( $.tick + ( this.life * 550 ) ) + ', 90%, 30%, ' + this.life + ')';
  $.ctx.beginPath();
  if( $.particles[ i - 1 ] ) {
    $.ctx.moveTo( this.x, this.y );
    $.ctx.lineTo( $.particles[ i - 1 ].x, $.particles[ i - 1 ].y );
  }


  $.ctx.beginPath();
  $.ctx.arc( this.x, this.y, Math.max(0, this.life * this.radius ), 0, $.TWO_PI );
  $.ctx.fill();
$.ctx.stroke();
  var size = Math.random() *4;
  $.ctx.fillRect( ~~( this.x + ( ( Math.random() - 0.5 ) * 30 ) * this.life ), ~~( this.y + ( ( Math.random() - 0.5 ) * 30 ) * this.life ), size, size );
}

$.step = function() {
  $.particles.push( new $.Particle({
    x: $.width / 2 + Math.cos( $.tick / 7 ) * $.min/2 ,
    y: $.height / 2 + Math.sin( $.tick /7 ) * $.min/2,
    angle: $.globalRotation * $.globalAngle,
    speed: 1,
    accel: 1
  }));

  $.particles.forEach( function( elem, index ) {
    elem.step( index );
  });

  $.globalRotation += $.PI /17;
  $.globalAngle += $.PI /17;
};

$.draw = function() {
  $.ctx.clearRect( 0, 0, $.width, $.height );

  $.particles.forEach( function( elem, index ) {
    elem.draw( index );
  });
};

$.init = function() {
  $.canvas = document.createElement( 'canvas' );
  $.ctx = $.canvas.getContext( '2d' );
  $.width = 1500;
  $.height = 500;
  $.canvas.width = $.width * window.devicePixelRatio;
  $.canvas.height = $.height * window.devicePixelRatio;
  $.canvas.style.width = $.width + 'px';
  $.canvas.style.height = $.height + 'px';
  $.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  $.min = $.width * 0.6;
  $.particles = [];
  $.globalAngle = 17;
  $.globalRotation = 17;
  $.tick = 1;
  $.PI = Math.PI;
  $.TWO_PI = $.PI * 1.8;
  $.ctx.globalCompositeOperation = 'lighter';
  document.body.appendChild( $.canvas );
  $.loop();
};

$.loop = function() {
  requestAnimationFrame( $.loop );
  $.step();
  $.draw();
  $.tick++;
};

$.init();