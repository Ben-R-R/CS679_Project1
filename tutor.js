// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas

// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function() {
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
	// draw a yellow circle in it
	theContext.strokeStyle = "#000000";		// black outline
	theContext.fillStyle = "#FFFF00";		// yellow fill
	circ = Math.PI*2;						// complete circle
	theContext.beginPath();
	theContext.arc(100,100,50,0,circ,true);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();			
}
