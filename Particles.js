// JavaScript Document

// particles

var particle = function(x,y, speed, angle){
	this.x = x;
	this.y = y;
	
	
	
	this.vX = Math.cos(angle) * speed;
	this.vY = Math.sin(angle) * speed;
	this.timeAlive = 0;
	
	this.move = function(){
		this.x += this.vX;
	    this.y += this.vY;
	    this.timeAlive += 1;
	}
	
	this.draw = function(){
		var _X = this.x + originX;
		var _Y = this.y + originY;
	
	    theContext.fillStyle = "#888888";
	    
	    
	    theContext.rect(_X - 1, _Y - 1, 2, 2);
	    
	    theContext.fill();
	}

}

var textParticle = function(x,y,text){
	this.x = x;
	this.y = y;
	
	this.text = text;	
	
	this.vX = 0;
	this.vY = -1;
	this.timeAlive = 0;
	
	this.move = function(){
		//this.x += this.vX;
	    this.y += this.vY;
	    this.timeAlive += 1;
	}
	
	this.draw = function(){
		var _X = this.x + originX;
		var _Y = this.y + originY;
	
	    //theContext.fillStyle = "#888888";
	    theContext.fillStyle = "rgb( 0," + Math.floor(this.timeAlive)+ " , 0)";
        theContext.font = "12px Arial";
        theContext.fillText(this.text, _X, _Y);
	    
	    //theContext.rect(_X - 1, _Y - 1, 2, 2);
	    
	    theContext.fill();
	}

}

var particleList = new List();

function smallExplosion(x, y){
	particleList.pushFront(new particle(x,y, Math.random() * 3 + 2, Math.random() * circ));
	particleList.pushFront(new particle(x,y, Math.random() * 3 + 2, Math.random() * circ));
	particleList.pushFront(new particle(x,y, Math.random() * 3 + 2, Math.random() * circ));	
}

function mediumExplosion(x,y){
	for(var i = 0; i < 10; i++){
		particleList.pushFront(new particle(x,y, Math.random() * 3 + 2, Math.random() * circ));
	}
}

function addTextParticle(x,y,text){
	particleList.pushFront(new textParticle(x,y, text));
}

function largeExplosion(x,y){
	for(var i = 0; i < 50; i++){
		particleList.pushFront(new particle(x,y, Math.random() * 3 + 2, Math.random() * circ));
	}
}



function drawParticles(){
	
	
	var PartIter = particleList.__iterator__();
	var PartCount = 0;
	for(var curr = PartIter.first(); !PartIter.atEnd(); curr = PartIter.next()){
		PartCount += 1;
		curr.move();
		curr.draw();
			
		if(curr.timeAlive > 50 || PartCount > 50){
			PartIter.removeCurrent();
		}
				
		
	}
	
}