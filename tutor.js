// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized
// phase 5 - animation 
// phase 6 - reqAnimFrame

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
        "r" : 50,
        "x" : 100,
        "y" : 100,
        "vX" : 20,
        "vY" : 20,
    
        draw : function() {
            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = ballcolor;
            theContext.beginPath();
            theContext.arc(this.x,this.y,this.r,0,circ,true);
            theContext.closePath();
            theContext.stroke();
            theContext.fill();
        },
    
        move: function() {
            this.x += this.vX;
            this.y += this.vY;
            if (this.x > theCanvas.width) {
                this.x -= theCanvas.width;
            }
            if (this.y > theCanvas.height) {
                this.y -= theCanvas.height;
            }
            if (this.x < 0) {
                this.x += theCanvas.width;
            }
            if (this.y < 0) {
                this.y += theCanvas.width;
            }
        }
    };
    // this function will do the drawing
    function drawBalls() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        // draw the ball
        aBall.draw();
    }
    
     // move the ball - check to see if it goes over the edge
     // if we go over the edge, wrap around
     function moveBalls() {
         aBall.move();
     }
     
     // note that we cannot "loop" the following code will just hang:
     //while (1) {
     //  drawBall();
     //  moveBall();
     //}
     // don't even try it
     
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
