/*==============================================================================
        ____        _ _     ____            _        _                    
   __ _| __ )  __ _| | |   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  / _` |  _ \ / _` | | |   | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
 | (_| | |_) | (_| | | |   |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  \__,_|____/ \__,_|_|_|   |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                         |___/|_|         
==============================================================================*/

// create a prototype ball
// this is a slightly weird way to make an object, but it's very
// javascripty
var aBall = {
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
    "remove" : false,	//tag for removal
    /*
     * Teams:
     * 1: P-Swarm
     * 2: Chompers
     * 3: Hornets
     * 4: Lure
     */
    draw : function() {
    	theContext.strokeStyle = ballstroke;
    	theContext.fillStyle = this.ballcolor;
    	var _X = this.x + originX;
    	var _Y = this.y + originY;
    	
		theContext.beginPath();
        	theContext.arc(_X,_Y,this.radius,0,circ,true); 
        	theContext.moveTo(_X,_Y);
        	theContext.lineTo(_X + 4*this.vX, _Y + 4*this.vY);
        theContext.closePath();
        
        theContext.stroke();
        theContext.fill();
        
    },

    // make 'em "bounce" when they go over the edge
    // not anymore, now they wrap over the edge.
    // no loss of velocity
    // Finish comment-block to switch between wrapping and a less potent bounce mechanic
    move: function() {
        this.x += this.vX;
        this.y += this.vY;
        if (this.x > fieldSizeX) {
        	this.x = 0;//*/ theCanvas.width; this.vX = -1;
        	/*this.vY = -this.vY;
            if (this.vX > 0) {
                this.vX = -this.vX;
            }  */
        }
        if (this.y > fieldSizeY) {
        	this.y = 0;//*/ theCanvas.height; this.vY = -1;
        	/*this.vX = -this.vX;
            if (this.vY > 0) {
                this.vY = -this.vY;
            } */
        }
        if (this.x < 0) {
        	this.x = fieldSizeX;//*/ 0; this.vX = 1;
        	/*this.vY = -this.vY;
            if (this.vX < 0) {
                this.vX = -this.vX;
            }  */
        }
        if (this.y < 0) {
        	this.y = fieldSizeY;//*/ 0; this.vY = 1;
        	/*this.vX = -this.vX;
            if (this.vY < 0) {
                this.vY = -this.vY;
            } */
        }
        
    },
    
    collide: function(otherBall){
	
	},
	
	beginUpdate: function() {
		
	},
	
	addInfluence : function(otherBall, d, dx ,dy) {
		var personalSpace = otherBall.radius * 10;
		var dd = Math.pow(d, 1.8); 
		
		if(otherBall.team === this.team){
		    if(d < 100){
				this.newVX  += (otherBall.vX / (dd+ali));
	        	this.newVY  += (otherBall.vY / (dd+ali));
			} else {
		    	this.newVX  += (dx * .1 ) / (dd);
	   			this.newVY  += (dx * .1 ) / (dd);
			}
			if(d < personalSpace && d > 0){
				//d > 0 requirement to prevent dividing by zero at the start.
				//as same-team balls approach each other, the repulsion goes up exponentially.
				this.newVX  -= (dx / d) * 0.01;
	    		this.newVY  -= (dy / d) * 0.01; 
			} 
		
		} else {
		    
			// Currently no interactions with other teams 
		
		}	
	},

   	finishUpdate : function(){
		this.vX = this.newVX + (fieldSizeX/2 - this.x) * .00005;
    	this.vY = this.newVY + (fieldSizeY/2 - this.y) * .00005;	   
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

/*=================================================================
  ____      ____                                        
 |  _ \    / ___|_      ____ _ _ __ _ __ ___   ___ _ __ 
 | |_) |___\___ \ \ /\ / / _` | '__| '_ ` _ \ / _ \ '__|
 |  __/_____|__) \ V  V / (_| | |  | | | | | |  __/ |   
 |_|       |____/ \_/\_/ \__,_|_|  |_| |_| |_|\___|_|   
                                                        
==================================================================*/
var p_swarmTeam = 1;

function drawP_Swarmer(){
	theContext.strokeStyle = ballstroke;
	theContext.fillStyle = this.ballcolor;
	var _X = this.x + originX;
	var _Y = this.y + originY;
	
	theta = Math.PI/4;
	phi = Math.atan2(this.vY,this.vX);
	theContext.beginPath();
		theContext.moveTo(_X,_Y);
		theContext.lineTo(_X-this.radius*Math.cos(phi+theta),_Y-this.radius*Math.sin(phi+theta));
		theContext.lineTo(_X+this.radius*Math.cos(phi),_Y+this.radius*Math.sin(phi));
		theContext.lineTo(_X-this.radius*Math.cos(phi-theta),_Y-this.radius*Math.sin(phi-theta));
	theContext.closePath();
	theContext.stroke();
	theContext.fill();	
}

// - - - - - - - - - - A D D   I N F L U E N C E   P - S W A R M E R

function addInfluenceP_Swarmer(otherBall, d, dx ,dy){
	
	var personalSpace = this.radius * 10;
	var dd = Math.pow(d, 1.8); 
	
	if(otherBall.team === this.team){
		if(d < 100){
			this.newVX  += (otherBall.vX / (dd+ali));
        	this.newVY  += (otherBall.vY / (dd+ali));
		} else {
	    	this.newVX  += (dx * .1 ) / (dd);
   			this.newVY  += (dy * .1 ) / (dd);
		}
		if(d < personalSpace && d > 0){
			//d > 0 requirement to prevent dividing by zero at the start.
			//as same-team balls approach each other, the repulsion goes up exponentially.
			this.newVX  -= (dx / d) * 0.02;
    		this.newVY  -= (dy / d) * 0.02; 
		}
	} else if(otherBall.team === chomperTeam && d < 100) {
		this.newVX  -= ((this.x - otherBall.x) * 1 ) / dd;
		this.newVY  -= ((this.y - otherBall.y) * 1 ) / dd;
	} 
}

function finishUpdateP_Swarmer(){
	this.vX = this.newVX + (mousex - this.x) * .0005; 
    this.vY = this.newVY + (mousey - this.y) * .0005;
}

/*=================================================
   ____ _                                     
  / ___| |__   ___  _ __ ___  _ __   ___ _ __ 
 | |   | '_ \ / _ \| '_ ` _ \| '_ \ / _ \ '__|
 | |___| | | | (_) | | | | | | |_) |  __/ |   
  \____|_| |_|\___/|_| |_| |_| .__/ \___|_|   
                             |_|              
=================================================*/

var chomperTeam = 2;

function drawChomper(){
	theContext.strokeStyle = ballstroke;
	theContext.fillStyle = this.ballcolor;
	var _X = this.x + originX;
	var _Y = this.y + originY;

	this.mouthAngle += 0.4;
	
	if(this.mouthAngle > 2 * Math.PI){
		this.mouthAngle = 0;
	}

	theta = Math.PI/8 * (Math.sin(this.mouthAngle)  + 1);
	
	phi = Math.atan2(this.vY,this.vX);
	theContext.beginPath();
		theContext.arc(_X,_Y,this.radius,phi-theta,phi+theta,true);
		theContext.lineTo(_X,_Y);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();

}

// - - - - - - - - - - A D D   I N F L U E N C E   C H O M P E R 

function addInfluenceChomper(otherBall, d, dx ,dy){
	
	var personalSpace = this.radius * 10;
	var dd = Math.pow(d, 1.8); 
	
	if(otherBall.team === this.team){
		if(d < personalSpace && d > 0){
			//d > 0 requirement to prevent dividing by zero at the start.
			//as same-team balls approach each other, 
			// the repulsion goes up exponentially.
			this.newVX  -= (dx / d) * 0.01;
    		this.newVY  -= (dy / d) * 0.01; 
		} 
	} else if (otherBall.team === p_swarmTeam && d < 200 ){
	    this.newVX  += ((this.x - otherBall.x) * .1 ) / dd;
	    this.newVY  += ((this.y - otherBall.y) * .1 ) / dd;
	}
}

function finishUpdateChomper(){
	// atracted to the tank
	this.vX = this.newVX + (Tank.x - this.x) * .0005;
    this.vY = this.newVY + (Tank.y - this.y) * .0005;
}
/*=========================================
  __  __                       _ _        
 |  \/  | ___  ___  __ _ _   _(_) |_ ___  
 | |\/| |/ _ \/ __|/ _` | | | | | __/ _ \ 
 | |  | | (_) \__ \ (_| | |_| | | || (_) |
 |_|  |_|\___/|___/\__, |\__,_|_|\__\___/ 
                      |_|                 
========================================*/

var mosquitoTeam = 0;

function drawMosquito(){
	theContext.strokeStyle = ballstroke;
	theContext.fillStyle = this.ballcolor;
	var _X = this.x + originX;
	var _Y = this.y + originY;
	
	theContext.beginPath();
    	theContext.arc(_X,_Y,this.radius,0,circ,true); 
    	theContext.moveTo(_X,_Y);
    	theContext.lineTo(_X + 4*this.vX, _Y + 4*this.vY);
    theContext.closePath();
    
    theContext.stroke();
    theContext.fill();
}

// - - - - - - - - - - A D D   I N F L U E N C E   M O S Q U I T O   

function addInfluenceMosquito(otherBall, d, dx ,dy){
	
	var personalSpace = bi.radius * 10;
	var dd = Math.pow(d, 1.8); 
	
	if(otherBall.team === this.team){
	    if(d < 100){
			this.newVX  += (otherBall.vX / (dd+ali));
        	this.newVY  += (otherBall.vY / (dd+ali));
		} else {
	    	this.newVX  += (dx * .1 ) / (dd);
   			this.newVY  += (dx * .1 ) / (dd);
		}
		if(d < personalSpace && d > 0){
			//d > 0 requirement to prevent dividing by zero at the start.
			//as same-team balls approach each other, the repulsion goes up exponentially.
			this.newVX  -= (dx / d) * 0.01;
    		this.newVY  -= (dy / d) * 0.01; 
		} 
	
	} else {
	    
		// Currently no interactions with other teams 
	
	}
}

function finishUpdateMosquito(){
	// currently atracted to the center of the field 
	this.vX = this.newVX + (fieldSizeX/2 - this.x) * .00005;
    this.vY = this.newVY + (fieldSizeY/2 - this.y) * .00005;
}

/*==============================================
                  _        ____        _ _ 
  _ __ ___   __ _| | _____| __ )  __ _| | |
 | '_ ` _ \ / _` | |/ / _ \  _ \ / _` | | |
 | | | | | | (_| |   <  __/ |_) | (_| | | |
 |_| |_| |_|\__,_|_|\_\___|____/ \__,_|_|_|
                                           
===============================================*/
function makeBall(x,y,color,team) {
    Empty = function () {};
    Empty.prototype = aBall;    // don't ask why not ball.prototype=aBall;
    ball = new Empty();
    ball.x = x;
    ball.y = y;
    ball.ballcolor = color;
    ball.team = team;
    
    if(team === p_swarmTeam) { //P-swarmers
    	ball.radius = 5.0;
    	ball.speed = 6.0;
    	ball.health = 50;
    	ball.draw = drawP_Swarmer;
    	ball.finishUpdate = finishUpdateP_Swarmer;
    	ball.addInfluence = addInfluenceP_Swarmer;
    	
    } else if(team === chomperTeam) { //Chompers
    	ball.radius = 10.0;
    	ball.speed = 2.0;
    	ball.health = 500;
		ball.draw = drawChomper;
		ball.mouthAngle = Math.random() * 2 * Math.PI ;
		ball.finishUpdate = finishUpdateChomper;
    	ball.addInfluence = addInfluenceChomper;
    	
    }  else if(team === mosquitoTeam){
        ball.radius = 5.0;
    	ball.speed = 4.0;
    	ball.health = 100;
		ball.draw = drawMosquito;
		ball.finishUpdate = finishUpdateMosquito;
    	ball.addInfluence = addInfluenceMosquito;
    	
	} else { //Miscellaneous
    	ball.radius = 5.0;
    	ball.speed = 4.0;
    	ball.health = 1000; 
		//ball.draw = drawMosquito;
    }
    return ball;
}
