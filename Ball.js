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
    
    onDeath : function() {
		UserData.score += 10;
		//lootDrop(this.x, this.y);	//drop a pickup (maybe)
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
    
    
    collide: function(otherBall, dx, dy){ //dx, dy is a vector from you to the other ball
		otherBall.health--;
		this.vX = -dx;
		this.vY = -dy;
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

function collideP_Swarm(otherBall, dx, dy){ //dx, dy is a vector from you to the other ball
	if(otherBall.team !== shieldTeam){
		//otherBall.health--;
		this.vX = -dx;
		this.vY = -dy;
	}
	if(otherBall.team in this.damageMap){
		otherBall.health -= this.damageMap[otherBall.team];
	}
	
}


// - - - - - - - - - - A D D   I N F L U E N C E   P - S W A R M E R

function addInfluenceP_Swarmer(otherBall, d, dx ,dy){
	
	if (otherBall === this){
		return;
	}
	
	var personalSpace = this.radius * 5;
	var dd = Math.pow(d, 1.8); 
	
	if(otherBall.team === this.team){
		if(d < 100){
			this.newVX  += (otherBall.vX) * 1/dd ;
        	this.newVY  += (otherBall.vY) * 1/dd ;
		} else {
	    	this.newVX  += (dx * .1 ) / (dd);
   			this.newVY  += (dy * .1 ) / (dd);
		}
		if(d < personalSpace && d > 0){
			//d > 0 requirement to prevent dividing by zero at the start.
			//as same-team balls approach each other, the repulsion goes up exponentially.
			this.newVX  -= (dx / dd) * 0.04;
    		this.newVY  -= (dy / dd) * 0.04; 
		}
	} else if(otherBall.team === chomperTeam && d < 100) {
		this.newVX  -= (((this.x - otherBall.x) * 1 ) / dd) * 100;
		this.newVY  -= (((this.y - otherBall.y) * 1 ) / dd) * 100;
		
		
		
	} else if(otherBall.team === lurkerTeam && d < 300) {
		this.newVX += (((this.x - otherBall.x) * 1 ) / dd) * 1000;
		this.newVY  += (((this.y - otherBall.y) * 1 ) / dd) * 1000;
		
		
		
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
	
	if (this.state == "attack") {
        if (this.frame == 0) {
            Tank.health--;
        }
        theContext.fillStyle = "#FF0000";
        theContext.beginPath();
        theContext.moveTo(_X, _Y);
        theContext.lineTo(Tank.x + originX, Tank.y + originY);
        theContext.closePath();
        theContext.stroke();
        this.frame++;
        if (this.frame > 10) {
            this.bloodLevel++;
            this.frame = 0;
            this.state = "flee";
        }
    } else {
     	theContext.beginPath();
	    theContext.moveTo(_X, _Y);
    	theContext.lineTo(_X + 4 * this.vX, _Y + 4 * this.vY);
    	theContext.closePath();
    	theContext.closePath();
        theContext.stroke();
	}
    if (this.state == "split") {
        var x = this.frame % 10;
        if (x <= 5) {
            this.y = this.y + 3;
            theContext.fillStyle = "#FFCC00";
        } else {
            theContext.fillStyle = "#FF9900";
            this.y = this.y - 3;
        }
        this.frame++;
        if (this.frame > 150) {
            b = makeBall(this.x + 10, this.y + 10, "#FCD116", mosquitoTeam);
            allBalls.push(b);
            this.state = "pursue";
            this.bloodLevel = 0;
        }
    } else {
        switch (this.bloodLevel) {
            case 0:
                theContext.fillStyle = "#FFCC00";
                this.ballcolor = "#FFCC00";
                break;

            case 1:
                theContext.fillStyle = "#FF9900";
                this.ballcolor = "#FF9900";
                break;

            case 2:
                theContext.fillStyle = "#FF6600";
                this.ballcolor = "#FF6600";
                break;
            case 3:
                theContext.fillStyle = "#FF3300";
                this.ballcolor = "#FF3300";
                break;

        } 
    }

    theContext.beginPath();
    theContext.arc(_X, _Y, this.radius, 0, circ, true);
    //theContext.moveTo(_X, _Y);
    //theContext.lineTo(_X + 4 * this.vX, _Y + 4 * this.vY);
    theContext.closePath();

    theContext.stroke();
    theContext.fill();
}

// - - - - - - - - - - A D D   I N F L U E N C E   M O S Q U I T O   

function addInfluenceMosquito(otherBall, d, dx ,dy){
	
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
	}
	
	
}

function finishUpdateMosquito(){
	 //   if (d < personalSpace && d > 0) {
    //d > 0 requirement to prevent dividing by zero at the start.
    //as same-team balls approach each other, the repulsion goes up exponentially.
    if (this.state == "flee") {
       this.newVX += -(Tank.x - this.x) * .01;
       this.newVY += -(Tank.y - this.y) * .01;
        if ((Math.abs(Tank.x - this.x) > 400) || (Math.abs(Tank.y - this.y) > 400)) {
            if (this.bloodLevel >= 3) {
                this.state = "split";
               this.newVX = 0;
               this.newVY = 0;
               this.vX = 0;
               this.vY = 0;
            }
            else {
               this.state = "pursue";
               this.newVX += Tank.x - this.x;
               this.newVY += Tank.y - this.y;
            }
        }
    }
    else if (this.state == "attack" || (Math.abs(Tank.x - this.x) < 50) && (Math.abs(Tank.y - this.y) < 50)) {
        this.state = "attack";
       this.newVX += Tank.vX * 10;
       this.newVY += Tank.vY * 10;
       //this.vX = Tank.vX;
       //this.vY = Tank.vY;
    }
    else if (this.state == "pursue") {
       this.state = "pursue";
       this.newVX += (Tank.x - this.x) * 0.0005;
       this.newVY += (Tank.y - this.y) * 0.0005;
    }
    
	this.vX = this.newVX;
    this.vY = this.newVY;
}

/*=======================================
  _               _                 
 | |   _   _ _ __| | _____ _ __ ___ 
 | |  | | | | '__| |/ / _ \ '__/ __|
 | |__| |_| | |  |   <  __/ |  \__ \
 |_____\__,_|_|  |_|\_\___|_|  |___/
                                    
========================================*/                                

var lurkerTeam = 4;

function drawLurker(){
	var _X = this.x + originX;
	var _Y = this.y + originY;
	
	theContext.strokeStyle = "#000000";
	theContext.fillStyle = "#330066";
	
	theContext.beginPath();
    	theContext.arc(_X, _Y, this.radius, circ/2 , circ/2 + circ/6  ,false ); 
		theContext.arc(_X- this.radius, _Y, this.radius, circ/2 + 2 * circ/6 ,circ  ,false ); 
		
		theContext.arc(_X + this.radius, _Y, this.radius, circ/2 , circ/2 + circ/6  ,false ); 
		theContext.arc(_X, _Y, this.radius, circ/2 + 2 * circ/6 ,circ  ,false );
		
		theContext.arc(_X + this.radius / 2, _Y, this.radius / 2, 0 ,circ/2 ,true );  
		theContext.arc(_X - this.radius / 2, _Y, this.radius / 2, 0 ,circ/2 ,true ); 
	
	theContext.fill();
	
	    theContext.moveTo(_X, _Y)
	    theContext.lineTo(_X , _Y + this.radius /3)
	    
	    var r6 =  this.radius /6
	    var r2 =  this.radius /2
	    
		for (var i = 2; i < 6; i ++){
			
			var __Y1 = Math.sqrt(Math.pow(r2, 2) - Math.pow( r2 - i * r6 , 2))
		
			var __Y2 = Math.sqrt(Math.pow(this.radius, 2) - Math.pow( i * r6 , 2))
		
			theContext.moveTo(_X - i * r6, _Y - __Y1 ) 
		    theContext.lineTo(_X - i * r6 + r2/2 * Math.sin(this.a), _Y + __Y2)
		    
		    theContext.moveTo(_X + i * r6, _Y - __Y1 ) 
		    theContext.lineTo(_X + i * r6 - r2/2 * Math.sin(this.a), _Y + __Y2)
		}
		
	
	
	theContext.stroke();
}

function lurkerNorm() {
    var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
    if (z<.001) {
        //this.vX = (Math.random() - .5) * this.speed;
        //this.vY = (Math.random() - .5) * this.speed;
        //this.norm();
    } else {
        z = this.speed / z;
        this.vX *= z;
        this.vY *= z;
    }
}

function addInfluenceLurker(otherBall, d, dx ,dy){

}

function finishUpdateLurker(){
	
	var d = Math.sqrt( Math.pow(Tank.x - this.x, 2) + Math.pow(Tank.y - this.y,2)); 
	
	// atracted to the tank
	if(d < 300){
		this.a += 0.1
		
		if(this.a > circ){
			this.a = this.a - circ;
		}
		
		
	    this.speed = 8 * Math.sin(this.a) + 4
	    this.vX = Tank.x - this.x;
	    this.vY = Tank.y - this.y;
	} else {
		this.a = 0;
		this.speed = 0.01
	    this.vX = 0 ;
    	this.vY = 0 ;
	}
	
	
}

/*======================================
  ____  _     _      _     _ 
 / ___|| |__ (_) ___| | __| |
 \___ \| '_ \| |/ _ \ |/ _` |
  ___) | | | | |  __/ | (_| |
 |____/|_| |_|_|\___|_|\__,_|
                             
======================================*/
var shieldTeam = 3;

function drawShield(){
	
	theContext.strokeStyle = "#00FFFF";
	
	theContext.lineWidth = 4;
	
	var _X = this.x + originX;
	var _Y = this.y + originY;
	//console.log(_X + " , " + _Y);
	theContext.beginPath();
    	theContext.arc(_X,_Y,this.radius,0,circ); 
    
    //theContext.closePath();
    
    theContext.stroke();

    theContext.lineWidth = 1; // reset linewidth so we don't mess up the other
    						  // drawing functions 
}

function addInfluenceShield(otherBall, d, dx ,dy){
	
	var personalSpace = this.radius * 10;
	//var dd = Math.pow(d, 1.8); 
	if(d < .01){
		d = .01;
	}
	if(otherBall.team === this.team){
		if(d < personalSpace && d > 0){
			//d > 0 requirement to prevent dividing by zero at the start.
			//as same-team balls approach each other, 
			// the repulsion goes up exponentially.
			this.newVX  -= (dx / d) * 0.01;
    		this.newVY  -= (dy / d) * 0.01; 
		} 
		 
	     
	
	} else {
	    
		// Currently no interactions with other teams 
	
	}
}

function finishUpdateShield(){
	// atracted to the tank
	this.vX = this.newVX + (Tank.x - this.x) * .0005;
    this.vY = this.newVY + (Tank.y - this.y) * .0005;
}

function shieldCollide(otherObject, dx, dy){

}

function nothing(){

}

//=============================================================================
//=============================================================================

var p_swarmDamageMap = {};
	p_swarmDamageMap[chomperTeam] = 5;
	p_swarmDamageMap[mosquitoTeam] = 1;
	//p_swarmDamageMap[shieldTeam] = 0.1;
	
var chomperDamageMap = {};
	chomperDamageMap[p_swarmTeam] = 5;
	chomperDamageMap[shieldTeam] = 5;
	
	
var mosquitoDamageMap = {};
	mosquitoDamageMap[p_swarmTeam] = 1;
	mosquitoDamageMap[shieldTeam] = 1;
	
var lurkerDamageMap = {};
	lurkerDamageMap[p_swarmTeam] = 20;
	lurkerDamageMap[shieldTeam] = 1001;	

var shieldDamageMap = {}; // shield does no damage to anyone

function genericDamage(otherObject, dx, dy){ //dx, dy is a vector from you to the other ball
	if(otherObject.team in this.damageMap){
		otherObject.health -= this.damageMap[otherObject.team];
	}
	
	if(otherObject.team === shieldTeam){
	    this.vX = -(Tank.x - this.x);
		this.vY = -(Tank.y - this.y)
	} else {
		this.vX = -dx;
		this.vY = -dy;
	}
	
	
	
}

function lurkerCollide(otherObject, dx, dy){
   if(otherObject.team in this.damageMap){
		otherObject.health -= this.damageMap[otherObject.team];
	}
	
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
    	ball.damageMap = p_swarmDamageMap;
    	ball.collide = collideP_Swarm;
    	ball.team = p_swarmTeam;
    	ball.onDeath = nothing;
    	
    } else if(team === chomperTeam) { //Chompers
    	ball.radius = 10.0;
    	ball.speed = 2.0;
    	ball.health = 500;
		ball.draw = drawChomper;
		ball.mouthAngle = Math.random() * 2 * Math.PI ;
		ball.finishUpdate = finishUpdateChomper;
    	ball.addInfluence = addInfluenceChomper;
    	ball.damageMap = chomperDamageMap;
    	ball.collide = genericDamage;
    	ball.team = chomperTeam
    	
    }  else if(team === mosquitoTeam){
        ball.radius = 6.0;
        ball.speed = 4.0;
        ball.health = 100;
		ball.draw = drawMosquito;
		ball.bloodLevel = 0;
		ball.finishUpdate = finishUpdateMosquito;
    	ball.addInfluence = addInfluenceMosquito;
    	ball.damageMap = mosquitoDamageMap;
    	ball.collide = genericDamage;
    	ball.team = mosquitoTeam;
    	ball.state = "pursue";
    	
	} else if(team === shieldTeam){
        ball.radius = 100.0;
    	ball.speed = 6.0;
    	ball.health = 5000;
		ball.draw = drawShield;
		ball.finishUpdate = finishUpdateShield;
    	ball.addInfluence = addInfluenceShield;
    	ball.damageMap = shieldDamageMap;
    	ball.collide = shieldCollide;
    	ball.team = shieldTeam;
    	ball.onDeath = nothing;
    	
	} else if(team === lurkerTeam){
        ball.radius = 30.0;
        ball.speed = 0.1;
        ball.health = 200;
        ball.a = 0;
		ball.draw = drawLurker;
		ball.bloodLevel = 0;
		ball.finishUpdate = finishUpdateLurker;
    	ball.addInfluence = addInfluenceLurker;
    	ball.damageMap = lurkerDamageMap;
    	ball.collide = lurkerCollide;
    	ball.team = lurkerTeam;
    	ball.state = "lurk";
    	ball.norm = lurkerNorm;
    	
	}else { //Miscellaneous
    	ball.radius = 5.0;
    	ball.speed = 4.0;
    	ball.health = 1000; 
		//ball.draw = drawMosquito;
    }
    return ball;
}
