// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized
// phase 5 - animation 

// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function() {
    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works
    
    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
    // these are effectively the constants
    var ballcolor = "#FFFF00";      // yellow fill
    var ballstroke = "#000000";     // black outline
    var circ = Math.PI*2;           // complete circle
    
    // these describe what will be drawn (we'll change them later)
    var radius = 50;
    var xPos = 100;
    var yPos = 100;
    var vX = 20;
    var vY = 0;
    
    // this function will do the drawing
    function drawBall() {
        // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        // draw the ball
        theContext.strokeStyle = ballstroke;
        theContext.fillStyle = ballcolor;
        theContext.beginPath();
        theContext.arc(xPos,yPos,50,0,circ,true);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    }
    
     // move the ball - check to see if it goes over the edge
     // if we go over the edge, wrap around
     function moveBall() {
        xPos += vX;
        yPos += vY;
        if (xPos > theCanvas.width) {
            xPos -= theCanvas.width;
        }
        if (yPos > theCanvas.height) {
            yPos -= theCanvas.height;
        }
        if (xPos < 0) {
            xPos += theCanvas.width;
        }
        if (yPos < 0) {
            yPos += theCanvas.width;
        }
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
        moveBall();     // new position
        drawBall();     // show things
        setTimeout(drawLoop,20);    // call us again in 20ms
     }
     drawLoop();
}
