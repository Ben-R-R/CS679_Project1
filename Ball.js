//wahahahahahahahaha



// create a prototype ball
// this is a slightly weird way to make an object, but it's very javascripty
var Ball = {
    "x" : 100,
    "y" : 100,
    "vX" : 10,
    "vY" : 10,
    "ballcolor" : "#FFFF00",
    "speed" : 4.0, //constant speed
    "radius" : 5.0, //used for drawing & collision calculation
    "newVX" : 0,
    "team" : 0,
    "health" : 100,
    "frame" : 0, //frame, for animation purposes
    /*
     * Teams:
     * 1: P-Swarm
     * 2: Chompers
     * 3: Hornets
     * 4: Lure
     */
    draw : function( ) {
    	theContext.strokeStyle = ballstroke;
    	theContext.fillStyle = this.ballcolor;
    	
    	if(this.team == 1) {
    		theta = Math.PI/4;
    		phi = Math.atan2(this.vY,this.vX);
    		theContext.beginPath();
    			theContext.moveTo(this.x,this.y);
    			theContext.lineTo(this.x-this.radius*Math.cos(phi+theta),this.y-this.radius*Math.sin(phi+theta));
    			theContext.lineTo(this.x+this.radius*Math.cos(phi),this.y+this.radius*Math.sin(phi));
    			theContext.lineTo(this.x-this.radius*Math.cos(phi-theta),this.y-this.radius*Math.sin(phi-theta));
    		theContext.closePath();
    		theContext.stroke();
    		theContext.fill();
    	} else if(this.team == 2) {
    		theta = Math.PI/4;
    		phi = Math.atan2(this.vY,this.vX);
    		theContext.beginPath();
    			theContext.arc(this.x,this.y,this.radius,phi-theta,phi+theta,true);
    			theContext.lineTo(this.x,this.y);
    		theContext.closePath();
    		theContext.stroke();
    		theContext.fill();
    	}
    	else {
    		drawBoid(theContext,ballstroke, this);
    		/*
    		theContext.beginPath();
            	theContext.arc(this.x,this.y,this.radius,0,circ,true); 
            	theContext.moveTo(this.x,this.y);
            	theContext.lineTo(this.x + 4*this.vX, this.y + 4*this.vY);
            theContext.closePath();
            
            theContext.stroke();
            theContext.fill(); */
        }
    },

    // make 'em "bounce" when they go over the edge
    // not anymore, now they wrap over the edge.
    // no loss of velocity
    // Finish comment-block to switch between wrapping and a less potent bounce mechanic
    move: function() {
        this.x += this.vX;
        this.y += this.vY;
        if (this.x > theCanvas.width) {
        	this.x = 0;//*/ theCanvas.width; this.vX = -1;
        	/*this.vY = -this.vY;
            if (this.vX > 0) {
                this.vX = -this.vX;
            }  */
        }
        if (this.y > theCanvas.height) {
        	this.y = 0;//*/ theCanvas.height; this.vY = -1;
        	/*this.vX = -this.vX;
            if (this.vY > 0) {
                this.vY = -this.vY;
            } */
        }
        if (this.x < 0) {
        	this.x = theCanvas.width;//*/ 0; this.vX = 1;
        	/*this.vY = -this.vY;
            if (this.vX < 0) {
                this.vX = -this.vX;
            }  */
        }
        if (this.y < 0) {
        	this.y = theCanvas.height;//*/ 0; this.vY = 1;
        	/*this.vX = -this.vX;
            if (this.vY < 0) {
                this.vY = -this.vY;
            } */
        }
    },

    // normalize the velocity to the given speed
    //         // if your velocity is zero, make a random velocity
    norm: function () {
        var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
        if (z<.001) {
            this.vX = (Math.random() - .5) * this.speed;
            this.vY = (Math.random() - .5) * this.speed;
            this.norm();
        } else {
            z = this.speed / z;
            this.vX *= z;
            this.vY *= z;
        }
    }
};

// this is so Javascripty it makes my head hurt:
// to create a new Ball object, we make a new empty object
// and set its prototype to be the first ball
// (we probably could use create as well)
// then we set some other stuff if we want
function makeBall(x,y,color,team) {
    Empty = function () {};
    Empty.prototype = Ball;    // don't ask why not ball.prototype=aBall;
    ball = new Empty();
    ball.x = x;
    ball.y = y;
    ball.ballcolor = color;
    ball.team = team;
    if(team == 1) { //P-swarmers
    	ball.radius = 5.0;
    	ball.speed = 4.0;
    	ball.health = 10;
    }
    else if(team == 2) { //Chompers
    	ball.radius = 10.0;
    	ball.speed = 2.0;
    	ball.health = 50;
    }
    else { //Miscellaneous
    	ball.radius = 5.0;
    	ball.speed = 4.0;
    	ball.health = 100;
    }
    return ball;
}