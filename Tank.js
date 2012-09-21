var Tank = {	//The player avatar, can be controlled with keyboard
	"x" : 100,
	"y" : 100,
	"speed" : 5, //maximum speed in any cardinal direction (diagonal is faster 'cause why not)
	"accel" : 0.5, //acceleration for smoother movement
	"radius" : 25, //radius of tank
	"vX" : 0, //current x velocity
	"vY" : 0, //current y velocity
	"health" : 0,
    draw : function() {
    
    
        
        //Experimenting with making appearance affected by movement
        theContext.strokeStyle = "#0099FF";
        theContext.fillStyle = "#0099FF";
        
        v = Math.sqrt(this.vX*this.vX+this.vY*this.vY)/this.speed*2;
        phi = Math.atan2(mousey - this.y, mousex - this.x);
        theta = Math.PI/8;
        theContext.beginPath();//bottom-right thrust
        	theContext.arc(this.x+this.radius/1.2,this.y+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-left thrust
        	theContext.arc(this.x-this.radius/1.2,this.y-this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-right thrust
        	theContext.arc(this.x+this.radius/1.2,this.y-this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//bottom-left thrust
        	theContext.arc(this.x-this.radius/1.2,this.y+this.radius/1.2,this.radius/3+v,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
       		
        theContext.strokeStyle = ballstroke;
        theContext.fillStyle = ballcolor;
        
        theContext.beginPath();//bottom-right pod
        	theContext.arc(this.x+this.radius/1.2,this.y+this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-left pod
        	theContext.arc(this.x-this.radius/1.2,this.y-this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//top-right pod
        	theContext.arc(this.x+this.radius/1.2,this.y-this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//bottom-left pod
        	theContext.arc(this.x-this.radius/1.2,this.y+this.radius/1.2,this.radius/3,0,circ,true);
       	theContext.closePath();
       	theContext.stroke();
       	theContext.fill();
        theContext.beginPath();//Body
            theContext.arc(this.x,this.y,this.radius,0,circ,true); 
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        theContext.beginPath();//Cannon
            theContext.moveTo(this.x,this.y);
            theContext.lineTo(this.x+this.radius*Math.cos(phi+theta*2)/2,this.y+this.radius*Math.sin(phi+theta*2)/2);
            theContext.lineTo(this.x+this.radius*Math.cos(phi+theta)/1.1,this.y+this.radius*Math.sin(phi+theta)/1.1);
            theContext.lineTo(this.x+this.radius*Math.cos(phi-theta)/1.1,this.y+this.radius*Math.sin(phi-theta)/1.1);
            theContext.lineTo(this.x+this.radius*Math.cos(phi-theta*2)/2,this.y+this.radius*Math.sin(phi-theta*2)/2);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        theContext.beginPath();//Turret
            theContext.arc(this.x,this.y,this.radius/2,0,circ,true); 
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    },
    move : function() {
        this.x += this.vX;
        this.y += this.vY;
        if (this.x > theCanvas.width) {
        	this.x = 0;
        	//this.vY = -this.vY;
        }
        if (this.y > theCanvas.height) {
        	this.y = 0;
        	//this.vX = -this.vX;
        }
        if (this.x < 0) {
        	this.x = theCanvas.width;
        	//this.vY = -this.vY;
        }
        if (this.y < 0) {
        	this.y = theCanvas.height;
        	//this.vX = -this.vX;
        }
    }
}
