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
    
	theCanvas = document.getElementById("mycanvas");
	theContext = theCanvas.getContext("2d");

    mousex = 0;					// mouse x-coordinate
    mousey = 0;					// mouse y-coordinate
    
    // make an array of balls
    allBalls = [];
    
    for (var i=0; i<20; i++) {
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#0000FF", 2);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF0000", 3);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF00FF", 4);
        allBalls.push(b)
    }

    // this function will do the drawing
    function drawBalls(ballList) {
        // draw the balls - too bad we can't use for i in theBalls
        for (var i=0; i < ballList.length; i++) {
            ballList[i].draw();
        }
    }
    
    // not the most efficient way to remove balls, 
    function removeDeadBalls(ballList) {
		var emptySpace = 0; 
		for (var i=0; i<ballList.length; i++) {
          	if(ballList[i].health < 0){
		   		ballList.splice(i,1)
		   		i--;
		   	}
      	}

	}
    
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
     
    // what to do when things get clicked
    function doClick(evt){
        // a catch - we need to adjust for where the canvas is!
        // this is quite ugly without some degree of support from
        // a library
        allBalls .push( 
			makeBall
			(
				evt.pageX - theCanvas.offsetLeft,
	        	evt.pageY - theCanvas.offsetTop,
	        	"#008800",
	        	1
			)
		);
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
        
        Tank.move();		//calculate new position of tank
      
	    // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        
        Tank.draw();	//show tank
        
        drawBalls(allBalls );     //show balls
        removeDeadBalls(allBalls);
        reqFrame(drawLoop);		//set up another iteration of loop
    }
    drawLoop();
}
