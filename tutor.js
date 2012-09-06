// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized
// phase 5 - animation 
// phase 6 - reqAnimFrame
// phase 7 - objectness
// phase 8 - object creation
// phase 9 - multiple objects
// phase 10 - click to add
// phase 11 - bouncing

// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function() {
    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works
    
    // figure out what the "requestAnimationFrame" function is called
    // the problem is that different browsers call it differently
    // if we don't have it at all, just use setTimeout
    var reqFrame =window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
        };


    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
    // these are effectively the constants
    var ballcolor = "#FFFF00";      // yellow fill
    var ballstroke = "#000000";     // black outline
    var circ = Math.PI*2;           // complete circle
    
    // create a prototype ball
    // this is a slightly weird way to make an object, but it's very
    // javascripty
    var aBall = {
        "r" : 10,
        "x" : 100,
        "y" : 100,
        "vX" : 10,
        "vY" : 10,
    
        draw : function() {
            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = ballcolor;
            theContext.beginPath();
            theContext.arc(this.x,this.y,this.r,0,circ,true);
            theContext.moveTo(this.x,this.y);
            theContext.lineTo(this.x + this.vX, this.y + this.vY);
            theContext.closePath();
            theContext.stroke();
            theContext.fill();
        },
    
        // make 'em "bounce" when they go over the edge
        // no loss of velocity
        move: function() {
            this.x += this.vX;
            this.y += this.vY;
            if (this.x > theCanvas.width) {
                if (this.vX > 0) {
                    this.vX = -this.vX;
                }
            }
            if (this.y > theCanvas.height) {
                if (this.vY > 0) {
                    this.vY = -this.vY;
                }
            }
            if (this.x < 0) {
                if (this.vX < 0) {
                    this.vX = -this.vX;
                }
            }
            if (this.y < 0) {
                if (this.vY < 0) {
                    this.vY = -this.vY;
                }
            }
        }
    };

    // this is so Javascripty it makes my head hurt:
    // to create a new Ball object, we make a new empty object
    // and set its prototype to be the first ball
    // (we probably could use create as well)
    // then we set some other stuff if we want
    function makeBall(x,y) {
        Empty = function () {};
        Empty.prototype = aBall;    // don't ask why not ball.prototype=aBall;
        ball = new Empty();
        ball.x = x;
        ball.y = y;
        return ball;
    }
    
    // make an array of balls
    theBalls = [];
    theBalls.push( makeBall(100,100) );
    theBalls.push( makeBall(200,100) );
    theBalls.push( makeBall(300,100) );

    // this function will do the drawing
    function drawBalls() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        // draw the balls - too bad we can't use for i in theBalls
        for (var i=0; i<theBalls.length; i++) {
            theBalls[i].draw();
        }
    }
    
    //move the balls
    function moveBalls() {
       for (var i=0; i<theBalls.length; i++) {
           theBalls[i].move();
       }
    }
     
    // what to do when things get clicked
    function doClick(evt){
        // a catch - we need to adjust for where the canvas is!
        // this is quite ugly without some degree of support from
        // a library
        theBalls.push( makeBall(evt.pageX - theCanvas.offsetLeft,
        evt.pageY - theCanvas.offsetTop) );
    }
    theCanvas.addEventListener("click",doClick,false);

    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
    function drawLoop() {
        moveBalls();     // new position
        drawBalls();     // show things
        reqFrame(drawLoop);
    }
    drawLoop();
}
