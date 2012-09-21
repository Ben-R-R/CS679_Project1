// JavaScript Document
function drawBoid(theContext, ballstroke, boidObj) {
	theContext.strokeStyle = ballstroke;
	theContext.fillStyle = boidObj.ballcolor;
	
	theContext.beginPath();
    	theContext.arc(boidObj.x,boidObj.y,boidObj.radius,0,Math.PI*2,true); 
    	theContext.moveTo(boidObj.x,boidObj.y);
    	theContext.lineTo(boidObj.x + 4*boidObj.vX, boidObj.y + 4*boidObj.vY);
    theContext.closePath();
    
    theContext.stroke();
    theContext.fill();
    
}