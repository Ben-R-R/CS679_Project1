/// TANK

 var Tank = {	//The player avatar, can be controlled with keyboard
	"x" : 100,
	"y" : 100,
	"speed" : 5, //maximum speed in any cardinal direction (diagonal is faster 'cause why not)
	"accel" : 0.5, //acceleration for smoother movement
	"radius" : 25, //radius of tank
	"vX" : 0, //current x velocity
	"vY" : 0, //current y velocity 
	"health" : 200,
    draw : function() {
    
        var _X = this.x + originX;
    	var _Y = this.y + originY;
        
        
        
        v = Math.sqrt(this.vX*this.vX+this.vY*this.vY)/this.speed*2;
        phi = Math.atan2((mousey) - this.y, (mousex) - this.x);
        
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
            theContext.lineTo(_X+this.radius*Math.cos(phi+theta*2)/2,_Y+this.radius*Math.sin(phi+theta*2)/2);
            theContext.lineTo(_X+this.radius*Math.cos(phi+theta)/1.1,_Y+this.radius*Math.sin(phi+theta)/1.1);
            theContext.lineTo(_X+this.radius*Math.cos(phi-theta)/1.1,_Y+this.radius*Math.sin(phi-theta)/1.1);
            theContext.lineTo(_X+this.radius*Math.cos(phi-theta*2)/2,_Y+this.radius*Math.sin(phi-theta*2)/2);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
        theContext.beginPath();//Turret
            theContext.arc(_X,_Y,this.radius/2,0,circ,true); 
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    },
    move : function() {
        this.x += this.vX;
        this.y += this.vY;
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