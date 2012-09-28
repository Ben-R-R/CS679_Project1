/// TANK

 var Tank = {	//The player avatar, can be controlled with keyboard
	"x" : 500,
	"y" : 500,
	"speed" : 5, //maximum speed in any cardinal direction (diagonal is faster 'cause why not)
	"accel" : 0.5, //acceleration for smoother movement
	"radius" : 25, //radius of tank
	"beaml" : 200,	//length of beam outward from tank center
	"beamsx" : 500, //x coordinate of beam start
	"beamsy" : 500, //y coordinate of beam start
	"beamex" : 550,	//x coordinate of beam end
	"beamey" : 550,	//y coordinate of beam end
	"vX" : 0, //current x velocity
	"vY" : 0, //current y velocity 
	"health" : 200,
	"maxHealth" : 200,
	"energy" : 0,	//energy of beam
	"maxEnergy" : 500,	//maximum beam energy
	"heading" : 0,	//angle of facing
	"beamOn" : false,	//if the beam is turned on
    draw : function() {
    
        var _X = this.x + originX;
    	var _Y = this.y + originY;
        
        v = Math.sqrt(this.vX*this.vX+this.vY*this.vY)/this.speed*2;
        
        theContext.fillStyle = "#0099FF"
        var tstX = 0 + originX;
        var tstY = 0 + originY; 
        theContext.beginPath();//Test Object
        	theContext.arc(tstX+this.radius/1.2,tstY+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
       	
       	theContext.fillStyle = "#9911FF"
       	tstX = mousex + originX;
        tstY = mousey + originY; 
        theContext.beginPath();//Test Object
        	theContext.arc(tstX+this.radius/1.2,tstY+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
       	
        //Experimenting with making appearance affected by movement
        theContext.strokeStyle = "#0099FF";
        theContext.fillStyle = "#0099FF";
        theta = Math.PI/8;
        theContext.beginPath();//bottom-right thrust
        	theContext.arc(_X+this.radius/1.2,_Y+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-left thrust
        	theContext.arc(_X-this.radius/1.2,_Y-this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-right thrust
        	theContext.arc(_X+this.radius/1.2,_Y-this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//bottom-left thrust
        	theContext.arc(_X-this.radius/1.2,_Y+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
       		
        theContext.strokeStyle = ballstroke;
        theContext.fillStyle = ballcolor;
        
        theContext.beginPath();//bottom-right pod
        	theContext.arc(_X+this.radius/1.2,_Y+this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-left pod
        	theContext.arc(_X-this.radius/1.2,_Y-this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-right pod
        	theContext.arc(_X+this.radius/1.2,_Y-this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//bottom-left pod
        	theContext.arc(_X-this.radius/1.2,_Y+this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//Body
            theContext.arc(_X,_Y,this.radius,0,circ,true); 
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        theContext.beginPath();//Cannon
            theContext.moveTo(_X,_Y);
            theContext.lineTo(_X+this.radius*Math.cos(this.heading+theta*2)/2,_Y+this.radius*Math.sin(this.heading+theta*2)/2);
            theContext.lineTo(_X+this.radius*Math.cos(this.heading+theta)/1.1,_Y+this.radius*Math.sin(this.heading+theta)/1.1);
            theContext.lineTo(_X+this.radius*Math.cos(this.heading-theta)/1.1,_Y+this.radius*Math.sin(this.heading-theta)/1.1);
            theContext.lineTo(_X+this.radius*Math.cos(this.heading-theta*2)/2,_Y+this.radius*Math.sin(this.heading-theta*2)/2);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        theContext.beginPath();//Turret
            theContext.arc(_X,_Y,this.radius/2,0,circ,true); 
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        
        if(this.beamOn) {
        	theContext.beginPath();//Beam
        		theContext.moveTo(_X+this.radius*Math.cos(this.heading),_Y+this.radius*Math.sin(this.heading));
        		theContext.lineTo(_X+this.beaml*Math.cos(this.heading),_Y+this.beaml*Math.sin(this.heading));
        	theContext.closePath();
        	theContext.stroke();
        	theContext.fill();
        }
    },
    move : function() {
        this.x += this.vX;
        this.y += this.vY;
        this.heading = Math.atan2((mousey) - this.y, (mousex) - this.x);
        if(this.beamOn) {
        	if(this.energy >= 5) {
        		this.beamsx = this.x + this.radius*Math.cos(this.heading);
        		this.beamsy = this.y + this.radius*Math.sin(this.heading);
        		this.beamex = this.x + this.beaml*Math.cos(this.heading);
        		this.beamey = this.y + this.beaml*Math.cos(this.heading);
        		this.energy -= 2;	//energy consumption rate
        	} else {this.energy = 0; this.beamOn = false;}
        } else {
        	this.energy += 1;	//energy recharge rate
        	if(this.energy > this.maxEnergy) {this.energy = this.maxEnergy;}
        	}
        
        if (this.x > fieldSizeX) {
        	this.x = fieldSizeX;
        	this.vX = -this.vX;
        }
        if (this.y > fieldSizeY) {
        	this.y = fieldSizeY;
        	this.vY = -this.vY;
        }
        if (this.x < 0) {
        	this.x = 0;
        	this.vX = -this.vX;
        }
        if (this.y < 0) {
        	this.y = 0;
        	this.vY = -this.vY;
        }
        var _X = this.x + originX;
        var _Y = this.y + originY;
        
        if ( (_X > theCanvas.width - 100) && this.vX > 0.0001){
			originX	-= this.vX;
			
		} else if ( (_X < 0 + 100)  && this.vX < -0.0001){
			originX	-= this.vX;
			
		} 
		
		if ( (_X < 0) ){
			originX	= -this.x + 100;
			
		} else if ( (_X > theCanvas.width) ){
			originX	= -this.x + 100;
			
		}
		
		if ( (_Y > theCanvas.height - 100) && this.vY > 0.0001){
			originY	-= this.vY;
			
		} else if ( (_Y < 0 + 100) && this.vY < -0.0001){
			originY	-= this.vY;
			
		} 
		
		if ( (_Y < 0) ){
			originY	= -this.y + 100;
			
		} else if ( (_Y > theCanvas.height) ){
			originY	= -this.y + 100;
			
		}
    }
}

//Code for pickups.
var aPickup = {
	"x" : 0,	//x position
	"y" : 0,	//y position
	"type" : 0,	//what kind of pickup is it? 1 for health, 2 for shields, 3 for bombs
	"pulse" : 1,	//thickness of borders
	"pulsign" : 0.2,	//used in animation
	"timeleft" : 500,	//counts down to pickup natural despawn
	"flicker" : 0,	//used in last counts of spawn
	"radius" : 15,	//radius of pickup
	"remove" : false,	//flags for removal
	draw : function() {
		if(this.flicker <= 5) {
			theContext.lineWidth = this.pulse;
			var _X = this.x + originX;
			var _Y = this.y + originY;
			if(this.type == 1) {	//health pickup
				theContext.strokeStyle = "#FF5555";
				theContext.fillStyle = "#FF0000";
				theContext.beginPath();
					theContext.arc(_X,_Y,this.radius,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.beginPath();
					theContext.moveTo(_X+this.radius*0.1,_Y+this.radius*0.1);
					theContext.lineTo(_X+this.radius*0.7,_Y+this.radius*0.1);
					theContext.lineTo(_X+this.radius*0.7,_Y-this.radius*0.1);
					theContext.lineTo(_X+this.radius*0.1,_Y-this.radius*0.1);
					theContext.lineTo(_X+this.radius*0.1,_Y-this.radius*0.7);
					theContext.lineTo(_X-this.radius*0.1,_Y-this.radius*0.7);
					theContext.lineTo(_X-this.radius*0.1,_Y-this.radius*0.1);
					theContext.lineTo(_X-this.radius*0.7,_Y-this.radius*0.1);
					theContext.lineTo(_X-this.radius*0.7,_Y+this.radius*0.1);
					theContext.lineTo(_X-this.radius*0.1,_Y+this.radius*0.1);
					theContext.lineTo(_X-this.radius*0.1,_Y+this.radius*0.7);
					theContext.lineTo(_X+this.radius*0.1,_Y+this.radius*0.7);
				theContext.closePath();
				theContext.stroke();
				theContext.fill();
			} else if(this.type == 2) {	//shield pickup
				theContext.strokeStyle = "#00CCFF";
				theContext.fillStyle = "#55DDFF";
				theContext.beginPath();
					theContext.arc(_X,_Y,this.radius,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.beginPath();
					theContext.arc(_X,_Y,this.radius/2,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.fill();
			} else if(this.type == 3) {	//bomb pickup
				theContext.strokeStyle = "#555555";
				theContext.fillStyle = "#000000";
				theContext.beginPath();
					theContext.arc(_X,_Y,this.radius,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.beginPath();
					theContext.arc(_X,_Y,this.radius/2,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.fill();
				theContext.fillStyle = "#FFFFFF";
				theContext.beginPath();
					theContext.arc(_X-this.radius/5,_Y-this.radius/5,this.radius/8,0,circ,true);
				theContext.closePath();
				theContext.stroke();
				theContext.fill();
				theContext.beginPath();
					theContext.arc(_X-this.radius/2,_Y-this.radius/2,this.radius/2,0,-circ/8,true);
				theContext.stroke();
			}
			theContext.lineWidth = 1;
		}
	},
	move : function() {
		this.pulse += this.pulsign;
		this.timeleft--;
		if(this.pulse <= 1 || this.pulse >= 3) {this.pulsign = this.pulsign * -1;}
		if(this.flicker <= 10 && this.timeleft <= 100) {this.flicker++;} else {this.flicker = 0;}
		if(this.timeleft <= 0) {
    		this.remove = true;
		}
	},
	acquire : function() {
		if(this.type == 1) {
			Tank.health += 20;
			if(Tank.health > Tank.maxHealth) {Tank.health = Tank.maxHealth;}
		}
		else if(this.type == 2) {
			ShieldItem.quantity++;
		}
		else if(this.type == 3) {
			BombItem.quantity++;
		}
		this.remove = true;
	}
}

function dropPickup(x,y,t) {//drops a pickup at the specified x and y of the specified type.
	Empty = function() {};
	Empty.prototype = aPickup;
	pickup = new Empty();
	pickup.x = x;
	pickup.y = y;
	pickup.type = t;
	Stuff.push(pickup);
}

function lootDrop(x,y) {//randomizer for dropped pickups
	var dropProb = 1/5;	//probability of a killed ball dropping a pickup
	var shieldProb = 1/12;	//probability of a pickup being shields
	var bombProb = 1/20;	//probability of a pickup being bombs
	if(Math.random() <= dropProb) {
		var prob = Math.random();
		if(prob <= shieldProb) {
			dropPickup(x,y,2);
		} else if(prob <= shieldProb + bombProb) {
			dropPickup(x,y,3);
		} else {
			dropPickup(x,y,1);
		}
	}
}
