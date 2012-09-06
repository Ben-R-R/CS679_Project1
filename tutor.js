// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized

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
    
    // this function will do the drawing
    function drawBall() {
        theContext.strokeStyle = ballstroke;
        theContext.fillStyle = ballcolor;
        theContext.beginPath();
        theContext.arc(xPos,yPos,50,0,circ,true);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    }
    
    drawBall();
}
