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
        	this.x = 0;
        	//this.vY = -this.vY;
        }
        if (this.y > fieldSizeY) {
        	this.y = 0;
        	//this.vX = -this.vX;
        }
        if (this.x < 0) {
        	this.x = fieldSizeX;
        	//this.vY = -this.vY;
        }
        if (this.y < 0) {
        	this.y = fieldSizeY;
        	//this.vX = -this.vX;
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
	"type" : 0,	//what kind of pickup is it?
	"pulse" : 1,	//thickness of borders
	"uppulse" : true,	//used in animation
	"timeleft" : 500,	//counts down to pickup natural despawn
	"flicker" : 0,	//used in last counts of spawn
	"radius" : 25,	//radius of pickup
	"remove" : false,	//flags for removal
	draw : function() {
		
	},
	move : function() {
		
	},
	pickup : function() {
		
	}
}

function dropPickup(x,y,type) {//drops a pickup at the specified x and y of the specified type.
	Empty = function() {};
	Empty.prototype = aPickup;
	pickup = new Empty();
	pickup.x = x;
	pickup.y = y;
	pickup.type = type;
	Stuff.push(pickup);
}
