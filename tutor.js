// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized
// phase 5 - animation 
// phase 6 - reqAnimFrame
// phase 7 - objectness
// phase 8 - object creation
// phase 9 - multiple objects
// phase 10 - click to add
// phase 11 - bouncing
// phase 12 - bouncing off of each other
// phase 13 - with alignment

// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function() {
    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works
    
    // figure out what the "requestAnimationFrame" function is called
    // the problem is that different browsers call it differently
    // if we don't have it at all, just use setTimeout
    var reqFrame =window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
        };


    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
    var ballcolor = "#FFFF00";      // yellow fill
    var ballstroke = "#000000";     // black outline
    var circ = Math.PI*2;           // complete circle
    var mousex = 0;					// mouse x-coordinate
    var mousey = 0;					// mouse y-coordinate
    
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
        		theContext.beginPath();
	            	theContext.arc(this.x,this.y,this.radius,0,circ,true); 
	            	theContext.moveTo(this.x,this.y);
	            	theContext.lineTo(this.x + 4*this.vX, this.y + 4*this.vY);
	            theContext.closePath();
	            
	            theContext.stroke();
	            theContext.fill();
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
            if(this.health < 0) {
            	this.remove = true;
            	allBalls.sort(cull);
            	allBalls.pop();
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
        Empty.prototype = aBall;    // don't ask why not ball.prototype=aBall;
        ball = new Empty();
        ball.x = x;
        ball.y = y;
        ball.ballcolor = color;
        ball.team = team;
        if(team == 1) { //P-swarmers
        	ball.radius = 5.0;
        	ball.speed = 4.0;
        	ball.health = 50;
        }
        else if(team == 2) { //Chompers
        	ball.radius = 10.0;
        	ball.speed = 2.0;
        	ball.health = 1000;
        }
        else { //Miscellaneous
        	ball.radius = 5.0;
        	ball.speed = 4.0;
        	ball.health = 1000;
        }
        return ball;
    }
    
    // make an array of balls
    theBlues = [];
    theReds = [];
    
    allBalls = [];
    
    for (var i=0; i<20; i++) {
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#0000FF", 2);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF0000", 3);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF00FF", 4);
        allBalls.push(b)
    }
    
    //for (var i=0; i<40; i++) {
    //    b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#0000FF");
    //    theBlues.push(b)
    //}
    
    //for (var i=0; i < 40; i++){
	//	b = makeBall( 50+Math.random()*500, 50+Math.random()*300,"#FF0000" );
    //    theReds.push(b)
	//}

    // this function will do the drawing
    function drawBalls(ballList) {
        
        // draw the balls - too bad we can't use for i in theBalls
        for (var i=0; i < ballList.length; i++) {
            ballList[i].draw();
        }
    }
    
    // not the most efficient way to remove balls, 
    /*
    function removeDeadBalls(ballList) {
		var emptySpace = 0; 
		for (var i=0; i<ballList.length; i++) {
          	if(ballList[i].health < 0){
		   		ballList.splice(i,1)
		   		i--;
		   	}
      	}

	}*/
    
    // bouncing behavior - if two balls are on top of each other,
    // have them react in a simple way
    function bounce(ballList) {
        
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            // notice that we do the n^2 checks here, slightly painful
            for(var j=i-1; j>=0; j--) {
                var bj = ballList[j];
                var bjx = bj.x;
                var bjy = bj.y;
                var rad = bi.radius + bj.radius;
                rad = rad * rad;
                var dx = bjx - bix;
                var dy = bjy - biy;
                var d = dx*dx+dy*dy;
                if (d < rad) {
                	bj.health --;
                	bi.health --;
                    bj.vX = dy;
                    bj.vY = dx;
                    bi.vX = -dx;
                    bi.vY = -dy;
                }
            }
        }
    }
        
    // Reynold's like alignment
    // each boid tries to make it's velocity to be similar to its neighbors
    // recipricol falloff in weight (allignment parameter + d
    // this assumes the velocities will be renormalized
    function align(ballList)
    {
        var ali = 25; // alignment parameter - between 0 and 1
    
        // make temp arrays to store results
        // this is inefficient, but the goal here is to make it work first
        //var newVX = new Array(ballList.length);
        //var newVY = new Array(ballList.length);
    
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            ballList[i].newVX = 0;
            ballList[i].newVY = 0;
    
            for(var j=ballList.length-1; j>=0; j--) {
            
                var bj = ballList[j];
                //if (bj == bi){
				//	break;
				//}
				// compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                
                var dd = Math.pow(d, 1.8);
                
                var personalSpace = bi.radius * 10;
                
                if(bj.team == bi.team){//Interactions with same team
                	if(bi.team == 0) {
                		
                	} else if(bi.team == 1) {//P-swarm
				  		if(d < 100){
							ballList[i].newVX  += (bj.vX / (dd+ali));
		                	ballList[i].newVY  += (bj.vY / (dd+ali));
		        		} else {
					    	ballList[i].newVX  += (dx * .1 ) / (dd);
	               			ballList[i].newVY  += (dy * .1 ) / (dd);
						}
						if(d < personalSpace && d > 0){
							//d > 0 requirement to prevent dividing by zero at the start.
							//as same-team balls approach each other, the repulsion goes up exponentially.
							ballList[i].newVX  -= (dx / d) * 0.02;
	                		ballList[i].newVY  -= (dy / d) * 0.02; 
						}  
                } else if(bi.team == 2) {//Chomper
						if(d < personalSpace && d > 0){
							//d > 0 requirement to prevent dividing by zero at the start.
							//as same-team balls approach each other, the repulsion goes up exponentially.
							ballList[i].newVX  -= (dx / d) * 0.01;
	                		ballList[i].newVY  -= (dy / d) * 0.01; 
						}  
                } else {//Other
				  		if(d < 100){
							ballList[i].newVX  += (bj.vX / (dd+ali));
		                	ballList[i].newVY  += (bj.vY / (dd+ali));
		        		} else {
					    	ballList[i].newVX  += (dx * .1 ) / (dd);
	               			ballList[i].newVY  += (dx * .1 ) / (dd);
						}
						if(d < personalSpace && d > 0){
							//d > 0 requirement to prevent dividing by zero at the start.
							//as same-team balls approach each other, the repulsion goes up exponentially.
							ballList[i].newVX  -= (dx / d) * 0.01;
	                		ballList[i].newVY  -= (dy / d) * 0.01; 
						}  
					}
				} else {//Interactions with other teams
					if(bi.team == 0) {
						
	             	} else if(bi.team == 1) {//P-swarm
	             		if(bj.team == 2 && d < 100) {
				    		ballList[i].newVX  -= ((bix - bj.x) * 1 ) / dd;
	                		ballList[i].newVY  -= ((biy - bj.y) * 1 ) / dd;
	             		}
	             	} else if(bi.team == 2) {//Chompers
	             		if(bj.team == 1 && d < 200) {
				    		ballList[i].newVX  += ((bix - bj.x) * .1 ) / dd;
	                		ballList[i].newVY  += ((biy - bj.y) * .1 ) / dd;
	             		}
	             	} else {
				    	ballList[i].newVX  += ((bix - bj.x) * .01 ) / dd;
	                	ballList[i].newVY  += ((biy - bj.y) * .01 ) / dd;
					}
              	}
            }
        }
        
        var cX = theCanvas.width/2
        var cY = theCanvas.height/2
        
        for(var i=ballList.length-1; i>=0; i--) {
            if(Math.random() * 100 > 99){
			   	//angleTemp = Math.random()
			//	ballList[i].vX = 2 - Math.random()*4;
            //	ballList[i].vY = 2 - Math.random()*4;
            }
            if(ballList[i].team == 1) {//P-swarm
        		ballList[i].vX = ballList[i].newVX + (mousex - ballList[i].x) * .0005; //+ (1 - Math.random()*2) * .03;
        	    ballList[i].vY = ballList[i].newVY + (mousey - ballList[i].y) * .0005; //+ (1 - Math.random()*2) * .03;
            } else if(ballList[i].team == 2) {//Chompers
        		ballList[i].vX = ballList[i].newVX + (Tank.x - ballList[i].x) * .0005; //+ (1 - Math.random()*2) * .03;
        	    ballList[i].vY = ballList[i].newVY + (Tank.y - ballList[i].y) * .0005; //+ (1 - Math.random()*2) * .03;
            } else {
        		// The balls want to be in the center of of the field:
        		ballList[i].vX = ballList[i].newVX + (cX - ballList[i].x) * .00005; //+ (1 - Math.random()*2) * .03;
         	    ballList[i].vY = ballList[i].newVY + (cY - ballList[i].y) * .00005; //+ (1 - Math.random()*2) * .03;
            }
        } 
    }
    
    //move the balls
    function moveBalls(ballList) {
       align(ballList);
       bounce(ballList);
       for (var i=0; i<ballList.length; i++) {
           ballList[i].norm();
           ballList[i].move();
       }
    }
     
    
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
    
    Stuff = [];//holds all miscellaneous objects (except Tank)
    
    function moveStuff() {//simple method, just goes through misc objects and runs move commands
    	for(var i = 0; i < Stuff.length; i++) {
    		Stuff[i].move();
    	}
    }
    function cull(a,b) {//sorting function for Stuff, puts stuff tagged for removal at end to be popped.
    	if(a.remove) {return 1;}
    	else if(b.remove) {return -1;}
    	else {return 0;}
    }
    
    var aBomb = {	//Prototype for bombs shot by Tank, goes in straight line to destination then explodes into a group of P-swarmers
    	"x" : 0,
    	"y" : 0,
    	"speed" : 10,	//speed of bombs (constant)
    	"vX" : 0,
    	"vY" : 0,
    	"radius" : 10,
    	"progress" : 0,	//how many steps taken so far
    	"steps" : 0,	//Number of steps until target is reached
    	"yield" : 5,	//Number of swarmers carried
    	"remove" : false, //flips to true when the object should be removed
    	
    	draw : function() {
    		theContext.strokeStyle = ballstroke;
    		theContext.fillStyle = "#555555"; //TODO: color changes as nears destination (gray to red, 555555 to FF0000)
    		theContext.beginPath();
    			theContext.arc(this.x,this.y,this.radius,0,circ,true);
    		theContext.closePath();
    		theContext.stroke();
    		theContext.fill();
    	},
    	move : function() {
    		if(this.progress < this.steps) {
    			this.x += this.vX;
    			this.y += this.vY;
    			this.progress++;
    		} else {
    			this.remove = true;//Flags, sorts and removes from list
    			Stuff.sort(cull);
    			Stuff.pop();
    			for(var i = 0; i < this.yield; i++) {//Spawns swarmers per bomb yield
    				allBalls.push(
    					makeBall(
    						this.x+this.radius*Math.cos(i*circ/this.yield)/2,
    						this.y+this.radius*Math.sin(i*circ/this.yield)/2,
    						"#008800",
    						1
    					)
    				);
    			}
    		}
    	}
    }
    
    // what to do when things get clicked
    function doClick(){
        /*allBalls .push( 
			makeBall
			(
				evt.pageX - theCanvas.offsetLeft,
	        	evt.pageY - theCanvas.offsetTop,
	        	"#008800",
	        	1
			)
		);*/
		theta = Math.atan2(mousey - Tank.y,mousex - Tank.x);
		Empty = function() {};
		Empty.prototype = aBomb;
		bomb = new Empty();
		bomb.x = Tank.x + Tank.radius * Math.cos(theta);
		bomb.y = Tank.y + Tank.radius * Math.sin(theta);
		bomb.vX = aBomb.speed * Math.cos(theta);
		bomb.vY = aBomb.speed * Math.sin(theta);
		dx = mousex - bomb.x;
		dy = mousey - bomb.y;
		bomb.steps = Math.sqrt(dx*dx+dy*dy)/aBomb.speed;
		Stuff.push(bomb);
    }
    theCanvas.addEventListener("click",doClick,false);
    var keysDown = {};	//holds all keys currently pressed
    window.addEventListener("keydown", function(e) {keysDown[e.keyCode] = true;}, false);
    window.addEventListener("keyup", function(e) {delete keysDown[e.keyCode];}, false);
    theCanvas.addEventListener("mousemove", function(e) {
    	mousex = e.pageX - theCanvas.offsetLeft;
    	mousey = e.pageY - theCanvas.offsetTop;
    }, false);
    
    function receive() {	//translates keystrokes from WASD to velocity changes
    	xstop = true;
    	ystop = true;
    	
    	if (38 in keysDown || 87 in keysDown) {	//Up
    		Tank.vY -= Tank.accel;
    		if (Tank.vY < -Tank.speed) {Tank.vY = -Tank.speed;}
    		ystop = false;
    	}
    	if (40 in keysDown || 83 in keysDown) {	//Down
    		Tank.vY += Tank.accel;
    		if (Tank.vY > Tank.speed) {Tank.vY = Tank.speed;}
    		ystop = false;
    	}
    	if (37 in keysDown || 65 in keysDown) {	//Left
    		Tank.vX -= Tank.accel;
    		if (Tank.vX < -Tank.speed) {Tank.vX = -Tank.speed;}
    		xstop = false;
    	}
    	if (39 in keysDown || 68 in keysDown) {	//Right
    		Tank.vX += Tank.accel;
    		if (Tank.vX > Tank.speed) {Tank.vX = Tank.speed;}
    		xstop = false;
    	}
    	if (xstop) {	//No x movement
    		if (Math.abs(Tank.vX) < Tank.accel) {Tank.vX = 0;}
    		else if (Tank.vX > 0) {Tank.vX -= Tank.accel;}
    		else {Tank.vX += Tank.accel;}
    	}
    	if (ystop) {	//No y movement
    		if (Math.abs(Tank.vY) < Tank.accel) {Tank.vY = 0;}
    		else if (Tank.vY > 0) {Tank.vY -= Tank.accel;}
    		else {Tank.vY += Tank.accel;}
    	}
    }
    

    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
    function drawLoop() {
        
        receive();		//evaluate effect of current keystrokes
        
        moveBalls(allBalls );     //calculate new positions of balls
        
        moveStuff();		//calculate new positions/qualities of other objects
        
        Tank.move();		//calculate new position of tank
      
	    // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        
        Tank.draw();	//show tank
        
        drawBalls(allBalls );     //show balls
        
        drawBalls(Stuff);
       
        reqFrame(drawLoop);		//set up another iteration of loop
    }
    drawLoop();
}
